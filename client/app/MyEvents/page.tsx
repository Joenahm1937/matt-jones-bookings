"use client";
import { useEffect, useState } from "react";
import { calendar_v3 } from "googleapis";
import { GetUserEventsResponse } from "@backendTypes/index";
import classNames from "classnames";
import { fetchEvents } from "./utils";

export default function MyEvents() {
    const [isPageVisible, setPageVisible] = useState(false);
    const [events, setEvents] = useState<GetUserEventsResponse>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const getUserEvents = async () => {
            try {
                const response: GetUserEventsResponse = await fetchEvents();
                setEvents(response);
                setPageVisible(true);
            } catch (error) {
                console.error("Failed to fetch events:", error);
                setError("Failed to fetch events");
            }
        };
        getUserEvents();
    }, []);

    return (
        <div
            className={classNames(
                "flex h-screen w-full items-center justify-center transition-opacity delay-200 duration-500 ease-in",
                {
                    "opacity-100": isPageVisible,
                    "opacity-0": !isPageVisible,
                },
            )}
        >
            {error ? (
                <p className="text-red-500">{error}</p>
            ) : (
                <div className="space-y-4">
                    {events.map((event) => (
                        <EventCard key={event.id} event={event} />
                    ))}
                </div>
            )}
        </div>
    );
}

interface IEventCardProps {
    event: calendar_v3.Schema$Event;
}

const EventCard = (props: IEventCardProps) => {
    const { event } = props;
    return (
        <div className="h-1/3 w-1/3 rounded-md bg-white p-4 shadow-md">
            <h3 className="text-lg font-semibold">{event.summary}</h3>
            <p className="text-sm text-gray-600">{event.location}</p>
            <div className="mt-2 text-sm">
                <p>Start Date: {event.start?.date}</p>
                <p>End Date: {event.end?.date}</p>
            </div>
        </div>
    );
};
