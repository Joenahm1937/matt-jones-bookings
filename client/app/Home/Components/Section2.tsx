import { useRef } from "react";
import { SectionLayout } from "./SectionLayout";
import { useAnimateOnScroll } from "../../Hooks/useAnimateOnScroll";
import { ISectionProps } from "../interfaces";

export default function Section2(props: ISectionProps) {
    const contentRef = useRef<HTMLDivElement>(null);
    const imageRef = useRef<HTMLDivElement>(null);

    useAnimateOnScroll(contentRef, {});
    useAnimateOnScroll(imageRef, {
        to: { duration: 0.4 },
    });

    return (
        <SectionLayout {...props}>
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
        </SectionLayout>
    );
}
