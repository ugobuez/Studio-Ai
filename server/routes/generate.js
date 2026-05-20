import express from 'express';
import { protect } from '../middleware/auth.js';
import Song from '../models/Song.js';
import musicQueue from '../queues/musicQueue.js';
import aiService from '../services/aiService.js';

const router = express.Router();

// @desc    Queue music generation
// @route   POST /api/generate/music
router.post('/music', protect, async (req, res) => {
  const { prompt, genre, mood, bpm, key, duration, lyrics, isInstrumental, voiceSampleId } = req.body;

  try {
    // 1. Create initial song record
    const song = await Song.create({
      userId: req.user._id,
      title: `${genre || 'AI'} Track - ${new Date().toLocaleDateString()}`,
      prompt,
      genre,
      mood,
      bpm,
      key,
      duration,
      lyrics,
      isInstrumental,
      voiceSampleId,
      status: 'queued'
    });

    // 2. Add to Bull queue
    await musicQueue.add({
      songId: song._id,
      options: {
        prompt,
        genre,
        mood,
        bpm,
        key,
        duration,
        lyrics,
        isInstrumental,
        voiceSampleId
      }
    });

    res.status(202).json({
      message: 'Generation queued',
      jobId: song._id
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Get generation status
// @route   GET /api/generate/status/:jobId
router.get('/status/:jobId', protect, async (req, res) => {
  try {
    const song = await Song.findOne({ _id: req.params.jobId, userId: req.user._id });
    if (!song) {
      return res.status(404).json({ message: 'Job not found' });
    }
    res.json({
      status: song.status,
      audioUrl: song.audioUrl,
      coverImageUrl: song.coverImageUrl,
      metadata: song.metadata
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Generate lyrics
// @route   POST /api/generate/lyrics
router.post('/lyrics', protect, async (req, res) => {
  const { prompt, genre, mood } = req.body;
  
  try {
    const data = await aiService.generateLyrics({ prompt, genre, mood });
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
