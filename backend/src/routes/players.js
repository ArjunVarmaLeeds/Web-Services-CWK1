import { Router } from "express";
import { authenticateToken } from "../middleware/auth.js";
import { ingestBattles, ingestPlayer } from "../controller/player.js"

// Player apis
// - GET /players/:tag/intelligence
// - GET /players/:tag/decks
// - GET /players/:tag/performance
// - POST /players/ingest/:tag
// - POST /players/ingest/battles/:tag

const router = Router();

router.use(authenticateToken);

// Intelligence routes
router.get("/:tag/intelligence", ingestBattles);
router.get("/:tag/decks", ingestBattles);
router.get("/:tag/performance", ingestBattles);

// Ingest routes
router.post("/ingest/:tag", ingestPlayer);
router.post("/ingest/battles/:tag", ingestBattles);

export default router;