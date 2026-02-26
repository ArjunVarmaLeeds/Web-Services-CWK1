import request from "supertest";
import app from "../app.js";
import { getAuthToken } from "./helpers/authHelper.js";

describe("Player Battles Ingest API", () => {
    it("should block unauthenticated access", async () => {
        const res = await request(app).post(
            "/api/player/ingest/battles/%2320RGGRCJJ9"
        );
        expect(res.statusCode).toBe(401);
    });

    it("should ingest player battles", async () => {
        const token = await getAuthToken();

        await request(app)
            .post("/api/cards/sync")
            .set("Authorization", `Bearer ${token}`);

        await request(app)
            .post("/api/player/ingest/%2320RGGRCJJ9")
            .set("Authorization", `Bearer ${token}`);

        const res = await request(app)
            .post("/api/player/ingest/battles/%2320RGGRCJJ9")
            .set("Authorization", `Bearer ${token}`);

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty("count");
    });
});
