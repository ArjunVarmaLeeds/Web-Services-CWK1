export const requireAdmin = (req, res, next) => {
    try {
        const user = req.user;

        if (!user) {
            return res.status(401).json({
                status: "error",
                message: "Unauthorized"
            });
        }

        if (user.email !== "admin@gmail.com") {
            return res.status(403).json({
                status: "error",
                message: "Admin privileges required"
            });
        }
        next();
    } catch (err) {
        next(err);
    }
};