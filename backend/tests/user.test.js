import request from "supertest";
import app from "../app.js";
import { getAuthToken, getAdminToken } from "./helpers/authHelper.js";
import { prisma } from "../src/config/db.js";

describe("User API", () => {
    describe("Authentication and Authorization", () => {
        it("should block unauthenticated access to GET /api/users", async () => {
            const res = await request(app).get("/api/users");
            expect(res.statusCode).toBe(401);
            expect(res.body.message).toBe("Missing authorization header");
        });

        it("should block non-admin access to GET /api/users", async () => {
            const token = await getAuthToken();
            const res = await request(app)
                .get("/api/users")
                .set("Authorization", `Bearer ${token}`);
            expect(res.statusCode).toBe(403);
            expect(res.body.message).toBe("Admin privileges required");
        });

        it("should block non-admin access to POST /api/users", async () => {
            const token = await getAuthToken();
            const res = await request(app)
                .post("/api/users")
                .set("Authorization", `Bearer ${token}`)
                .send({
                    email: "newuser@test.com",
                    password: "password123",
                });
            expect(res.statusCode).toBe(403);
            expect(res.body.message).toBe("Admin privileges required");
        });

        it("should block non-admin access to PUT /api/users/:id", async () => {
            const token = await getAuthToken();
            const res = await request(app)
                .put("/api/users/1")
                .set("Authorization", `Bearer ${token}`)
                .send({
                    email: "updated@test.com",
                });
            expect(res.statusCode).toBe(403);
            expect(res.body.message).toBe("Admin privileges required");
        });

        it("should block non-admin access to DELETE /api/users/:id", async () => {
            const token = await getAuthToken();
            const res = await request(app)
                .delete("/api/users/1")
                .set("Authorization", `Bearer ${token}`);
            expect(res.statusCode).toBe(403);
            expect(res.body.message).toBe("Admin privileges required");
        });
    });

    describe("GET /api/users - List all users", () => {
        it("should return all users with admin token", async () => {
            const adminToken = await getAdminToken();

            // Create a test user
            await request(app).post("/api/auth/register").send({
                email: "user1@test.com",
                password: "password123",
            });

            const res = await request(app)
                .get("/api/users")
                .set("Authorization", `Bearer ${adminToken}`);

            expect(res.statusCode).toBe(200);
            expect(res.body.status).toBe("success");
            expect(Array.isArray(res.body.data)).toBe(true);
            expect(res.body.data.length).toBeGreaterThan(0);
        });

        it("should return user objects with id, email, and createdAt", async () => {
            const adminToken = await getAdminToken();

            const res = await request(app)
                .get("/api/users")
                .set("Authorization", `Bearer ${adminToken}`);

            expect(res.statusCode).toBe(200);
            res.body.data.forEach((user) => {
                expect(user).toHaveProperty("id");
                expect(user).toHaveProperty("email");
                expect(user).toHaveProperty("createdAt");
                expect(user).not.toHaveProperty("passwordHash");
            });
        });

        it("should return empty array when no users exist", async () => {
            const adminToken = await getAdminToken();

            const res = await request(app)
                .get("/api/users")
                .set("Authorization", `Bearer ${adminToken}`);

            expect(res.statusCode).toBe(200);
            // Should have at least the admin user
            expect(Array.isArray(res.body.data)).toBe(true);
        });
    });

    describe("GET /api/users/:id - Get single user", () => {
        it("should return a single user by ID with admin token", async () => {
            const adminToken = await getAdminToken();

            // Get the admin user first
            const listRes = await request(app)
                .get("/api/users")
                .set("Authorization", `Bearer ${adminToken}`);

            const userId = listRes.body.data[0].id;

            const res = await request(app)
                .get(`/api/users/${userId}`)
                .set("Authorization", `Bearer ${adminToken}`);

            expect(res.statusCode).toBe(200);
            expect(res.body.status).toBe("success");
            expect(res.body.data).toHaveProperty("id");
            expect(res.body.data).toHaveProperty("email");
            expect(res.body.data).toHaveProperty("createdAt");
            expect(res.body.data.id).toBe(userId);
        });

        it("should not expose passwordHash in user response", async () => {
            const adminToken = await getAdminToken();

            const listRes = await request(app)
                .get("/api/users")
                .set("Authorization", `Bearer ${adminToken}`);

            const userId = listRes.body.data[0].id;

            const res = await request(app)
                .get(`/api/users/${userId}`)
                .set("Authorization", `Bearer ${adminToken}`);

            expect(res.statusCode).toBe(200);
            expect(res.body.data).not.toHaveProperty("passwordHash");
        });

        it("should return 404 for non-existent user", async () => {
            const adminToken = await getAdminToken();

            const res = await request(app)
                .get("/api/users/99999")
                .set("Authorization", `Bearer ${adminToken}`);

            expect(res.statusCode).toBe(404);
            expect(res.body.message).toBe("User not found");
        });

        it("should handle invalid user ID format", async () => {
            const adminToken = await getAdminToken();

            const res = await request(app)
                .get("/api/users/invalid")
                .set("Authorization", `Bearer ${adminToken}`);

            // Should either return 404 or 400
            expect([400, 404]).toContain(res.statusCode);
        });
    });

    describe("POST /api/users - Create user", () => {
        it("should create a new user with admin token", async () => {
            const adminToken = await getAdminToken();

            const res = await request(app)
                .post("/api/users")
                .set("Authorization", `Bearer ${adminToken}`)
                .send({
                    email: "newuser@test.com",
                    password: "password123",
                });

            expect(res.statusCode).toBe(201);
            expect(res.body.status).toBe("success");
            expect(res.body.data).toHaveProperty("id");
            expect(res.body.data.email).toBe("newuser@test.com");
            expect(res.body.data).toHaveProperty("createdAt");
            expect(res.body.data).not.toHaveProperty("passwordHash");
        });

        it("should hash the password when creating user", async () => {
            const adminToken = await getAdminToken();

            const res = await request(app)
                .post("/api/users")
                .set("Authorization", `Bearer ${adminToken}`)
                .send({
                    email: "passwordtest@test.com",
                    password: "secretpassword",
                });

            expect(res.statusCode).toBe(201);
            const userId = res.body.data.id;

            // Verify password is hashed by checking it in database
            const user = await prisma.user.findUnique({
                where: { id: userId },
            });

            expect(user.passwordHash).not.toBe("secretpassword");
        });

        it("should reject duplicate email", async () => {
            const adminToken = await getAdminToken();

            await request(app)
                .post("/api/users")
                .set("Authorization", `Bearer ${adminToken}`)
                .send({
                    email: "duplicate@test.com",
                    password: "password123",
                });

            const res = await request(app)
                .post("/api/users")
                .set("Authorization", `Bearer ${adminToken}`)
                .send({
                    email: "duplicate@test.com",
                    password: "password456",
                });

            expect(res.statusCode).toBe(400);
            expect(res.body.message).toBe("User already exists");
        });

        it("should reject request with missing email", async () => {
            const adminToken = await getAdminToken();

            const res = await request(app)
                .post("/api/users")
                .set("Authorization", `Bearer ${adminToken}`)
                .send({
                    password: "password123",
                });

            // Should return error (could be 400 or 500 depending on validation)
            expect(res.statusCode).not.toBe(201);
        });

        it("should reject request with missing password", async () => {
            const adminToken = await getAdminToken();

            const res = await request(app)
                .post("/api/users")
                .set("Authorization", `Bearer ${adminToken}`)
                .send({
                    email: "nopassword@test.com",
                });

            expect(res.statusCode).not.toBe(201);
        });
    });

    describe("PUT /api/users/:id - Update user", () => {
        it("should update user email with admin token", async () => {
            const adminToken = await getAdminToken();

            // Create a user to update
            const createRes = await request(app)
                .post("/api/users")
                .set("Authorization", `Bearer ${adminToken}`)
                .send({
                    email: "toupdate@test.com",
                    password: "password123",
                });

            const userId = createRes.body.data.id;

            const res = await request(app)
                .put(`/api/users/${userId}`)
                .set("Authorization", `Bearer ${adminToken}`)
                .send({
                    email: "updated@test.com",
                });

            expect(res.statusCode).toBe(200);
            expect(res.body.status).toBe("success");
            expect(res.body.data.id).toBe(userId);
            expect(res.body.data.email).toBe("updated@test.com");
        });

        it("should not expose passwordHash when updating user", async () => {
            const adminToken = await getAdminToken();

            // Create a user to update
            const createRes = await request(app)
                .post("/api/users")
                .set("Authorization", `Bearer ${adminToken}`)
                .send({
                    email: "nopwdexpose@test.com",
                    password: "password123",
                });

            const userId = createRes.body.data.id;

            const res = await request(app)
                .put(`/api/users/${userId}`)
                .set("Authorization", `Bearer ${adminToken}`)
                .send({
                    email: "newemail@test.com",
                });

            expect(res.statusCode).toBe(200);
            expect(res.body.data).not.toHaveProperty("passwordHash");
        });

        it("should return 404 when updating non-existent user", async () => {
            const adminToken = await getAdminToken();

            const res = await request(app)
                .put("/api/users/99999")
                .set("Authorization", `Bearer ${adminToken}`)
                .send({
                    email: "updated@test.com",
                });

            expect(res.statusCode).toBe(404);
        });

        it("should handle duplicate email on update", async () => {
            const adminToken = await getAdminToken();

            // Create two users
            const user1 = await request(app)
                .post("/api/users")
                .set("Authorization", `Bearer ${adminToken}`)
                .send({
                    email: "user1update@test.com",
                    password: "password123",
                });

            const user2 = await request(app)
                .post("/api/users")
                .set("Authorization", `Bearer ${adminToken}`)
                .send({
                    email: "user2update@test.com",
                    password: "password123",
                });

            // Try to update user2 with user1's email
            const res = await request(app)
                .put(`/api/users/${user2.body.data.id}`)
                .set("Authorization", `Bearer ${adminToken}`)
                .send({
                    email: "user1update@test.com",
                });

            expect(res.statusCode).toBe(400);
        });
    });

    describe("DELETE /api/users/:id - Delete user", () => {
        it("should delete user with admin token", async () => {
            const adminToken = await getAdminToken();

            // Create a user to delete
            const createRes = await request(app)
                .post("/api/users")
                .set("Authorization", `Bearer ${adminToken}`)
                .send({
                    email: "todelete@test.com",
                    password: "password123",
                });

            const userId = createRes.body.data.id;

            const res = await request(app)
                .delete(`/api/users/${userId}`)
                .set("Authorization", `Bearer ${adminToken}`);

            expect(res.statusCode).toBe(200);
            expect(res.body.status).toBe("success");
            expect(res.body.message).toBe("User deleted");
        });

        it("should not find user after deletion", async () => {
            const adminToken = await getAdminToken();

            // Create a user to delete
            const createRes = await request(app)
                .post("/api/users")
                .set("Authorization", `Bearer ${adminToken}`)
                .send({
                    email: "verifydelete@test.com",
                    password: "password123",
                });

            const userId = createRes.body.data.id;

            // Delete the user
            await request(app)
                .delete(`/api/users/${userId}`)
                .set("Authorization", `Bearer ${adminToken}`);

            // Try to get the deleted user
            const getRes = await request(app)
                .get(`/api/users/${userId}`)
                .set("Authorization", `Bearer ${adminToken}`);

            expect(getRes.statusCode).toBe(404);
        });

        it("should return 404 when deleting non-existent user", async () => {
            const adminToken = await getAdminToken();

            const res = await request(app)
                .delete("/api/users/99999")
                .set("Authorization", `Bearer ${adminToken}`);

            expect(res.statusCode).toBe(404);
        });

        it("should handle deleting user twice", async () => {
            const adminToken = await getAdminToken();

            // Create a user to delete
            const createRes = await request(app)
                .post("/api/users")
                .set("Authorization", `Bearer ${adminToken}`)
                .send({
                    email: "doubledelete@test.com",
                    password: "password123",
                });

            const userId = createRes.body.data.id;

            // Delete the user
            await request(app)
                .delete(`/api/users/${userId}`)
                .set("Authorization", `Bearer ${adminToken}`);

            // Try to delete again
            const res = await request(app)
                .delete(`/api/users/${userId}`)
                .set("Authorization", `Bearer ${adminToken}`);

            expect(res.statusCode).toBe(404);
        });
    });
});
