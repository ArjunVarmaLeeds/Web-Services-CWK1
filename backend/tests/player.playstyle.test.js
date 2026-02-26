import request from "supertest";
import app from "../app.js";
import { getAuthToken } from "./helpers/authHelper.js";

describe("Player Playstyle API", () => {
    it("should block unauthenticated access", async () => {
        const res = await request(app).get("/api/player/%2320RGGRCJJ9/playstyle");
        expect(res.statusCode).toBe(401);
    });

    it("should return playstyle metrics after ingestion", async () => {
        const token = await getAuthToken();

        // ensure card metadata and player are present
        await request(app)
            .post("/api/cards/sync")
            .set("Authorization", `Bearer ${token}`);

        await request(app)
            .post("/api/player/ingest/%2320RGGRCJJ9")
            .set("Authorization", `Bearer ${token}`);

        // ingest some battles to produce stats
        await request(app)
            .post("/api/player/ingest/battles/%2320RGGRCJJ9")
            .set("Authorization", `Bearer ${token}`);

        const res = await request(app)
            .get("/api/player/%2320RGGRCJJ9/playstyle")
            .set("Authorization", `Bearer ${token}`);

        expect(res.statusCode).toBe(200);
        expect(res.body.data).toHaveProperty("totalBattles");
        expect(res.body.data).toHaveProperty("playstyle");
    });
});
