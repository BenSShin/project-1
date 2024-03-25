const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const GradeSchema = new Schema({
  studentId: { type: String, required: true },
  classId: { type: String, required: true },
  grade: { type: String, required: true },
  semester: { type: String, required: true },
  year: { type: Number, required: true },
});

module.exports = mongoose.model("Grade", GradeSchema);
