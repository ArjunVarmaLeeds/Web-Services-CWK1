import { Router } from "express";
import { syncCards } from "../service/card.js";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Cards
 *   description: Card metadata synchronisation
 */

/**
 * @swagger
 * /api/cards/sync:
 *   post:
 *     summary: Synchronise Clash Royale card metadata
 *     description: Fetches all card data from the Clash Royale API and stores it in the local database. This is required before ingesting players to maintain referential integrity.
 *     tags: [Cards]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Card metadata successfully synchronised
 *         content:
 *           application/json:
 *             example:
 *               status: success
 *               totalFromAPI: 128
 *               insertedIntoDB: 128
 *       401:
 *         description: Unauthorized – JWT missing or invalid
 *       500:
 *         description: Server error
 */
router.post("/sync", syncCards);

export default router;
