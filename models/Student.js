const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const StudentSchema = new Schema({
  name: { type: String, required: true },
  major: { type: String, required: true },
});

module.exports = mongoose.model("Student", StudentSchema);
