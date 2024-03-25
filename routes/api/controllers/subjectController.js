const express = require("express");
const router = express.Router();
const handleError = require("../../../utils/handleError");
const ObjectId = require("mongodb").ObjectId;
const Subject = require("../../../models/Subject");

router.post("/create/subject", async (req, res) => {
  try {
    const subjectName = req.body.name;
    console.log(subjectName);
    const existingSubject = await Subject.findOne({ name: subjectName });

    if (existingSubject) {
      console.log("This subject name has already been registered");
      return res.status(400).json({ message: "This subject has already been registered" });
    } else {
      const newSubject = new Subject(req.body);
      newSubject.save().catch((err) => console.log(err));
      return res.status(200).json(newSubject);
    }
  } catch (error) {
    console.log(err);
    handleError(error, res);
  }
});

router.get("/fetch/subject", async (req, res) => {
  try {
    const subjects = await Subject.find();
    console.log(subjects);
    if (subjects) {
      return res.status(200).json(subjects);
    } else {
      return res.json({ message: "No Subjects have been added yet." });
    }
  } catch (error) {
    console.log(error);
    handleError(error, res);
  }
});

module.exports = router;
