// TODO:
// Remove Duplicate Code. Adding events for both client and user should be similar
// Add route for retrieving a particular user's events (this means figuring out how to get the user's email when they authenticate)
// Test Client routes - Owner routes function correctly

import express, { Express, Request, Response } from "express";
import session from "express-session";
import dotenv from "dotenv";
import { google, calendar_v3 } from "googleapis";

import { IEnvironmentVars, User } from "./interfaces";
import {
    Attendees,
    IAuthURLResponse,
    IGoogleAPICalendarEvents,
    IMyEventAddedRequest,
    IMyEventsResponse,
} from "./apiTypes";
import {
    getOwnerRefreshTokenFromFile,
    getUserSession,
    setOwnerRefreshTokenFromFile,
    validateEnvVariables,
} from "./utils";
import { serverURL, redirectURLs } from "./constants";

declare module "express-session" {
    interface SessionData {
        user: User;
    }
}

dotenv.config();

validateEnvVariables();
const {
    CLIENT_ID,
    CLIENT_SECRET,
    CLIENT_URL,
    PORT,
    OWNER_CALENDAR_ID,
    OWNER_AUTH_PASSPHRASE,
    SESSION_SECRET,
} = process.env as unknown as IEnvironmentVars;

const app: Express = express();

// Middleware
app.use(express.json());
app.use(
    session({
        secret: SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
    })
);

// Google OAuth 2.0 Setup
const oauth2Owner = new google.auth.OAuth2(
    CLIENT_ID,
    CLIENT_SECRET,
    redirectURLs.owner
);
const refreshToken = getOwnerRefreshTokenFromFile();
if (refreshToken) {
    oauth2Owner.setCredentials({ refresh_token: refreshToken });
}
const ownerCalendar = google.calendar({ version: "v3", auth: oauth2Owner });

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

app.get("/client-login", (req: Request, res: Response) => {
    const { oauth2Client } = getUserSession(req);
    const url = oauth2Client.generateAuthUrl({
        access_type: "offline",
        scope: "https://www.googleapis.com/auth/calendar",
    });
    const response: IAuthURLResponse = { url };
    res.send(response);
});

app.get("/client-logout", (req: Request, res: Response) => {
    const { oauth2Client } = getUserSession(req);
    oauth2Client.revokeCredentials();
    res.send("Logged out successfully.");
});

app.get("/OAuth2ClientCallback", async (req: Request, res: Response) => {
    const { code } = req.query;
    const { oauth2Client } = getUserSession(req);

    try {
        const { tokens } = await oauth2Client.getToken(code as string);
        oauth2Client.setCredentials(tokens);
        res.redirect(CLIENT_URL);
    } catch (error) {
        console.error("Error getting token from Google:", error);
        res.status(400).send("Error getting token from Google");
    }
});

app.post("/add-client-event", async (req: Request, res: Response) => {
    const event: calendar_v3.Schema$Event = req.body;
    const { calendar } = getUserSession(req);

    try {
        const response = await calendar.events.insert({
            calendarId: "primary",
            requestBody: event,
        });

        res.send(response.data);
    } catch (error: any) {
        res.status(400).send(error);
    }
});

app.post("/add-my-event", async (req: Request, res: Response) => {
    const eventRequest: IMyEventAddedRequest = req.body;
    const myEmail: Attendees = { email: OWNER_CALENDAR_ID };
    eventRequest.attendees.push(myEmail);

    try {
        const apiResponse = await ownerCalendar.events.insert({
            calendarId: OWNER_CALENDAR_ID,
            requestBody: eventRequest,
        });

        const event = apiResponse.data as IGoogleAPICalendarEvents;
        const response: IMyEventsResponse = {
            attendees: event.attendees,
            summary: event.summary,
            start: event.start,
            end: event.end,
        };
        res.send(response);
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
