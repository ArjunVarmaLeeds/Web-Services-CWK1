import catchAsync from "../utils/catchAsync.js";
import * as playerService from "../service/player.js";

export const ingestPlayer = catchAsync(async (req, res) => {
    const data = await playerService.ingestPlayer(req.params.tag);

    res.status(200).json({
        status: "success",
        data
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
    const overview = await playerService.getOverview(req.params.tag);

    res.status(200).json(overview);
});

export const getPlaystyle = catchAsync(async (req, res) => {
    const data = await playerService.getPlaystyle(req.params.tag);
    res.status(200).json(data);
});

export const getCardIntelligence = catchAsync(async (req, res) => {
    const data = await playerService.getCardIntelligence(req.params.tag);
    res.status(200).json(data);
});
