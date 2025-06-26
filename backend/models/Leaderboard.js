const mongoose = require('mongoose');

const leaderboardSchema = new mongoose.Schema({
  course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
  type: { type: String, enum: ['points', 'badges', 'grades'], default: 'points' },
  entries: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    value: Number
  }],
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Leaderboard', leaderboardSchema);
