const Task = require("../models/Task");

module.exports = {
  async createTask(req, res) {
    const { name, priority, description } = req.body;
    let task = await Task.findOne({ name, description });
    if (task) return res.status(400).send("Essa task já existe.");

    try {
      if (!task) {
        task = await Task.create({
          name,
          priority,
          description,
        });
        return res.status(200).send("ok");
      }
    } catch (err) {
      console.log(err);
      return res.status(400).send("Algum campo está inválido.");
    }
    return res.status(400).send("Algum campo está inválido.");
  },

  async listTasks(req, res) {
    try {
      const tasks = await Task.find();
      return res.json(tasks);
    } catch (error) {
      return res.status(400).send("Não há tarefa cadastrada");
    }
  },

  async sortTasks(req, res) {
    try {
      const tasks = await Task.find();
      tasks.sort((a, b) => {
        if (a < b) {
          return -1;
        } else if (a > b) {
          return 1;
        }
        return 0;
      });
      return res.json(tasks);
    } catch (error) {
      return res.status(400).send("Não há tarefa cadastrada");
    }
  },

  async updateTask(req, res) {
    try {
      if (req.body.priority == "baixa" || req.body.priority == "alta") {
        const updatedTask = await Task.updateOne(
          { _id: req.params.taskId },
          {
            $set: {
              name: req.body.name,
              priority: req.body.priority,
              description: req.body.description,
            },
          }
        );
        return res.status(200).send("ok");
      }
      return res
        .status(400)
        .send(
          'O campo de prioridade está com valores inválidos. Tente "sem prioridade", "baixa", "media" ou "alta". '
        );
    } catch (err) {
      return res.status(400).send(err);
    }
  },

  async deleteTask(req, res) {
    const task = await Task.findById({ _id: req.params.taskId });
    if (!task) {
      return res.status(400).send("Esta tarefa não existe no banco de dados.");
    }
    try {
      const task = await Task.deleteOne({ _id: req.params.taskId });
      return res.status(200).send("Deletado com sucesso");
    } catch (error) {
      return res.status(400).send("Não foi possível deletar a tarefa.");
    }
  },
};
