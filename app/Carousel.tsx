"use client";
import { useEffect, useState } from "react";
import Image from "next/image";

const NUM_IMAGES = 5;

export default function Carousel() {
    const [activeSlide, setActiveSlide] = useState(1);

    const handlePrevClick = () => {
        setActiveSlide((prev) => (prev > 0 ? prev - 1 : NUM_IMAGES - 1));
    };

    const handleNextClick = () => {
        setActiveSlide((prev) => (prev < NUM_IMAGES - 1 ? prev + 1 : 0));
    };

    const left = activeSlide === 0 ? NUM_IMAGES - 1 : activeSlide - 1;
    const right = activeSlide === NUM_IMAGES - 1 ? 0 : activeSlide + 1;

    useEffect(() => {
        const interval = setInterval(() => {
            handleNextClick();
        }, 5000);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="relative flex h-screen items-center justify-center overflow-hidden bg-neutral-300">
            <button
                onClick={handlePrevClick}
                className="absolute left-10 top-1/2 z-30 -translate-y-1/2 text-4xl text-white"
            >
                &#8592;
            </button>

            {[...Array(NUM_IMAGES)].map((_, idx) => (
                <Card
                    key={idx}
                    src={`/carousel/wedding-photo-${idx}.jpg`}
                    alt={`Slide ${idx}`}
                    isActive={activeSlide === idx}
                    isLeft={
                        activeSlide - 1 === idx ||
                        (activeSlide === 0 && idx === NUM_IMAGES - 1)
                    }
                    isRight={
                        activeSlide + 1 === idx ||
                        (activeSlide === NUM_IMAGES - 1 && idx === 0)
                    }
                />
            ))}
            <button
                onClick={handleNextClick}
                className="absolute right-10 top-1/2 z-30 -translate-y-1/2 text-4xl text-white"
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
}

const Card = (props: ICardProps) => {
    const { src, alt, isActive, isLeft, isRight } = props;

    let style;

    if (isActive) {
        style = "z-10 scale-100 opacity-100";
    } else if (isLeft) {
        style = "translate-x-3/4 scale-75 opacity-70";
    } else if (isRight) {
        style = "-translate-x-3/4 scale-75 opacity-70";
    } else {
        style = "hidden";
    }

    return (
        <div
            className={`absolute top-1/2 flex h-1/2 w-1/3 -translate-y-1/2 transform opacity-0 transition-transform duration-700 ${style}`}
        >
            <div className="relative flex-1 overflow-hidden rounded-xl shadow-xl">
                <Image
                    src={src}
                    alt={alt}
                    layout="fill"
                    objectFit="cover"
                    sizes="(max-width: 640px) 640px, (max-width: 768px) 768px, (max-width: 1024px) 1024px, 1280px"
                />
            </div>
        </div>
    );
};
