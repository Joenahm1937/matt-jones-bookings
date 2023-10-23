import { RefObject, useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import { FaChevronDown } from "react-icons/fa";

gsap.registerPlugin(ScrollTrigger);

interface ISectionProps {
    scrollTo?: (section: RefObject<HTMLDivElement>) => void;
    goToSectionRef?: RefObject<HTMLDivElement>;
}

export default function Section3(props: ISectionProps) {
    const { scrollTo, goToSectionRef } = props;
    const contentRef = useRef<HTMLDivElement>(null);
    const imageRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Animation for text content
        gsap.fromTo(
            contentRef.current,
            {
                autoAlpha: 0,
                y: -20,
            },
            {
                y: 0,
                autoAlpha: 1,
                duration: 2,
                scrollTrigger: {
                    once: true,
                    scroller: ".home-section-container",
                    trigger: contentRef.current,
                    start: "top 100%",
                    end: "bottom 0%",
                    toggleActions: "play none restart reverse",
                },
            },
        );

        // Animation for background image
        gsap.fromTo(
            imageRef.current,
            {
                autoAlpha: 0, // Start with an opacity of 0
            },
            {
                autoAlpha: 1, // Animate to an opacity of 1
                duration: 0.4,
                scrollTrigger: {
                    once: true,
                    scroller: ".home-section-container",
                    trigger: contentRef.current,
                    start: "top 100%",
                    end: "bottom 0%",
                    toggleActions: "play none restart reverse",
                },
            },
        );
    }, []);

    return (
        <div className="home-section relative flex h-screen w-full flex-col items-center justify-center md:flex-row">
            <div
                ref={imageRef}
                className={`bg-image h-full w-full md:w-1/3 bg-cover bg-center bg-no-repeat transition-opacity duration-500 ease-in`}
                style={{ backgroundImage: `url('/wedding-photo-2.jpg')` }}
            ></div>
            <div ref={contentRef} className="content flex-grow min-h-[40%]">
                <h2 className="relative z-10 text-center text-[5rem] font-bold text-white">
                    Lorem Ipsum
                </h2>
            </div>
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
}
