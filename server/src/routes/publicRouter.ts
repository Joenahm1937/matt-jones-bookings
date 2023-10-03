import express, { Request, Response } from "express";
import { owner } from "../server";
import { GetAllEventsResponse } from "../interfaces";

const router = express.Router();

router.get("/blockedDays", async (req: Request, res: Response) => {
    try {
        const blockedDays: GetAllEventsResponse = await owner.getOwnerEventsByResponseStatus();
        res.json(blockedDays);
    } catch (error: any) {
        res.status(500).send(`Error retrieving blocked days: ${error.message}`);
    }
});

export default router;
