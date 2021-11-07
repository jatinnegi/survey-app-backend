const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv").config();

const app = express();

app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 5000;

mongoose
  .connect(
    `mongodb+srv://${process.env.ATLAS_USER}:${process.env.ATLAS_PASSWORD}@cluster0.mmt7s.mongodb.net/${process.env.ATLAS_DATABASE}?retryWrites=true&w=majority`,
    {
      useUnifiedTopology: true,
    }
  )
  .then(() => {
    console.log(`Connected to MongoDB atlas...`);
  })
  .catch((err) => console.log(err));
app.get("/", (req, res) => res.send("Welcome to survey-app-poc api"));
app.use("/api/auth", require("./routes/api/auth"));
app.use("/api/survey", require("./routes/api/survey"));

app.listen(PORT, () => {
  console.log(`Listening on PORT ${PORT}...`);
});
