const mongoose = require('mongoose');

const gradeSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  assignment: { type: mongoose.Schema.Types.ObjectId, ref: 'Assignment' },
  grade: String,
  feedback: String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Grade', gradeSchema);
