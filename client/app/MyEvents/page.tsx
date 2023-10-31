"use client";
import { useState, useEffect } from "react";
import { GetUserEventsResponse } from "@backendTypes/index";
import classNames from "classnames";
import { fetchEvents } from "./utils";
import Link from "next/link";
import EventCard from "./Components/EventCard";
import { usePageContext } from "../Contexts/PageContext";

export default function MyEvents() {
    const { pageVisible, setPageVisible } = usePageContext();
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

    const handleDelete = (eventId: string) => {
        setEvents(events.filter((event) => event.id !== eventId));
    };

    const handleUpdate = async () => {
        try {
            const updatedEvents = await fetchEvents();
            setEvents(updatedEvents);
        } catch (error) {
            console.error("Failed to fetch updated events:", error);
        }
    };

    return (
        <div
            className={classNames(
                "flex h-screen w-full transition-opacity delay-200 duration-500 ease-in",
                {
                    "opacity-100": pageVisible,
                    "opacity-0": !pageVisible,
                    "items-start justify-start": events.length > 0,
                    "items-center justify-center": events.length === 0,
                },
            )}
        >
            {error ? (
                <p className="text-red-500">{error}</p>
            ) : events.length > 0 ? (
                <div className="grid h-screen w-full grid-cols-1 gap-14 overflow-y-auto p-8 pt-32 sm:p-14 md:grid-cols-2 lg:p-32 2xl:grid-cols-3">
                    {events.map((event) => (
                        <EventCard
                            key={event.id}
                            event={event}
                            onUpdate={handleUpdate}
                            onDelete={handleDelete}
                        />
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
