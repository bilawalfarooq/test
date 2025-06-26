require('dotenv').config({ path: '../.env' });
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/lms';

const demoUsers = [
  { name: 'Admin Demo', email: 'admin@lms.com', password: 'admin123', role: 'admin' },
  { name: 'Teacher Demo', email: 'teacher@lms.com', password: 'teacher123', role: 'teacher' },
  { name: 'Student Demo', email: 'student@lms.com', password: 'student123', role: 'student' },
  { name: 'Parent Demo', email: 'parent@lms.com', password: 'parent123', role: 'parent' }
];

async function createAllDemoUsers() {
  await mongoose.connect(MONGO_URI);
  for (const demo of demoUsers) {
    const existing = await User.findOne({ email: demo.email });
    if (!existing) {
      const hashed = await bcrypt.hash(demo.password, 10);
      await new User({ ...demo, password: hashed }).save();
      console.log(`Created: ${demo.email} (${demo.role}) | password: ${demo.password}`);
    } else {
      console.log(`Exists: ${demo.email} (${demo.role}) | password: ${demo.password}`);
    }
  }
  mongoose.disconnect();
}

createAllDemoUsers();
