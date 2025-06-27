const express = require('express');
const Student = require('../models/Student');
const auth = require('../middleware/auth');

const router = express.Router();

// List students with optional filters
router.get('/', auth, async (req, res) => {
  const { class: className, section } = req.query;
  const filter = {};
  if (className) filter.class = className;
  if (section) filter.section = section;
  const students = await Student.find(filter);
  res.json(students);
});

// Get single student
router.get('/:id', auth, async (req, res) => {
  const student = await Student.findById(req.params.id);
  if (!student) return res.status(404).json({ message: 'Student not found' });
  res.json(student);
});

// Add student
router.post('/', auth, async (req, res) => {
  try {
    const student = new Student(req.body);
    await student.save();
    res.status(201).json(student);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Edit student
router.put('/:id', auth, async (req, res) => {
  try {
    const student = await Student.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!student) return res.status(404).json({ message: 'Student not found' });
    res.json(student);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete student
router.delete('/:id', auth, async (req, res) => {
  const student = await Student.findByIdAndDelete(req.params.id);
  if (!student) return res.status(404).json({ message: 'Student not found' });
  res.json({ message: 'Student deleted' });
});

// Promote students (bulk)
router.post('/promote', auth, async (req, res) => {
  const { fromClass, toClass, section } = req.body;
  const filter = { class: fromClass };
  if (section) filter.section = section;
  const result = await Student.updateMany(filter, { class: toClass, promoted: true });
  res.json({ message: 'Promotion complete', result });
});

module.exports = router;
