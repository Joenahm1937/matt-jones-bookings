import { RefObject, useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import { FaChevronDown } from "react-icons/fa";

gsap.registerPlugin(ScrollTrigger);

interface ISectionProps {
    scrollTo?: (section: RefObject<HTMLDivElement>) => void;
    goToSectionRef?: RefObject<HTMLDivElement>;
}

export default function Section2(props: ISectionProps) {
    const { scrollTo, goToSectionRef } = props;
    const contentRef = useRef<HTMLDivElement>(null);
    const imageRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Animation for text content
        gsap.fromTo(
            contentRef.current,
            {
                autoAlpha: 0,
                y: 60,
            },
            {
                y: 0,
                autoAlpha: 1,
                duration: 2,
                scrollTrigger: {
                    once: true,
                    scroller: ".home-section-container",
                    trigger: contentRef.current,
                    start: "top 60%",
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
                    start: "top 60%",
                    end: "bottom 0%",
                    toggleActions: "play none restart reverse",
                },
            },
        );
    }, []);

    return (
        <div className="home-section relative flex h-screen w-full items-center justify-center">
            <div ref={contentRef} className="content flex-grow">
                <h2 className="relative z-10 text-center text-[3rem] font-bold text-white">
                    Lorem Ipsum
                </h2>
            </div>
            <div
                ref={imageRef}
                className={`bg-image h-full w-2/3 min-w-[60%] bg-cover bg-center bg-no-repeat transition-opacity duration-500 ease-in`}
                style={{ backgroundImage: `url('/wedding-photo-1.jpg')` }}
            ></div>
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
