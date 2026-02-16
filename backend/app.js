import express from "express";
import { env } from "./src/config/env.js";
import { prisma } from "./src/config/db.js";
import { swaggerSpec, swaggerUi } from "./src/config/swagger.js";

const app = express();

app.use(express.json());

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get("/health", async (req, res) => {
  await prisma.$queryRaw`SELECT 1`;
  res.send("DB OK");
});

export default app;