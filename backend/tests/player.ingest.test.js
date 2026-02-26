import request from "supertest";
import app from "../app.js";
import { getAuthToken } from "./helpers/authHelper.js";

describe("Player Ingest API", () => {
    it("should ingest a player", async () => {
        const token = await getAuthToken();

        const res = await request(app)
            .post("/api/player/ingest/%2320RGGRCJJ9")
            .set("Authorization", `Bearer ${token}`);

        expect(res.statusCode).toBe(200);
        expect(res.body.data.tag).toBe("#20RGGRCJJ9");
    });
});
