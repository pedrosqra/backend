const app = require("../app");
const supertest = require("supertest");
const request = supertest(app);
const database = require("../config/database");
const User = require("../models/User");

describe("insert", () => {
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
    expect(res.status).toEqual(200);
    expect(res.body).toHaveProperty("token");
  });

  it("should log an user and receive a token", async () => {
    const res = await request.post("/login").send({
      email: "euimplro@pfvr.com",
      password: "genteplmdds",
    });
    expect(res.status).toEqual(200);
    expect(res.body).toHaveProperty("token");
  });
});
