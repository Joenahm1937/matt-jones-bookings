"use client";
import { useState } from "react";
import { LoadingContext } from "@/app/Contexts/LoadingContext";
import Spinner from "@/app/GlobalComponents/NavBar";
import NavBar from "@/app/GlobalComponents/NavBar";

/**
 * We are utilizing the LoadingContext in the template layer so state is reset to false upon re-render,
 * as opposed to GlobalContext which should act as a global store - https://nextjs.org/docs/app/building-your-application/routing/pages-and-layouts#templates
 */
export default function Template({ children }: { children: React.ReactNode }) {
    const [loading, setLoading] = useState(false);
    const [pageVisible, setPageVisible] = useState(false);

    return (
        <LoadingContext.Provider
            value={{ loading, setLoading, pageVisible, setPageVisible }}
        >
            <NavBar />
            {loading ? <Spinner /> : children}
        </LoadingContext.Provider>
    );
}
