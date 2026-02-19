export const getWinRate = (player) => {
    const total = player.wins + player.losses;
    return total ? player.wins / total : 0;
};

// Average crown per win
export const getAggressionScore = (battles) => {
    const totalCrowns = battles.reduce((sum, b) => sum + b.crowns, 0);
    return battles.length ? totalCrowns / battles.length : 0;
};

// Playstyle metrics - favourite mode, consistency index
export const classifyPlaystyle = (avgCrowns) => {
    if (avgCrowns >= 2) return "AGGRO";
    if (avgCrowns <= 1) return "CONTROL";
    return "BALANCED";
};

// Card intelligence - most used card, average card level, deck cost
export const cardIntelligence = () => {

}
