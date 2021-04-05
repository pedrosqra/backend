const mongoose = require("mongoose");

const TasksSchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  priority: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Tasks", TasksSchema);
