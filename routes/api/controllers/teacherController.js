const express = require("express");
const router = express.Router();
const handleError = require("../../../utils/handleError");
const Teacher = require("../../../models/Teacher");
const Class = require("../../../models/Class");
const ObjectId = require("mongodb").ObjectId;

router.post("/create/teacher", async (req, res) => {
  try {
    const teacherName = req.body.name;
    const teacherDoc = await Teacher.findOne({ name: teacherName });
    if (teacherDoc) {
      return res.status(404).json({ message: "This name is already registered as a Teacher" });
    } else {
      const newTeacher = new Teacher(req.body);
      newTeacher.save().catch((err) => console.log(err));
      return res.status(200).json(newTeacher);
    }
  } catch (error) {
    console.log(error);
    handleError(error, res);
  }
});

router.get("/fetch/teacher", async (req, res) => {
  try {
    const teacher = await Teacher.find();
    if (teacher) {
      return res.status(200).json(teacher);
    } else {
      return res.json({ message: "No Teachers have been added yet" });
    }
  } catch (error) {
    console.log(err);
    handleError(error, res);
  }
});

router.get("/fetch/:teacherId/classes", async (req, res) => {
  try {
    const { teacherId } = req.params;
    const teacher = await Teacher.findById(teacherId);
    if (teacher) {
      const classes = await Class.find({ teacherId: { $eq: teacherId } });
      return res.status(200).json(classes);
    } else {
      return res.status(400).json({ message: "This teacher doesn't exist." });
    }
  } catch (error) {
    console.log(error);
    handleError(error, res);
  }
});

module.exports = router;
