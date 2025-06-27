const mongoose = require('mongoose');

const salaryRecordSchema = new mongoose.Schema({
  amount: { type: Number, required: true },
  month: { type: String, required: true }, // e.g., '2025-06'
  paidDate: { type: Date },
});

const staffSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  role: { type: String, enum: ['teacher', 'admin', 'staff'], required: true },
  phone: { type: String },
  address: { type: String },
  salary: { type: Number },
  salaryRecords: [salaryRecordSchema],
  subjects: [{ type: String }], // e.g., ['Math', 'Science']
  assignedClasses: [{ type: String }], // e.g., ['10A', '9B']
  password: { type: String }, // for login if needed
}, { timestamps: true });

module.exports = mongoose.model('Staff', staffSchema);
