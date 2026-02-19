import AppError from "../utils/appError.js";
import { formatTag } from "../utils/formatTag.js";
import { parseClashDate } from "../utils/parseClashDate.js";
import { getPlayer, getBattleLog } from "./clashApi.js";
import * as playerRepo from "../repositories/player.js";
import { getWinRate, classifyPlaystyle } from "./analytics.js";
import { analyzeDeck } from "../utils/deckAnalyser.js";

export const ingestPlayer = async (rawTag) => {
    const tag = formatTag(rawTag);
    const { data } = await getPlayer(tag);
    return playerRepo.upsertPlayer(data);
};

export const ingestBattles = async (rawTag) => {
    const tag = formatTag(rawTag);
    const { data } = await getBattleLog(tag);

    const playerTag = data?.[0]?.team?.[0]?.tag;
    if (!playerTag) throw new AppError("Invalid battle data", 400);

    const player = await playerRepo.findByTag(playerTag);

    const battles = data.map((b) => ({
        playerId: player.id,
        result: b.team[0].crowns > b.opponent[0].crowns ? "WIN" : "LOSS",
        crowns: b.team[0].crowns,
        gameMode: b.gameMode.name,
        battleTime: parseClashDate(b.battleTime)
    }));

    return playerRepo.insertBattles(battles);
};

export const getOverview = async (tag) => {
    const player = await playerRepo.findByTag(tag);
    const battles = await playerRepo.getBattles(player.id);

    return {
        trophies: player.trophies,
        bestTrophies: player.bestTrophies,
        winRate: getWinRate(player)
    };
};

export const getPlaystyle = async (tag) => {
    const player = await playerRepo.findByTag(tag);

    const stats = await playerRepo.getBattleStats(player.id);
    if (!stats.total) throw new AppError("Not enough battles", 400);

    return {
        totalBattles: stats.total,
        aggressionScore: stats.avgCrowns,
        consistencyScore: getWinRate(player),
        favouriteGameMode: stats.favouriteMode,
        playstyle: classifyPlaystyle(stats.avgCrowns)
    };
};

export const getCardIntelligence = async (tag) => {
    const player = await playerRepo.getPlayerWithCards(tag);

    if (!player.currentDeck.length)
        throw new AppError("No deck data available", 400);

    const deckCards = player.currentDeck.map((d) => d.card);
    const collection = player.cards;

    const deckAnalysis = analyzeDeck(deckCards);

    const avgLevel =
        collection.reduce((s, c) => s + c.level, 0) /
        (collection.length || 1);

    const mostUpgraded = collection[0];

    return {
        deck: {
            ...deckAnalysis,
            cards: deckCards
        },
        progression: {
            averageCardLevel: Number(avgLevel.toFixed(2)),
            totalCardsOwned: collection.length,
            mostUpgradedCard: mostUpgraded
                ? { name: mostUpgraded.cardName, level: mostUpgraded.level }
                : null
        },
        favourites: {
            supercellFavourite: player.favouriteCard?.name || null
        }
    };
};
