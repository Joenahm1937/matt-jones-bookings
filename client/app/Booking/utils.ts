import { format } from "date-fns";
import { DateRange } from "react-day-picker";
import { IEventDates, IUserSelection } from "./Interfaces";
import type {
    GetAllEventsResponse,
    ScrubbedEventData,
} from "@backendTypes/index";

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
        const dayDifference = Math.floor((to.getTime() - from.getTime()) / (1000 * 60 * 60 * 24)) + 1;
        userSelection.formattedDates = `${format(from, "PPP")} - ${format(to, "PPP")}`;
        userSelection.formattedDateCount = `${dayDifference} day event`;
    }

    return userSelection;
};

const extractDatesFromRange = (eventArray: ScrubbedEventData[]) => {
    let dates: DateRange[] = [];

    eventArray.forEach((event) => {
        if (event.start?.date && event.end?.date) {
            const startDate = new Date(event.start.date);
            const endDate = new Date(event.end.date);
            dates.push({
                from: startDate,
                to: endDate,
            });
        }
    });

    return dates;
};

export const transformEvents = (
    eventsResponse: GetAllEventsResponse,
): IEventDates => {
    return {
        acceptedDates: extractDatesFromRange([
            ...eventsResponse.noStatus,
            ...eventsResponse.accepted,
        ]),
        pendingDates: extractDatesFromRange(eventsResponse.needsAction),
    };
};

export { conveyUserSelection };
