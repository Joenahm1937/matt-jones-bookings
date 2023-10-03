import { DateRange } from "react-day-picker";

export interface IUserSelection {
    formattedDates?: string;
    formattedDateCount?: string;
}

export interface IEventDates {
    acceptedDates: DateRange[];
    pendingDates: DateRange[];
}
