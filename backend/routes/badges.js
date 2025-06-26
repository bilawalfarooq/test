const express = require('express');
const Badge = require('../models/Badge');
const UserBadge = require('../models/UserBadge');
const auth = require('../middleware/auth');

const router = express.Router();

// Get all badges
router.get('/', auth, async (req, res) => {
  const badges = await Badge.find();
  res.json(badges);
});

// Create a badge (admin only)
router.post('/', auth, async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ message: 'Forbidden' });
  const { name, description, icon, criteria } = req.body;
  if (!name) return res.status(400).json({ message: 'Name required' });
  const badge = new Badge({ name, description, icon, criteria });
  await badge.save();
  res.status(201).json({ message: 'Badge created', badge });
});

// Award a badge to a user (admin/teacher)
router.post('/award', auth, async (req, res) => {
  if (!['admin', 'teacher'].includes(req.user.role)) return res.status(403).json({ message: 'Forbidden' });
  const { user, badge } = req.body;
  if (!user || !badge) return res.status(400).json({ message: 'User and badge required' });
  const userBadge = new UserBadge({ user, badge });
  await userBadge.save();
  res.status(201).json({ message: 'Badge awarded', userBadge });
});

// Get badges for a user
router.get('/user/:userId', auth, async (req, res) => {
  const userBadges = await UserBadge.find({ user: req.params.userId }).populate('badge');
  res.json(userBadges);
});

module.exports = router;
