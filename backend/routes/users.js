const express = require('express');

const User = require('../models/User');
const auth = require('../middleware/auth');
const avatarUpload = require('../middleware/avatarUpload');
const path = require('path');

const router = express.Router();

// Upload or update user avatar (authenticated user)
router.post('/avatar', auth, avatarUpload.single('avatar'), async (req, res) => {
  console.log('req.user:', req.user);
  if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
  // Update user's avatar field
  const user = await User.findByIdAndUpdate(req.user.userId, { avatar: req.file.filename }, { new: true, fields: '-password' });
  if (!user) return res.status(404).json({ message: 'User not found' });
  res.json({ message: 'Avatar uploaded', avatar: req.file.filename });
});

// Serve avatar images statically
router.get('/avatar/:filename', (req, res) => {
  const filePath = path.join(__dirname, '../uploads/avatars', req.params.filename);
  res.sendFile(filePath);
});

// Get all users (admin only)
router.get('/', auth, async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ message: 'Forbidden' });
  const users = await User.find({}, '-password');
  res.json(users);
});

// Create user (admin only)
router.post('/', auth, async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ message: 'Forbidden' });
  const { name, email, password, role } = req.body;
  if (!name || !email || !password || !role) return res.status(400).json({ message: 'All fields required' });
  const existing = await User.findOne({ email });
  if (existing) return res.status(400).json({ message: 'User already exists' });
  const bcrypt = require('bcryptjs');
  const hashed = await bcrypt.hash(password, 10);
  const user = new User({ name, email, password: hashed, role });
  await user.save();
  res.status(201).json({ message: 'User created' });
});

// Update user (admin only)
router.put('/:id', auth, async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ message: 'Forbidden' });
  const { name, email, role } = req.body;
  const user = await User.findByIdAndUpdate(req.params.id, { name, email, role }, { new: true, fields: '-password' });
  if (!user) return res.status(404).json({ message: 'User not found' });
  res.json(user);
});

// Delete user (admin only)
router.delete('/:id', auth, async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ message: 'Forbidden' });
  const user = await User.findByIdAndDelete(req.params.id);
  if (!user) return res.status(404).json({ message: 'User not found' });
  res.json({ message: 'User deleted' });
});

// Get a single user (self or admin)
router.get('/:id', auth, async (req, res) => {
  if (req.user.role !== 'admin' && req.user.userId !== req.params.id) {
    return res.status(403).json({ message: 'Forbidden' });
  }
  const user = await User.findById(req.params.id, '-password');
  if (!user) return res.status(404).json({ message: 'User not found' });
  res.json(user);
});

module.exports = router;
