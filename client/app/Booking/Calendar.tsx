"use client";
import { useEffect, useState } from "react";
import {
    DateRange,
    DayPicker,
    SelectRangeEventHandler,
} from "react-day-picker";
import "react-day-picker/dist/style.css";
import "./day-picker.css";
import { conveyUserSelection } from "./utils";
import { IUserSelection } from "./interfaces";
import { ResponseData } from "./calendar/route";

export default function Booking() {
    const [range, setRange] = useState<DateRange | undefined>();
    const [disabledDays, setDisabledDays] = useState<(Date | DateRange)[]>([]);
    const [showDesktopView, setShowDesktopView] = useState(
        window.matchMedia("(min-width: 1280px)").matches,
    );

    const handleRangeSelection: SelectRangeEventHandler = (
        selectedRange: DateRange | undefined,
    ) => {
        if (
            selectedRange?.to &&
            selectedRange?.from &&
            selectedRange?.to < selectedRange?.from
        ) {
            const orderedRange: DateRange = {
                from: selectedRange?.to,
                to: selectedRange?.from,
            };
            setRange(orderedRange);
        } else {
            setRange(selectedRange);
        }
    };

    const handleMediaChange = (e: MediaQueryListEvent) => {
        setShowDesktopView(e.matches);
    };

    const handleClickReserve = () => {
        console.log(range);
    };

    const fetchBusyDays = async () => {
        try {
            const response = await fetch("/Booking/calendar");
            if (!response.ok) {
                throw new Error("Failed to fetch events");
            }
            const data: ResponseData = await response.json();
            const hydratedData = data.busyDates.map((date) => {
                if (typeof date === "string") {
                    return new Date(date);
                } else {
                    const { from, to } = date as DateRange;
                    return {
                        from: from && new Date(from),
                        to: to && new Date(to),
                    };
                }
            });
            setDisabledDays(hydratedData);
        } catch (error) {
            console.error("Error fetching events:", error);
        }
    };

    useEffect(() => {
        fetchBusyDays();
        const mediaQuery = window.matchMedia("(min-width: 1024px)"); // Tailwind's xl breakpoint
        mediaQuery.addEventListener("change", handleMediaChange);

        return () => {
            mediaQuery.removeEventListener("change", handleMediaChange);
        };
    }, []);

    const currentDate = new Date();
    const userSelection: IUserSelection = conveyUserSelection(range);

    const isDisabled = !range?.from || !range?.to;

    return (
        <>
            <div className="flex w-full justify-center">
                <div className="flex w-9/12 flex-col items-start md:w-3/5 lg:pl-20 xl:w-1/2">
                    <div>
                        <h1 className="text-md md:text-xl lg:text-2xl">
                            {userSelection.formattedDates}
                        </h1>
                        <p className="md:text-md text-sm italic lg:text-lg">
                            {userSelection.formattedDateCount}
                        </p>
                    </div>
                </div>
            </div>
            <div className="flex h-1/2 w-full items-center justify-center">
                <DayPicker
                    mode="range"
                    selected={range}
                    disabled={disabledDays}
                    onSelect={handleRangeSelection}
                    captionLayout="dropdown-buttons"
                    max={6}
                    numberOfMonths={showDesktopView ? 2 : 1}
                    pagedNavigation
                    defaultMonth={currentDate}
                    fromDate={currentDate}
                    toYear={currentDate.getFullYear() + 1}
                />
            </div>
            <button
                className={`h-14 w-56 transform rounded-lg px-4 py-2 shadow-md transition-all duration-200 hover:bg-black hover:text-white focus:outline-none ${
                    isDisabled
                        ? "bg-gray-300 opacity-60 scale-75"
                        : "bg-white text-black"
                }`}
                disabled={isDisabled}
                onClick={handleClickReserve}
            >
                Reserve
            </button>
        </>
    );
}