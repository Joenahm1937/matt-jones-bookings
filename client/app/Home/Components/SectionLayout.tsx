import React, { RefObject, ReactNode } from "react";
import { FaChevronDown } from "react-icons/fa";

interface SectionLayoutProps {
    children: ReactNode;
    scrollTo?: (section: RefObject<HTMLDivElement>) => void;
    goToSectionRef?: RefObject<HTMLDivElement>;
    containerStyles?: string;
}

export const SectionLayout: React.FC<SectionLayoutProps> = ({
    children,
    scrollTo,
    goToSectionRef,
    containerStyles,
}) => {
    return (
        <div
            className={`home-section relative flex h-screen w-full items-center justify-center ${containerStyles}`}
        >
            {children}
            {scrollTo && goToSectionRef && (
                <button
                    onClick={() => scrollTo(goToSectionRef)}
                    className="absolute bottom-10 m-auto text-3xl"
                >
                    <FaChevronDown size={24} />
                </button>
            )}
        </div>
    );
};
