require('dotenv').config({ path: '../.env' });
const mongoose = require('mongoose');
const Student = require('../models/Student');
const ClassSection = require('../models/ClassSection');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/lms';

async function createDemoStudentsAndClasses() {
  await mongoose.connect(MONGO_URI);

  // Demo ClassSections
  const classSectionsData = [
    { className: '10', section: 'A', teacher: 'Mr. Smith', capacity: 30, academicYear: '2024-2025' },
    { className: '10', section: 'B', teacher: 'Ms. Johnson', capacity: 28, academicYear: '2024-2025' },
    { className: '9', section: 'A', teacher: 'Mr. Lee', capacity: 32, academicYear: '2024-2025' },
    { className: '8', section: 'C', teacher: 'Ms. Brown', capacity: 25, academicYear: '2024-2025' }
  ];
  const classSections = [];
  for (const cs of classSectionsData) {
    let section = await ClassSection.findOne({ className: cs.className, section: cs.section, academicYear: cs.academicYear });
    if (!section) {
      section = await new ClassSection(cs).save();
    }
    classSections.push(section);
  }

  // Demo Students
  const studentsData = [
    { name: 'Alice Johnson', email: 'alice10a@school.com', admissionNumber: 'A1001', class: '10', section: 'A', dob: '2010-05-12', gender: 'female', address: '123 Main St', phone: '1234567890', parentName: 'Robert Johnson', parentContact: '9876543210' },
    { name: 'Bob Smith', email: 'bob10b@school.com', admissionNumber: 'A1002', class: '10', section: 'B', dob: '2010-08-23', gender: 'male', address: '456 Oak Ave', phone: '2345678901', parentName: 'Linda Smith', parentContact: '8765432109' },
    { name: 'Charlie Lee', email: 'charlie9a@school.com', admissionNumber: 'A1003', class: '9', section: 'A', dob: '2011-01-15', gender: 'male', address: '789 Pine Rd', phone: '3456789012', parentName: 'Grace Lee', parentContact: '7654321098' },
    { name: 'Diana Brown', email: 'diana8c@school.com', admissionNumber: 'A1004', class: '8', section: 'C', dob: '2012-11-30', gender: 'female', address: '321 Maple St', phone: '4567890123', parentName: 'Henry Brown', parentContact: '6543210987' }
  ];
  for (const s of studentsData) {
    let student = await Student.findOne({ admissionNumber: s.admissionNumber });
    if (!student) {
      student = await new Student(s).save();
    }
  }

  console.log('Demo students and class-sections created!');
  mongoose.disconnect();
}

createDemoStudentsAndClasses();
