import Image from "next/image";
import { ISection3Props } from "../../Interfaces";
import { useGlobalStyles } from "../../GlobalContext";

export const Section3: React.FC<ISection3Props> = ({ reference, isVisible }) => {
    const classes = isVisible ? "opacity-100" : "opacity-0";
    const { navHeight } = useGlobalStyles();

    return (
        <div
            className={`flex h-screen flex-col items-center justify-center transition-opacity delay-300 duration-500 ease-in ${classes}`}
            ref={reference}
        >
            <div className={`flex flex-col md:flex-row w-full flex-1 items-center justify-center pt-[${navHeight}]`}>
                <div className="relative w-full md:w-3/5 h-1/2 md:h-full bg-black mb-4 md:mb-0">
                    <Image
                        priority
                        src="/carousel/wedding-photo-0.jpg"
                        alt="Section 2 Image"
                        fill
                        sizes="(max-width: 768px) 100vw"
                        className="object-cover"
                    />
                </div>
                <div className="w-full md:w-auto flex-grow">Section 3 Content</div>
            </div>
        </div>
    );
};
