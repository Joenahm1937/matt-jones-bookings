import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import { google, calendar_v3 } from "googleapis";

import { IEnvironmentVars } from "./interfaces";
import {
    Attendees,
    IAuthURLResponse,
    IGoogleAPICalendarEvents,
    IMyEventAddedRequest,
    IMyEventsResponse,
} from "./apiTypes";
import {
    getOwnerRefreshTokenFromFile,
    setOwnerRefreshTokenFromFile,
    validateEnvVariables,
} from "./utils";
import { serverURL, redirectURLs } from "./constants";

dotenv.config();

const {
    CLIENT_ID,
    CLIENT_SECRET,
    CLIENT_URL,
    PORT,
    OWNER_CALENDAR_ID,
    OWNER_AUTH_PASSPHRASE,
} = process.env as unknown as IEnvironmentVars;

validateEnvVariables();

const app: Express = express();

// Middleware
app.use(express.json());

// Google OAuth 2.0 Setup
const OAuth2 = google.auth.OAuth2;
const oauth2Owner = new OAuth2(CLIENT_ID, CLIENT_SECRET, redirectURLs.owner);
const refreshToken = getOwnerRefreshTokenFromFile();
if (refreshToken) {
    oauth2Owner.setCredentials({ refresh_token: refreshToken });
}
const ownerCalendar = google.calendar({ version: "v3", auth: oauth2Owner });

const oauth2Client = new OAuth2(CLIENT_ID, CLIENT_SECRET, redirectURLs.client);
const clientCalendar = google.calendar({ version: "v3", auth: oauth2Client });

app.get("/", (_, res: Response) => {
    res.send("Welcome to Matt's Bookings Server");
});

app.get("/auth-url-owner", (req: Request, res: Response) => {
    const { passphrase } = req.query;
    if (passphrase !== OWNER_AUTH_PASSPHRASE) {
        return res.status(403).send("Unauthorized");
    }

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
        if (tokens.refresh_token) {
            setOwnerRefreshTokenFromFile(tokens.refresh_token);
        }
        res.send("Owner credentials have been set");
    } catch (error) {
        res.status(400).send(`Error getting token from Google: ${error}`);
    }
});

app.get("/client-login", (_, res: Response) => {
    const url = oauth2Client.generateAuthUrl({
        access_type: "offline",
        scope: "https://www.googleapis.com/auth/calendar",
    });
    const response: IAuthURLResponse = { url };
    res.send(response);
});

app.get("/client-logout", (req: Request, res: Response) => {
    oauth2Client.revokeCredentials();
    res.send("Logged out successfully.");
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
        const apiResponse = await ownerCalendar.events.insert({
            calendarId: OWNER_CALENDAR_ID,
            requestBody: event,
        });
        res.send(apiResponse.data);
    } catch (error: any) {
        console.log(error.response.data.error.errors);
        res.status(400).send(error.message);
    }
});

app.get("/get-my-events", async (_, res: Response) => {
    try {
        const apiResponse = await ownerCalendar.events.list({
            calendarId: OWNER_CALENDAR_ID,
        });
        const events = apiResponse.data.items as
            | IGoogleAPICalendarEvents[]
            | undefined;
        if (events) {
            const response: IMyEventsResponse[] = events.map(
                (event: IGoogleAPICalendarEvents) => ({
                    attendees: event.attendees,
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
    console.log(`🚀 Server is running at ${serverURL}`);
});
