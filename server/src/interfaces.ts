import { calendar_v3 } from "googleapis";
import type { OAuth2Client } from 'google-auth-library';

export interface IEnvironmentVars {
    CLIENT_ID: string;
    CLIENT_SECRET: string;
    CLIENT_URL: string;
    PORT: string;
    SESSION_SECRET: string;
    OWNER_CALENDAR_ID: string;
    OWNER_AUTH_PASSPHRASE: string;
}

export interface User {
    oauth2Client: OAuth2Client;
    calendar: calendar_v3.Calendar;
}