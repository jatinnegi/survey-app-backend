const User = require("../models/User.model");
const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");

const signInController = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ msg: "Invalid credentials" });

  try {
    let user = await User.findOne({ email });

    if (!user) return res.status(400).json({ msg: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });

    res.status(201).json({ userId: user._id, userType: user.userType });
  } catch (error) {
    console.log(error);
    res.status(500).send("Server error");
  }
};

const signUpController = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty())
    return res.status(422).json({ errors: errors.array() });

  const { name, email, password, gender, age, userType } = req.body;

  try {
    let user = await User.findOne({ email });

    if (user)
      return res
        .status(400)
        .json({ errors: [{ param: "email", msg: "Email is already taken" }] });

    const hashedPassword = await bcrypt.hash(password, 12);

    user = await User.create({
      name,
      email,
      password: hashedPassword,
      gender,
      age,
      userType,
    });

    res.status(201).json({ userId: user._id, userType: user.userType });
  } catch (error) {
    console.log(error);
    res.status(500).send("Server error");
  }
};

module.exports = { signInController, signUpController };
