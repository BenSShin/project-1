const express = require("express");
const router = express.Router();
const handleError = require("../../../utils/handleError");
const Student = require("../../../models/Student");
const Class = require("../../../models/Class");
const Grade = require("../../../models/Grade");
const ObjectId = require("mongodb").ObjectId;

router.post("/create/grade", async (req, res) => {
  try {
    const studentStrId = req.body.studentId;
    const studentObjId = new ObjectId(studentStrId);
    const studentDoc = await Student.findById(studentObjId);

    const classId = req.body.classId;
    const classObjId = new ObjectId(classId);
    const classDoc = await Class.findById(classObjId);

    const gradeDoc = await Grade.find({
      $and: [{ studentId: { $eq: studentStrId } }, { classId: { $eq: classId } }],
    });
    if (gradeDoc.length > 0) {
      return res.status(400).json({ message: "There is already a grade with this class and student." });
    } else if (studentDoc && classDoc) {
      const newGrade = new Grade(req.body);
      newGrade.save().catch((err) => console.log(err));
      return res.status(200).json(newGrade);
    } else {
      console.log("The student or class are not registered");
      return res.status(400).json({ message: "The student or class is not registered." });
    }
  } catch (error) {
    console.log(error);
    handleError(error, res);
  }
});

router.get("/fetch/:gradeId", async (req, res) => {
  try {
    const { gradeId } = req.params;
    const gradeObjId = new ObjectId(gradeId);
    const grade = await Grade.findById(gradeObjId);
    if (grade) {
      return res.status(200).json(grade);
    } else {
      return res.status(400).json({ message: "Grade does not exist." });
    }
  } catch (error) {
    console.log(error);
    handleError(error, res);
  }
});

router.put("/update/:gradeId", async (req, res) => {
  const { gradeId } = req.params;
  const updatedGradeData = req.body;
  const gradeObjId = new ObjectId(gradeId);
  try {
    const updatedGrade = await Grade.findByIdAndUpdate(gradeObjId, updatedGradeData, {
      new: true,
    });
    if (!updatedGrade) {
      return res.status(404).json({ message: "No such grade exists." });
    }
    return res.status(200).json(updatedGrade);
  } catch (errer) {
    console.log(error);
    handleError(error, res);
  }
});

router.get("/class/:classId", async (req, res) => {
  const { classId } = req.params;
  const classObjId = new ObjectId(classId);
  const classDoc = await Class.findById(classObjId);

  try {
    if (classDoc) {
      const gradesDoc = await Grade.find({ classId: { $eq: classObjId } });
      return res.status(200).json(gradesDoc);
    } else {
      return res.status(404).json({ message: "This class does not exist." });
    }
  } catch (error) {
    console.log(error);
    handleError(error, res);
  }
});

module.exports = router;
