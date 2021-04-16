const mongoose = require("mongoose");

const TaskSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  priority: {
    type: String,
    enum: ["baixa", "alta"],
    default: "baixa",
  },
  description: {
    type: String,
  },
});

module.exports = mongoose.model("Tasks", TaskSchema);
