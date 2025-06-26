require('dotenv').config({ path: '../.env' });
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const User = require('../models/User');
const Course = require('../models/Course');
const Assignment = require('../models/Assignment');
const Grade = require('../models/Grade');
const Attendance = require('../models/Attendance');
const Leaderboard = require('../models/Leaderboard');
const Badge = require('../models/Badge');
const Resource = require('../models/Resource');
const ForumPost = require('../models/ForumPost');
const Notification = require('../models/Notification');
const Report = require('../models/Report');
const AnalyticsEvent = require('../models/AnalyticsEvent');
const AuditLog = require('../models/AuditLog');
const File = require('../models/File');
const Setting = require('../models/Setting');
const UserBadge = require('../models/UserBadge');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/lms';

async function createDemoData() {
  await mongoose.connect(MONGO_URI);

  // USERS
  const usersData = [
    { name: 'Admin Demo', email: 'admin@lms.com', password: 'admin123', role: 'admin' },
    { name: 'Admin2 Demo', email: 'admin2@lms.com', password: 'admin123', role: 'admin' },
    { name: 'Teacher Demo', email: 'teacher@lms.com', password: 'teacher123', role: 'teacher' },
    { name: 'Teacher2 Demo', email: 'teacher2@lms.com', password: 'teacher123', role: 'teacher' },
    { name: 'Student Demo', email: 'student@lms.com', password: 'student123', role: 'student' },
    { name: 'Student2 Demo', email: 'student2@lms.com', password: 'student123', role: 'student' },
    { name: 'Student3 Demo', email: 'student3@lms.com', password: 'student123', role: 'student' },
    { name: 'Parent Demo', email: 'parent@lms.com', password: 'parent123', role: 'parent' },
    { name: 'Parent2 Demo', email: 'parent2@lms.com', password: 'parent123', role: 'parent' }
  ];
  const users = {};
  for (const u of usersData) {
    let user = await User.findOne({ email: u.email });
    if (!user) {
      const hashed = await bcrypt.hash(u.password, 10);
      user = await new User({ ...u, password: hashed }).save();
    }
    if (!users[u.role]) users[u.role] = [];
    users[u.role].push(user);
  }

  // COURSES
  const courses = [];
  for (let i = 1; i <= 3; i++) {
    const course = await new Course({
      title: `Course ${i}: Math 10${i}`,
      description: `Description for Math 10${i}`,
      teacher: users['teacher'][i % users['teacher'].length]._id,
      students: users['student'].map(s => s._id),
      materials: [`https://example.com/material${i}.pdf`]
    }).save();
    courses.push(course);
  }

  // ASSIGNMENTS
  const assignments = [];
  for (const course of courses) {
    for (let j = 1; j <= 2; j++) {
      const assignment = await new Assignment({
        title: `Assignment ${j} for ${course.title}`,
        description: `Description for assignment ${j}`,
        course: course._id,
        dueDate: new Date(Date.now() + (j * 7) * 24 * 60 * 60 * 1000),
        submissions: users['student'].map((student, idx) => ({
          student: student._id,
          fileUrl: `https://example.com/submission${j}_${idx + 1}.pdf`,
          submittedAt: new Date(),
          grade: ['A', 'B', 'C'][idx % 3],
          feedback: `Feedback for student ${idx + 1}`
        }))
      }).save();
      assignments.push(assignment);
    }
  }

  // GRADES
  for (const assignment of assignments) {
    for (const student of users['student']) {
      await new Grade({
        student: student._id,
        course: assignment.course,
        assignment: assignment._id,
        grade: ['A', 'B', 'C'][Math.floor(Math.random() * 3)],
        feedback: 'Demo feedback'
      }).save();
    }
  }

  // ATTENDANCE
  for (const course of courses) {
    for (let d = 0; d < 3; d++) {
      await new Attendance({
        course: course._id,
        date: new Date(Date.now() - d * 24 * 60 * 60 * 1000),
        records: users['student'].map(student => ({ student: student._id, present: Math.random() > 0.2 }))
      }).save();
    }
  }

  // LEADERBOARDS
  for (const course of courses) {
    await new Leaderboard({
      course: course._id,
      type: 'points',
      entries: users['student'].map((student, idx) => ({ user: student._id, value: 100 - idx * 10 }))
    }).save();
  }

  // BADGES
  const badges = [];
  for (let i = 1; i <= 2; i++) {
    const badge = await new Badge({
      name: `Badge ${i}`,
      description: `Description for badge ${i}`,
      icon: '🏅',
      criteria: `Criteria for badge ${i}`
    }).save();
    badges.push(badge);
  }

  // USER BADGES
  for (const student of users['student']) {
    for (const badge of badges) {
      await new UserBadge({ user: student._id, badge: badge._id }).save();
    }
  }

  // RESOURCES
  for (const course of courses) {
    for (let r = 1; r <= 2; r++) {
      await new Resource({
        title: `Resource ${r} for ${course.title}`,
        type: ['pdf', 'book', 'video'][r % 3],
        url: `https://example.com/resource${r}_${course._id}.pdf`,
        course: course._id,
        uploadedBy: users['teacher'][0]._id
      }).save();
    }
  }

  // FORUM POSTS
  for (const course of courses) {
    for (let f = 1; f <= 2; f++) {
      await new ForumPost({
        course: course._id,
        author: users['student'][f % users['student'].length]._id,
        title: `Forum Post ${f} for ${course.title}`,
        content: `Content for forum post ${f}`,
        replies: [{ author: users['teacher'][0]._id, content: 'Reply from teacher', createdAt: new Date() }]
      }).save();
    }
  }

  // NOTIFICATIONS
  for (const student of users['student']) {
    for (let n = 1; n <= 2; n++) {
      await new Notification({
        user: student._id,
        message: `Notification ${n} for ${student.name}`,
        type: ['info', 'alert', 'reminder'][n % 3]
      }).save();
    }
  }

  // REPORTS
  for (const course of courses) {
    await new Report({
      type: 'grades',
      generatedBy: users['teacher'][0]._id,
      course: course._id,
      data: { average: 'B', highest: 'A', lowest: 'C' }
    }).save();
  }

  // ANALYTICS EVENTS
  for (const student of users['student']) {
    await new AnalyticsEvent({
      user: student._id,
      type: 'login',
      data: { device: 'web' }
    }).save();
  }

  // AUDIT LOGS
  for (const course of courses) {
    await new AuditLog({
      user: users['admin'][0]._id,
      action: 'created_course',
      targetType: 'Course',
      targetId: course._id.toString(),
      details: { title: course.title }
    }).save();
  }

  // FILES
  for (let i = 1; i <= 3; i++) {
    await new File({
      filename: `file${i}.pdf`,
      url: `https://example.com/file${i}.pdf`,
      uploadedBy: users['teacher'][0]._id,
      type: 'pdf',
      size: 123456 * i
    }).save();
  }

  // SETTINGS
  await Setting.updateOne(
    { key: 'school_name' },
    { $set: { value: 'Demo School', updatedAt: new Date() } },
    { upsert: true }
  );
  await Setting.updateOne(
    { key: 'semester' },
    { $set: { value: 'Spring 2024', updatedAt: new Date() } },
    { upsert: true }
  );

  console.log('Multiple demo data records created!');
  mongoose.disconnect();
}

createDemoData(); 

