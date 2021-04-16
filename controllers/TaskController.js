const Task = require("../models/Task");
const User = require("../models/User");

module.exports = {
  //Criar tarefas
  async createTask(req, res) {
    try {
      const user = await User.findById(req.userId);
      const task = await Task.create({ ...req.body, user: req.userId });
      user.tasks.push(task);
      await user.save();
      return res.send(task);
    } catch (error) {
      return res
        .status(400)
        .send("Erro na criação, confira se preencheu os dados corretamente");
    }
  },
  //Listar tarefas
  async listTasks(req, res) {
    try {
      const user = await User.findById(req.userId);
      return res.send(user.tasks);
    } catch (error) {
      return res.status(400).send("O usuário não possui tarefas cadastradas.");
    }
  },
  //Ordenar listas pela prioridade
  async sortTasks(req, res) {
    try {
      const user = await User.findById(req.userId);
      user.tasks.sort((a, b) => {
        if (JSON.stringify(a)[13] > JSON.stringify(b)[13]) {
          return 1;
        } else if (JSON.stringify(a)[13] < JSON.stringify(b)[13]) {
          return -1;
        }
        return 0;
      });
      return res.send(user.tasks);
    } catch (error) {
      return res.status(400).send("O usuário não possui tarefas cadastradas.");
    }
  },
  //Editar tarefa
  async updateTask(req, res) {
    try {
      const user = await User.findById(req.userId);
      const { name, priority, description } = req.body;
      if (
        (name !== null && name !== "" && priority === "alta") ||
        (name !== null && name !== "" && priority === "baixa")
      ) {
        const taskUpdated = await Task.findByIdAndUpdate(
          req.params.taskId,
          {
            name,
            priority,
            description,
          },
          { new: true }
        );
        user.tasks.forEach((task) => {
          if (task._id == req.params.taskId) {
            let index = user.tasks.indexOf(task);
            user.tasks.splice(index, 1);
          }
        });
        user.tasks.push(taskUpdated);
        await user.save();

        return res.send(user.tasks);
      }
      return res
        .status(400)
        .send("Campos inválidos checar se preencheu corretamente.");
    } catch (error) {
      return res
        .status(400)
        .send("Campos inválidos checar se preencheu corretamente.");
    }
  },
  //Deletar tarefa
  async deleteTask(req, res) {
    try {
      const user = await User.findById(req.userId);
      let flag = false;
      user.tasks.forEach((task) => {
        if (task._id == req.params.taskId) {
          let index = user.tasks.indexOf(task);
          user.tasks.splice(index, 1);
          flag = true;
        }
      });
      if (flag) {
        const taskToDelete = await Task.deleteOne({ _id: req.params.taskId });
        await user.save();
        return res.status(200).send(user.tasks);
      }
      return res.status(400).send("Tarefa não encontrada.");
    } catch (error) {
      return res.status(400).send("Erro ao deletar a tarefa.");
    }
  },
};
