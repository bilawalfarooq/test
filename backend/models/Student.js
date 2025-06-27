const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  admissionNumber: { type: String, required: true, unique: true },
  class: { type: String, required: true },
  section: { type: String, required: true },
  dob: { type: Date },
  gender: { type: String, enum: ['male', 'female', 'other'] },
  address: { type: String },
  phone: { type: String },
  parentName: { type: String },
  parentContact: { type: String },
  academicInfo: {
    type: Object,
    default: {}
  },
  promoted: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Student', studentSchema);
