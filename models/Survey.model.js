const mongoose = require("mongoose");

const OptionSchema = mongoose.Schema({
  value: {
    type: String,
    required: true,
  },
  votes: [String],
});

const QuestionSchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  options: [OptionSchema],
});

const SurveySchema = mongoose.Schema({
  coordinator: {
    type: mongoose.Types.ObjectId,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  questions: [QuestionSchema],
  age: {
    type: String,
    required: true,
  },
  gender: {
    type: String,
    required: true,
  },
  completedBy: {
    type: [String],
  },
});

const Survey = mongoose.model("survey", SurveySchema);

module.exports = Survey;
