import { useRef } from "react";
import { SectionLayout } from "./SectionLayout";
import { useAnimateOnScroll } from "../useAnimateOnScroll";
import { ISectionProps } from "../interfaces";

export default function Section3(props: ISectionProps) {
    const contentRef = useRef<HTMLDivElement>(null);
    const imageRef = useRef<HTMLDivElement>(null);

    useAnimateOnScroll(contentRef, {
        from: { y: -40 },
    });
    useAnimateOnScroll(imageRef, {
        to: { duration: 0.4 },
    });

    return (
        <SectionLayout {...props}>
            <div
                ref={imageRef}
                className={`bg-image h-full w-full bg-cover bg-center bg-no-repeat transition-opacity duration-500 ease-in md:w-1/3`}
                style={{ backgroundImage: `url('/wedding-photo-2.jpg')` }}
            ></div>
            <div ref={contentRef} className="content min-h-[40%] flex-grow">
                <h2 className="relative z-10 text-center text-[5rem] font-bold text-white">
                    Lorem Ipsum
                </h2>
            </div>
        </SectionLayout>
    );
}
