// controllers/courseController.js
const Course = require('../Models/Course');
const UserCourse = require('../Models/UserCourse');
const mongoose = require('mongoose');

const User = require('../Models/User');
const Profile = require('../Models/Profile');

// CREATE a new course
exports.createCourse = async (req, res) => {
  try {
    const course = new Course(req.body);
    await course.save();
    res.status(201).json({ success: true, data: course });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// READ - get all courses
exports.getCourses = async (req, res) => {
  try {
    const courses = await Course.find();
    res.json({ success: true, data: courses });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// READ - get single course by id
exports.getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ success: false, message: 'Course not found' });
    res.json({ success: true, data: course });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// UPDATE a course
exports.updateCourse = async (req, res) => {
  try {
    const course = await Course.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!course) return res.status(404).json({ success: false, message: 'Course not found' });
    res.json({ success: true, data: course });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// DELETE a course
exports.deleteCourse = async (req, res) => {
  try {
    const course = await Course.findByIdAndDelete(req.params.id);
    if (!course) return res.status(404).json({ success: false, message: 'Course not found' });
    res.json({ success: true, message: 'Course deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};





exports.joinCourse = async (req, res) => {
  try {
    const { profileId, courseId } = req.body;

    // 1. Find course
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ success: false, message: "Course not found" });
    }

    // 2. Find profile
    const profile = await Profile.findById(profileId);
    if (!profile) {
      return res.status(404).json({ success: false, message: "Profile not found" });
    }

    // 3. Find the user associated with this profile
    const user = await User.findOne({ profile: profileId });
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // 4. Check if user already enrolled (via UserCourse)
    const alreadyEnrolled = await UserCourse.findOne({
      userId: user._id,
      courseId: course._id,
    });

    if (alreadyEnrolled) {
      return res.status(400).json({ success: false, message: "Already enrolled in this course" });
    }

    // 5. Create a new UserCourse entry
    const userCourse = await UserCourse.create({
      userId: user._id,
      courseId: course._id,
      progress: {
        completed: 0,
        total: course.content.length,
        percentage: 0,
      },
      completedModules: [],
      watchedTill: {},
    });

    console.log('course saved' , userCourse);

    // 6. Add course to profile for quick reference (optional)
    profile.enrolledCourse.push(course._id);
    await profile.save();

    // 7. Increment enrolledStudents count in Course
    course.enrolledStudents += 1;
    await course.save();
    console.log(userCourse);

    res.status(200).json({
      success: true,
      message: "Successfully enrolled in course",
      data: {
        profile,
        course,
        userCourse,
      },
    });
  } catch (error) {
    console.error("Join course error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};


exports.getMyCourses = async (req, res) => {
  try {
    const userId = req.params.id;

   

    // 1. Check user
    const user = await User.findById(userId).populate("profile");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // 2. Fetch enrolled courses with full course object
    const enrolled = await UserCourse.find({ userId})
      .populate({
        path: "courseId",
        model: "Course",
      });

    if (!enrolled || enrolled.length === 0) {
      return res.status(200).json([]);
    }

    // 3. Format response
    const response = enrolled.map(uc => ({
      _id: uc._id,
      course: uc.courseId, // now contains full course document
      progress: uc.progress,
      completedModules: uc.completedModules,
      watchedTill: uc.watchedTill
    }));

    return res.status(200).json(response);
  } catch (error) {
    console.error("Error fetching my courses:", error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

// controllers/courseController.js

exports.markCourseCompletion = async (req, res) => {
  try {
    const { userId, courseId } = req.body;

    // 1. Find the enrollment
    const userCourse = await UserCourse.findOne({ userId, courseId })
      .populate("courseId"); // to access full course content
    if (!userCourse) {
      return res.status(404).json({ success: false, message: "Enrollment not found" });
    }

    const course = userCourse.courseId;
    if (!course || !course.content) {
      return res.status(400).json({ success: false, message: "Invalid course data" });
    }

    // 2. Mark all modules as completed
    const allModules = course.content.map(c => c._id);

    userCourse.completedModules = allModules;
    userCourse.progress.completed = allModules.length;
    userCourse.progress.total = allModules.length;
    userCourse.progress.percentage = allModules.length > 0 ? 100 : 0;

    await userCourse.save();

    return res.status(200).json({
      success: true,
      message: "Course marked as completed",
      data: userCourse,
    });
  } catch (error) {
    console.error("Error marking course completion:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};
// Mark a single lesson/module as completed
exports.markLessonComplete = async (req, res) => {
  try {
    const { userId, courseId, contentId } = req.body;

    // Find enrollment
    const userCourse = await UserCourse.findOne({ userId, courseId }).populate("courseId");
    if (!userCourse) {
      return res.status(404).json({ success: false, message: "Enrollment not found" });
    }

    const course = userCourse.courseId;
    if (!course || !course.content) {
      return res.status(400).json({ success: false, message: "Invalid course data" });
    }

    // Check if already completed
    if (!userCourse.completedModules.includes(contentId)) {
      userCourse.completedModules.push(contentId);
    }

    // Update progress
    const total = course.content.length;
    const completed = userCourse.completedModules.length;
    userCourse.progress = {
      completed,
      total,
      percentage: total > 0 ? Math.round((completed / total) * 100) : 0,
    };

    await userCourse.save();

    return res.status(200).json({
      success: true,
      message: "Lesson marked as completed",
      data: userCourse,
    });
  } catch (error) {
    console.error("Error marking lesson complete:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};




