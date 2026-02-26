import AppError from "../utils/appError.js";
import { prisma } from "../config/db.js";
import { getCards } from "./clashApi.js";

export const syncCards = async (req, res, next) => {
    const { data } = await getCards();

    if (!data?.items?.length)
        throw new AppError("No cards received from Clash API", 502);

    const cards = data.items.map((card) => ({
        name: card.name,
        maxLevel: card.maxLevel,
        elixir: card.elixirCost ?? -1,
        rarity: card.rarity,
        iconUrl: card.iconUrls.medium
    }));

    const result = await prisma.card.createMany({
        data: cards,
        // skipDuplicates: true
    });

    res.status(200).json({
        totalFromAPI: cards.length,
        insertedIntoDB: result.count
    });
};
