import { calendar_v3 } from "googleapis";
import { SERVER_URL } from "../Constants";
import { format, parseISO } from "date-fns";
import { DateRange } from "react-day-picker";
import { ISubmitForm } from "../Booking/Interfaces";

export const fetchEvents = async () => {
    const response = await fetch(`${SERVER_URL}/protected/userEvents`, {
        credentials: "include",
    });
    if (!response.ok) {
        throw new Error("Network response was not ok");
    }
    return response.json();
};

export const updateEvent = async ({ eventRequest, eventId }: ISubmitForm) => {
    const response = await fetch(
        `${SERVER_URL}/protected/updateEvent/${eventId}`,
        {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(eventRequest),
            credentials: "include",
        },
    );

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json() as Promise<calendar_v3.Schema$Event>;
};

export const deleteEvent = async (eventId: string) => {
    const response = await fetch(
        `${SERVER_URL}/protected/deleteEvent/${eventId}`,
        {
            method: "DELETE",
            credentials: "include",
        },
    );

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.text();
};

export const formatEventDate = (dateString: string) => {
    if (!dateString) return "TBA";
    const date = parseISO(dateString);
    return format(date, "PPPP");
};

function getDateFromEventDateTime(
    eventDateTime?: calendar_v3.Schema$EventDateTime,
): Date | undefined {
    if (!eventDateTime) return undefined;

    const { date, dateTime, timeZone } = eventDateTime;

    if (date) {
        return new Date(date);
    }

    if (dateTime) {
        return timeZone
            ? new Date(dateTime + " " + timeZone)
            : new Date(dateTime);
    }

    return undefined;
}

export function getDateRange(
    start?: calendar_v3.Schema$EventDateTime,
    end?: calendar_v3.Schema$EventDateTime,
): DateRange {
    return {
        from: getDateFromEventDateTime(start),
        to: getDateFromEventDateTime(end),
    };
}
