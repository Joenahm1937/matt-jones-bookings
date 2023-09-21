import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import { google, calendar_v3 } from "googleapis";
import path from "path";

import { IEnvironmentVars, IServiceAccount } from "./interfaces";

dotenv.config();

const app: Express = express();

const {
    CLIENT_ID,
    CLIENT_SECRET,
    REDIRECT_URL,
    CLIENT_URL,
    PORT,
    SERVICE_ACCOUNT_KEY_FILENAME,
    OWNER_CALENDAR_ID,
} = process.env as unknown as IEnvironmentVars;

// Google OAuth 2.0 Setup
const OAuth2 = google.auth.OAuth2;
const oauth2Client = new OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URL);
const clientCalendar = google.calendar({ version: "v3", auth: oauth2Client });

// Google Service Account Setup
const serviceAccount: IServiceAccount = require(path.join(
    "../keys",
    SERVICE_ACCOUNT_KEY_FILENAME
));
const serviceJWT = new google.auth.JWT(
    serviceAccount.client_email,
    undefined,
    serviceAccount.private_key,
    ["https://www.googleapis.com/auth/calendar"]
);
const serviceCalendar = google.calendar({ version: "v3", auth: serviceJWT });

app.get("/", (_, res: Response) => {
    res.send("Express + TypeScript Server");
});

// OAuth URL Generation
app.get("/auth-url", (_, res: Response) => {
    const url = oauth2Client.generateAuthUrl({
        access_type: "offline",
        scope: "https://www.googleapis.com/auth/calendar",
    });
    res.send({ url });
});

// OAuth Callback Endpoint
app.get("/oauth2callback", async (req: Request, res: Response) => {
    const { code } = req.query;

    try {
        const { tokens } = await oauth2Client.getToken(code as string);
        oauth2Client.setCredentials(tokens);
        res.redirect(CLIENT_URL);
    } catch (error) {
        res.status(400).send("Error getting token from Google");
    }
});

// Add event to user's calendar using OAuth
app.post("/add-user-event", async (req: Request, res: Response) => {
    const event: calendar_v3.Schema$Event = req.body;

    try {
        const response = await clientCalendar.events.insert({
            calendarId: "primary",
            requestBody: event,
        });

        res.send(response.data);
    } catch (error: any) {
        res.status(400).send(error.message);
    }
});

// Add event to business calendar using Service Account
app.post("/add-matts-event", async (req: Request, res: Response) => {
    const event: calendar_v3.Schema$Event = req.body;

    try {
        const response = await serviceCalendar.events.insert({
            calendarId: OWNER_CALENDAR_ID,
            requestBody: event,
        });

        res.send(response.data);
    } catch (error: any) {
        res.status(400).send(error.message);
    }
});

app.get("/get-matts-events", async (_, res: Response) => {
    try {
        const response = await serviceCalendar.events.list({
            calendarId: OWNER_CALENDAR_ID,
        });
        res.send(response.data.items);
    } catch (error: any) {
        res.status(400).send(error.message);
    }
});

app.listen(PORT, () => {
    console.log(`⚡️[server]: Server is running at http://localhost:${PORT}`);
});
