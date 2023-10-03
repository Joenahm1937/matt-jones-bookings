import { createClient } from "redis";
import { google, calendar_v3 } from "googleapis";
import { OAuth2Client, Credentials } from "google-auth-library";
import {
    Attendee,
    InsertEventRequest,
    ResponseStatus,
    GetAllEventsResponse,
    ScrubbedEventData,
} from "../interfaces";
import "dotenv/config";

let RedisClient: ReturnType<typeof createClient>;

export class Owner {
    oAuth2Client: OAuth2Client;
    private calendar: calendar_v3.Calendar;
    private redisClient: typeof RedisClient;

    constructor(
        clientId: string,
        clientSecret: string,
        redirectUrl: string,
        redisClient: typeof RedisClient
    ) {
        this.oAuth2Client = new google.auth.OAuth2(
            clientId,
            clientSecret,
            redirectUrl
        );
        this.calendar = google.calendar({
            version: "v3",
            auth: this.oAuth2Client,
        });
        this.redisClient = redisClient;
    }

    async refreshTokenIfNeeded() {
        try {
            const tokens = await this.getTokensFromRedis();
            console.log("Authenticating Owner with Stored Tokens");
            this.oAuth2Client.setCredentials(tokens);
        } catch (err) {
            console.error(
                `No stored tokens found. Owner needs to authenticate at http://${process.env.IP_ADDR}:${process.env.PORT}/auth/owner-auth`
            );
        }
    }

    async insertEvent(
        eventRequest: InsertEventRequest,
        clientEmail: string
    ): Promise<calendar_v3.Schema$Event> {
        const attendees: Attendee[] = [
            { email: clientEmail },
            { email: process.env.OWNER_CALENDAR_ID! },
        ];
        eventRequest.attendees = attendees;
        const response = await this.calendar.events.insert({
            calendarId: process.env.OWNER_CALENDAR_ID!,
            requestBody: eventRequest,
        });
        return response.data;
    }

    async getOwnerEventsByResponseStatus(): Promise<GetAllEventsResponse> {
        try {
            const response = await this.calendar.events.list({
                calendarId: process.env.OWNER_CALENDAR_ID!,
                maxResults: 2500,
                singleEvents: true,
                orderBy: "startTime",
            });

            const events = response.data.items || [];
            const ownerEmail = process.env.OWNER_CALENDAR_ID!;

            const groupedEvents: GetAllEventsResponse = {
                needsAction: [],
                tentative: [],
                accepted: [],
                noStatus: [],
            };

            events.forEach((event) => {
                const filteredEventData: ScrubbedEventData = {
                    start: event.start,
                    end: event.end,
                };
                const ownerAttendee = event.attendees?.find(
                    (attendee) => attendee.email === ownerEmail
                );
                if (
                    ownerAttendee &&
                    ownerAttendee.responseStatus &&
                    Object.keys(groupedEvents).includes(
                        ownerAttendee.responseStatus
                    )
                ) {
                    groupedEvents[
                        ownerAttendee.responseStatus as ResponseStatus
                    ].push(filteredEventData);
                } else {
                    groupedEvents.noStatus.push(filteredEventData);
                }
            });

            return groupedEvents;
        } catch (error: any) {
            throw new Error(
                `Error retrieving owner's events by response status: ${error.message}`
            );
        }
    }

    async getUserEvents(
        clientEmail: string
    ): Promise<calendar_v3.Schema$Event[]> {
        try {
            const response = await this.calendar.events.list({
                calendarId: process.env.OWNER_CALENDAR_ID!,
                q: clientEmail,
                maxResults: 50,
                singleEvents: true,
                orderBy: "startTime",
            });

            const events = response.data.items;

            if (!events || events.length === 0) return [];

            return events.filter((event) => {
                const attendees = event.attendees || [];
                return attendees.some(
                    (attendee) => attendee.email === clientEmail
                );
            });
        } catch (error: any) {
            throw new Error(
                `Error retrieving user events from Google API: ${error.message}`
            );
        }
    }

    async getTokensFromRedis(): Promise<Credentials> {
        const tokensString = await this.redisClient.get("owner_tokens");
        if (!tokensString) {
            throw new Error("No tokens found in Redis.");
        }
        const tokens: Credentials = JSON.parse(tokensString);
        if (!("refresh_token" in tokens)) {
            throw new Error("Refresg token missing in Credentials.");
        }
        return tokens;
    }

    async saveTokensToRedis(tokens: Credentials): Promise<void> {
        await this.redisClient.set("owner_tokens", JSON.stringify(tokens));
    }
}
