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
    const res_register = await request.post("/register").send({
      nickname: "plmdssssssss",
      email: "euimplro@pfvr.com",
      password: "genteplmdds",
    });
    expect(res_register.status).toEqual(200);
    expect(res_register.body).toHaveProperty("user");
  });

  it("should log an user and receive a token", async () => {
    const res_login = await request.post("/login").send({
      email: "euimplro@pfvr.com",
      password: "genteplmdds",
    });
    expect(res_login.status).toEqual(200);
    expect(res_login.body).toHaveProperty("token");
    token = "Bearer " + res_login.body.token;
  });

  it("should delete an user", async () => {
    const res = await request
      .delete("/delete")
      .send({
        email: "euimplro@pfvr.com",
        password: "genteplmdds",
      })
      .set("auth", token);
    expect(res.status).toEqual(200);
    expect(res.body).toHaveProperty("success");
  });
});
