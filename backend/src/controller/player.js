import catchAsync from "../utils/catchAsync.js";
import * as playerService from "../service/player.js";
import AppError from "../utils/appError.js";
import { buildPlayerMetrics } from "../service/analytics.js";

export const ingestPlayer = catchAsync(async (req, res) => {
    const data = await playerService.ingestPlayer(req.params.tag);

    res.status(200).json({
        status: "success",
        data
    });
});

export const getPlayerProfile = catchAsync(async (req, res) => {
    const player = await playerService.playerProfile(req.params.tag);

    res.status(200).json({
        status: "success",
        player
    });
});

export const ingestBattles = catchAsync(async (req, res) => {
    const { count } = await playerService.ingestBattles(req.params.tag);

    res.status(200).json({
        status: "success",
        count
    });
});

export const getOverview = catchAsync(async (req, res) => {
    const data = await playerService.getOverview(req.params.tag);

    res.status(200).json({
        status: "success",
        data
    });
});

export const getPlaystyle = catchAsync(async (req, res) => {
    const data = await playerService.getPlaystyle(req.params.tag);
    res.status(200).json({
        status: "success",
        data
    });
});

export const getCardIntelligence = catchAsync(async (req, res) => {
    const data = await playerService.getCardIntelligence(req.params.tag);
    res.status(200).json({
        status: 'success',
        data
    });
});

export const comparePlayers = catchAsync(async (req, res, next) => {
    let { tag1, tag2 } = req.query;

    if (!tag1 || !tag2) 
        return next(new AppError("tag1 and tag2 are required", 400));

    const [p1, p2] = await Promise.all([
        buildPlayerMetrics(tag1),
        buildPlayerMetrics(tag2)
    ]);

    const comparison = {
        winRate: p1.winRate > p2.winRate ? p1.name : p2.name,
        aggression: p1.aggression > p2.aggression ? p1.name : p2.name,
        trophies: p1.trophies > p2.trophies ? p1.name : p2.name,
        deckAdvantage: p1.avgElixir < p2.avgElixir ? p1.name : p2.name
    };

    res.status(200).json({
        status: 'success',
        data: {
            player1: p1,
            player2: p2,
            comparison
        }
    });
});