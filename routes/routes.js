const router = require("express").Router();
const AuthController = require("../controllers/AuthController");
const TaskController = require("../controllers/TaskController");
const tokenAuth = require("../validation/tokenVerification");

//Tasks routes
router.post("/task", tokenAuth, TaskController.createTask);
router.patch("/task/:taskId", tokenAuth, TaskController.updateTask);
router.get("/tasks", tokenAuth, TaskController.listTasks);
router.get("/tasks/sorted", tokenAuth, TaskController.sortTasks);
router.delete("/task/:taskId", tokenAuth, TaskController.deleteTask);
//User auth routes
router.post("/register", AuthController.createUser);
router.delete("/delete", tokenAuth, AuthController.deleteUser);
router.post("/login", AuthController.logUser);

module.exports = router;
