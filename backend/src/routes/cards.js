import { Router } from "express";
import { syncCards } from "../service/card.js";

const router = Router();

router.post("/sync", syncCards);

export default router;
