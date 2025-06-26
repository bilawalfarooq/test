const express = require('express');
const Setting = require('../models/Setting');
const auth = require('../middleware/auth');

const router = express.Router();

// Get all settings (admin only)
router.get('/', auth, async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ message: 'Forbidden' });
  const settings = await Setting.find();
  res.json(settings);
});

// Update or create a setting (admin only)
router.post('/', auth, async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ message: 'Forbidden' });
  const { key, value } = req.body;
  if (!key) return res.status(400).json({ message: 'Key required' });
  let setting = await Setting.findOne({ key });
  if (setting) {
    setting.value = value;
    setting.updatedAt = new Date();
    await setting.save();
    res.json({ message: 'Setting updated', setting });
  } else {
    setting = new Setting({ key, value });
    await setting.save();
    res.status(201).json({ message: 'Setting created', setting });
  }
});

module.exports = router;
