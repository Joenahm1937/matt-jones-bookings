"use client";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { useLoading } from "../template";
// Uses window match query on first render so no SSR
const NonSSRCalendar = dynamic(() => import("./Components/Calendar"), {
    ssr: false,
});

export default function Booking() {
    const [pageVisible, setPageVisible] = useState(false);
    const { loading } = useLoading();

    useEffect(() => {
        console.log(pageVisible)
        setPageVisible(true);
    }, [loading]);

    return (
        <div
            className={`flex h-screen flex-col items-center justify-center gap-10 transition-opacity delay-200 duration-500 ease-in ${
                pageVisible ? "opacity-100" : "opacity-0"
            }`}
        >
            <NonSSRCalendar />
        </div>
    );
}
