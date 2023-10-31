import { Dispatch, SetStateAction, createContext, useContext } from "react";

type PageContextType = {
    pageVisible: boolean;
    setPageVisible: Dispatch<SetStateAction<boolean>>;
};

export const PageContext = createContext<PageContextType | undefined>(
    undefined,
);

/**
 * Custom hook to control a self-managed loading state.
 * Without managing our own loading state, nextJS will only render loading component when loading.tsx renders,
 * which does not happen immediately upon navigating to a new page.
 * We want the spinner to immediately render when clicking on a nav link.
 * Similar issue: https://github.com/vercel/next.js/issues/43548
 */
export function usePageContext() {
    const context = useContext(PageContext);
    if (!context) {
        throw new Error(
            "usePageContext must be used within a Loading Context Provider",
        );
    }
    return context;
}
