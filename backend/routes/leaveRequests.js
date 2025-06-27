const express = require('express');
const LeaveRequest = require('../models/LeaveRequest');
const router = express.Router();

// Submit leave request
router.post('/', async (req, res) => {
  try {
    const { staff, from, to, reason } = req.body;
    const leave = new LeaveRequest({ staff, from, to, reason });
    await leave.save();
    res.status(201).json(leave);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Get all leave requests
router.get('/', async (req, res) => {
  try {
    const leaves = await LeaveRequest.find().populate('staff');
    res.json(leaves);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Approve/reject leave
router.put('/:id', async (req, res) => {
  try {
    const { status } = req.body;
    if (!['approved', 'rejected'].includes(status)) return res.status(400).json({ message: 'Invalid status' });
    const leave = await LeaveRequest.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!leave) return res.status(404).json({ message: 'Not found' });
    res.json(leave);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
