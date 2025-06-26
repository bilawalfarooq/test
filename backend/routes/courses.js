const express = require('express');
const Course = require('../models/Course');
const User = require('../models/User');
const auth = require('../middleware/auth');

const router = express.Router();

// Get all courses
router.get('/', auth, async (req, res) => {
  const courses = await Course.find().populate('teacher', 'name email').populate('students', 'name email');
  res.json(courses);
});

// Create a course (admin or teacher)
router.post('/', auth, async (req, res) => {
  if (!['admin', 'teacher'].includes(req.user.role)) return res.status(403).json({ message: 'Forbidden' });
  const { title, description, teacher } = req.body;
  if (!title || !teacher) return res.status(400).json({ message: 'Title and teacher required' });
  const teacherUser = await User.findById(teacher);
  if (!teacherUser || teacherUser.role !== 'teacher') return res.status(400).json({ message: 'Invalid teacher' });
  const course = new Course({ title, description, teacher });
  await course.save();
  res.status(201).json({ message: 'Course created', course });
});

// Update a course (admin or teacher)
router.put('/:id', auth, async (req, res) => {
  if (!['admin', 'teacher'].includes(req.user.role)) return res.status(403).json({ message: 'Forbidden' });
  const { title, description, teacher } = req.body;
  const course = await Course.findByIdAndUpdate(req.params.id, { title, description, teacher }, { new: true });
  if (!course) return res.status(404).json({ message: 'Course not found' });
  res.json(course);
});

// Delete a course (admin or teacher)
router.delete('/:id', auth, async (req, res) => {
  if (!['admin', 'teacher'].includes(req.user.role)) return res.status(403).json({ message: 'Forbidden' });
  const course = await Course.findByIdAndDelete(req.params.id);
  if (!course) return res.status(404).json({ message: 'Course not found' });
  res.json({ message: 'Course deleted' });
});

// Enroll a student (admin, teacher, or student)
router.post('/:id/enroll', auth, async (req, res) => {
  const course = await Course.findById(req.params.id);
  if (!course) return res.status(404).json({ message: 'Course not found' });
  const studentId = req.body.studentId || req.user._id;
  if (!studentId) return res.status(400).json({ message: 'Student ID required' });
  if (!course.students.includes(studentId)) {
    course.students.push(studentId);
    await course.save();
  }
  res.json({ message: 'Enrolled', course });
});

module.exports = router;
