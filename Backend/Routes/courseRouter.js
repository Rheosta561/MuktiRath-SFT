const express = require("express");
const router = express.Router();

const {
  createCourse,
  getCourses,
  getCourseById,
  updateCourse,
  deleteCourse,
  joinCourse,
  getMyCourses,
  markCourseCompletion,
  markLessonComplete

} = require("../Controllers/courseController");

// CREATE a new course
router.post("/", createCourse);

// READ - get all courses
router.get("/", getCourses);

// READ - get single course by id
router.get("/:id", getCourseById);

// UPDATE a course
router.put("/:id", updateCourse);

// DELETE a course
router.delete("/:id", deleteCourse);

// ENROLL user into a course
router.post("/join", joinCourse);
router.post('/mark-complete', markCourseCompletion);
router.post('/mark-lesson' , markLessonComplete );

router.get('/user/:id' ,getMyCourses );

module.exports = router;
