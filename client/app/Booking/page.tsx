"use client";
import { useEffect, useRef, useState } from "react";
import { Calendar } from "./Components/Calendar";
import { Form } from "./Components/Form";
import { useLoading } from "../template";

export default function Booking() {
    const [pageVisible, setPageVisible] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [showDesktopView, setShowDesktopView] = useState(false);
    const { loading } = useLoading();
    const formRef = useRef<HTMLDivElement>(null);

    const handleBack = () => {
        window.scrollTo(0, 0);
        setShowForm(false);
    };

    const handleMediaChange = (e: MediaQueryListEvent) => {
        setShowDesktopView(e.matches);
    };

    useEffect(() => {
        window.scrollTo(0, 0);
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
                        ? `relative h-full shadow-md ${
                              showDesktopView
                                  ? "transition-width w-1/2 overflow-hidden duration-700 ease-in-out"
                                  : "w-full"
                          }`
                        : "w-0"
                }
                style={{ boxShadow: "-4px 0 6px -2px rgba(0, 0, 0, 0.1)" }}
            >
                <div className="h-full w-full">
                    <Form onBack={handleBack} showForm={showForm} />
                </div>
            </div>
        </div>
    );
}
