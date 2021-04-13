const mongoose = require("mongoose");

const UserSchema = mongoose.Schema(
  {
    nickname: {
      type: String,
      required: true,
      min: 6,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
      min: 8,
    },
    tasks: {
      type: Array,
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", UserSchema);
