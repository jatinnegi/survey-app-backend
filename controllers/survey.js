const Survey = require("../models/Survey.model");
const User = require("../models/User.model");
const { options } = require("../routes/api/survey");

const createSurveyController = async (req, res) => {
  try {
    const survey = await Survey.create(req.body);

    res.status(201).json(survey);
  } catch (error) {
    console.log(error);
    res.status(500).send("Server error");
  }
};

const getSurveysController = async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await User.findOne({ _id: userId });

    if (user.userType === "coordinator") {
      const surveys = await Survey.find({ coordinator: userId });
      const data = surveys.map((survey) => ({
        _id: survey._id,
        title: survey.title,
        questions: survey.questions.length,
        responses: survey.completedBy.length,
      }));
      res.status(200).json(data);
    } else {
      const age = user.age;
      let ageQuery = "";

      if (age < 18) ageQuery = "<18";
      else if (age < 31) ageQuery = "18-30";
      else if (age < 41) ageQuery = "31-40";
      else if (age < 55) ageQuery = "41-54";
      else ageQuery = "55+";

      const surveys = await Survey.find({
        $and: [
          {
            $or: [{ age: "all" }, { age: ageQuery }],
          },
          {
            $or: [{ gender: "all" }, { gender: user.gender }],
          },
        ],
      });
      const data = surveys.map((survey) => {
        return {
          _id: survey._id,
          title: survey.title,
          questions: survey.questions.length,
          status: survey.completedBy.includes(userId),
        };
      });
      res.status(200).json(data);
    }
  } catch (error) {
    console.log(error);
    res.status(500).send("Server error");
  }
};

const getSurveyController = async (req, res) => {
  const { surveyId, userId } = req.params;

  try {
    const user = await User.findById(userId);
    const survey = await Survey.findById(surveyId);

    if (user.userType === "respondant") {
      let data = {
        _id: survey._id,
        title: survey.title,
        status: survey.completedBy.includes(userId),
      };

      const questions = survey.questions.map((question) => ({
        _id: question._id,
        title: question.title,
        options: question.options.map((option) => ({
          _id: option._id,
          value: option.value,
          selected: option.votes.includes(userId),
        })),
      }));
      data.questions = questions;

      res.status(200).json(data);
    } else {
      let data = {
        _id: survey._id,
        title: survey.title,
      };

      const respondants = [];

      for (let i = 0; i < survey.completedBy.length; i++) {
        const user = await User.findById(survey.completedBy[i]);

        respondants.push({
          _id: user._id,
          name: user.name,
          email: user.email,
          status: "Completed",
        });
      }

      data.respondants = respondants;

      res.status(200).json(data);
    }
  } catch (error) {
    console.log(error);
    res.status(500).send("Server error");
  }
};

const surveyResponseController = async (req, res) => {
  const { surveyId, userId } = req.params;
  const answers = req.body;

  try {
    const survey = await Survey.findById(surveyId);

    answers.forEach((answer) => {
      survey.questions.forEach((question) => {
        if (question._id.toString() === answer._id) {
          question.options.forEach((option) => {
            if (option.value === answer.value) option.votes.push(userId);
            else {
              let index = option.votes.indexOf(userId);
              if (index > -1) option.votes.splice(index, 1);
            }
          });
        }
      });
    });

    if (!survey.completedBy.includes(userId)) survey.completedBy.push(userId);

    await survey.save();

    res.status(200).json({});
  } catch (error) {
    console.log(error);
    res.status(500).send("Server error");
  }
};

module.exports = {
  getSurveysController,
  getSurveyController,
  surveyResponseController,
  createSurveyController,
};
