import { Dispatch, SetStateAction, createContext, useContext } from "react";

type LoadingContextType = {
    loading: boolean;
    setLoading: Dispatch<SetStateAction<boolean>>;
    pageVisible: boolean;
    setPageVisible: Dispatch<SetStateAction<boolean>>;
};

export const LoadingContext = createContext<LoadingContextType | undefined>(
    undefined,
);

/**
 * Custom hook to control a self-managed loading state.
 * Without managing our own loading state, nextJS will only render loading component when loading.tsx renders,
 * which does not happen immediately upon navigating to a new page.
 * We want the spinner to immediately render when clicking on a nav link.
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
