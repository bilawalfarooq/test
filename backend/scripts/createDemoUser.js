require('dotenv').config({ path: '../.env' });
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/lms';

async function createDemoUser() {
  await mongoose.connect(MONGO_URI);
  const email = 'demo@lms.com';
  const password = await bcrypt.hash('demo123', 10);
  const name = 'Demo User';
  const role = 'student';
  let user = await User.findOne({ email });
  if (!user) {
    user = new User({ name, email, password, role });
    await user.save();
    console.log('Demo user created:', { email, password: 'demo123', role });
  } else {
    console.log('Demo user already exists:', { email, password: 'demo123', role });
  }
  mongoose.disconnect();
}

createDemoUser();
