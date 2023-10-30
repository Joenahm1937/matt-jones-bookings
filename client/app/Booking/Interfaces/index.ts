import { InsertEventRequest } from "@backendTypes/index";
import { Dispatch, SetStateAction } from "react";
import { DateRange, SelectRangeEventHandler } from "react-day-picker";

export interface ISubmitForm {
    eventRequest: InsertEventRequest;
    eventId?: string;
}

export interface IFormProps {
    onBack: () => void;
    range?: DateRange;
    showForm: boolean;
    onSuccess: () => void;
    mutationCallback: (data: ISubmitForm) => Promise<any>;
    initialData?: Partial<InsertEventRequest>;
    isEmbedded?: boolean;
    eventId?: string;
}

export interface ICalendarProps {
    showForm: boolean;
    setShowForm: Dispatch<SetStateAction<boolean>>;
    showDesktopView: boolean;
    range?: DateRange;
    handleRangeSelection: SelectRangeEventHandler;
    setPageVisible: Dispatch<SetStateAction<boolean>>;
}

export interface IUserSelection {
    formattedDates?: string;
    formattedDateCount?: string;
}

export interface IEventDates {
    acceptedDates: Date[];
}

export interface ICalendarHeaderProps {
    userSelection: IUserSelection;
    showForm: boolean;
}
