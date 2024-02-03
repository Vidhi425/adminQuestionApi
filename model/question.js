const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const QuestionSchema = new Schema({
  question: { type: String, required: true },
  type: { type: String, required: true, enum: ["main", "side"] },
  answer: { type: String, required: true },
});

const QuestionModel = mongoose.model("Question", QuestionSchema);
module.exports = QuestionModel;
