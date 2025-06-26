const express = require('express');
const Leaderboard = require('../models/Leaderboard');
const auth = require('../middleware/auth');

const router = express.Router();

// Get leaderboard for a course
router.get('/course/:courseId', auth, async (req, res) => {
  const { type } = req.query;
  const leaderboard = await Leaderboard.findOne({ course: req.params.courseId, type: type || 'points' }).populate('entries.user', 'name role');
  res.json(leaderboard);
});

// Update leaderboard (admin/teacher)
router.post('/course/:courseId', auth, async (req, res) => {
  if (!['admin', 'teacher'].includes(req.user.role)) return res.status(403).json({ message: 'Forbidden' });
  const { type, entries } = req.body;
  let leaderboard = await Leaderboard.findOne({ course: req.params.courseId, type: type || 'points' });
  if (leaderboard) {
    leaderboard.entries = entries;
    leaderboard.updatedAt = new Date();
    await leaderboard.save();
  } else {
    leaderboard = new Leaderboard({ course: req.params.courseId, type: type || 'points', entries });
    await leaderboard.save();
  }
  res.status(201).json({ message: 'Leaderboard updated', leaderboard });
});

module.exports = router;
