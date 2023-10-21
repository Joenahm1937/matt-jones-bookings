"use client";
import { useEffect, useRef, useState } from "react";
import ScrollTrigger from "react-scroll-trigger";
import { useLogin } from "./GlobalContext";
import { IScrollSectionProps } from "./Interfaces";
import {
    Section1,
    Section2,
    Section3,
    Section4,
} from "./Components/HomeSections";

export default function Home() {
    const [section1Visible, setSection1Visible] = useState(false);
    const [section2Visible, setSection2Visible] = useState(false);
    const [section3Visible, setSection3Visible] = useState(false);
    const [section4Visible, setSection4Visible] = useState(false);
    const [backgroundVisible, setBackgroundVisible] = useState(false);
    const [currentSection, setCurrentSection] = useState(0);
    const sectionRefs = [
        useRef<HTMLDivElement>(null),
        useRef<HTMLDivElement>(null),
        useRef<HTMLDivElement>(null),
        useRef<HTMLDivElement>(null),
    ];
    let scrolling = false;

    const handleScroll = (event: WheelEvent) => {
        event.preventDefault();
        if (scrolling) return;
        scrolling = true;

        setCurrentSection((prev) => {
            if (event.deltaY > 0 && prev < 3) {
                // Scrolling down
                const targetSection = sectionRefs[prev + 1];
                if (targetSection && targetSection.current) {
                    targetSection.current.scrollIntoView({
                        behavior: "smooth",
                    });
                }
                return prev + 1;
            } else if (event.deltaY < 0 && prev > 0) {
                // Scrolling up
                const targetSection = sectionRefs[prev - 1];
                if (targetSection && targetSection.current) {
                    targetSection.current.scrollIntoView({
                        behavior: "smooth",
                    });
                }
                return prev - 1;
            }
            return prev;
        });

        // Prevent multiple rapid scrolls by setting a timeout
        setTimeout(() => {
            scrolling = false;
        }, 300);
    };

    const getInitialVisibleSection = () => {
        for (let i = 0; i < sectionRefs.length; i++) {
            const section = sectionRefs[i].current;
            if (section) {
                const rect = section.getBoundingClientRect();
                if (rect.top >= 0 && rect.bottom <= window.innerHeight) {
                    return i;
                }
            }
        }
        return 0;
    };

    const { isLoggedIn } = useLogin();

    useEffect(() => {
        setBackgroundVisible(true);
        setTimeout(() => {
            setCurrentSection(getInitialVisibleSection());
        }, 1000); // 10

        // Listen to scroll events
        window.addEventListener("wheel", handleScroll, { passive: false });

        return () => {
            // Cleanup listener
            window.removeEventListener("wheel", handleScroll);
        };
    }, [isLoggedIn]);

    return (
        <div>
            <ScrollSection onVisible={() => setSection1Visible(true)}>
                <Section1
                    reference={sectionRefs[0]}
                    backgroundVisible={backgroundVisible}
                    isVisible={section1Visible}
                    isLoggedIn={isLoggedIn}
                />
            </ScrollSection>
            <ScrollSection onVisible={() => setSection2Visible(true)}>
                <Section2
                    reference={sectionRefs[1]}
                    isVisible={section2Visible}
                />
            </ScrollSection>
            <ScrollSection onVisible={() => setSection3Visible(true)}>
                <Section3
                    reference={sectionRefs[2]}
                    isVisible={section3Visible}
                />
            </ScrollSection>
            <ScrollSection onVisible={() => setSection4Visible(true)}>
                <Section4
                    reference={sectionRefs[3]}
                    isVisible={section4Visible}
                />
            </ScrollSection>
        </div>
    );
}

const ScrollSection: React.FC<IScrollSectionProps> = ({
    onVisible,
    children,
}) => {
    return (
        /* @ts-ignore */
        <ScrollTrigger
            onProgress={(args) => {
                if (args && args.progress >= 0.25) {
                    onVisible();
                }
            }}
        >
            {children}
        </ScrollTrigger>
    );
};
