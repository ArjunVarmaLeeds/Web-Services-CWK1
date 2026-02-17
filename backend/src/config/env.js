import dotenv from "dotenv";
import { cleanEnv, str, port } from "envalid";

dotenv.config();

const cleaned = cleanEnv(process.env, {
    NODE_ENV: str({ default: "development" }),
    PORT: port({ default: 5000 }),
<<<<<<< HEAD
<<<<<<< Updated upstream

=======
>>>>>>> 43cc98f0f60c79628e8014d28c9bec2f1fc518b1
    DATABASE_URL: str(),
    JWT_SECRET: str(),
    RIOT_API_KEY: str(),
    RIOT_REGION: str({ default: "europe" }),
});
<<<<<<< HEAD
=======
    DATABASE_URL: str(),
    JWT_SECRET: str(),
    RIOT_API_KEY: str(),
    RIOT_REGION: str({ default: "europe" }),
    BASE_URL: str({ default: "https://europe.api.riotgames.com" })
});
=======
>>>>>>> 43cc98f0f60c79628e8014d28c9bec2f1fc518b1

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
<<<<<<< HEAD
        baseUrl: cleaned.BASE_URL.replace('region', cleaned.RIOT_REGION)
    },
};
>>>>>>> Stashed changes
=======
    },
};
>>>>>>> 43cc98f0f60c79628e8014d28c9bec2f1fc518b1
