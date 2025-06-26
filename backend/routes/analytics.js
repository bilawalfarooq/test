const express = require('express');
const AnalyticsEvent = require('../models/AnalyticsEvent');
const auth = require('../middleware/auth');

const router = express.Router();

// Log an analytics event
router.post('/', auth, async (req, res) => {
  const { type, data } = req.body;
  if (!type) return res.status(400).json({ message: 'Type required' });
  const event = new AnalyticsEvent({ user: req.user.userId, type, data });
  await event.save();
  res.status(201).json({ message: 'Event logged', event });
});

// Get analytics events (admin only)
router.get('/', auth, async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ message: 'Forbidden' });
  const events = await AnalyticsEvent.find().populate('user', 'name email role');
  res.json(events);
});

// Get analytics summary (admin only)
router.get('/summary', auth, async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ message: 'Forbidden' });
  // Example: count events by type
  const summary = await AnalyticsEvent.aggregate([
    { $group: { _id: '$type', count: { $sum: 1 } } }
  ]);
  res.json(summary);
});

module.exports = router;
