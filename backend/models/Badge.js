const mongoose = require('mongoose');

const badgeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  icon: String,
  criteria: String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Badge', badgeSchema);
