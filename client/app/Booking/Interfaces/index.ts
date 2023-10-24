import { Dispatch, SetStateAction } from "react";
import { DateRange, SelectRangeEventHandler } from "react-day-picker";

export interface IFormProps {
    onBack: () => void;
    range?: DateRange;
    showForm: boolean;
}

export interface ICalendarProps {
    showForm: boolean;
    setShowForm: Dispatch<SetStateAction<boolean>>;
    showDesktopView: boolean;
    range?: DateRange;
    handleRangeSelection: SelectRangeEventHandler;
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
