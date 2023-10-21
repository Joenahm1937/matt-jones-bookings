"use client";
import { useEffect, useRef, useState } from "react";
import { Calendar } from "./Components/Calendar";
import { useLoading } from "../template";
import { useGlobalStyles } from "../GlobalContext";

export default function Booking() {
    const [pageVisible, setPageVisible] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [showDesktopView, setShowDesktopView] = useState(false);
    const { loading } = useLoading();
    const { navHeight } = useGlobalStyles();
    const formRef = useRef<HTMLDivElement>(null);

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

    useEffect(() => {
        if (showForm && !showDesktopView && formRef.current) {
            formRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [showForm, showDesktopView]);

    return (
        <div
            className={`flex ${
                !showDesktopView && "flex-col"
            } w-full transition-opacity delay-200 duration-500 ease-in ${
                pageVisible ? "opacity-100" : "opacity-0"
            }`}
        >
            <div className="flex h-screen flex-grow flex-col items-center justify-center gap-10">
                <Calendar
                    showForm={showForm}
                    setShowForm={setShowForm}
                    showDesktopView={showDesktopView}
                />
            </div>

            <div
                ref={formRef}
                className={
                    showForm
                        ? `${
                              showDesktopView
                                  ? "transition-width w-1/2 overflow-hidden duration-700 ease-in-out"
                                  : "w-full"
                          }`
                        : "w-0"
                }
            >
                <div className={`h-full w-full bg-yellow-500`}>
                    <ReserveForm />
                </div>
            </div>
        </div>
    );
}

// ReserveForm.js
function ReserveForm() {
    return <div className="h-screen w-full bg-red-500"></div>;
}
