"use client";
import {
    Dispatch,
    SetStateAction,
    createContext,
    useContext,
    useEffect,
    useState,
} from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import { CLIENT_URL, SERVER_URL } from "./Constants";
import { GetLoginStatusResponse } from "@backendTypes/index";

type LoginContextType = {
    isLoggedIn: boolean;
    login: () => void;
    logout: () => void;
};

type StylesContextType = {
    navHeight: string;
    setNavHeight: Dispatch<SetStateAction<string>>;
};

const LoginContext = createContext<LoginContextType | undefined>(undefined);
const StylesContext = createContext<StylesContextType | undefined>(undefined);
const queryClient = new QueryClient();

interface IGlobalProvider {
    children: any;
}

export const GlobalProvider = ({ children }: IGlobalProvider) => {
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
        setTimeout(
            () => (window.location.href = `${CLIENT_URL}`),
            1000,
        );
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

export function useGlobalStyles() {
    const context = useContext(StylesContext);
    if (!context) {
        throw new Error(
            "useGlobalStyles must be used within a Styles Context Provider",
        );
    }
    return context;
}
