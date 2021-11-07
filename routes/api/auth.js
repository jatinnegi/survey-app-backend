const express = require("express");
const {
  signInController,
  signUpController,
} = require("../../controllers/auth");
const { check } = require("express-validator");

const router = express.Router({ strict: true });

router.post("/signin", signInController);

router.post(
  "/signup",
  [
    check("name", "Name is required").exists(),
    check("email", "Enter a valid email").isEmail(),
    check("password", "Password is reqiured").exists(),
    check("gender", "Gender is required").exists(),
    check("age", "Age is required").exists(),
    check("userType", "User type is required").exists(),
  ],
  signUpController
);

module.exports = router;
