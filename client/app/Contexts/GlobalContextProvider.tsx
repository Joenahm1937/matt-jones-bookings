"use client";
import { useEffect, useState, ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import { LoginContext } from "./LoginContext";
import { StylesContext } from "./StylesContext";
import { GetLoginStatusResponse } from "@backendTypes/index";
import { CLIENT_URL, SERVER_URL } from "@/app/constants";

const queryClient = new QueryClient();

interface IGlobalProvider {
    children: ReactNode;
}

export default function GlobalContextProvider({ children }: IGlobalProvider) {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [navHeight, setNavHeight] = useState("0");

    const login = async () => {
        setTimeout(() => {
            window.location.href = `${SERVER_URL}/auth/login`;
        }, 500);
    };

    const logout = async () => {
        await fetch(`${SERVER_URL}/auth/logout`, {
            credentials: "include",
        });
        setTimeout(() => (window.location.href = `${CLIENT_URL}`), 1000);
    };

    useEffect(() => {
        const syncLoginStatus = async () => {
            const response = await fetch(`${SERVER_URL}/auth/isLoggedIn`, {
                credentials: "include",
            });
            const { loggedIn }: GetLoginStatusResponse = await response.json();
            setIsLoggedIn(loggedIn);
        };

        syncLoginStatus();
    }, []);

    return (
        <QueryClientProvider client={queryClient}>
            <LoginContext.Provider value={{ isLoggedIn, login, logout }}>
                <StylesContext.Provider value={{ navHeight, setNavHeight }}>
                    {children}
                </StylesContext.Provider>
            </LoginContext.Provider>
        </QueryClientProvider>
    );
}
