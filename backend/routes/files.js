const express = require('express');
const File = require('../models/File');
const auth = require('../middleware/auth');

const router = express.Router();

// List all files
router.get('/', auth, async (req, res) => {
  const files = await File.find();
  res.json(files);
});

// Upload file (metadata only, actual upload should be handled by a service like multer or cloud storage)
router.post('/', auth, async (req, res) => {
  const { filename, url, type, size } = req.body;
  if (!filename || !url) return res.status(400).json({ message: 'Filename and URL required' });
  const file = new File({ filename, url, type, size, uploadedBy: req.user.userId });
  await file.save();
  res.status(201).json({ message: 'File uploaded', file });
});

// Delete file (admin/teacher)
router.delete('/:id', auth, async (req, res) => {
  if (!['admin', 'teacher'].includes(req.user.role)) return res.status(403).json({ message: 'Forbidden' });
  const file = await File.findByIdAndDelete(req.params.id);
  if (!file) return res.status(404).json({ message: 'File not found' });
  res.json({ message: 'File deleted' });
});

module.exports = router;
