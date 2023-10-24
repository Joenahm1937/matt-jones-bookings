import type { Request, Response, NextFunction } from "express";

export function ensureAuthenticated(
    req: Request,
    res: Response,
    next: NextFunction
) {
    if (req.session && req.session.userTokens) {
        next();
    } else {
        res.send("User is not authenticated");
    }
}
