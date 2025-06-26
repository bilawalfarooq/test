const express = require('express');
const Assignment = require('../models/Assignment');
const auth = require('../middleware/auth');

const router = express.Router();

// Get all assignments for a course
router.get('/course/:courseId', auth, async (req, res) => {
  const assignments = await Assignment.find({ course: req.params.courseId });
  res.json(assignments);
});

// Create assignment (teacher or admin)
router.post('/', auth, async (req, res) => {
  if (!['teacher', 'admin'].includes(req.user.role)) return res.status(403).json({ message: 'Forbidden' });
  const { title, description, course, dueDate } = req.body;
  if (!title || !course) return res.status(400).json({ message: 'Title and course required' });
  const assignment = new Assignment({ title, description, course, dueDate });
  await assignment.save();
  res.status(201).json({ message: 'Assignment created', assignment });
});

// Submit assignment (student)
router.post('/:id/submit', auth, async (req, res) => {
  if (req.user.role !== 'student') return res.status(403).json({ message: 'Forbidden' });
  const { fileUrl } = req.body;
  const assignment = await Assignment.findById(req.params.id);
  if (!assignment) return res.status(404).json({ message: 'Assignment not found' });
  assignment.submissions.push({ student: req.user.userId, fileUrl, submittedAt: new Date() });
  await assignment.save();
  res.json({ message: 'Submitted', assignment });
});

// Grade assignment (teacher)
router.put('/:id/grade', auth, async (req, res) => {
  if (req.user.role !== 'teacher') return res.status(403).json({ message: 'Forbidden' });
  const { studentId, grade, feedback } = req.body;
  const assignment = await Assignment.findById(req.params.id);
  if (!assignment) return res.status(404).json({ message: 'Assignment not found' });
  const submission = assignment.submissions.find(s => s.student.toString() === studentId);
  if (!submission) return res.status(404).json({ message: 'Submission not found' });
  submission.grade = grade;
  submission.feedback = feedback;
  await assignment.save();
  res.json({ message: 'Graded', assignment });
});

module.exports = router;
