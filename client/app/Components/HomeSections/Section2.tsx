import { useGlobalStyles } from "../../GlobalContext";
import { ISection2Props } from "../../Interfaces";

export const Section2: React.FC<ISection2Props> = ({
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
                className={`flex w-full flex-1 items-center justify-center pt-[${navHeight}]`}
            >
                <div className="">Section 2 Content</div>
            </div>
        </div>
    );
};
