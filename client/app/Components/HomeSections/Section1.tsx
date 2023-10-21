import { HOME_HEADER, HOME_SUBHEADER } from "../../Constants";
import {
    ISection1Props,
    IBackgroundImageProps,
    IContentOverlayProps,
} from "../../Interfaces";

export const Section1: React.FC<ISection1Props> = ({
    reference,
    isVisible,
    backgroundVisible,
    isLoggedIn,
}) => (
    <div className="flex h-screen items-center justify-center" ref={reference}>
        <BackgroundImage isVisible={backgroundVisible} />
        <ContentOverlay isVisible={isVisible} isLoggedIn={isLoggedIn} />
    </div>
);

const BackgroundImage: React.FC<IBackgroundImageProps> = ({ isVisible }) => {
    const classes = isVisible ? "opacity-100" : "opacity-0";
    return (
        <div
            className={`h-full w-full bg-cover bg-center bg-no-repeat transition-opacity duration-500 ease-in ${classes}`}
            style={{ backgroundImage: `url('/backgroundImage.jpg')` }}
        ></div>
    );
};

const ContentOverlay: React.FC<IContentOverlayProps> = ({
    isVisible,
    isLoggedIn,
}) => {
    const classes = isVisible ? "opacity-100" : "opacity-0";
    return (
        <div
            className={`absolute top-0 flex h-full w-full items-center justify-center bg-black bg-opacity-10 p-8 transition-opacity delay-500 duration-700 ease-in ${classes}`}
        >
            <div className="space-y-10 text-left text-white xl:space-y-44">
                <div className="space-y-4 xl:space-y-8">
                    <h1 className="p-2 text-5xl font-bold xl:text-6xl">
                        {HOME_HEADER}
                    </h1>
                    <p className="text-xl xl:text-3xl">{HOME_SUBHEADER}</p>
                </div>
                <button className="rounded-full bg-slate-500 px-14 py-4 text-white shadow-md transition-all duration-200 hover:bg-slate-600 hover:text-white  active:translate-x-0.5 active:translate-y-0.5 active:bg-gray-800 active:shadow-inner">
                    {isLoggedIn ? "Book Now" : "Login"}
                </button>
            </div>
        </div>
    );
};
