import { OWNER_EMAIL } from "@/app/Constants";
import { Dialog } from "@headlessui/react";
import { calendar_v3 } from "googleapis";
import { useState, Fragment, Dispatch, SetStateAction } from "react";
import {
    updateEvent,
    deleteEvent,
    formatEventDate,
    getDateRange,
} from "../utils";
import { Form } from "@/app/Booking/Components/Form";
import { FaArrowLeft } from "react-icons/fa";

interface IEventCardProps {
    event: calendar_v3.Schema$Event;
    onDelete: (eventId: string) => void;
    onUpdate: () => void;
}

export default function EventCard(props: IEventCardProps) {
    const { event, onDelete, onUpdate } = props;

    const [isModalOpen, setModalOpen] = useState(false);

    const responseStatus = event.attendees?.filter(
        (attendee) => attendee.email === OWNER_EMAIL,
    )[0].responseStatus;

    return (
        <div
            onClick={() => setModalOpen(true)}
            style={{
                boxShadow:
                    "0 5px 10px rgba(0,0,0,0.2), 0 6px 20px rgba(0,0,0,0.19)",
            }}
            className={`flex h-full cursor-pointer flex-col justify-center gap-28 rounded-2xl ${
                responseStatus === "accepted"
                    ? "bg-slate-900"
                    : "bg-slate-400 opacity-50"
            } bg-opacity-90 p-6 transition-transform duration-300 hover:scale-105 md:gap-36`}
        >
            {responseStatus !== "accepted" && (
                <p className="text-center text-lg italic text-white">
                    Pending...
                </p>
            )}
            <h3 className="text-center text-3xl font-bold text-white">
                {event.summary}
            </h3>
            <p className="text-center text-lg italic text-white">
                {event.location}
            </p>
            <div className="mt-4 text-center text-white">
                <p className="text-lg">
                    {formatEventDate(event.start?.date as string)} -
                </p>
                <p className="text-lg">
                    {formatEventDate(event.end?.date as string)}
                </p>
            </div>

            <Dialog
                as="div"
                className="fixed inset-0 z-10 overflow-y-auto"
                open={isModalOpen}
                onClose={() => setModalOpen(false)}
            >
                <div className="flex min-h-screen items-center justify-center px-4 text-center">
                    <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-30" />

                    <Modal
                        event={event}
                        isModalOpen={isModalOpen}
                        onUpdate={onUpdate}
                        onDelete={onDelete}
                    />
                </div>
            </Dialog>
        </div>
    );
}

interface IModalProps {
    event: calendar_v3.Schema$Event;
    isModalOpen: boolean;
    onUpdate: () => void;
    onDelete: (eventId: string) => void;
}

const Modal = (props: IModalProps) => {
    const { event, onUpdate, onDelete } = props;

    const [isFormOpen, setFormOpen] = useState(false);

    const handleDelete = async () => {
        try {
            await deleteEvent(event.id!);
            onDelete(event.id!);
        } catch (error) {
            console.error("Failed to delete event:", error);
        }
    };

    return (
        <div
            className="w-full max-w-lg transform overflow-hidden rounded-2xl bg-white sm:p-10"
            style={{
                boxShadow:
                    "0 5px 10px rgba(0,0,0,0.2), 0 6px 20px rgba(0,0,0,0.19)",
            }}
        >
            {isFormOpen ? (
                <Form
                    range={getDateRange(event.start, event.end)}
                    initialData={{
                        summary: event.summary!,
                        description: event.description!,
                        location: event.location!,
                        attendees: event.attendees?.map((attendee) => ({
                            email: attendee.email!,
                        })),
                    }}
                    onBack={() => setFormOpen(false)}
                    showForm={isFormOpen}
                    isEmbedded={true}
                    mutationCallback={updateEvent}
                    eventId={event.id!}
                    onSuccess={() => {
                        onUpdate();
                    }}
                />
            ) : (
                <div>
                    <Dialog.Title className="border-b px-4 py-2 text-center text-xl font-medium text-black">
                        {event.summary}
                    </Dialog.Title>
                    <div className="p-4 text-center">
                        <p className="text-sm italic">
                            {formatEventDate(event.start?.date as string)} -{" "}
                            {formatEventDate(event.end?.date as string)}
                        </p>
                    </div>
                    <div className="p-4">
                        <p className="mb-4 text-center text-sm text-gray-600">
                            {event.location}
                        </p>
                        <p className="text-center">{event.description}</p>
                    </div>
                    {event.attendees && (
                        <div className="m-10 text-sm">
                            <h3 className="text-center text-lg font-semibold">
                                Attendees
                            </h3>
                            <ul className="mt-2 text-center">
                                {event.attendees?.map(
                                    (attendee, id) =>
                                        attendee.email !== OWNER_EMAIL && (
                                            <li key={id}>{attendee.email}</li>
                                        ),
                                )}
                            </ul>
                        </div>
                    )}
                    <div className="flex flex-col items-center gap-8">
                        <button
                            className="mt-2 rounded-3xl bg-[#626d47] p-8 py-2 text-white"
                            onClick={() => setFormOpen(true)}
                        >
                            Update Event
                        </button>
                        <button
                            className="mt-2 rounded-3xl bg-[#a03f3f] p-8 py-2 text-white"
                            onClick={handleDelete}
                        >
                            Delete Event
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};
