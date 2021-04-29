const express = require("express");
const cors = require("cors");
const app = express();
const database = require("./config/database");
require("dotenv/config");

//Routes
const routes = require("./routes/routes");

//Middlewares
app.use(express.json());
app.use(cors());
app.use(routes);

module.exports = app;
