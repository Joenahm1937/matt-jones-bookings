import { useRef } from "react";
import Link from "next/link";
import { SectionLayout } from "./SectionLayout";
import { useAnimateOnScroll } from "../AnimateHook";
import { HOME_HEADER, HOME_SUBHEADER } from "@/app/constants";
import { ISectionProps } from "../interfaces";

export default function Section1(props: ISectionProps) {
    const contentRef = useRef<HTMLDivElement>(null);

    useAnimateOnScroll(contentRef, {
        from: { y: -20 },
        to: {
            delay: 0.8,
            ease: "power3.out",
        },
    });

    return (
        <SectionLayout {...props}>
            <div
                className="h-full w-full bg-cover bg-center bg-no-repeat"
                style={{ backgroundImage: `url('/backgroundImage.jpg')` }}
            ></div>
            <div
                ref={contentRef}
                className="absolute top-0 flex h-full w-full items-center justify-center bg-black bg-opacity-10 p-8 will-change-transform"
            >
                <ContentOverlay />
            </div>
        </SectionLayout>
    );
}

function ContentOverlay() {
    return (
        <div className="space-y-10 text-left text-white xl:space-y-44">
            <div className="space-y-4 xl:space-y-8">
                <h1 className="p-2 text-5xl font-bold xl:text-6xl">
                    {HOME_HEADER}
                </h1>
                <p className="text-xl xl:text-3xl">{HOME_SUBHEADER}</p>
            </div>
            <Link href="/Booking" className="flex flex-grow items-center">
                <button className="rounded-full bg-[#82593e] px-14 py-4 text-white shadow-md transition-all duration-200 hover:bg-slate-600 hover:text-white  active:translate-x-0.5 active:translate-y-0.5 active:bg-gray-800 active:shadow-inner">
                    Book Now
                </button>
            </Link>
        </div>
    );
}
