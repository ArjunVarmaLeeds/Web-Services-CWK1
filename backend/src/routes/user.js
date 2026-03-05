import { Router } from "express";
import { authenticateToken } from "../middleware/auth.js";
import { getUsers, getUserById, createUser, updateUser, deleteUser } from "../controller/user.js";
import { requireAdmin } from "../middleware/user.js";

const router = Router();

router.use(authenticateToken);
router.use(requireAdmin);

router.get("/", getUsers);
router.get("/:id", getUserById);
router.post("/", createUser);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);

export default router;