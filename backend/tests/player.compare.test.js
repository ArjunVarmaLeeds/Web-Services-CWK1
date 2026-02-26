import request from "supertest";
import app from "../app.js";
import { getAuthToken } from "./helpers/authHelper.js";

describe("Player Comparison API", () => {
    it("should block unauthenticated access", async () => {
        const res = await request(app).get(
            "/api/player/compare?tag1=%2320RGGRCJJ9&tag2=%2320RGGRCJJ9"
        );
        expect(res.statusCode).toBe(401);
    });

    it("should compare two players", async () => {
        const token = await getAuthToken();

        // ingest both players (same tag is fine for test)
        await request(app)
            .post("/api/cards/sync")
            .set("Authorization", `Bearer ${token}`);

        await request(app)
            .post("/api/player/ingest/%2320RGGRCJJ9")
            .set("Authorization", `Bearer ${token}`);

        await request(app)
            .post("/api/player/ingest/%2320RGGRCJJ9")
            .set("Authorization", `Bearer ${token}`);

        const res = await request(app)
            .get("/api/player/compare?tag1=%2320RGGRCJJ9&tag2=%2320RGGRCJJ9")
            .set("Authorization", `Bearer ${token}`);

        expect(res.statusCode).toBe(200);
        expect(res.body.data).toHaveProperty("player1");
        expect(res.body.data).toHaveProperty("player2");
        expect(res.body.data).toHaveProperty("comparison");
    });
});
