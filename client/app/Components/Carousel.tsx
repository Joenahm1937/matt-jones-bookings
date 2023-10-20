"use client";
import { useEffect, useRef, useState } from "react";
import {
    FaChevronLeft,
    FaChevronRight,
    FaTwitter,
    FaFacebookF,
    FaInstagram,
    FaEnvelope,
} from "react-icons/fa";
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
            <div className="absolute top-[68%] mx-auto flex items-center justify-center px-10 text-center lg:top-[77%] lg:w-3/5">
                <h1 className="font-semibold leading-relaxed lg:text-xl">
                    This is some extra placeholder text Lorem Ipsum is simply
                    dummy text of the printing and typesetting industry. Lorem
                    Ipsum has been the industry standard dummy text ever since
                    the 1500s, when an unknown printer took a galley of type and
                    scrambled it to make a type specimen book.
                </h1>
            </div>
            <footer className="mt-auto w-full bg-white bg-opacity-90 py-3 shadow-md">
                <div className="flex justify-center space-x-10">
                    <a
                        href="https://twitter.com/yourusername"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="transition-colors duration-300 hover:text-stone-700"
                    >
                        <FaTwitter size={24} color="#1DA1F2" />
                    </a>
                    <a
                        href="https://facebook.com/yourusername"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="transition-colors duration-300 hover:text-stone-700"
                    >
                        <FaFacebookF size={24} color="#6f95c7" />
                    </a>
                    <a
                        href="https://instagram.com/yourusername"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="transition-colors duration-300 hover:text-stone-700"
                    >
                        <FaInstagram size={24} color="#E4405F" />
                    </a>
                    <a
                        href="mailto:youremail@example.com"
                        className="flex items-center space-x-4 text-stone-500 transition-colors duration-300 hover:text-stone-700"
                    >
                        <FaEnvelope size={24} />
                        <span>Contact me</span>
                    </a>
                </div>
            </footer>
        </div>
    );
}

interface CarouselButtonProps {
    direction: "left" | "right";
    onClick: () => void;
}

const CarouselButton = ({ direction, onClick }: CarouselButtonProps) => {
    const baseStyles =
        "absolute top-[36%] z-30 flex h-12 w-12 translate-y-1/2 transform items-center justify-center text-xl font-bold text-black transition-opacity hover:opacity-75";
    const directionStyles =
        direction === "left" ? "left-12 lg:left-8" : "right-12 lg:right-8";
    const IconComponent = direction === "left" ? FaChevronLeft : FaChevronRight;

    return (
        <button
            onClick={onClick}
            className={`${baseStyles} ${directionStyles}`}
        >
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
        style = `translate-x-3/4 ${
            showAdjacentImages ? "scale-[70%]" : "scale-[0%]"
        } opacity-70`;
    } else if (isRight) {
        style = `-translate-x-3/4 ${
            showAdjacentImages ? "scale-[70%]" : "scale-[0%]"
        } opacity-70`;
    } else {
        style = "hidden";
    }

    return (
        <div
            className={`absolute top-[42%] rounded-3xl shadow-[20px_20px_20px_20px_rgba(0,0,0,0.2)] ${
                showAdjacentImages
                    ? "h-[500px] w-[730px]"
                    : "h-[300px] w-[400px] md:h-[450px] md:w-[600px]"
            } -translate-y-1/2 transform flex-col opacity-0 transition-transform duration-1000 z-${zIndex} ${style}`}
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
