import AppError from "../utils/appError.js";
import catchAsync from "../utils/catchAsync.js";
import { clashClient, clashEndpoints } from "../config/clashApi.js";
import { prisma } from "../config/db.js";
import { env } from "../config/env.js";
import { formatTag } from "../utils/formatTag.js";
import { getPlayer, getBattleLog, getCards, getClan, getClanMembers } from "../service/clashApi.js";
import { parseClashDate } from "../utils/parseClashDate.js";

export const ingestPlayer = catchAsync(async (req, res) => {
    const encodedTag = formatTag(req.params.tag);

    const { data } = await getPlayer(encodedTag);

    const player = await prisma.player.upsert({
        where: { tag: data.tag },
        update: {
            name: data.name,
            trophies: data.trophies,
            bestTrophies: data.bestTrophies,
            wins: data.wins,
            losses: data.losses
        },
        create: {
            tag: data.tag,
            name: data.name,
            trophies: data.trophies,
            bestTrophies: data.bestTrophies,
            wins: data.wins,
            losses: data.losses
        }
    });

    res.status(200).json({ status: "success", data: player });
});

export const ingestBattles = catchAsync(async (req, res) => {
    const encodedTag = formatTag(req.params.tag);

    const { data } = await getBattleLog(encodedTag);

    const player = await prisma.player.findUnique({
        where: { tag: data[0].team[0].tag }
    });

    const battles = data.map((battle) => ({
        playerId: player.id,
        result:
        battle.team[0].crowns > battle.opponent[0].crowns
            ? "WIN"
            : "LOSS",
        crowns: battle.team[0].crowns,
        gameMode: battle.gameMode.name,
        battleTime: parseClashDate(battle.battleTime)
    }));

    await prisma.battle.createMany({
        data: battles,
        skipDuplicates: true
    });

    res.status(200).json({
        status: "success",
        count: battles.length
    });
});