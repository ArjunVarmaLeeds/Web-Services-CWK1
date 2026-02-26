import request from "supertest";
import app from "../app.js";
import { getAuthToken } from "./helpers/authHelper.js";

describe("Player Overview API", () => {
    it("should return overview metrics", async () => {
        const token = await getAuthToken();

        await request(app)
            .post("/api/player/ingest/%2320RGGRCJJ9")
            .set("Authorization", `Bearer ${token}`);

        const res = await request(app)
            .get("/api/player/%2320RGGRCJJ9/overview")
            .set("Authorization", `Bearer ${token}`);

        expect(res.body).toHaveProperty("data");
    });
});
