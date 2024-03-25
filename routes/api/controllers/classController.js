const express = require("express");
const router = express.Router();
const handleError = require("../../../utils/handleError");
const Subject = require("../../../models/Subject");
const Teacher = require("../../../models/Teacher");
const Class = require("../../../models/Class");
const ObjectId = require("mongodb").ObjectId;
const isPastSemester = require("../../../utils/handlePast");

router.post("/create/class", async (req, res) => {
  try {
    const subjectId = req.body.subjectId;
    const subjectObjId = new ObjectId(subjectId);
    const existingSubject = await Subject.findById(subjectObjId);

    const teacherId = req.body.teacherId;
    const teacherObjId = new ObjectId(teacherId);
    const existingTeacher = await Teacher.findById(teacherObjId);

    if (existingSubject && existingTeacher) {
      const newClass = new Class(req.body);
      newClass.save().catch((err) => console.log(err));
      return res.status(200).json(newClass);
    } else {
      console.log("The subject or teacher are not registered.");
      return res.status(400).json({ message: "This subject or teacher are not registered." });
    }
  } catch (error) {
    console.log(error);
    handleError(error, res);
  }
});

router.put("/:classId/enroll", async (req, res) => {
  const { classId } = req.params;
  const enrolledStudent = req.body.studentId;
  const classObjId = new ObjectId(classId);
  try {
    const classDoc = await Class.findById(classObjId);
    const classYear = classDoc.year;
    const classSemester = classDoc.semester;
    const past = await isPastSemester(classSemester, classYear);
    // I did look up how to do the below code line on chatgpt since I couldn't use this code:
    //          const enrolledDoc = await Class.find({ studentId: { $in: enrolledStudent } });
    // because of it changing classDoc variable defined earlier.
    const alreadyEnrolled = classDoc.studentId.some((student) => enrolledStudent.includes(student));
    if (!classDoc) {
      return res.status(404).json({ message: "Class not found." });
    } else if (past) {
      return res.status(400).json({ message: "This class has already been completed." });
    } else if (alreadyEnrolled) {
      return res.status(404).json({ message: "This student is already enrolled in this class." });
    } else {
      await enrolledStudent.forEach((id) => classDoc.studentId.push(id));
      await classDoc.save();
      return res.status(200).json(classDoc);
    }
  } catch (error) {
    console.log(error);
    handleError(error, res);
  }
});

router.delete("/:classId/drop", async (req, res) => {
  const { classId } = req.params;
  const classObjId = new ObjectId(classId);
  const studentId = req.body.studentId;
  try {
    const classDoc = await Class.findById(classObjId);
    const classYear = classDoc.year;
    const classSemester = classDoc.semester;
    const past = await isPastSemester(classSemester, classYear);
    if (past) {
      return res.status(400).json({ message: "This class has already been completed" });
    } else if (classDoc) {
      classDoc.studentId = await classDoc.studentId.filter((id) => id !== studentId);
      await classDoc.save();
      return res.status(200).json(classDoc);
    } else {
      return res.status(404).json({ message: "This class does not exist." });
    }
  } catch (error) {
    console.log(error);
    handleError(error, res);
  }
});

module.exports = router;
