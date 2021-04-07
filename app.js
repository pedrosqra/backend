const express = require("express");
const app = express();
const database = require("./config/database");
require("dotenv/config");

//Routes
const routes = require("./routes/routes");

//Middlewares
app.use(express.json());
app.use("/", routes);

//Choosing a port to listen to
app.listen(3333);

module.exports = app;
