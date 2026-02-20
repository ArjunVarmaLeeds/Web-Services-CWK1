import { findByTag } from "../repositories/player.js";

export const getWinRate = (player) => {
    const total = player.wins + player.losses;
    return total ? player.wins / total : 0;
};

// Average crown per win
export const getAggressionScore = (battles) => {
    const totalCrowns = battles.reduce((sum, b) => sum + b.crowns, 0);
    return battles.length ? totalCrowns / battles.length : 0;
};

export const getAvgElixer = (deck) => {
    return deck.reduce((sum, d) => sum + (d.card.elixir || 0), 0) / (deck.length || 1);
}

// Playstyle metrics - favourite mode, consistency index
export const classifyPlaystyle = (avgCrowns) => {
    if (avgCrowns >= 2) return "AGGRO";
    if (avgCrowns <= 1) return "CONTROL";
    return "BALANCED";
};

export const buildPlayerMetrics = async (tag) => {
    const player = await findByTag(tag);

    if (!player) throw new Error(`Player ${tag} not found`);

    const winRate = getWinRate(player);
    const aggression = getAggressionScore(player.battles);
    const avgElixir = getAvgElixer(player.currentDeck);

    return {
        tag: player.tag,
        name: player.name,
        trophies: player.trophies,
        winRate,
        aggression,
        playstyle: classifyPlaystyle(aggression),
        avgElixir: Number(avgElixir.toFixed(2))
    };
};