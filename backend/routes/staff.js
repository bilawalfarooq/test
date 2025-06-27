const express = require('express');
const Staff = require('../models/Staff');
const bcrypt = require('bcryptjs');
const router = express.Router();

// Create staff
router.post('/', async (req, res) => {
  try {
    const { name, email, role, phone, address, salary, subjects, assignedClasses, password } = req.body;
    const hash = password ? await bcrypt.hash(password, 10) : undefined;
    const staff = new Staff({
      name, email, role, phone, address, salary, subjects, assignedClasses,
      password: hash
    });
    await staff.save();
    res.status(201).json(staff);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Get all staff
router.get('/', async (req, res) => {
  try {
    const staff = await Staff.find();
    res.json(staff);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get one staff
router.get('/:id', async (req, res) => {
  try {
    const staff = await Staff.findById(req.params.id);
    if (!staff) return res.status(404).json({ message: 'Not found' });
    res.json(staff);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update staff
router.put('/:id', async (req, res) => {
  try {
    const update = { ...req.body };
    if (update.password) {
      update.password = await bcrypt.hash(update.password, 10);
    }
    const staff = await Staff.findByIdAndUpdate(req.params.id, update, { new: true });
    if (!staff) return res.status(404).json({ message: 'Not found' });
    res.json(staff);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete staff
router.delete('/:id', async (req, res) => {
  try {
    const staff = await Staff.findByIdAndDelete(req.params.id);
    if (!staff) return res.status(404).json({ message: 'Not found' });
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Assign classes/subjects
router.post('/:id/assign', async (req, res) => {
  try {
    const { subjects, assignedClasses } = req.body;
    const staff = await Staff.findByIdAndUpdate(
      req.params.id,
      { $set: { subjects, assignedClasses } },
      { new: true }
    );
    if (!staff) return res.status(404).json({ message: 'Not found' });
    res.json(staff);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Add salary record
router.post('/:id/salary', async (req, res) => {
  try {
    const { amount, month, paidDate } = req.body;
    const staff = await Staff.findById(req.params.id);
    if (!staff) return res.status(404).json({ message: 'Not found' });
    staff.salaryRecords.push({ amount, month, paidDate });
    await staff.save();
    res.json(staff);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
