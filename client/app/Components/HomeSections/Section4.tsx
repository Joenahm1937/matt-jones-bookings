import Image from "next/image";
import { ISection4Props } from "../../Interfaces";
import { useGlobalStyles } from "../../GlobalContext";
import { Footer } from "../Footer";

export const Section4: React.FC<ISection4Props> = ({
    reference,
    isVisible,
}) => {
    const classes = isVisible ? "opacity-100" : "opacity-0";
    const { navHeight } = useGlobalStyles();

    return (
        <div
            className={`flex h-screen flex-col items-center justify-center transition-opacity delay-300 duration-500 ease-in ${classes}`}
            ref={reference}
        >
            <div
                className={`flex w-full flex-1 flex-col items-center justify-center md:flex-row pt-[${navHeight}]`}
            >
                <div className="w-full flex-grow md:w-auto">
                    Section 4 Content
                </div>
                <div className="relative h-1/2 w-full bg-black md:mb-0 md:h-full md:w-3/5">
                    <Image
                        priority
                        src="/carousel/wedding-photo-1.jpg"
                        alt="Section 2 Image"
                        fill
                        sizes="(max-width: 768px) 100vw"
                        className="object-cover"
                    />
                </div>
            </div>
            <Footer />
        </div>
    );
};
