import { parseISO, addDays, format } from "date-fns";
import { DateRange } from "react-day-picker";
import { IEventDates, IUserSelection } from "./Interfaces";
import type {
    GetAllEventsResponse,
    InsertEventRequest,
    ScrubbedEventData,
} from "@backendTypes/index";
import { SERVER_URL } from "../Constants";

const conveyUserSelection = (range: DateRange | undefined): IUserSelection => {
    const { from, to } = range || {};

    const userSelection: IUserSelection = {};

    if (!from && !to) {
        userSelection.formattedDates = "Select Dates";
        userSelection.formattedDateCount = "6 day event max";
    } else if (from && !to) {
        userSelection.formattedDates = `From ${format(from, "PPP")}`;
        userSelection.formattedDateCount = "Select your end date";
    } else if (from && to && from.toString() === to.toString()) {
        userSelection.formattedDates = `${format(from, "PPP")}`;
        userSelection.formattedDateCount = "Single Day Event";
    } else if (from && to) {
        const dayDifference =
            Math.floor(
                (to.getTime() - from.getTime()) / (1000 * 60 * 60 * 24),
            ) + 1;
        userSelection.formattedDates = `${format(from, "PPP")} - ${format(
            to,
            "PPP",
        )}`;
        userSelection.formattedDateCount = `${dayDifference} day event`;
    }

    return userSelection;
};

const extractDatesFromRange = (eventArray: ScrubbedEventData[]) => {
    let dates: Date[] = [];

    eventArray.forEach((event) => {
        if (event.start?.date && event.end?.date) {
            // Parse the dates as UTC
            const startDate = parseISO(event.start.date);
            const endDate = parseISO(event.end.date);

            // Iterate through the range of dates
            for (let d = startDate; d < endDate; d = addDays(d, 1)) {
                // Add each date to the array
                dates.push(d);
            }
        }
    });

    return dates;
};

export const transformEvents = (
    eventsResponse: GetAllEventsResponse,
): IEventDates => {
    return {
        acceptedDates: extractDatesFromRange(eventsResponse.bookedDays),
    };
};

export const insertEvent = async (eventRequest: InsertEventRequest) => {
    try {
        const response = await fetch(`${SERVER_URL}/protected/insertEvent`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(eventRequest),
            credentials: "include",
        });

        if (!response.ok) {
            throw new Error(
                "Network response was not ok " + response.statusText,
            );
        }

        return await response.json();
    } catch (error) {
        throw error;
    }
};

export { conveyUserSelection };
