"use client";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { NUM_CAROUSEL_IMAGES, CAROUSEL_INTERVAL_SECONDS } from "./constants";

export default function Carousel() {
    const [activeSlide, setActiveSlide] = useState(1);
    const [showAdjacentImages, setShowAdjacentImages] = useState(
        window.matchMedia("(min-width: 1280px)").matches,
    );
    let interval = useRef<NodeJS.Timeout | null>(null);

    const resetInterval = () => {
        if (interval.current) clearInterval(interval.current);
        interval.current = setInterval(
            handleNextClick,
            CAROUSEL_INTERVAL_SECONDS * 1000,
        );
    };

    const handlePrevClick = () => {
        setActiveSlide((prev) =>
            prev > 0 ? prev - 1 : NUM_CAROUSEL_IMAGES - 1,
        );
        resetInterval();
    };

    const handleNextClick = () => {
        setActiveSlide((prev) =>
            prev < NUM_CAROUSEL_IMAGES - 1 ? prev + 1 : 0,
        );
        resetInterval();
    };

    const handleMediaChange = (e: MediaQueryListEvent) => {
        resetInterval();
        setShowAdjacentImages(e.matches);
    };

    const left = activeSlide === 0 ? NUM_CAROUSEL_IMAGES - 1 : activeSlide - 1;
    const right = activeSlide === NUM_CAROUSEL_IMAGES - 1 ? 0 : activeSlide + 1;

    useEffect(() => {
        const mediaQuery = window.matchMedia("(min-width: 1280px)"); // Tailwind's xl breakpoint
        mediaQuery.addEventListener("change", handleMediaChange);
        resetInterval();

        return () => {
            if (interval.current) clearInterval(interval.current);
            mediaQuery.removeEventListener("change", handleMediaChange);
        };
    }, []);

    return (
        <div className="relative flex h-screen items-center justify-center overflow-hidden bg-[#f4eee6]">
            <button
                onClick={handlePrevClick}
                className="absolute left-16 top-1/2 z-30 flex h-10 w-10 -translate-y-1/2 transform items-center justify-center rounded-full bg-white font-bold text-black "
            >
                &#8592;
            </button>

            {[...Array(NUM_CAROUSEL_IMAGES)].map((_, idx) => (
                <Card
                    key={idx}
                    src={`/carousel/wedding-photo-${idx}.jpg`}
                    alt={`Slide ${idx}`}
                    isActive={activeSlide === idx}
                    isLeft={
                        activeSlide - 1 === idx ||
                        (activeSlide === 0 && idx === NUM_CAROUSEL_IMAGES - 1)
                    }
                    isRight={
                        activeSlide + 1 === idx ||
                        (activeSlide === NUM_CAROUSEL_IMAGES - 1 && idx === 0)
                    }
                    showAdjacentImages={showAdjacentImages}
                />
            ))}
            <button
                onClick={handleNextClick}
                className="absolute right-16 top-1/2 z-30 flex h-10 w-10 -translate-y-1/2 transform items-center justify-center rounded-full bg-white font-bold text-black"
            >
                &#8594;
            </button>
        </div>
    );
}

interface ICardProps {
    src: string;
    alt: string;
    isActive: boolean;
    isLeft: boolean;
    isRight: boolean;
    showAdjacentImages: boolean;
}

const Card = (props: ICardProps) => {
    const { src, alt, isActive, isLeft, isRight, showAdjacentImages } = props;

    let style;
    let zIndex = 0;

    if (isActive) {
        style = "scale-100 opacity-100";
        zIndex = 10;
    } else if (isLeft) {
        style = "translate-x-3/4 scale-75 opacity-70";
    } else if (isRight) {
        style = "-translate-x-3/4 scale-75 opacity-70";
    } else {
        style = "hidden";
    }

    return (
        <div
            className={`absolute top-1/2 bg-[#f4eee6] ${
                showAdjacentImages ? "w-1/3" : "w-full p-10 md:w-1/2 md:p-0"
            } -translate-y-1/2 transform flex-col opacity-0 transition-transform duration-700 z-${zIndex} ${style}`}
        >
            <div className="relative mb-4 flex h-[60vh] w-auto flex-col overflow-hidden rounded-2xl shadow-2xl">
                <div className="relative h-full">
                    <Image
                        src={src}
                        alt={alt}
                        layout="fill"
                        objectFit="contain"
                        className="absolute left-0 top-0"
                    />
                </div>
                <div className="mt-4">
                    <p className="shadow-text rounded-md px-4 py-2 text-base font-semibold tracking-wide shadow-lg transition-all md:text-lg lg:text-xl">
                        This is some text that will describe the picture above -
                        very very descriptive
                        askdfhkashfaskdjhfkajsdhfkjasdhfkajsdhsldfjsdlkfjsldkjflsjdlfjsdlfjkdskl
                    </p>
                </div>
            </div>
        </div>
    );
};
