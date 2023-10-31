import { Dispatch, SetStateAction, createContext, useContext } from "react";

type StylesContextType = {
    navHeight: string;
    setNavHeight: Dispatch<SetStateAction<string>>;
};

export const StylesContext = createContext<StylesContextType | undefined>(
    undefined,
);

export function useGlobalStyles() {
    const context = useContext(StylesContext);
    if (!context) {
        throw new Error(
            "useGlobalStyles must be used within a Styles Context Provider",
        );
    }
    return context;
}
