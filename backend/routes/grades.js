const express = require('express');
const Grade = require('../models/Grade');
const auth = require('../middleware/auth');

const router = express.Router();

// Get grades for a student
router.get('/student/:studentId', auth, async (req, res) => {
  if (req.user.role !== 'admin' && req.user.userId !== req.params.studentId) return res.status(403).json({ message: 'Forbidden' });
  const grades = await Grade.find({ student: req.params.studentId }).populate('course assignment');
  res.json(grades);
});

// Get grades for a course
router.get('/course/:courseId', auth, async (req, res) => {
  if (!['admin', 'teacher'].includes(req.user.role)) return res.status(403).json({ message: 'Forbidden' });
  const grades = await Grade.find({ course: req.params.courseId }).populate('student assignment');
  res.json(grades);
});

// Assign or update a grade (teacher or admin)
router.post('/', auth, async (req, res) => {
  if (!['teacher', 'admin'].includes(req.user.role)) return res.status(403).json({ message: 'Forbidden' });
  const { student, course, assignment, grade, feedback } = req.body;
  if (!student || !course || !grade) return res.status(400).json({ message: 'Missing fields' });
  let record = await Grade.findOne({ student, course, assignment });
  if (record) {
    record.grade = grade;
    record.feedback = feedback;
    await record.save();
    return res.json({ message: 'Grade updated', record });
  } else {
    record = new Grade({ student, course, assignment, grade, feedback });
    await record.save();
    return res.status(201).json({ message: 'Grade assigned', record });
  }
});

module.exports = router;
