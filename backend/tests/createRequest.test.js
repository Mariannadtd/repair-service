const request = require("supertest");
const app = require("../src/app");

describe("Create request", () => {
  it("should create request", async () => {
    const res = await request(app).post("/requests").send({
      clientName: "Test Client",
      phone: "123456",
      address: "Test street",
      problemText: "Something broken",
    });

    expect(res.statusCode).toBe(201);
    expect(res.body.clientName).toBe("Test Client");
  });
});
