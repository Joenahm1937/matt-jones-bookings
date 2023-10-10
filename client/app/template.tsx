"use client";
import { useState, useEffect, createContext, useContext } from "react";
import Spinner from "./Components/Spinner";
import NavBar from "./Components/NavBar";
import { SERVER_URL } from "./Constants";
import { GetLoginStatusResponse } from "@backendTypes/index";

type LoadingContextType = {
    loading: boolean;
    setLoading: React.Dispatch<React.SetStateAction<boolean>>;
};

type LoginContextType = {
    isLoggedIn: boolean;
    login: () => void;
    logout: () => void;
};

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);
const LoginContext = createContext<LoginContextType | undefined>(undefined);

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

export function useLogin() {
    const context = useContext(LoginContext);
    if (!context) {
        throw new Error(
            "useLogin must be used within a Login Context Provider",
        );
    }
    return context;
}

export default function Template({ children }: { children: React.ReactNode }) {
    const [loading, setLoading] = useState(false);
    const [isLoggedIn, setLoginStatus] = useState(false);

    const login = () => {
        // TODO: login logic
        setLoginStatus(true);
    };
    const logout = () => {
        // TODO: logout logic
        setLoginStatus(false);
    };

    useEffect(() => {
        const simulateLoading = async () => {
            setLoading(true);
            const response = await fetch(`${SERVER_URL}/auth/isLoggedIn`);
            const { loggedIn }: GetLoginStatusResponse = await response.json();
            setLoginStatus(loggedIn);
            setLoading(false);
        };

        simulateLoading();
    }, []);

    return (
        <LoginContext.Provider value={{ isLoggedIn, login, logout }}>
            <LoadingContext.Provider value={{ loading, setLoading }}>
                <NavBar />
                {loading ? <Spinner /> : children}
            </LoadingContext.Provider>
        </LoginContext.Provider>
    );
}
