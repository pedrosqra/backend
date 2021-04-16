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
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

module.exports = mongoose.model("Task", TaskSchema);
