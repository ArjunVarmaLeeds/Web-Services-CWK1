export const analyzeDeck = (deckCards) => {
    const avgElixir = deckCards.reduce((s, c) => s + (c.elixir || 0), 0) /deckCards.length;
    const cycleCards = deckCards.filter((c) => c.elixir <= 2).length;

    const rarityDist = deckCards.reduce((acc, c) => {
        acc[c.rarity] = (acc[c.rarity] || 0) + 1;
        return acc;
    }, {});

    const type = avgElixir <= 3.3 ? "CYCLE" : avgElixir >= 4 ? "BEATDOWN" : "BALANCED";

    return {
        averageElixir: Number(avgElixir.toFixed(2)),
        cycleCardCount: cycleCards,
        rarityDistribution: rarityDist,
        type
    };
};
