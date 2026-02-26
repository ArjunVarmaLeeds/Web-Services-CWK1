import request from "supertest";
import app from "../app.js";
import { getAuthToken } from "./helpers/authHelper.js";

describe("Player Card Intelligence API", () => {
    it("should block unauthenticated access", async () => {
        const res = await request(app).get("/api/player/%2320RGGRCJJ9/cardIntelligence");
        expect(res.statusCode).toBe(401);
    });

    it("should return card intelligence after ingestion", async () => {
        const token = await getAuthToken();

        // sync cards and ingest player/battles so deck data exists
        await request(app)
            .post("/api/cards/sync")
            .set("Authorization", `Bearer ${token}`);

        await request(app)
            .post("/api/player/ingest/%2320RGGRCJJ9")
            .set("Authorization", `Bearer ${token}`);

        await request(app)
            .post("/api/player/ingest/battles/%2320RGGRCJJ9")
            .set("Authorization", `Bearer ${token}`);

        const res = await request(app)
            .get("/api/player/%2320RGGRCJJ9/cardIntelligence")
            .set("Authorization", `Bearer ${token}`);

        expect(res.statusCode).toBe(200);
        expect(res.body.data).toHaveProperty("deck");
        expect(res.body.data).toHaveProperty("progression");
    });
});
