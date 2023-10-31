import { RefObject, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export const useAnimateOnScroll = (
    ref: RefObject<HTMLElement>,
    options: gsap.TweenVars,
    triggerOptions: ScrollTrigger.Vars = {},
) => {
    useEffect(() => {
        if (ref.current) {
            gsap.fromTo(
                ref.current,
                { autoAlpha: 0, y: 60, ...options?.from },
                {
                    y: 0,
                    autoAlpha: 1,
                    duration: 2,
                    scrollTrigger: {
                        once: true,
                        scroller: ".home-section-container",
                        trigger: ref.current,
                        start: "top 60%",
                        end: "bottom 0%",
                        toggleActions: "play none restart reverse",
                        ...triggerOptions,
                    },
                    ...options?.to,
                },
            );
        }
    }, []);
};
