const supertest = require("supertest");
const mongoose = require("mongoose");
const helper = require("./list_helper");
const app = require("../app");
const api = supertest(app);

const Blog = require("../models/blog");
const blogsRouter = require("../controllers/blogs");

beforeEach(async () => {
  await Blog.deleteMany({});

  for (let blog of helper.initialBlogs) {
    let blogObject = new Blog(blog);
    await blogObject.save();
  }
});

describe("general test", () => {
  test("all blogs are returned", async () => {
    const response = await api.get("/api/blogs");

    expect(response.body.length).toBe(helper.initialBlogs.length);
  });
});

describe("adding tests", () => {
  test("a blog can be added to the list", async () => {
    const newBlog = {
      title: "Everything Dogs",
      author: "Ruffard",
      url: "http://dogsrule.com",
      likes: 79,
    };

    await api
      .post("/api/blogs")
      .send(newBlog)
      .expect(200)
      .expect("Content-Type", /application\/json/);

    const blogsAtEnd = await helper.blogsInDb();
    expect(blogsAtEnd.length).toBe(helper.initialBlogs.length + 1);

    const contents = blogsAtEnd.map((n) => n.title);
    expect(contents).toContain("Everything Dogs");
  });

  test("test to see blank like entries in the list default to 0", async () => {
    const newBlog = {
      title: "Cats Cats and more Cats",
      author: "William von Einstein",
      url: "http://cat.org/",
    };

    await api
      .post("/api/blogs")
      .send(newBlog)
      .expect(200)
      .expect("Content-Type", /application\/json/);

    const blogsAtEnd = await helper.blogsInDb();
    expect(blogsAtEnd[blogsAtEnd.length - 1].likes).toBe(0);
  });

  test("tests to see if title and url is missing, returns 400 Bad Request", async () => {
    const newBlog = {
      author: "Bob Boberson",
      likes: 100,
    };

    await api.post("/api/blogs").send(newBlog).expect(400);
  });
});

describe("testing deleting", () => {
  test("tests deletion of one post", async () => {
    const blogsAtStart = await helper.blogsInDb();
    const blogToDelete = blogsAtStart[0];

    await api.delete(`/api/blogs/${blogToDelete.id}`).expect(204);

    const blogsAtEnd = await helper.blogsInDb();

    expect(blogsAtEnd).toHaveLength(blogsAtStart.length - 1);

    const contents = blogsAtEnd.map((r) => r.title);
    expect(contents).not.toContain(blogToDelete.title);
  });
});

describe("tests for updating", () => {
  test("tests updating one blog", async () => {
    const blogsAtStart = await helper.blogsInDb();
    const blogToUpdate = blogsAtStart[0];

    const updatedInfo = {
      likes: 100,
    };

    await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .send(updatedInfo)
      .expect(200)

    const blogsAtEnd = await helper.blogsInDb();
    const updatedBlog = blogsAtEnd[0];
    expect(updatedBlog.likes).toBe(100)
  });
});

afterAll(() => {
  mongoose.connection.close();
});
