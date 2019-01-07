const request = require("supertest");
const { Genre } = require("../../models/genre");
const { User } = require("../../models/user");
let server;

describe("auth middleware", () => {
  let name;
  let token;

  const exec = () => {
    return request(server)
      .post("/api/genres")
      .set("x-auth-token", token)
      .send({ name });
  };

  beforeEach(() => {
    server = require("../../index");
    token = new User().generateAuthToken();
    name = "genre1";
  });
  afterEach(async () => {
    await Genre.deleteMany({});
    await server.close();
  });

  it("should return 401 if no token is provided", async () => {
    token = '';
    const res = await exec();
    expect(res.status).toBe(401);
  });

  it("should return 400 if token is invalid", async () => {
    token = 'aa';
    const res = await exec();
    expect(res.status).toBe(400);
  });

  it("should return 200 if token is valid", async () => {
    const res = await exec();
    expect(res.status).toBe(200);
  });
});
