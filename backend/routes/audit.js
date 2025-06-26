const express = require('express');
const AuditLog = require('../models/AuditLog');
const auth = require('../middleware/auth');

const router = express.Router();

// Log an action (to be called from other routes)
router.post('/', auth, async (req, res) => {
  const { action, targetType, targetId, details } = req.body;
  if (!action) return res.status(400).json({ message: 'Action required' });
  const log = new AuditLog({ user: req.user.userId, action, targetType, targetId, details });
  await log.save();
  res.status(201).json({ message: 'Audit logged', log });
});

// Get audit logs (admin only)
router.get('/', auth, async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ message: 'Forbidden' });
  const logs = await AuditLog.find().populate('user', 'name email role');
  res.json(logs);
});

module.exports = router;
