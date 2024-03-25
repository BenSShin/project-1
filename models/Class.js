const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const getCurrentSemesterAndYear = require("../utils/handleCurrent");

const ClassSchema = new Schema({
  name: { type: String, required: true },
  subjectId: { type: String, required: true },
  teacherId: { type: String, required: true },
  semester: { type: String, default: getCurrentSemesterAndYear().currentSemester },
  year: { type: Number, default: getCurrentSemesterAndYear().currentYear },
  studentId: Array,
});

module.exports = mongoose.model("Class", ClassSchema);
