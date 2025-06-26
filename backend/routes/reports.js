const express = require('express');
const Report = require('../models/Report');
const auth = require('../middleware/auth');

const router = express.Router();

// Get all reports (admin/teacher)
router.get('/', auth, async (req, res) => {
  if (!['admin', 'teacher'].includes(req.user.role)) return res.status(403).json({ message: 'Forbidden' });
  const reports = await Report.find();
  res.json(reports);
});

// Create a report (admin/teacher)
router.post('/', auth, async (req, res) => {
  if (!['admin', 'teacher'].includes(req.user.role)) return res.status(403).json({ message: 'Forbidden' });
  const { type, course, data } = req.body;
  if (!type || !data) return res.status(400).json({ message: 'Type and data required' });
  const report = new Report({ type, course, data, generatedBy: req.user.userId });
  await report.save();
  res.status(201).json({ message: 'Report generated', report });
});

module.exports = router;
