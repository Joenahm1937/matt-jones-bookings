import { format } from "date-fns";
import { DateRange } from "react-day-picker";
import { IUserSelection } from "./interfaces";

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
        userSelection.formattedDates = `${format(from, "PPP")} - ${format(
            to,
            "PPP",
        )}`;
        userSelection.formattedDateCount = `${
            to.getDate() - from.getDate() + 1
        } day event`;
    }

    return userSelection;
};

export { conveyUserSelection };
