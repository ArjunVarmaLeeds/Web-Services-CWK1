import { Router } from "express";
import { authenticateToken } from "../middleware/auth.js";
import { getUsers, getUserById, createUser, updateUser, deleteUser } from "../controller/user.js";
import { requireAdmin } from "../middleware/user.js";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User management (admin only)
 */

router.use(authenticateToken);
router.use(requireAdmin);

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Retrieve a list of all users
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of users
 *         content:
 *           application/json:
 *             example:
 *               status: success
 *               data:
 *                 - id: 1
 *                   email: test@example.com
 *                   createdAt: 2026-02-21T16:41:07.843Z
 *       401:
 *         description: Unauthorized – JWT missing or invalid
 *       403:
 *         description: Forbidden – admin privileges required
 *       500:
 *         description: Server error
 */
router.get("/", getUsers);

/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     summary: Get a single user by ID
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Numeric ID of the user to get
 *     responses:
 *       200:
 *         description: User object
 *         content:
 *           application/json:
 *             example:
 *               status: success
 *               data:
 *                 id: 1
 *                 email: test@example.com
 *                 createdAt: 2026-02-21T16:41:07.843Z
 *       401:
 *         description: Unauthorized – JWT missing or invalid
 *       403:
 *         description: Forbidden – admin privileges required
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */
router.get("/:id", getUserById);

/**
 * @swagger
 * /api/users:
 *   post:
 *     summary: Create a new user
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email:
 *                 type: string
 *                 example: newuser@example.com
 *               password:
 *                 type: string
 *                 example: strongPassword!
 *     responses:
 *       201:
 *         description: User created successfully
 *         content:
 *           application/json:
 *             example:
 *               status: success
 *               data:
 *                 id: 2
 *                 email: newuser@example.com
 *                 createdAt: 2026-02-21T17:00:00.000Z
 *       400:
 *         description: Validation error or user already exists
 *       401:
 *         description: Unauthorized – JWT missing or invalid
 *       403:
 *         description: Forbidden – admin privileges required
 *       500:
 *         description: Server error
 */
router.post("/", createUser);

/**
 * @swagger
 * /api/users/{id}:
 *   put:
 *     summary: Update an existing user's email
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Numeric ID of the user to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email]
 *             properties:
 *               email:
 *                 type: string
 *                 example: updated@example.com
 *     responses:
 *       200:
 *         description: User updated successfully
 *         content:
 *           application/json:
 *             example:
 *               status: success
 *               data:
 *                 id: 1
 *                 email: updated@example.com
 *                 createdAt: 2026-02-21T16:41:07.843Z
 *       400:
 *         description: Validation error or duplicate email
 *       401:
 *         description: Unauthorized – JWT missing or invalid
 *       403:
 *         description: Forbidden – admin privileges required
 *       404:
 *         description: User does not exists
 *       500:
 *         description: Server error
 */
router.put("/:id", updateUser);

/**
 * @swagger
 * /api/users/{id}:
 *   delete:
 *     summary: Delete a user by ID
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Numeric ID of the user to delete
 *     responses:
 *       200:
 *         description: User deleted successfully
 *         content:
 *           application/json:
 *             example:
 *               status: success
 *               message: User deleted
 *       401:
 *         description: Unauthorized – JWT missing or invalid
 *       403:
 *         description: Forbidden – admin privileges required
 *       404:
 *         description: User does not exists
 *       500:
 *         description: Server error
 */
router.delete("/:id", deleteUser);

export default router;