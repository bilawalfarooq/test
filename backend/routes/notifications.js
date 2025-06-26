const express = require('express');
const Notification = require('../models/Notification');
const auth = require('../middleware/auth');

const router = express.Router();

// Get notifications for a user
router.get('/', auth, async (req, res) => {
  const notifications = await Notification.find({ user: req.user.userId });
  res.json(notifications);
});

// Create notification (admin/teacher)
router.post('/', auth, async (req, res) => {
  if (!['admin', 'teacher'].includes(req.user.role)) return res.status(403).json({ message: 'Forbidden' });
  const { user, message, type } = req.body;
  if (!user || !message) return res.status(400).json({ message: 'User and message required' });
  const notification = new Notification({ user, message, type });
  await notification.save();
  res.status(201).json({ message: 'Notification sent', notification });
});

// Mark notification as read
router.put('/:id/read', auth, async (req, res) => {
  const notification = await Notification.findByIdAndUpdate(req.params.id, { read: true }, { new: true });
  if (!notification) return res.status(404).json({ message: 'Notification not found' });
  res.json(notification);
});

module.exports = router;
