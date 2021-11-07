const express = require("express");
const {
  getSurveysController,
  getSurveyController,
  createSurveyController,
  surveyResponseController,
} = require("../../controllers/survey");

const router = express.Router({ strict: true });

router.get("/all/:userId", getSurveysController);
router.get("/:surveyId/:userId", getSurveyController);
router.post("/:surveyId/:userId", surveyResponseController);
router.post("/create-survey", createSurveyController);

module.exports = router;
