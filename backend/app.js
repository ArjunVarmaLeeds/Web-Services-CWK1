import express from "express";
import { env } from "./src/config/env.js";
import { prisma } from "./src/config/db.js";
import { swaggerSpec, swaggerUi } from "./src/config/swagger.js";
import authRoutes from "./src/routes/auth.js"
import { errorHandler } from "./src/middleware/errorHandler.js";
import playerRouter from "./src/routes/players.js"
import cardRouter from "./src/routes/cards.js";

const app = express();

app.use(express.json());

app.use("/api/auth", authRoutes);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

/**
 * @swagger
 * /health:
 *   get:
 *     summary: Health check endpoint
 *     description: Checks database connectivity
 *     responses:
 *       200:
 *         description: Database is healthy
 *         content:
 *           text/plain:
 *             example: DB OK
 *       500:
 *         description: Database connection failed
 */
app.get("/health", async (req, res) => {
    await prisma.$queryRaw`SELECT 1`;
    res.send("DB OK");
});

app.use('/api/player', playerRouter);
app.use('/api/cards', cardRouter);

app.use(errorHandler);

export default app;