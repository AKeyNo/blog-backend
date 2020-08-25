const bcrypt = require("bcryptjs");
const usersRouter = require("express").Router();
const User = require("../models/User");

usersRouter.post("/", async (request, response) => {
  const body = request.body;

  if (body.username.length <= 3 || body.password.length <= 3) {
    return response.status(400).json({
      error: "username and password must have 4 or more characters",
    });
  }

  if (await User.findOne({username: body.username})) {
    return response.status(400).json({
        error: "that username is not unique, it has been taken already"
    })
  }

  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(body.password, saltRounds);

  const user = new User({
    username: body.username,
    name: body.name,
    passwordHash,
  });

  const savedUser = await user.save();

  response.json(savedUser);
});

usersRouter.get("/", async (request, response) => {
  const users = await User.find({}).populate('blogs', {title: 1, url: 1, likes: 1});
  response.json(users.map((user) => user.toJSON()));
});

module.exports = usersRouter;
