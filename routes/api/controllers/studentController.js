const express = require("express");
const router = express.Router();
const handleError = require("../../../utils/handleError");
const Student = require("../../../models/Student");
const Grade = require("../../../models/Grade");
const ObjectId = require("mongodb").ObjectId;
const gpaCalc = require("../../../utils/handleGpa");

router.post("/create/student", async (req, res) => {
  try {
    const newStudent = new Student(req.body);
    newStudent.save().catch((err) => console.log(err));
    return res.status(200).json(newStudent);
  } catch (error) {
    console.log(error);
    handleError(error, res);
  }
});

router.get("/fetch/student", async (req, res) => {
  try {
    const student = await Student.find();
    if (student) {
      return res.status(200).json(student);
    } else {
      return res.json({ message: "No Student have been added yet" });
    }
  } catch (error) {
    console.log(error);
    handleError(error, res);
  }
});

router.get("/:studentId/grades", async (req, res) => {
  const { studentId } = req.params;
  const studentObjId = new ObjectId(studentId);
  const studentDoc = Student.findById(studentObjId);
  try {
    if (studentDoc) {
      const grades = await Grade.find({ studentId: { $eq: studentId } });
      return res.status(200).json(grades);
    } else {
      return res.status(400).json({ message: "This student doesn't exist." });
    }
  } catch (error) {
    console.log(error);
    handleError(error, res);
  }
});

router.get("/:studentId/gpa/:semester/:year", async (req, res) => {
  const studentId = req.params.studentId;
  const semester = req.params.semester;
  const year = req.params.year;
  try {
    const studentObjId = new ObjectId(studentId);
    const studentDoc = await Student.findById(studentObjId);
    const grades = await Grade.find({
      $and: [{ studentId: studentId }, { semester: semester }, { year: year }],
    });
    if (!studentDoc) {
      return res.status(404).json({ message: "The student does not exist." });
    } else if (grades.length > 0) {
      const gpaArray = [];
      await grades.forEach((gr) => {
        gpaArray.push(gpaCalc(gr.grade));
      });
      const gpaSum = await gpaArray.reduce((a, b) => a + b, 0);
      return res.status(200).json({ gpa: `${(gpaSum / gpaArray.length).toFixed(2)}` });
    } else {
      return res.status(404).json({ message: "This semester or year is invalid." });
    }
  } catch (error) {
    console.log(error);
    handleError(error, res);
  }
});

router.get("/:studentId/gpa", async (req, res) => {
  const { studentId } = req.params;
  try {
    const studentObjId = new ObjectId(studentId);
    const studentDoc = await Student.findById(studentObjId);
    const grades = await Grade.find({ studentId: { $eq: studentId } });
    if (!studentDoc) {
      return res.status(404).json({ message: "The student does not exist." });
    } else if (grades.length > 0) {
      const gpaArray = [];
      await grades.forEach((gr) => {
        gpaArray.push(gpaCalc(gr.grade));
      });
      const gpaSum = await gpaArray.reduce((a, b) => a + b, 0);
      return res.status(200).json({ gpa: `${(gpaSum / gpaArray.length).toFixed(2)}` });
    } else {
      return res.status(404).json({ message: "This student has no Grades yet." });
    }
  } catch (error) {
    console.log(error);
    handleError(error, res);
  }
});

module.exports = router;
