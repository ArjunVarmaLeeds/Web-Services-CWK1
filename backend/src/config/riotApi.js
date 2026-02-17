import axios from "axios";
import { env } from "./env.js";

export const riotClient = axios.create({
    headers: {
        "X-Riot-Token": env.riot.apiKey,
    },
});

export const riotEndpoints = {
    accountByRiotId: (gameName, tagLine) => `${env.riot.baseUrl}/riot/account/v1/accounts/by-riot-id/${gameName}/${tagLine}`,
    matchlistByPuuid: (puuid) => `${env.riot.baseUrl}/val/match/v1/matchlists/by-puuid/${puuid}`,
    matchById: (matchId) => `${env.riot.baseUrl}/val/match/v1/matches/${matchId}`,
    rankByPuuid: (puuid) => `${env.riot.baseUrl}/val/ranked/v1/by-puuid/${puuid}`,
};
