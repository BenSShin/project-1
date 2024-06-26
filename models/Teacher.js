const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const TeacherSchema = new Schema({
  name: { type: String, required: true },
  subjectsTaught: Array,
});

module.exports = mongoose.model("Teacher", TeacherSchema);
