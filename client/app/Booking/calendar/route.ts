import { NextResponse } from "next/server";
import { google } from "googleapis";
import { DateRange } from "react-day-picker";
import type { SampleRequest } from "@backend/apiTypes";

export type ResponseData = {
    busyDates: (Date | DateRange)[];
};

export async function GET() {
    // if (req.method !== 'GET') {
    //     return res.status(405).end();
    // }

    // const oAuth2Client = new google.auth.OAuth2(
    //     process.env.GOOGLE_CLIENT_ID,
    //     process.env.GOOGLE_CLIENT_SECRET,
    //     'YOUR_REDIRECT_URL' // e.g., 'http://localhost:3000/api/calendar'
    // );

    // oAuth2Client.setCredentials({
    //     refresh_token: 'YOUR_REFRESH_TOKEN',
    // });

    // const calendar = google.calendar({ version: 'v3', auth: oAuth2Client });

    // try {
    //     const response = await calendar.events.list({
    //         calendarId: 'primary',
    //         timeMin: (new Date()).toISOString(),
    //         maxResults: 10,
    //         singleEvents: true,
    //         orderBy: 'startTime',
    //     });

    //     const events = response.data.items;

    //     return res.status(200).json(events);
    // } catch (error) {
    //     return res.status(500).send(error.message);
    // }
    const today = new Date();
    const mockDisabledDays = [
        today,
        {
            from: new Date(
                today.getFullYear(),
                today.getMonth(),
                today.getDate() + 5,
            ),
            to: new Date(
                today.getFullYear(),
                today.getMonth(),
                today.getDate() + 10,
            ),
        },
        {
            from: new Date(
                today.getFullYear(),
                today.getMonth(),
                today.getDate() + 16,
            ),
            to: new Date(
                today.getFullYear(),
                today.getMonth(),
                today.getDate() + 27,
            ),
        },
        new Date(
            today.getFullYear(),
            today.getMonth() + 2,
            today.getDate() + 3,
        ),
    ];

    const response: ResponseData = { busyDates: mockDisabledDays };
    return NextResponse.json(response);
}
