import { useRef } from "react";
import { SectionLayout } from "./SectionLayout";
import Footer from "./Footer";
import { useAnimateOnScroll } from "../../Hooks/useAnimateOnScroll";

export default function Section4() {
    const contentRef = useRef<HTMLDivElement>(null);

    useAnimateOnScroll(
        contentRef,
        {},
        { toggleActions: "play none none none" },
    );

    return (
        <SectionLayout containerStyles="flex-col">
            <div className="flex h-screen w-full items-center justify-center">
                <div ref={contentRef} className="flex-grow ">
                    <h2 className="relative z-10 text-center text-[5rem] font-bold text-white">
                        Lorem Ipsum
                    </h2>
                </div>
            </div>
            <Footer />
        </SectionLayout>
    );
}
