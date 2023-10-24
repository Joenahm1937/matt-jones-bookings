"use client";
import { useEffect, useState } from "react";
import { calendar_v3 } from "googleapis";
import { GetUserEventsResponse } from "@backendTypes/index";
import classNames from "classnames";
import { fetchEvents } from "./utils";
import Link from "next/link";

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
                "flex h-screen w-full transition-opacity delay-200 duration-500 ease-in",
                {
                    "opacity-100": isPageVisible,
                    "opacity-0": !isPageVisible,
                    "items-start justify-start": events.length > 0,
                    "items-center justify-center": events.length === 0,
                },
            )}
        >
            {error ? (
                <p className="text-red-500">{error}</p>
            ) : events.length > 0 ? (
                <div className="mx-4 my-24 grid h-screen w-full grid-cols-2 gap-10 overflow-y-auto md:grid-cols-3 ">
                    {events.map((event) => (
                        <div
                            key={event.id}
                            className="flex w-full items-start justify-center"
                        >
                            <EventCard event={event} />
                        </div>
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center gap-4">
                    <h1 className="text-2xl">No Events</h1>
                    <Link
                        href="/Booking"
                        className="rounded-md bg-stone-500 px-8 py-2 text-lg font-medium text-white"
                    >
                        Create an Event
                    </Link>
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
        <div className="flex h-full w-full flex-col rounded-md bg-white p-4 shadow-md">
            <h3 className="text-lg font-semibold">{event.summary}</h3>
            <p className="text-sm text-gray-600">{event.location}</p>
            <div className="mt-2 text-sm">
                <p>Start Date: {event.start?.date}</p>
                <p>End Date: {event.end?.date}</p>
            </div>
        </div>
    );
};
