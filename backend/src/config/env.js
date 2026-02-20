import dotenv from "dotenv";
import { cleanEnv, str, port } from "envalid";

dotenv.config();

const cleaned = cleanEnv(process.env, {
    NODE_ENV: str({ default: "development" }),
    PORT: port({ default: 5000 }),
    DATABASE_URL: str(),
    JWT_SECRET: str(),
    BASE_URL: str({ default: "https://api.clashroyale.com/v1/" }),
    CLASH_API_KEY: str()
});

export const env = {
    nodeEnv: cleaned.NODE_ENV,
    port: cleaned.PORT,
    databaseUrl: cleaned.DATABASE_URL,
    jwt: {
        secret: cleaned.JWT_SECRET,
        expiresIn: "7d",
    },
    baseUrl: cleaned.BASE_URL,
    clashApiKey: cleaned.CLASH_API_KEY
};