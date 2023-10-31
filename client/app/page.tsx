"use client";
import { RefObject, useEffect, useRef } from "react";

import { useLoading } from "@/app/Contexts/LoadingContext";
import Section1 from "@/app/Home/Components/Section1";
import Section2 from "@/app/Home/Components/Section2";
import Section3 from "@/app/Home/Components/Section3";
import Section4 from "@/app/Home/Components/Section4";
import classNames from "classnames";

export default function Home() {
    const { pageVisible, setPageVisible } = useLoading();
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
    }, [setPageVisible]);

    return (
        <div
            className={classNames(
                "home-section-container transition-opacity duration-500 ease-linear",
                {
                    "opacity-100": pageVisible,
                    "opacity-0": !pageVisible,
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
