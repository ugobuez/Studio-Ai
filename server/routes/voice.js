import express from 'express';
import { protect } from '../middleware/auth.js';
import upload from '../middleware/upload.js';
import VoiceSample from '../models/VoiceSample.js';
import ffmpeg from 'fluent-ffmpeg';
import fs from 'fs';

const router = express.Router();

// @desc    Upload a voice sample
// @route   POST /api/voice/upload
router.post('/upload', protect, upload.single('sample'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }

  try {
    // Extract metadata using ffprobe
    ffmpeg.ffprobe(req.file.path, async (err, metadata) => {
      if (err) {
        // Even if metadata fails, we might still want to save the record or delete the file
        console.error('ffprobe error:', err);
        return res.status(500).json({ message: 'Error processing audio file' });
      }

      const { duration, sample_rate } = metadata.format;

      const voiceSample = await VoiceSample.create({
        userId: req.user._id,
        name: req.body.name || req.file.originalname,
        filePath: req.file.path,
        duration: duration,
        sampleRate: sample_rate,
      });

      res.status(201).json(voiceSample);
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Get user's voice samples
// @route   GET /api/voice/samples
router.get('/samples', protect, async (req, res) => {
  try {
    const samples = await VoiceSample.find({ userId: req.user._id });
    res.json(samples);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Delete a voice sample
// @route   DELETE /api/voice/samples/:id
router.delete('/samples/:id', protect, async (req, res) => {
  try {
    const sample = await VoiceSample.findOne({ _id: req.params.id, userId: req.user._id });
    if (!sample) {
      return res.status(404).json({ message: 'Sample not found' });
    }

    await sample.deleteOne();
    // Note: In production, also delete the physical file from storage
    res.json({ message: 'Sample removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
