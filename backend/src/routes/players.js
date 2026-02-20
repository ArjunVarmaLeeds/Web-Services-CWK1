import { Router } from "express";
import { authenticateToken } from "../middleware/auth.js";
import { getCardIntelligence, getOverview, getPlaystyle, ingestBattles, ingestPlayer, getPlayerProfile, comparePlayers } from "../controller/player.js"

// Player apis
// - GET /players/:tag/overview
// - GET /players/:tag/playstyle
// - GET /players/:tag/cardIntelligence
// - GET /players/:tag
// - GET /players/compare?tag1&:tag2
// - POST /players/ingest/:tag
// - POST /players/ingest/battles/:tag

const router = Router();

router.use(authenticateToken);

router.get("/compare", comparePlayers);

// intelligence routes
router.get("/:tag/overview", getOverview);
router.get("/:tag/playstyle", getPlaystyle);
router.get("/:tag/cardIntelligence", getCardIntelligence);

// ingest routes
router.post("/ingest/:tag", ingestPlayer);
router.post("/ingest/battles/:tag", ingestBattles);

router.get("/:tag", getPlayerProfile);

export default router;
