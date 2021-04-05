const express = require("express");
const router = express.Router();
const Task = require("../models/Task");
const verify = require("../validation/tokenVerification");

//Gets back all the tasks
router.get("/", verify, async (req, res) => {
  try {
    const tasks = await Task.find().sort({ priority: 1 });
    res.json(tasks);
  } catch (err) {
    res.json({ message: err });
  }
});

//Submits a task
router.post("/", verify, async (req, res) => {
  const task = new Task({
    title: req.body.title,
    description: req.body.description,
    priority: req.body.priority,
  });
  try {
    const savedTask = await task.save();
    res.json(savedTask);
  } catch (err) {
    res.json({ message: err });
  }
});

//Gets back specific task
router.get("/:postId", verify, async (req, res) => {
  try {
    const task = await Task.findById(req.params.postId);
    res.json(task);
  } catch (err) {
    res.json({ message: err });
  }
});

//Delete specific task
router.delete("/:postId", verify, async (req, res) => {
  try {
    const removeTask = await Task.remove({ _id: req.params.postId });
    res.json(removeTask);
  } catch (err) {
    res.json({ message: err });
  }
});

//Update task
router.patch("/:postId", async (req, res) => {
  try {
    const updateTask = await Task.updateOne(
      { _id: req.params.postId },
      { $set: { title: req.body.title } }
    );
    res.json(updateTask);
  } catch (err) {
    res.json({ message: err });
  }
});

module.exports = router;
