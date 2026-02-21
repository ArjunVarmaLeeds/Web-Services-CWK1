import * as authService from "../service/auth.js";

export const register = async (req, res, next) => {
    try {
        const user = await authService.registerUser(req.body);
        res.status(201).json({
            id: user.id,
            email: user.email,
            createdAt: user.createdAt
        });
    } catch (err) {
        next(err);
    }
};

export const login = async (req, res, next) => {
    try {
        const data = await authService.loginUser(req.body);
        res.json(data);
    } catch (err) {
        next(err);
    }
};

export const me = async (req, res, next) => {
    try {
        const user = await authService.getCurrentUser(req.user.userId);
        res.json(user);
    } catch (err) {
        next(err);
    }
};
