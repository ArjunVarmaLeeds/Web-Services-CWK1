import axios from "axios";
import { env } from "./env.js";

export const clashClient = axios.create({
    headers: {
        "Authorization": `Bearer ${env.clashApiKey}`,
    },
});

export const clashEndpoints = {
    playerInfo: (playerTag) => `${env.baseUrl}/players/${playerTag}`,
    playerBattleLog: (playerTag) => `${env.baseUrl}/players/${playerTag}`,
    allCards: () => `${env.baseUrl}/cards`,
    clanInfo: (clanTag) => `${env.baseUrl}/clans/${clanTag}`,
    clanMembers: (clanTag) => `${env.baseUrl}/clans/${clanTag}/members`,
    locations: () => `${env.baseUrl}/locations`,
    clanRankings: (id) => `${env.baseUrl}/${id}/rankings/clans`,
    playerRankings: (id) => `${env.baseUrl}/${id}/rankings/players`,
};
