const request = require("supertest");
const app = require("../src/app");

describe("Race condition take request", () => {
  it("only one request should succeed", async () => {
    const r1 = request(app).patch("/requests/1/take").set("x-user-id", "2");

    const r2 = request(app).patch("/requests/1/take").set("x-user-id", "2");

    const [res1, res2] = await Promise.all([r1, r2]);

    const statuses = [res1.statusCode, res2.statusCode];

    expect(statuses).toContain(200);
    expect(statuses).toContain(409);
  });
});
