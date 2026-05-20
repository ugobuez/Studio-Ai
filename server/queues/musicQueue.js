import Queue from 'bull';
import Song from '../models/Song.js';
import aiService from '../services/aiService.js';
import { emitProgress, emitCompletion, emitError } from '../socket/progressSocket.js';

const musicQueue = new Queue('music-generation', process.env.REDIS_URL || 'redis://localhost:6379');

export const initWorker = (io) => {
  musicQueue.process(async (job) => {
    const { songId, options } = job.data;
    
    try {
      // 1. Update status to processing
      const song = await Song.findById(songId);
      if (!song) throw new Error('Song not found');
      
      song.status = 'processing';
      await song.save();
      
      emitProgress(io, songId, 'INITIATING', 10);

      // 2. Music Generation Step
      emitProgress(io, songId, 'GENERATING_MUSIC', 30);
      const musicResult = await aiService.generateMusic(options);
      
      // 3. Mastering Step
      emitProgress(io, songId, 'MASTERING', 70);
      const masteredResult = await aiService.masterAudio({
        audio_path: musicResult.audio_path,
        target_lufs: -14
      });

      // 4. Cover Image Generation Step
      emitProgress(io, songId, 'GENERATING_COVER', 85);
      try {
        const coverResult = await aiService.generateCover({
          genre: song.genre,
          mood: song.mood
        });
        song.coverImageUrl = coverResult.image_url || coverResult.cover_path;
      } catch (coverError) {
        console.error('Cover generation failed, skipping:', coverError.message);
      }

      // 5. Update Song Record
      song.status = 'done';
      song.audioUrl = masteredResult.mastered_path || musicResult.audio_path;
      song.metadata = { ...musicResult.metadata, ...masteredResult.metadata };
      await song.save();

      emitProgress(io, songId, 'COMPLETED', 100);
      emitCompletion(io, songId, { 
        songUrl: song.audioUrl, 
        metadata: song.metadata 
      });
      
      return { status: 'success', songId: song._id };
    } catch (error) {
      console.error(`Job ${job.id} failed:`, error.message);
      
      await Song.findByIdAndUpdate(songId, { status: 'failed' });
      emitError(io, songId, error.message);
      
      throw error;
    }
  });

  console.log('Music generation worker initialized');
};

export default musicQueue;
