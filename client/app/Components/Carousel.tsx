"use client";
import { useEffect, useRef, useState } from "react";
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import Image from "next/image";
import {
    NUM_CAROUSEL_IMAGES,
    CAROUSEL_INTERVAL_SECONDS,
    CAROUSEL_PHOTOS,
} from "../Constants";
import { ICardProps } from "../Interfaces";

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

    useEffect(() => {
        const mediaQuery = window.matchMedia("(min-width: 1024px)"); // Tailwind's xl breakpoint
        mediaQuery.addEventListener("change", handleMediaChange);
        resetInterval();

        return () => {
            if (interval.current) clearInterval(interval.current);
            mediaQuery.removeEventListener("change", handleMediaChange);
        };
    }, []);

    return (
        <div className="relative flex h-screen items-center justify-center overflow-hidden">
            <div className="absolute top-36 mx-auto flex w-full items-center justify-center text-center">
                <span className="mx-5 block h-0.5 w-[10vw] rounded-md bg-gray-600"></span>
                <h1 className="text-2xl py-2">Past Events</h1>
                <span className="mx-5 block h-0.5 w-[10vw] rounded-md bg-gray-600"></span>
            </div>
            <CarouselButton direction="left" onClick={handlePrevClick} />
            {CAROUSEL_PHOTOS.map((photo, idx) => (
                <Card
                    key={idx}
                    photo={photo}
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
            <CarouselButton direction="right" onClick={handleNextClick} />
        </div>
    );
}

interface CarouselButtonProps {
    direction: "left" | "right";
    onClick: () => void;
}

const CarouselButton = ({ direction, onClick }: CarouselButtonProps) => {
    const baseStyles =
      "absolute top-[50%] z-30 flex h-12 w-12 translate-y-1/2 transform items-center justify-center text-xl font-bold text-black transition-opacity hover:opacity-75";
    const directionStyles = direction === "left" ? "left-8" : "right-8";
    const IconComponent = direction === "left" ? FaChevronLeft : FaChevronRight;
  
    return (
      <button onClick={onClick} className={`${baseStyles} ${directionStyles}`}>
        <IconComponent size={24} /> {/* Adjust size as needed */}
      </button>
    );
  };

const Card = (props: ICardProps) => {
    const { photo, isActive, isLeft, isRight, showAdjacentImages } = props;

    let style;
    let zIndex = 0;

    if (isActive) {
        style = "scale-100 opacity-100";
        zIndex = 10;
    } else if (isLeft) {
        style = "translate-x-3/4 scale-[70%] opacity-70";
    } else if (isRight) {
        style = "-translate-x-3/4 scale-[70%] opacity-70";
    } else {
        style = "hidden";
    }

    return (
        <div
            className={`absolute top-[56%] rounded-3xl shadow-[20px_20px_20px_20px_rgba(0,0,0,0.2)] ${
                showAdjacentImages
                    ? "h-[500px] w-[700px]"
                    : "h-[300px] w-[400px]"
            } -translate-y-1/2 transform flex-col opacity-0 transition-transform duration-700 z-${zIndex} ${style}`}
        >
            <div className="relative flex h-full flex-col overflow-hidden rounded-3xl">
                <Image
                    priority
                    src={`/carousel/${photo.src}`}
                    alt={photo.alt}
                    fill
                    sizes="(max-width: 768px) 100vw"
                    className="absolute left-0 top-0 object-fill"
                />
            </div>
        </div>
    );
};
