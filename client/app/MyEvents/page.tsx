"use client";
import { useEffect, useState } from "react";
import { calendar_v3 } from "googleapis";
import { GetUserEventsResponse } from "@backendTypes/index";
import classNames from "classnames";
import { fetchEvents } from "./utils";
import Link from "next/link";
import { updateEvent, deleteEvent } from "./utils";

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
                            <EventCard
                                event={event}
                                onUpdate={handleUpdate}
                                onDelete={handleDelete}
                            />
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
    onDelete: (eventId: string) => void;
    onUpdate: () => void;
}

const EventCard = (props: IEventCardProps) => {
    const { event, onDelete, onUpdate } = props;

    const handleUpdate = async () => {
        try {
            const updatedEventDetails: calendar_v3.Schema$Event = {
                summary: "Placeholder for Updated Event",
                location: "Updated Location",
                start: event.start,
                end: event.end,
            };

            await updateEvent(event.id!, updatedEventDetails);
            onUpdate();
        } catch (error) {
            console.error("Failed to update event:", error);
        }
    };

    const handleDelete = async () => {
        try {
            await deleteEvent(event.id!);
            onDelete(event.id!);
        } catch (error) {
            console.error("Failed to delete event:", error);
        }
    };

    return (
        <div className="flex h-full w-full flex-col rounded-md bg-white p-4 shadow-md">
            <h3 className="text-lg font-semibold">{event.summary}</h3>
            <p className="text-sm text-gray-600">{event.location}</p>
            <div className="mt-2 text-sm">
                <p>Start Date: {event.start?.date}</p>
                <p>End Date: {event.end?.date}</p>
            </div>
            <button
                className="mt-2 rounded-md bg-blue-500 py-2 text-white"
                onClick={handleUpdate}
            >
                Update Event
            </button>
            <button
                className="mt-2 rounded-md bg-red-500 py-2 text-white"
                onClick={handleDelete}
            >
                Delete Event
            </button>
        </div>
    );
};
