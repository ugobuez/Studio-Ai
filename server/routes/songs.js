import express from 'express';
import { protect } from '../middleware/auth.js';
import Song from '../models/Song.js';
import path from 'path';
import fs from 'fs';

const router = express.Router();

// @desc    Get user's song library
// @route   GET /api/songs
router.get('/', protect, async (req, res) => {
  try {
    const songs = await Song.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json(songs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Download song
// @route   GET /api/songs/:id/download
router.get('/:id/download', protect, async (req, res) => {
  try {
    const song = await Song.findOne({ _id: req.params.id, userId: req.user._id });
    if (!song || !song.audioUrl) {
      return res.status(404).json({ message: 'Song or audio file not found' });
    }

    const filePath = path.resolve(song.audioUrl);
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: 'File not found on server' });
    }

    res.download(filePath, `${song.title || 'track'}${path.extname(filePath)}`);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Get song by ID
// @route   GET /api/songs/:id
router.get('/:id', protect, async (req, res) => {
  try {
    const song = await Song.findOne({ _id: req.params.id, userId: req.user._id });
    if (!song) {
      return res.status(404).json({ message: 'Song not found' });
    }
    res.json(song);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Delete song
// @route   DELETE /api/songs/:id
router.delete('/:id', protect, async (req, res) => {
  try {
    const song = await Song.findOne({ _id: req.params.id, userId: req.user._id });
    if (!song) {
      return res.status(404).json({ message: 'Song not found' });
    }
    await song.deleteOne();
    res.json({ message: 'Song removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
