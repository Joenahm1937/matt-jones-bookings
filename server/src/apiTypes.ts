export interface IAuthURLResponse {
    url: string;
}

export interface IClientEventAddedResponse {
    data: string[];
}

/**
 * Only supporting PST, MST, CST, EST
 */
type TimeZone =
    | "America/Los_Angeles"
    | "America/Denver"
    | "America/Chicago"
    | "America/New_York";

/**
 * Use "date" for all-day events (2023-09-21)
 * Use "dateTime" for timed events (2023-09-21T00:00:00-07:00)
 */
type DateOrDateTime =
    | { kind: "date"; date: string; timeZone: TimeZone }
    | { kind: "dateTime"; dateTime: string; timeZone: TimeZone };

export type Attendees = {
    email: string;
};

export interface IMyEventAddedRequest {
    summary: string;
    location: string;
    start: DateOrDateTime;
    end: DateOrDateTime;
    attendees: Attendees[];
}

export interface IMyEventAddedResponse {
    data: string[];
}

export interface IMyEventsResponse {
    summary: string;
    start: {
        dateTime: string;
        timeZone: string;
    };
    end: {
        dateTime: string;
        timeZone: string;
    };
    attendees: [
        {
            email: string;
            organizer: boolean;
            self: boolean;
            responseStatus:
                | "needsAction"
                | "declined"
                | "tentative"
                | "accepted";
        }
    ];
}

export interface IGoogleAPICalendarEvents {
    kind: string;
    etag: string;
    id: string;
    status: string;
    htmlLink: string;
    created: string;
    updated: string;
    summary: string;
    creator: {
        email: string;
        self: boolean;
    };
    organizer: {
        email: string;
        self: boolean;
    };
    start: {
        dateTime: string;
        timeZone: string;
    };
    end: {
        dateTime: string;
        timeZone: string;
    };
    iCalUID: string;
    sequence: number;
    reminders: {
        useDefault: boolean;
    };
    eventType: string;
    attendees: [
        {
            email: string;
            organizer: boolean;
            self: boolean;
            responseStatus:
                | "needsAction"
                | "declined"
                | "tentative"
                | "accepted";
        }
    ];
}
