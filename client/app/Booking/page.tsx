"use client";
import { useEffect, useState } from "react";
import { Calendar } from "./Components/Calendar";
import { useLoading } from "../template";
import { useGlobalStyles } from "../GlobalContext";

export default function Booking() {
    const [pageVisible, setPageVisible] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [showDesktopView, setShowDesktopView] = useState(false);
    const { loading } = useLoading();
    const { navHeight } = useGlobalStyles();

    const handleMediaChange = (e: MediaQueryListEvent) => {
        setShowDesktopView(e.matches);
    };

    useEffect(() => {
        const isDesktop = window.matchMedia("(min-width: 1280px)").matches;
        setShowDesktopView(isDesktop);
        setPageVisible(true);
        const mediaQuery = window.matchMedia("(min-width: 1024px)"); // Tailwind's xl breakpoint
        mediaQuery.addEventListener("change", handleMediaChange);

        return () => {
            mediaQuery.removeEventListener("change", handleMediaChange);
        };
    }, [loading]);

    return (
        <div
            className={`flex h-screen w-full items-center justify-center transition-opacity delay-200 duration-500 ease-in ${
                pageVisible ? "opacity-100" : "opacity-0"
            }`}
        >
            <div className="flex h-full flex-grow flex-col items-center justify-center gap-10">
                <Calendar
                    showForm={showForm}
                    setShowForm={setShowForm}
                    showDesktopView={showDesktopView}
                />
            </div>
            {showForm && showDesktopView && (
                <div className="h-full w-1/2">
                    <div
                        className={`h-full w-full bg-red-500 transition-all duration-300 pt-[${navHeight}]`}
                    >
                        <ReserveForm />
                    </div>
                </div>
            )}
        </div>
    );
}

// ReserveForm.js
function ReserveForm() {
    return <div className="h-full w-full bg-yellow-500"></div>;
}
