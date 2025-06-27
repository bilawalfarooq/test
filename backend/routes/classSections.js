const express = require('express');
const ClassSection = require('../models/ClassSection');
const auth = require('../middleware/auth');

const router = express.Router();

// List all class-sections
router.get('/', auth, async (req, res) => {
  const sections = await ClassSection.find();
  res.json(sections);
});

// Get a single class-section
router.get('/:id', auth, async (req, res) => {
  const section = await ClassSection.findById(req.params.id);
  if (!section) return res.status(404).json({ message: 'Not found' });
  res.json(section);
});

// Add a class-section
router.post('/', auth, async (req, res) => {
  try {
    const section = new ClassSection(req.body);
    await section.save();
    res.status(201).json(section);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Edit a class-section
router.put('/:id', auth, async (req, res) => {
  try {
    const section = await ClassSection.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!section) return res.status(404).json({ message: 'Not found' });
    res.json(section);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete a class-section
router.delete('/:id', auth, async (req, res) => {
  const section = await ClassSection.findByIdAndDelete(req.params.id);
  if (!section) return res.status(404).json({ message: 'Not found' });
  res.json({ message: 'Deleted' });
});

module.exports = router;
