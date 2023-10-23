import { Dispatch, SetStateAction } from "react";
import { DateRange } from "react-day-picker";

export interface IFormProps {
    onBack: () => void;
    showForm: boolean;
}

export interface ICalendarProps {
    showForm: boolean;
    setShowForm: Dispatch<SetStateAction<boolean>>;
    showDesktopView: boolean;
}

export interface IUserSelection {
    formattedDates?: string;
    formattedDateCount?: string;
}

export interface IEventDates {
    acceptedDates: DateRange[];
    pendingDates: DateRange[];
}

export interface ICalendarHeaderProps {
    userSelection: IUserSelection;
    showForm: boolean;
}
