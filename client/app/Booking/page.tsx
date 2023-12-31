"use client";

import { useEffect, useRef, useState } from "react";
import { Calendar } from "./Components/Calendar";
import { Form } from "./Components/Form";
import classNames from "classnames";
import { DateRange } from "react-day-picker";
import { insertEvent } from "./utils";
import { useRouter } from "next/navigation";
import { usePageVisible } from "@/app/Hooks/usePageVisible";

export default function Booking() {
    const MIN_WIDTH_DESKTOP = "1280px";
    const MIN_WIDTH_LARGE_SCREEN = "1024px";

    const [pageVisible, setPageVisible] = usePageVisible();
    const [isFormVisible, setIsFormVisible] = useState(false);
    const [isDesktopView, setIsDesktopView] = useState(false);
    const [range, setRange] = useState<DateRange | undefined>();
    const router = useRouter();

    const onFormSucess = () => {
        router.push("/MyEvents");
    };

    const formRef = useRef<HTMLDivElement>(null);

    const handleRangeSelection = (selectedRange: DateRange | undefined) => {
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
        setIsFormVisible(false);
    };

    const handleBack = () => {
        window.scrollTo(0, 0);
        setIsFormVisible(false);
    };

    const handleMediaChange = (e: MediaQueryListEvent) => {
        setIsDesktopView(e.matches);
    };

    useEffect(() => {
        window.scrollTo(0, 0);
        const isDesktop = window.matchMedia(
            `(min-width: ${MIN_WIDTH_DESKTOP})`,
        ).matches;
        setIsDesktopView(isDesktop);

        const mediaQuery = window.matchMedia(
            `(min-width: ${MIN_WIDTH_LARGE_SCREEN})`,
        );
        mediaQuery.addEventListener("change", handleMediaChange);

        return () => {
            mediaQuery.removeEventListener("change", handleMediaChange);
        };
    }, []);

    useEffect(() => {
        if (isFormVisible && !isDesktopView && formRef.current) {
            formRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [isFormVisible, isDesktopView]);

    return (
        <div
            className={classNames(
                "flex w-full transition-opacity delay-200 duration-500 ease-in",
                {
                    "flex-col": !isDesktopView,
                    "opacity-100": pageVisible,
                    "opacity-0": !pageVisible,
                },
            )}
        >
            <div className="flex h-screen flex-grow flex-col items-center justify-center gap-10">
                <Calendar
                    range={range}
                    handleRangeSelection={handleRangeSelection}
                    showForm={isFormVisible}
                    setShowForm={setIsFormVisible}
                    showDesktopView={isDesktopView}
                    setPageVisible={setPageVisible}
                />
            </div>

            <div
                ref={formRef}
                className={classNames({
                    "relative h-full shadow-md": isFormVisible,
                    "transition-width w-1/2 overflow-hidden duration-700 ease-in-out":
                        isFormVisible && isDesktopView,
                    "w-full": isFormVisible && !isDesktopView,
                    "w-0": !isFormVisible,
                })}
                style={{ boxShadow: "-4px 0 6px -2px rgba(0, 0, 0, 0.1)" }}
            >
                <div className="h-full w-full">
                    <Form
                        mutationCallback={insertEvent}
                        onSuccess={onFormSucess}
                        onBack={handleBack}
                        showForm={isFormVisible}
                        range={range}
                    />
                </div>
            </div>
        </div>
    );
}
