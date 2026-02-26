import { prisma } from "../config/db.js";
import AppError from "../utils/appError.js";

export const findByTag = async (tag) => {
    if (tag.startsWith("%23")) tag = tag.replace("%23", "#");

    const player = await prisma.player.findUnique({ 
        where: { tag },
        include: {
            battles: true,
            currentDeck: {
                include: {
                    card: true
                }
            }
        }
    });

    if (!player) throw new AppError("Player not found", 404);
    
    return player;
};

export const upsertPlayer = (data) =>
    prisma.$transaction(async (tx) => {
        const player = await tx.player.upsert({
            where: { tag: data.tag },
            update: mapPlayer(data),
            create: mapPlayer(data)
        });

        await Promise.all([
            tx.playerCard.deleteMany({ where: { playerId: player.id } }),
            tx.playerDeck.deleteMany({ where: { playerId: player.id } })
        ]);

        await tx.playerCard.createMany({
            data: data.cards.map((c) => ({
                playerId: player.id,
                cardName: c.name,
                level: c.level
            }))
        });

        await tx.playerDeck.createMany({
            data: data.currentDeck.map((c) => ({
                playerId: player.id,
                cardName: c.name
            }))
        });

        return player;
});

export const insertBattles = (battles) => prisma.battle.createMany({ 
    data: battles, 
    // skipDuplicates: true
});

export const getBattles = (playerId) => prisma.battle.findMany({ where: { playerId } });

export const getBattleStats = async (playerId) => {
    const [aggregate, favouriteMode] = await Promise.all([
        prisma.battle.aggregate({
            where: { playerId },
            _avg: { crowns: true },
            _count: true
        }),
        prisma.battle.groupBy({
            by: ["gameMode"],
            where: { playerId },
            _count: true,
            orderBy: { _count: { gameMode: "desc" } },
            take: 1
        })
    ]);

    return {
        avgCrowns: aggregate._avg.crowns || 0,
        total: aggregate._count,
        favouriteMode: favouriteMode[0]?.gameMode || null
    };
};

export const getPlayerWithCards = (tag) =>
    prisma.player.findUnique({
        where: { tag },
        include: {
            currentDeck: { include: { card: true } },
            cards: {
                include: { card: true },
                orderBy: { level: "desc" }
            },
            favouriteCard: true
        }
    }
);

const mapPlayer = (data) => ({
    tag: data.tag,
    name: data.name,
    trophies: data.trophies,
    bestTrophies: data.bestTrophies,
    wins: data.wins,
    losses: data.losses,
    arena: data.arena?.name ?? null,
    favouriteCardName: data.currentFavouriteCard?.name ?? null
});
