import type { Request, Response, NextFunction } from "express";

export function ensureAuthenticated(req: Request, res: Response, next: NextFunction) {
    if (req.session && req.session.userTokens) {
        next();
    } else {
        req.session.redirectTo = req.originalUrl;
        res.redirect("/auth/login");
    }
}
