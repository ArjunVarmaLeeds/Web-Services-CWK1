import dotenv from "dotenv";
import { cleanEnv, str, port } from "envalid";

dotenv.config();

const cleaned = cleanEnv(process.env, {
    NODE_ENV: str({ default: "development" }),
    PORT: port({ default: 5000 }),
    DATABASE_URL: str(),
    JWT_SECRET: str(),
    RIOT_API_KEY: str(),
    RIOT_REGION: str({ default: "europe" }),
});

export const env = {
    nodeEnv: cleaned.NODE_ENV,
    port: cleaned.PORT,
    databaseUrl: cleaned.DATABASE_URL,
    jwt: {
        secret: cleaned.JWT_SECRET,
        expiresIn: "7d",
    },
    riot: {
        apiKey: cleaned.RIOT_API_KEY,
        region: cleaned.RIOT_REGION,
    },
};
