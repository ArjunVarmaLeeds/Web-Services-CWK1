import { Router } from "express";
import { authenticateToken } from "../middleware/auth.js";
import { getCardIntelligence, getOverview, getPlaystyle, ingestBattles, ingestPlayer, getPlayerProfile, comparePlayers } 
from "../controller/player.js";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Players
 *   description: Player analytics and ingestion endpoints
 */

router.use(authenticateToken);

/**
 * @swagger
 * /api/player/compare:
 *   get:
 *     summary: Compare two players
 *     tags: [Players]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: tag1
 *         required: true
 *         schema:
 *           type: string
 *         description: First player tag
 *       - in: query
 *         name: tag2
 *         required: true
 *         schema:
 *           type: string
 *         description: Second player tag
 *     responses:
 *       200:
 *         description: Comparison result
 */
router.get("/compare", comparePlayers);

/**
 * @swagger
 * /api/player/{tag}/overview:
 *   get:
 *     summary: Get player performance overview
 *     tags: [Players]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: tag
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Player overview metrics
 */
router.get("/:tag/overview", getOverview);

/**
 * @swagger
 * /api/player/{tag}/playstyle:
 *   get:
 *     summary: Get player playstyle analytics
 *     tags: [Players]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: tag
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Playstyle metrics
 */
router.get("/:tag/playstyle", getPlaystyle);

/**
 * @swagger
 * /api/player/{tag}/cardIntelligence:
 *   get:
 *     summary: Get card and deck intelligence for a player
 *     tags: [Players]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: tag
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Card intelligence data
 */
router.get("/:tag/cardIntelligence", getCardIntelligence);

/**
 * @swagger
 * /api/player/ingest/{tag}:
 *   post:
 *     summary: Ingest player data from Clash Royale API
 *     tags: [Players]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: tag
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Player successfully ingested
 */
router.post("/ingest/:tag", ingestPlayer);

/**
 * @swagger
 * /api/player/ingest/battles/{tag}:
 *   post:
 *     summary: Ingest player battle log
 *     tags: [Players]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: tag
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Battles successfully ingested
 */
router.post("/ingest/battles/:tag", ingestBattles);

/**
 * @swagger
 * /api/player/{tag}:
 *   get:
 *     summary: Get stored player profile
 *     tags: [Players]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: tag
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Player profile
 */
router.get("/:tag", getPlayerProfile);

export default router;