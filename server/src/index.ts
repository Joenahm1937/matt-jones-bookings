import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import { google, calendar_v3 } from "googleapis";
import path from "path";

import { IEnvironmentVars, IServiceAccount } from "./interfaces";
import {
    Attendees,
    IAuthURLResponse,
    IGoogleAPICalendarEvents,
    IMyEventAddedRequest,
    IMyEventsResponse,
} from "./apiTypes";
import { validateEnvVariables } from "./utils";
import { redirectURLs } from "./constants";

dotenv.config();

const {
    CLIENT_ID,
    CLIENT_SECRET,
    CLIENT_URL,
    PORT,
    SERVICE_ACCOUNT_KEY_FILENAME,
    OWNER_CALENDAR_ID,
} = process.env as unknown as IEnvironmentVars;

validateEnvVariables();

const app: Express = express();

// Middleware
app.use(express.json());

// Google OAuth 2.0 Setup
const OAuth2 = google.auth.OAuth2;
const oauth2Owner = new OAuth2(CLIENT_ID, CLIENT_SECRET, redirectURLs.owner);
const oauth2Client = new OAuth2(CLIENT_ID, CLIENT_SECRET, redirectURLs.client);
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
    res.send("Welcome to Matt's Bookings Server");
});

app.get("/auth-url-owner", (_, res: Response) => {
    const url = oauth2Owner.generateAuthUrl({
        access_type: "offline",
        scope: "https://www.googleapis.com/auth/calendar",
    });
    const response: IAuthURLResponse = { url };
    res.send(response);
});

app.get("/OAuth2OwnerCallback", async (req: Request, res: Response) => {
    const { code } = req.query;

    try {
        const { tokens } = await oauth2Owner.getToken(code as string);
        oauth2Owner.setCredentials(tokens);
        res.send("Owner credentials have been set");
    } catch (error) {
        res.status(400).send("Error getting token from Google");
    }
});

app.get("/auth-url", (_, res: Response) => {
    const url = oauth2Client.generateAuthUrl({
        access_type: "offline",
        scope: "https://www.googleapis.com/auth/calendar",
    });
    const response: IAuthURLResponse = { url };
    res.send(response);
});

app.get("/OAuth2ClientCallback", async (req: Request, res: Response) => {
    const { code } = req.query;

    try {
        const { tokens } = await oauth2Client.getToken(code as string);
        oauth2Client.setCredentials(tokens);
        res.redirect(CLIENT_URL);
    } catch (error) {
        res.status(400).send("Error getting token from Google");
    }
});

app.post("/add-client-event", async (req: Request, res: Response) => {
    const event: calendar_v3.Schema$Event = req.body;

    try {
        const response = await clientCalendar.events.insert({
            calendarId: "primary",
            requestBody: event,
        });

        res.send(response.data);
    } catch (error: any) {
        res.status(400).send(error);
    }
});

app.post("/add-my-event", async (req: Request, res: Response) => {
    const event: IMyEventAddedRequest = req.body;
    const myEmail: Attendees = { email: OWNER_CALENDAR_ID };
    event.attendees.push(myEmail);

    try {
        const apiResponse = await serviceCalendar.events.insert({
            calendarId: OWNER_CALENDAR_ID,
            requestBody: event,
        });
        // TODO:
        // Currently attendees won't work because of domain delegation issue, but I want to add this so I can add events as pending and accept in the UI
        // Send back limited info
        res.send(apiResponse.data);
    } catch (error: any) {
        console.log(error.response.data.error.errors);
        res.status(400).send(error.message);
    }
});

app.get("/get-my-events", async (_, res: Response) => {
    try {
        const apiResponse = await serviceCalendar.events.list({
            calendarId: OWNER_CALENDAR_ID,
        });
        const events = apiResponse.data.items as
            | IGoogleAPICalendarEvents[]
            | undefined;
        if (events) {
            const response: IMyEventsResponse[] = events.map(
                (event: IGoogleAPICalendarEvents) => ({
                    status: event.status,
                    summary: event.summary,
                    start: event.start,
                    end: event.end,
                })
            );
            res.send(response);
        } else {
            throw new Error("Google API Response did not send valid response");
        }
    } catch (error: any) {
        res.status(400).send(error.message);
    }
});

app.listen(PORT, () => {
    console.log(`🚀 Server is running at ${CLIENT_URL}`);
});
