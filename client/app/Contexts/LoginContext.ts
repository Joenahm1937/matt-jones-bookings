import { createContext, useContext } from "react";

type LoginContextType = {
    isLoggedIn: boolean;
    login: () => void;
    logout: () => void;
};

export const LoginContext = createContext<LoginContextType | undefined>(
    undefined,
);

export function useLogin() {
    const context = useContext(LoginContext);
    if (!context) {
        throw new Error(
            "useLogin must be used within a Login Context Provider",
        );
    }
    return context;
}
