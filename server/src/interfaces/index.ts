import { Session, SessionData } from "express-session";
import { Credentials } from "google-auth-library";
import { calendar_v3 } from "googleapis";

export interface UserInfo {
    email: string;
    userTokens: Credentials;
    redirectTo?: string;
}

interface CustomSessionData extends SessionData {
    email: string;
    userTokens: Credentials;
    redirectTo?: string;
}

type AuthenticatedSession = CustomSessionData & Session;

export interface AuthenticatedRequest extends Request {
    session: AuthenticatedSession;
}

export type Attendee = {
    email: string;
};

export interface EventRequest {
    summary: string;
    location: string;
    start: calendar_v3.Schema$EventDateTime;
    end: calendar_v3.Schema$EventDateTime;
    attendees?: Attendee[];
}

export interface EventResponse {
    summary?: string;
    start?: calendar_v3.Schema$EventDateTime;
    end?: calendar_v3.Schema$EventDateTime;
}
