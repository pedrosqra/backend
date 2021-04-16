const app = require("../app");
const supertest = require("supertest");
const request = supertest(app);
const database = require("../config/database");
const User = require("../models/User");
const Task = require("../models/Task");

describe("insert", () => {
  let token;
  let taskId;
  let userId;
  beforeAll(async () => {
    await User.deleteMany();
    await Task.deleteMany();
  });

  afterAll(async () => {
    await database.connection.close();
    done();
  });

  it("should create an user using the /register route", async () => {
    const res = await request.post("/register").send({
      nickname: "plmdssssssss",
      email: "euimplro@pfvr.com",
      password: "genteplmdds",
    });
    expect(res.status).toEqual(200);
    expect(res.body).toHaveProperty("user");
    userId = res.body.user;
  });

  it("should log an user and receive a token", async () => {
    const res = await request.post("/login").send({
      email: "euimplro@pfvr.com",
      password: "genteplmdds",
    });
    token = "Bearer " + res.body.token;
    expect(res.status).toEqual(200);
    expect(res.body).toHaveProperty("token");
  });

  it("creating a task", async () => {
    const res_create_task = await request
      .post("/task")
      .send({
        name: "Se Tornar o Rei dos piratas",
        priority: "alta",
        description: "Achar o One Piece",
      })
      .set("auth", token);
    expect(res_create_task.status).toEqual(200);
    expect(res_create_task.body).toStrictEqual({
      __v: 0,
      _id: res_create_task.body._id,
      name: "Se Tornar o Rei dos piratas",
      priority: "alta",
      description: "Achar o One Piece",
      user: `${userId}`,
    });
    taskId = res_create_task.body._id;
    //ERROR
    const res_create_task_error = await request
      .post("/task")
      .send({
        name: "",
        priority: "alta",
        description: "123",
      })
      .set("auth", token);
    expect(res_create_task_error.status).toEqual(400);
    //aumentando o banco de dados para futuros testes.
    const res_create_task2 = await request
      .post("/task")
      .send({
        name: "Derrotar Akainu",
        priority: "baixa",
        description: "Vingar o Ace",
      })
      .set("auth", token);
    expect(res_create_task2.status).toEqual(200);
    const res_create_task3 = await request
      .post("/task")
      .send({
        name: "Derrotar os Yonkous",
        priority: "alta",
        description: "Derrotar Big Mom e Kaido",
      })
      .set("auth", token);
    expect(res_create_task3.status).toEqual(200);
  });
  it("list tasks", async () => {
    const res_list_task = await request.get("/tasks").set("auth", token);
    expect(res_list_task.status).toEqual(200);
    expect([
      {
        name: "Se Tornar o Rei dos piratas",
        priority: "alta",
        description: "Achar o One Piece",
      },
      {
        name: "Derrotar Akainu",
        priority: "baixa",
        description: "Vingar o Ace",
      },
    ]).toStrictEqual([
      {
        name: "Se Tornar o Rei dos piratas",
        priority: "alta",
        description: "Achar o One Piece",
      },
      {
        name: "Derrotar Akainu",
        priority: "baixa",
        description: "Vingar o Ace",
      },
    ]);
  });

  it("sort tasks", async () => {
    const res_list_task = await request.get("/tasks/sorted").set("auth", token);
    expect(res_list_task.status).toEqual(200);
    expect([
      {
        name: "Se Tornar o Rei dos piratas",
        priority: "alta",
        description: "Achar o One Piece",
      },
      {
        name: "Derrotar os Yonkous",
        priority: "alta",
        description: "Derrotar Big Mom e Kaido",
      },
      {
        name: "Derrotar Akainu",
        priority: "baixa",
        description: "Vingar o Ace",
      },
    ]).toStrictEqual([
      {
        name: "Se Tornar o Rei dos piratas",
        priority: "alta",
        description: "Achar o One Piece",
      },
      {
        name: "Derrotar os Yonkous",
        priority: "alta",
        description: "Derrotar Big Mom e Kaido",
      },
      {
        name: "Derrotar Akainu",
        priority: "baixa",
        description: "Vingar o Ace",
      },
    ]);
  });

  it("delete task", async () => {
    const res_delete_task = await request
      .delete("/task/" + taskId)
      .set("auth", token);
    expect(res_delete_task.status).toEqual(200);
  });

  it("update task", async () => {
    const res_update_task = await request
      .put("/task/" + taskId)
      .send({
        name: "Chegar em Laugh tale",
        priority: "alta",
        description: "Chegar na útlima ilha e se tornar o rei dos piratas",
      })
      .set("auth", token);
    expect(res_update_task.status).toEqual(200);
    expect([
      {
        name: "Chegar em Laugh tale",
        priority: "alta",
        description: "Chegar na útlima ilha e se tornar o rei dos piratas",
      },
      {
        name: "Derrotar os Yonkous",
        priority: "alta",
        description: "Derrotar Big Mom e Kaido",
      },
      {
        name: "Derrotar Akainu",
        priority: "baixa",
        description: "Vingar o Ace",
      },
    ]).toStrictEqual([
      {
        name: "Chegar em Laugh tale",
        priority: "alta",
        description: "Chegar na útlima ilha e se tornar o rei dos piratas",
      },
      {
        name: "Derrotar os Yonkous",
        priority: "alta",
        description: "Derrotar Big Mom e Kaido",
      },
      {
        name: "Derrotar Akainu",
        priority: "baixa",
        description: "Vingar o Ace",
      },
    ]);
  });
});
