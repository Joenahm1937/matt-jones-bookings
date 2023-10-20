"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { SERVER_URL } from "./Constants";
import { GetLoginStatusResponse } from "@backendTypes/index";

type LoginContextType = {
    isLoggedIn: boolean;
    login: () => void;
    logout: () => void;
};

const LoginContext = createContext<LoginContextType | undefined>(undefined);

interface IGlobalProvider {
    children: any;
}

export const GlobalProvider = ({ children }: IGlobalProvider) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const login = async () => {
        setTimeout(() => {
            window.location.href = `${SERVER_URL}/auth/login`;
        }, 500);
    };

    const logout = async () => {
        await fetch(`${SERVER_URL}/auth/logout`, {
            credentials: "include",
        });
        setTimeout(() => setIsLoggedIn(false), 1000);
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
        <LoginContext.Provider value={{ isLoggedIn, login, logout }}>
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
