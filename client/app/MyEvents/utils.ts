import { calendar_v3 } from "googleapis";
import { SERVER_URL } from "../Constants";
import { InsertEventRequest } from "@backendTypes/index";

export const fetchEvents = async () => {
    const response = await fetch(`${SERVER_URL}/protected/userEvents`, {
        credentials: "include",
    });
    if (!response.ok) {
        throw new Error("Network response was not ok");
    }
    return response.json();
};

export const updateEvent = async (
    eventId: string,
    updatedEventDetails: InsertEventRequest,
) => {
    const response = await fetch(
        `${SERVER_URL}/protected/updateEvent/${eventId}`,
        {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(updatedEventDetails),
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
