const mongoose = require("mongoose");
const configuration = require("./config");
require("dotenv/config");

const config =
  process.env.NODE_ENV === "test"
    ? configuration.database.test
    : configuration.database.base;

//Connecting to database
mongoose.connect(
  config,
  { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false },
  () => console.log("connected to database")
);
mongoose.Promise = global.Promise;
module.exports = mongoose;
