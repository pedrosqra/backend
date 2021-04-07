const mongoose = require("mongoose");
require("dotenv/config");

//Connecting to database
mongoose.connect(
  process.env.DB_CONNECTION,
  { useNewUrlParser: true, useUnifiedTopology: true },
  () => console.log("connected to database")
);
