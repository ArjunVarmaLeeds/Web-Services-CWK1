import request from "supertest";
import app from "../../app.js";

export const getAuthToken = async () => {
    await request(app).post("/api/auth/register").send({
        email: "test@test.com",
        password: "password123",
    });

    const res = await request(app).post("/api/auth/login").send({
        email: "test@test.com",
        password: "password123",
    });

    return res.body.token;
};
