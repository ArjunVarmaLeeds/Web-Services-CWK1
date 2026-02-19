import { Router } from "express";
import { authenticateToken } from "../middleware/auth.js";
import { getCardIntelligence, getOverview, getPlaystyle, ingestBattles, ingestPlayer } from "../controller/player.js"
import { syncCards } from "../service/card.js";

// Player apis
// - GET /players/:tag/overview
// - GET /players/:tag/playstyle
// - GET /players/:tag/cards
// - GET /players/:tag/progression
// - POST /players/ingest/:tag
// - POST /players/ingest/battles/:tag

const router = Router();

router.use(authenticateToken);

// Intelligence routes
router.get("/:tag/overview", getOverview);
router.get("/:tag/playstyle", getPlaystyle);
router.get("/:tag/cardIntelligence", getCardIntelligence);
router.post("/sync-cards", syncCards);

// Ingest routes
router.post("/ingest/:tag", ingestPlayer);
router.post("/ingest/battles/:tag", ingestBattles);

export default router;