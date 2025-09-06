const mongoose = require('mongoose');

// Nested schema for course content (modules/lessons)
const contentSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  videoUrl: { type: String, required: true },
  duration: { type: String, required: true },
  thumbnailUrl: { type: String, required: true }
});

// Main Course schema
const courseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: [contentSchema],  
  isActive: { type: Boolean, default: true },
  organisation: { type: String, required: true },
  price: { type: Number, required: true },
  rating: { type: Number, default: 0 },
  tags: { type: [String], default: [] },
  imageUrl: { type: String, required: true },
  enrolledStudents: { type: Number, default: 0 }
}, { timestamps: true });

const Course = mongoose.model('Course', courseSchema);
module.exports = Course;
