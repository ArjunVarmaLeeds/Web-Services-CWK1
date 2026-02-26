import request from "supertest";
import app from "../app.js";
import { log } from "console";
import { getAuthToken } from "./helpers/authHelper.js";

describe("Auth API", () => {
    it("should register a user", async () => {
        const res = await request(app).post("/api/auth/register").send({
            email: "userTest@test.com",
            password: "password123",
        });

        expect(res.statusCode).toBe(201);
        expect(res.body.createdAt).toBeDefined();
    });

    it("should login a user", async () => {
        await request(app).post("/api/auth/register").send({
            email: "user2@test.com",
            password: "password123",
        });

        const res = await request(app).post("/api/auth/login").send({
            email: "user2@test.com",
            password: "password123",
        });

        expect(res.body.token).toBeDefined();
    });

    it("should return current user when authenticated", async () => {
        const token = await getAuthToken();
        const res = await request(app)
            .get("/api/auth/me")
            .set("Authorization", `Bearer ${token}`);

        expect(res.statusCode).toBe(200);
        expect(res.body.email).toBeDefined();
    });

    it("should block access to /me when unauthenticated", async () => {
        const res = await request(app).get("/api/auth/me");
        expect(res.statusCode).toBe(401);
    });
});
