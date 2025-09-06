const mongoose = require('mongoose');
const userCourseSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true },

  // Track progress per user
  completedModules: [
    { type: mongoose.Schema.Types.ObjectId } // store IDs of completed course.content
  ],

  watchedTill: {
    type: Map,
    of: Number, // e.g. { "contentId1": 120, "contentId2": 300 } -> seconds watched
    default: {}
  },

  progress: {
    completed: { type: Number, default: 0 },
    total: { type: Number, default: 0 },
    percentage: { type: Number, default: 0 }
  }
}, { timestamps: true });

const UserCourse = mongoose.model("UserCourse", userCourseSchema);
module.exports = UserCourse;
