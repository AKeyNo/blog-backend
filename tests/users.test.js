const supertest = require("supertest");
const mongoose = require("mongoose");
const helper = require("./list_helper");
const app = require("../app");
const api = supertest(app);

const User = require("../models/user");

// happens before each test
beforeEach(async () => {
  await User.deleteMany({});

  for (let user of helper.initialUsers) {
    let userObject = new User(user);
    await userObject.save();
  }
});

describe("general test", () => {
  test("all users are returned", async () => {
    const response = await api.get("/api/users");

    expect(response.body.length).toBe(helper.initialUsers.length);
  });
});

describe("invalid users tests", () => {
  test("invalid username", async () => {
    const newUser = {
      username: "a",
      name: "Charles A",
      password: "goodpassword",
    };

    await api.post("/api/users").send(newUser).expect(400);
  });

  test("invalid password", async () => {
    const newUser = {
      username: "goodusername",
      name: "Charles A",
      password: "b",
    };

    await api.post("/api/users").send(newUser).expect(400);
  });

  test("invalid username and password", async () => {
    const newUser = {
      username: "q",
      name: "Charles A",
      password: "b",
    };

    await api.post("/api/users").send(newUser).expect(400);
  });
});

afterAll(() => {
  mongoose.connection.close();
});
