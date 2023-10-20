"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { SERVER_URL } from "./Constants";
import { GetLoginStatusResponse } from "@backendTypes/index";

type LoginContextType = {
    isLoggedIn: boolean;
    logout: () => void;
};

const LoginContext = createContext<LoginContextType | undefined>(undefined);

interface IGlobalProvider {
    children: any;
}

export const GlobalProvider = ({ children }: IGlobalProvider) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false); // Initial state can be fetched from local storage or cookies

    const logout = async () => {
        await fetch(`${SERVER_URL}/auth/logout`, {
            credentials: "include",
        });
        setIsLoggedIn(false);
    };

    useEffect(() => {
        const simulateLoading = async () => {
            const response = await fetch(`${SERVER_URL}/auth/isLoggedIn`, {
                credentials: "include",
            });
            const { loggedIn }: GetLoginStatusResponse = await response.json();
            setIsLoggedIn(loggedIn);
        };

        simulateLoading();
    }, []);

    return (
        <LoginContext.Provider value={{ isLoggedIn, logout }}>
            {children}
        </LoginContext.Provider>
    );
};

export function useLogin() {
    const context = useContext(LoginContext);
    if (!context) {
        throw new Error(
            "useLogin must be used within a Login Context Provider",
        );
    }
    return context;
}
