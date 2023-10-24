import express, { Request, Response } from "express";
import {
    AuthenticatedRequest,
    GetUserEventsResponse,
    InsertEventRequest,
    InsertEventResponse,
} from "../interfaces";
import { owner } from "../server";

const router = express.Router();

router.post("/insertEvent", async (req: Request, res: Response) => {
    const eventRequest: InsertEventRequest = req.body;
    const { email } = (req as unknown as AuthenticatedRequest).session;

    try {
        const eventData = await owner.insertEvent(eventRequest, email);
        const response: InsertEventResponse = {
            summary: eventData.summary!,
            start: eventData.start!,
            end: eventData.end!,
        };
        res.json(response);
    } catch (error: any) {
        console.log(error.message);
        res.status(500).send("Error inserting event");
    }
});

router.put("/updateEvent/:eventId", async (req: Request, res: Response) => {
    const { eventId } = req.params;
    const updatedEventDetails: InsertEventRequest = req.body;
    const { email } = (req as unknown as AuthenticatedRequest).session;

    try {
        const updatedEvent = await owner.updateEvent(
            eventId,
            email,
            updatedEventDetails
        );
        res.json(updatedEvent);
    } catch (error: any) {
        console.error(`Error updating event: ${error.message}`);
        res.status(500).send("Error updating event");
    }
});

router.delete("/deleteEvent/:eventId", async (req: Request, res: Response) => {
    const { eventId } = req.params;

    try {
        await owner.deleteEvent(eventId);
        res.send("Event deleted successfully");
    } catch (error: any) {
        console.error(`Error deleting event: ${error.message}`);
        res.status(500).send("Error deleting event");
    }
});

router.get("/userEvents", async (req: Request, res: Response) => {
    const { email } = (req as unknown as AuthenticatedRequest).session;

    try {
        const events: GetUserEventsResponse = await owner.getUserEvents(email);
        res.json(events);
    } catch (error: any) {
        res.status(500).send(`Error retrieving user events: ${error.message}`);
    }
});

export default router;
