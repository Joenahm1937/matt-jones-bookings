import { RefObject, useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import { FaChevronDown } from "react-icons/fa";
import { HOME_HEADER, HOME_SUBHEADER } from "../../Constants";
import { useLogin } from "../../GlobalContext";

gsap.registerPlugin(ScrollTrigger);

interface ISectionProps {
    scrollTo?: (section: RefObject<HTMLDivElement>) => void;
    goToSectionRef?: RefObject<HTMLDivElement>;
}

export default function Section1(props: ISectionProps) {
    const { scrollTo, goToSectionRef } = props;
    const contentRef = useRef<HTMLDivElement>(null);

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
                delay: 0.8,
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
    }, []);

    return (
        <div className="home-section relative flex h-screen w-full items-center justify-center">
            <div
                className="h-full w-full bg-cover bg-center bg-no-repeat"
                style={{ backgroundImage: `url('/backgroundImage.jpg')` }}
            ></div>
            <div
                ref={contentRef}
                className="absolute top-0 flex h-full w-full items-center justify-center bg-black bg-opacity-10 p-8"
            >
                <ContentOverlay />
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

const ContentOverlay: React.FC = () => {
    const { isLoggedIn } = useLogin();
    return (
        <div className="space-y-10 text-left text-white xl:space-y-44">
            <div className="space-y-4 xl:space-y-8">
                <h1 className="p-2 text-5xl font-bold xl:text-6xl">
                    {HOME_HEADER}
                </h1>
                <p className="text-xl xl:text-3xl">{HOME_SUBHEADER}</p>
            </div>
            <button className="rounded-full bg-slate-500 px-14 py-4 text-white shadow-md transition-all duration-200 hover:bg-slate-600 hover:text-white  active:translate-x-0.5 active:translate-y-0.5 active:bg-gray-800 active:shadow-inner">
                {isLoggedIn ? "Book Now" : "Login"}
            </button>
        </div>
    );
};
