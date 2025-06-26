const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema({
  filename: { type: String, required: true },
  url: { type: String, required: true },
  uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  type: { type: String },
  size: Number,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('File', fileSchema);
