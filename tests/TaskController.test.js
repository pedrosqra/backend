const app = require("../app");
const supertest = require("supertest");
const request = supertest(app);
const database = require("../config/database");
const User = require("../models/User");

describe("insert", () => {
  let token;
  beforeAll(async () => {
    await User.deleteMany();
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
  });

  it("should log an user and receive a token", async () => {
    const res = await request.post("/login").send({
      email: "euimplro@pfvr.com",
      password: "genteplmdds",
    });
    token = 'Bearer ' + res.body.token;
    expect(res.status).toEqual(200);
    expect(res.body).toHaveProperty("token");
  });
  
  it('creating a task', async () => {
    const res_create_task = await request.post('/task').send({
      name: "Se Tornar o Rei dos piratas",
      priority: "alta",
      description: "Achar o One Piece"
    }).set('auth', token);
    
    const res_create_task2 = await request.post('/task').send({
      name: "Derrotar Akainu",
      priority: "baixa",
      description: "Vingar o Ace"
    }).set('auth', token);
    expect(res_create_task.status).toEqual(200);
    expect(res_create_task.body).toStrictEqual({
      name: "Se Tornar o Rei dos piratas",
      priority: "alta",
      description: "Achar o One Piece"
    });
  });
  it('list tasks', async () => {
    const res_list_task = await request.get('/tasks').set('auth', token);
    expect(res_list_task.status).toEqual(200);
    expect([{
      name: "Se Tornar o Rei dos piratas",
      priority: "alta",
      description: "Achar o One Piece"
    }, {
      name: "Derrotar Akainu",
      priority: "baixa",
      description: "Vingar o Ace"
    }]).toStrictEqual([{
      name: "Se Tornar o Rei dos piratas",
      priority: "alta",
      description: "Achar o One Piece"
    }, {
      name: "Derrotar Akainu",
      priority: "baixa",
      description: "Vingar o Ace"
    }]);
  });

  // it('sort tasks', async () => {
  //   const res_list_task
  // })
  
});