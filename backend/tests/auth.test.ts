// Integration test — requires a reachable DATABASE_URL (run `npx prisma migrate dev` first).
// Not run as part of static verification in CI without a database configured.
import { afterAll, beforeEach, describe, expect, it } from "vitest";
import request from "supertest";
import { createApp } from "../src/app";
import { prisma } from "../src/config/db";

const app = createApp();
const TEST_EMAIL = "test-auth@example.com";
const TEST_PASSWORD = "password123";

beforeEach(async () => {
  await prisma.user.deleteMany({ where: { email: TEST_EMAIL } });
});

afterAll(async () => {
  await prisma.user.deleteMany({ where: { email: TEST_EMAIL } });
  await prisma.$disconnect();
});

describe("auth flow", () => {
  it("registers, logs in, fetches /me, and logs out", async () => {
    const registerRes = await request(app)
      .post("/api/auth/register")
      .send({ email: TEST_EMAIL, password: TEST_PASSWORD });
    expect(registerRes.status).toBe(201);
    expect(registerRes.body.email).toBe(TEST_EMAIL);
    const cookie = registerRes.headers["set-cookie"];
    expect(cookie).toBeDefined();

    const meRes = await request(app).get("/api/auth/me").set("Cookie", cookie);
    expect(meRes.status).toBe(200);
    expect(meRes.body.email).toBe(TEST_EMAIL);

    const logoutRes = await request(app).post("/api/auth/logout").set("Cookie", cookie);
    expect(logoutRes.status).toBe(204);

    const loginRes = await request(app)
      .post("/api/auth/login")
      .send({ email: TEST_EMAIL, password: TEST_PASSWORD });
    expect(loginRes.status).toBe(200);
  });

  it("rejects duplicate registration", async () => {
    await request(app).post("/api/auth/register").send({ email: TEST_EMAIL, password: TEST_PASSWORD });
    const second = await request(app)
      .post("/api/auth/register")
      .send({ email: TEST_EMAIL, password: TEST_PASSWORD });
    expect(second.status).toBe(409);
  });

  it("rejects an incorrect password", async () => {
    await request(app).post("/api/auth/register").send({ email: TEST_EMAIL, password: TEST_PASSWORD });
    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: TEST_EMAIL, password: "wrong-password" });
    expect(res.status).toBe(401);
  });

  it("rejects /me without a session cookie", async () => {
    const res = await request(app).get("/api/auth/me");
    expect(res.status).toBe(401);
  });
});
