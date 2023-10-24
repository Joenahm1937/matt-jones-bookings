"use client";
import { RefObject, useEffect, useRef, useState } from "react";
import {
    Section1,
    Section2,
    Section3,
    Section4,
} from "./Components/HomeSections";
import classNames from "classnames";

// Images should go from opacity-0 to opacity-100 and text fall into place (y)

export default function Home() {
    const [isPageVisible, setPageVisible] = useState(false);
    const sectionRefs = [
        useRef<HTMLDivElement>(null),
        useRef<HTMLDivElement>(null),
        useRef<HTMLDivElement>(null),
        useRef<HTMLDivElement>(null),
    ];

    const scrollTo = (section: RefObject<HTMLDivElement>) => {
        section.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        setTimeout(() => setPageVisible(true), 400);
    }, []);

    return (
        <div
            className={classNames(
                "home-section-container transition-opacity duration-500 ease-linear",
                {
                    "opacity-100": isPageVisible,
                    "opacity-0": !isPageVisible,
                },
            )}
        >
            <div ref={sectionRefs[0]}>
                <Section1 scrollTo={scrollTo} goToSectionRef={sectionRefs[1]} />
            </div>
            <div ref={sectionRefs[1]}>
                <Section2 scrollTo={scrollTo} goToSectionRef={sectionRefs[2]} />
            </div>
            <div ref={sectionRefs[2]}>
                <Section3 scrollTo={scrollTo} goToSectionRef={sectionRefs[3]} />
            </div>
            <div ref={sectionRefs[3]}>
                <Section4 />
            </div>
        </div>
    );
}
