const express = require('express');
const Attendance = require('../models/Attendance');
const auth = require('../middleware/auth');

const router = express.Router();

// Get attendance for a course
router.get('/course/:courseId', auth, async (req, res) => {
  const records = await Attendance.find({ course: req.params.courseId });
  res.json(records);
});

// Mark attendance (teacher or admin)
router.post('/', auth, async (req, res) => {
  if (!['teacher', 'admin'].includes(req.user.role)) return res.status(403).json({ message: 'Forbidden' });
  const { course, date, records } = req.body;
  if (!course || !date || !records) return res.status(400).json({ message: 'Missing fields' });
  const attendance = new Attendance({ course, date, records });
  await attendance.save();
  res.status(201).json({ message: 'Attendance marked', attendance });
});

// Update attendance (teacher or admin)
router.put('/:id', auth, async (req, res) => {
  if (!['teacher', 'admin'].includes(req.user.role)) return res.status(403).json({ message: 'Forbidden' });
  const { records } = req.body;
  const attendance = await Attendance.findByIdAndUpdate(req.params.id, { records }, { new: true });
  if (!attendance) return res.status(404).json({ message: 'Attendance not found' });
  res.json(attendance);
});

module.exports = router;
