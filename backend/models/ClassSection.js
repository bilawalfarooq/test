const mongoose = require('mongoose');

const classSectionSchema = new mongoose.Schema({
  className: { type: String, required: true },
  section: { type: String, required: true },
  teacher: { type: String }, // optional: teacher name or id
  capacity: { type: Number },
  academicYear: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('ClassSection', classSectionSchema);
