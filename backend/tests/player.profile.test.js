import request from "supertest";
import app from "../app.js";
import { getAuthToken } from "./helpers/authHelper.js";

describe("Player Profile API", () => {
    it("should block unauthenticated access", async () => {
        const res = await request(app).get("/api/player/%2320RGGRCJJ9");
        expect(res.statusCode).toBe(401);
    });

    it("should allow authenticated access", async () => {
        const token = await getAuthToken();

        const res = await request(app)
            .get("/api/player/%2320RGGRCJJ9")
            .set("Authorization", `Bearer ${token}`);

        expect(res.statusCode).not.toBe(401);
    });
});
