import { Router } from "express";
import { authenticateToken } from "../middleware/auth.js";
import {
  getCardIntelligence,
  getOverview,
  getPlaystyle,
  ingestBattles,
  ingestPlayer,
  getPlayerProfile,
  comparePlayers
} from "../controller/player.js";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Players
 *   description: Player analytics and ingestion endpoints
 *
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *
 *   schemas:
 *     PlayerProfile:
 *       type: object
 *       properties:
 *         status:
 *           type: string
 *           example: success
 *         player:
 *           type: object
 *           properties:
 *             id:
 *               type: integer
 *               example: 1
 *             tag:
 *               type: string
 *               example: "#ABC123"
 *             name:
 *               type: string
 *               example: Arjun
 *             trophies:
 *               type: integer
 *               example: 7500
 *             bestTrophies:
 *               type: integer
 *               example: 8000
 *             wins:
 *               type: integer
 *               example: 700
 *             losses:
 *               type: integer
 *               example: 500
 *             arena:
 *               type: string
 *               example: Executioner's Kitchen
 *             createdAt:
 *               type: string
 *               example: 2026-02-18T23:59:54.773Z
 *             favouriteCard:
 *               type: string
 *               example: Witch
 *             battles:
 *               type: array
 *               items:
 *                 type: object
 *             currentDeck:
 *               type: array
 *               items:
 *                 type: object
 *
 *     Overview:
 *       type: object
 *       properties:
 *         status:
 *           type: string
 *           example: success
 *         data:
 *           type: object
 *           properties:
 *             trophies:
 *               type: integer
 *               example: 7500
 *             bestTrophies:
 *               type: integer
 *               example: 8000
 *             winRate:
 *               type: number
 *               example: 0.64
 *
 *     Playstyle:
 *       type: object
 *       properties:
 *         status:
 *           type: string
 *           example: success
 *         data:
 *           type: object
 *           properties:
 *             aggressionScore:
 *               type: number
 *               example: 2.1
 *             playstyle:
 *               type: string
 *               example: AGGRO
 *             totalBattles:
 *               type: number
 *               example: 90
 *             consistencyScore:
 *               type: number
 *               example: 0.5
 *             favouriteGameMode:
 *               type: number
 *               example: Ladder
 *   
 *     CardIntelligence:
 *       type: object
 *       properties:
 *         status:
 *           type: string
 *           example: success
 *         data:
 *           type: object
 *           properties:
 *             deck:
 *               type: object
 *             averageElixir:
 *               type: number
 *               example: 4
 *             cycleCardCount:
 *               type: integer
 *               example: 0
 *             rarityDistribution:
 *               type: object
 *             additionalProperties:
 *               type: integer
 *               example:
 *                 rare: 3
 *                 epic: 3
 *                 common: 1
 *                 legendary: 1
 *             type:
 *               type: string
 *               example: BEATDOWN
 *             cards:
 *               type: array
 *               items:
 *                 type: object
 *             progression:
 *               type: object
 *               properties:
 *                 averageCardLevel:
 *                   type: number
 *                   example: 5.85
 *                 totalCardsOwned:
 *                   type: integer
 *                   example: 106
 *                 mostUpgradedCard:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *                       example: Bats
 *                     level:
 *                       type: integer
 *                       example: 12
 *                 favourites:
 *                   type: object
 *                   properties:
 *                     supercellFavourite:
 *                       type: string
 *                       example: Witch
 *
 *     PlayerComparison:
 *       type: object
 *       properties:
 *         status:
 *           type: string
 *           example: success
 *         data:
 *           type: object
 *           properties:
 *             player1:
 *               type: object
 *               properties:
 *                 tag:
 *                   type: string
 *                   example: "#ABC123"
 *                 name:
 *                   type: string
 *                   example: Arjun
 *                 trophies:
 *                   type: integer
 *                   example: 7500
 *                 winRate:
 *                   type: number
 *                   example: 0.64
 *                 aggression:
 *                   type: number
 *                   example: 2.1
 *                 playstyle:
 *                   type: string
 *                   example: AGGRO
 *                 avgElixir:
 *                   type: number
 *                   example: 4.2
 *             player2:
 *               type: object
 *               properties:
 *                 tag:
 *                   type: string
 *                   example: "#DEF456"
 *                 name:
 *                   type: string
 *                   example: Sam
 *                 trophies:
 *                   type: integer
 *                   example: 7200
 *                 winRate:
 *                   type: number
 *                   example: 0.58
 *                 aggression:
 *                   type: number
 *                   example: 1.8
 *                 playstyle:
 *                   type: string
 *                   example: BALANCED
 *                 avgElixir:
 *                   type: number
 *                   example: 4.5
 *             comparison:
 *               type: object
 *               properties:
 *                 winRate:
 *                   type: string
 *                   example: Arjun
 *                 aggression:
 *                   type: string
 *                   example: Sam
 *                 trophies:
 *                   type: string
 *                   example: Arjun
 *                 deckAdvantage:
 *                   type: string
 *                   example: Sam
 *     
 *     ErrorResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           example: Player not found
 */

/**
 * All routes below require JWT.
 * 
 * HOW TO AUTHORIZE:
 * 1. Call /api/auth/login
 * 2. Copy the token
 * 3. Click "Authorize" in Swagger UI
 * 4. Enter: Bearer <your_token>
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
 *           example: "%23PLAYER1"
 *       - in: query
 *         name: tag2
 *         required: true
 *         schema:
 *           type: string
 *           example: "%23PLAYER2"
 *     responses:
 *       200:
 *         description: Comparison result
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PlayerComparison'
 *       400:
 *         description: Bad request - tag1 and tag2 are required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Unauthorized - JWT missing or invalid
 *       404:
 *         description: Player not found
 *       500:
 *         description: Server error
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
 *           example: "%23ABC123"
 *     responses:
 *       200:
 *         description: Player overview metrics
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Overview'
 *       401:
 *         description: Unauthorized - JWT missing or invalid
 *       404:
 *         description: Player not found
 *       500:
 *         description: Server error
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
 *           example: "%23ABC123"
 *     responses:
 *       200:
 *         description: Playstyle metrics
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Playstyle'
 *       400:
 *         description: Not enough battles
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Unauthorized - JWT missing or invalid
 *       404:
 *         description: Player not found
 *       500:
 *         description: Server error
 */
router.get("/:tag/playstyle", getPlaystyle);

/**
 * @swagger
 * /api/player/{tag}/cardIntelligence:
 *   get:
 *     summary: Get card and deck intelligence
 *     tags: [Players]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: tag
 *         required: true
 *         schema:
 *           type: string
 *           example: "%23ABC123"
 *     responses:
 *       200:
 *         description: Card intelligence
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CardIntelligence'
 *       400:
 *         description: No deck data available
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Unauthorized - JWT missing or invalid
 *       404:
 *         description: Player not found
 *       500:
 *         description: Server error
 */
router.get("/:tag/cardIntelligence", getCardIntelligence);

/**
 * @swagger
 * /api/player/ingest/{tag}:
 *   post:
 *     summary: Ingest player data from Clash Royale API
 *     description: Fetches player data from the external API and stores it in the local database. Existing records are updated.
 *     tags: [Players]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: tag
 *         required: true
 *         schema:
 *           type: string
 *           example: "%2320RGGRCJJ9"
 *         description: Clash Royale player tag (URL encoded)
 *     responses:
 *       200:
 *         description: Player successfully ingested
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   $ref: '#/components/schemas/PlayerProfile'
 *             example:
 *               status: success
 *               data:
 *                 id: 2
 *                 tag: "#20RGGRCJJ9"
 *                 name: OsamaBinSaggin
 *                 trophies: 5707
 *                 bestTrophies: 5859
 *                 wins: 757
 *                 losses: 593
 *                 arena: Executioner's Kitchen
 *                 createdAt: "2026-02-18T23:59:54.773Z"
 *                 favouriteCardName: Witch
 *       401:
 *         description: Unauthorized – JWT missing or invalid
 *       404:
 *         description: Player not found in external API
 *       500:
 *         description: Server error
 */
router.post("/ingest/:tag", ingestPlayer);

/**
 * @swagger
 * /api/player/ingest/battles/{tag}:
 *   post:
 *     summary: Ingest player battle log
 *     description: Fetches the latest battle log for a player and stores new battles in the database.
 *     tags: [Players]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: tag
 *         required: true
 *         schema:
 *           type: string
 *           example: "%2320RGGRCJJ9"
 *         description: Clash Royale player tag (URL encoded)
 *     responses:
 *       200:
 *         description: Battles successfully ingested
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 count:
 *                   type: integer
 *                   example: 35
 *             example:
 *               status: success
 *               count: 35
 *       401:
 *         description: Unauthorized – JWT missing or invalid
 *       404:
 *         description: Player not found
 *       500:
 *         description: Server error
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
 *     responses:
 *       200:
 *         description: Player profile
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PlayerProfile'
 *       401:
 *         description: Unauthorized - JWT missing or invalid
 *       404:
 *         description: Player not found
 *       500:
 *         description: Server error
 */
router.get("/:tag", getPlayerProfile);

export default router;
