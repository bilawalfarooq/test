const express = require('express');
const Resource = require('../models/Resource');
const auth = require('../middleware/auth');

const router = express.Router();

// Get all resources (optionally by course)
router.get('/', auth, async (req, res) => {
  const filter = req.query.course ? { course: req.query.course } : {};
  const resources = await Resource.find(filter);
  res.json(resources);
});

// Upload resource (teacher/admin)
router.post('/', auth, async (req, res) => {
  if (!['teacher', 'admin'].includes(req.user.role)) return res.status(403).json({ message: 'Forbidden' });
  const { title, type, url, course } = req.body;
  if (!title || !url) return res.status(400).json({ message: 'Title and URL required' });
  const resource = new Resource({ title, type, url, course, uploadedBy: req.user.userId });
  await resource.save();
  res.status(201).json({ message: 'Resource uploaded', resource });
});

// Delete resource (admin/teacher)
router.delete('/:id', auth, async (req, res) => {
  if (!['teacher', 'admin'].includes(req.user.role)) return res.status(403).json({ message: 'Forbidden' });
  const resource = await Resource.findByIdAndDelete(req.params.id);
  if (!resource) return res.status(404).json({ message: 'Resource not found' });
  res.json({ message: 'Resource deleted' });
});

module.exports = router;
