import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import { Footer } from "../Footer";

gsap.registerPlugin(ScrollTrigger);

export default function Section4() {
    const contentRef = useRef<HTMLDivElement>(null);

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
                    end: "bottom 0",
                    toggleActions: "play none none none",
                },
            },
        );
    }, []);

    return (
        <div className="home-section relative flex h-screen w-full flex-col">
            <div className="flex h-screen w-full items-center justify-center">
                <div ref={contentRef} className="flex-grow ">
                    <h2 className="relative z-10 text-center text-[5rem] font-bold text-white">
                        Lorem Ipsum
                    </h2>
                </div>
            </div>
            <Footer />
        </div>
    );
}
