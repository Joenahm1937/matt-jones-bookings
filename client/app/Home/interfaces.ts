import { RefObject } from "react";

export interface ISectionProps {
    scrollTo?: (section: RefObject<HTMLDivElement>) => void;
    goToSectionRef?: RefObject<HTMLDivElement>;
}

export interface AuthButtonProps {
    action: "login" | "logout";
    initialText: string;
    inProgressText: string;
}
