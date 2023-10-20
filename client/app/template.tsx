"use client";
import { useState, createContext, useContext } from "react";
import Spinner from "./Components/Spinner";
import NavBar from "./Components/NavBar";

type LoadingContextType = {
    loading: boolean;
    setLoading: React.Dispatch<React.SetStateAction<boolean>>;
};
const LoadingContext = createContext<LoadingContextType | undefined>(undefined);


/**
 * Custom hook for using the loading state we're managing ourselves.
 * Without managing our own loading state, NextJS will only show Spinner
 * when loading.tsx renders, which does not happen immediately upon navigating to a new page.
 * Similar issue: https://github.com/vercel/next.js/issues/43548
 */
export function useLoading() {
    const context = useContext(LoadingContext);
    if (!context) {
        throw new Error(
            "useLoading must be used within a Loading Context Provider",
        );
    }
    return context;
}



export default function Template({ children }: { children: React.ReactNode }) {
    const [loading, setLoading] = useState(false);

    return (
            <LoadingContext.Provider value={{ loading, setLoading }}>
                <NavBar />
                {loading ? <Spinner /> : children}
            </LoadingContext.Provider>
    );
}
