"use client";
import { useEffect, useState } from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { conveyUserSelection, transformEvents } from "../utils";
import {
    IEventDates,
    IUserSelection,
    ICalendarProps,
    ICalendarHeaderProps,
} from "../Interfaces";
import { SERVER_URL } from "../../Constants";
import type { GetAllEventsResponse } from "@backendTypes/index";
import { useLogin } from "../../GlobalContext";
import { LoginButton } from "../../Components/LoginButtons";

export const Calendar = (props: ICalendarProps) => {
    const {
        range,
        handleRangeSelection,
        showForm,
        setShowForm,
        showDesktopView,
        setPageVisible,
    } = props;

    const [eventDates, setEventDates] = useState<IEventDates>({
        acceptedDates: [],
    });

    const { isLoggedIn } = useLogin();

    const fetchBusyDays = async () => {
        try {
            const response = await fetch(`${SERVER_URL}/public/blockedDays`);
            const data: GetAllEventsResponse = await response.json();
            const transformedData: IEventDates = transformEvents(data);
            setEventDates(transformedData);
            setPageVisible(true);
        } catch (error) {
            console.error("Error fetching events:", error);
        }
    };

    useEffect(() => {
        fetchBusyDays();
    }, []);

    const currentDate = new Date();
    const userSelection: IUserSelection = conveyUserSelection(range);
    const isDisabled = showForm || !range?.from || !range?.to;
    const css = `
        .rdp {
            --rdp-cell-size: ${showDesktopView ? "4rem" : "3rem"};
        }
    `;

    return (
        <>
            <div className="flex w-full justify-center">
                <CalendarHeader
                    showForm={showForm}
                    userSelection={userSelection}
                />
            </div>
            <div className="flex h-1/2 items-center justify-center">
                <>
                    <style>{css}</style>
                    <div className="rounded-3xl shadow-lg">
                        <DayPicker
                            mode="range"
                            selected={range}
                            disabled={eventDates.acceptedDates}
                            modifiersStyles={{
                                selected: { backgroundColor: "#82593e" },
                            }}
                            onSelect={handleRangeSelection}
                            captionLayout="dropdown-buttons"
                            max={6}
                            numberOfMonths={
                                showDesktopView && !showForm ? 2 : 1
                            }
                            pagedNavigation
                            defaultMonth={currentDate}
                            fromDate={currentDate}
                            toYear={currentDate.getFullYear() + 1}
                        />
                    </div>
                </>
            </div>
            {isLoggedIn ? (
                <button
                    className={`h-14 w-56 transform rounded-lg bg-[#82593e] px-4 py-2 text-white shadow-md transition-all duration-200 hover:bg-[#4e301d] hover:text-white focus:outline-none ${
                        isDisabled ? "scale-75 opacity-60" : " text-black"
                    }`}
                    disabled={isDisabled}
                    onClick={() => setShowForm(true)}
                >
                    Reserve
                </button>
            ) : (
                <LoginButton />
            )}
        </>
    );
};

const CalendarHeader = (props: ICalendarHeaderProps) => {
    const { showForm, userSelection } = props;
    return (
        <div className="ml-[8%] w-full sm:ml-[28%]">
            <div>
                <h1
                    className={`text-md ${
                        showForm ? "text-md" : "lg:text-2xl"
                    }`}
                >
                    {userSelection.formattedDates}
                </h1>
                <p className="md:text-md text-sm italic lg:text-lg">
                    {userSelection.formattedDateCount}
                </p>
            </div>
        </div>
    );
};
