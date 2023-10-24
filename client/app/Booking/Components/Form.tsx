import { FormEvent, useState } from "react";
import { useMutation } from "react-query";
import { useRouter } from "next/navigation";
import { insertEvent, validateEmail } from "../utils";
import { IFormProps } from "../Interfaces";
import { FaArrowLeft, FaTimes } from "react-icons/fa";
import { InsertEventRequest, Attendee } from "@backendTypes/index";
import { calendar_v3 } from "googleapis";
import Spinner from "@/app/Components/Spinner";

export const Form = (props: IFormProps) => {
    const { range, onBack, showForm } = props;
    const [formData, setFormData] = useState({
        summary: "",
        description: "",
        location: "",
        attendees: [] as Attendee[],
    });
    const [attendeeInput, setAttendeeInput] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    const router = useRouter();

    const mutation = useMutation(insertEvent, {
        onSuccess: () => {
            router.push("/MyEvents");
        },
        onError: (error) => {
            console.error("Error inserting event:", error);
            setErrorMessage("Failed to insert event. Please try again later.");
        },
    });

    const handleAttendeeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setAttendeeInput(e.target.value);
    };

    const handleDeleteAttendee = (emailToDelete: string) => {
        setFormData({
            ...formData,
            attendees: formData.attendees.filter(
                (attendee: Attendee) => attendee.email !== emailToDelete,
            ),
        });
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            e.preventDefault();
            if (validateEmail(attendeeInput)) {
                const currentAttendee: Attendee = {
                    email: attendeeInput,
                };

                setFormData((prevFormData) => {
                    const updatedAttendees = [
                        ...prevFormData.attendees,
                        currentAttendee,
                    ];
                    return {
                        ...prevFormData,
                        attendees: updatedAttendees,
                    };
                });

                setAttendeeInput("");
            } else {
                setErrorMessage("Invalid email address");
            }
        }
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setErrorMessage("");

        if (!range?.from || !range?.to) {
            console.error("Date range is incomplete");
            return;
        }

        // Formatting the date in "YYYY-MM-DD" format for all-day events
        const startDate = range.from.toISOString().split("T")[0];
        const endDate = range.to.toISOString().split("T")[0];

        const start: calendar_v3.Schema$EventDateTime = {
            date: startDate,
        };

        const end: calendar_v3.Schema$EventDateTime = {
            date: endDate,
        };

        const eventRequest: InsertEventRequest = {
            summary: formData.summary,
            description: formData.description,
            location: formData.location,
            attendees: formData.attendees,
            start,
            end,
        };
        console.log(eventRequest);

        mutation.mutate(eventRequest);
    };

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    return (
        <div
            className={`flex h-screen w-full flex-col ${
                !range && "items-center"
            } justify-center bg-white p-10 shadow-md`}
        >
            {showForm && (
                <button
                    type="button"
                    onClick={onBack}
                    className={`absolute left-0 top-14 m-5 rounded-full border border-gray-300 bg-white p-2`}
                >
                    <FaArrowLeft size={24} />
                </button>
            )}
            <h1 className="mb-5 text-2xl font-bold">
                {range ? "Reservation Form" : "Please Pick a Date Range"}
            </h1>
            {range && (
                <form onSubmit={handleSubmit}>
                    <div className="h-8">
                        {mutation.isLoading && <Spinner />}
                    </div>
                    <div className="mb-4">
                        <label
                            htmlFor="attendees"
                            className="block text-sm font-medium text-gray-700"
                        >
                            Attendees
                        </label>
                        <div className="mt-1 flex flex-wrap gap-2">
                            {formData.attendees.map((attendee, index) => (
                                <div
                                    key={index}
                                    className="flex items-center rounded bg-blue-100 px-2 py-1 text-sm"
                                >
                                    <span>{attendee.email}</span>
                                    <button
                                        type="button"
                                        onClick={() =>
                                            handleDeleteAttendee(attendee.email)
                                        }
                                        className="ml-2 text-red-500"
                                        aria-label={`Remove ${attendee.email}`}
                                    >
                                        <FaTimes size={12} />
                                    </button>
                                </div>
                            ))}
                            <input
                                type="text"
                                id="attendees"
                                value={attendeeInput}
                                onChange={handleAttendeeChange}
                                onKeyDown={handleKeyDown}
                                className="rounded-md border p-2"
                            />
                        </div>
                    </div>
                    <div className="mb-4">
                        <label
                            htmlFor="summary"
                            className="block text-sm font-medium text-gray-700"
                        >
                            Title
                        </label>
                        <input
                            type="text"
                            id="summary"
                            name="summary"
                            required
                            onChange={handleChange}
                            className="mt-1 w-full rounded-md border p-2"
                        />
                    </div>
                    <div className="mb-4">
                        <label
                            htmlFor="location"
                            className="block text-sm font-medium text-gray-700"
                        >
                            Location
                        </label>
                        <input
                            type="text"
                            id="location"
                            name="location"
                            required
                            onChange={handleChange}
                            className="mt-1 w-full rounded-md border p-2"
                        />
                    </div>
                    <div className="mb-4">
                        <label
                            htmlFor="description"
                            className="block text-sm font-medium text-gray-700"
                        >
                            Event Notes
                        </label>
                        <textarea
                            id="description"
                            name="description"
                            rows={4}
                            value={formData.description}
                            onChange={handleChange}
                            className="mt-1 w-full rounded-md border p-2"
                        ></textarea>
                    </div>
                    <button
                        type="submit"
                        className="mb-4 rounded-md bg-blue-500 px-4 py-2 text-white"
                    >
                        Submit
                    </button>
                    {errorMessage && (
                        <div className=" text-2xl text-red-500">
                            {errorMessage}
                        </div>
                    )}
                </form>
            )}
        </div>
    );
};
