const express = require("express");
const mongoose = require("mongoose");
const app = express();
require("dotenv/config");

//Tasks route
const tasksRoute = require("./routes/tasks");

//Auth route
const authRoute = require("./routes/auth");

//Connecting to database
mongoose.connect(
  process.env.DB_CONNECTION,
  { useNewUrlParser: true, useUnifiedTopology: true },
  () => console.log("connected to database")
);

//Middlewares
app.use(express.json());
app.use("/tasks", tasksRoute);
app.use("/", authRoute);

//Choosing a port to listen to
app.listen(3333);
