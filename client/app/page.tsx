"use client";
import { useEffect, useState } from "react";
import { HOME_HEADER, HOME_SUBHEADER } from "./Constants";
import ScrollTrigger from "react-scroll-trigger";
import { Footer } from "./Components/Footer";
import { useLogin } from "./GlobalContext";

export default function Home() {
    const [section1Visible, setSection1Visible] = useState(false);
    const [section2Visible, setSection2Visible] = useState(false);
    const [section3Visible, setSection3Visible] = useState(false);
    const [section4Visible, setSection4Visible] = useState(false);
    const [pageVisible, setPageVisible] = useState(false);

    const { isLoggedIn } = useLogin();

    useEffect(() => {
        setPageVisible(true);
    }, []);

    return (
        <div>
            {/* @ts-ignore */}
            <ScrollTrigger
                onProgress={(args) => {
                    if (args && args.progress >= 0.25) {
                        setSection1Visible(true);
                    }
                }}
            >
                <div className={`flex h-screen items-center justify-center`}>
                    <div
                        className={`h-full w-full bg-cover bg-center bg-no-repeat transition-opacity duration-500 ease-in ${
                            pageVisible ? "opacity-100" : "opacity-0"
                        }
                        `}
                        style={{
                            backgroundImage: `url('/backgroundImage.jpg')`,
                        }}
                    ></div>

                    <div
                        className={`absolute top-0 flex h-full w-full items-center justify-center bg-black bg-opacity-10 p-8 transition-opacity delay-500 duration-700 ease-in ${
                            section1Visible ? "opacity-100" : "opacity-0"
                        }`}
                    >
                        <div className="space-y-10 text-left text-white xl:space-y-44">
                            <div className="space-y-4 xl:space-y-8">
                                <h1 className="p-2 text-5xl font-bold xl:text-6xl">
                                    {HOME_HEADER}
                                </h1>
                                <p className="text-xl xl:text-3xl">
                                    {HOME_SUBHEADER}
                                </p>
                            </div>

                            <button className="rounded-full bg-slate-500 px-14 py-4  text-white shadow-md transition-all duration-200 hover:bg-slate-600 hover:text-white  active:translate-x-0.5 active:translate-y-0.5 active:bg-gray-800 active:shadow-inner">
                                {isLoggedIn ? "Book Now" : "Login"}
                            </button>
                        </div>
                    </div>
                </div>
            </ScrollTrigger>

            {/* @ts-ignore */}
            <ScrollTrigger
                onProgress={(args) => {
                    if (args && args.progress >= 0.25) {
                        setSection2Visible(true);
                    }
                }}
            >
                <div
                    className={`flex h-screen items-center justify-center transition-opacity delay-500 duration-500 ease-in ${
                        section2Visible ? "opacity-100" : "opacity-0"
                    }`}
                >
                    <h1>Section 2 Content</h1>
                </div>
            </ScrollTrigger>

            {/* @ts-ignore */}
            <ScrollTrigger
                onProgress={(args) => {
                    if (args && args.progress >= 0.25) {
                        setSection3Visible(true);
                    }
                }}
            >
                <div
                    className={`flex h-screen items-center justify-center transition-opacity delay-500 duration-500 ease-in ${
                        section3Visible ? "opacity-100" : "opacity-0"
                    }`}
                >
                    <h1>Section 3 Content</h1>
                </div>
            </ScrollTrigger>

            {/* @ts-ignore */}
            <ScrollTrigger
                onProgress={(args) => {
                    if (args && args.progress >= 0.25) {
                        setSection4Visible(true);
                    }
                }}
            >
                <div
                    className={`flex h-screen flex-col items-center justify-center transition-opacity delay-500 duration-500 ease-in ${
                        section4Visible ? "opacity-100" : "opacity-0"
                    }`}
                >
                    <div className="flex w-full flex-1 items-center justify-center">
                        <div>Section 4 Content</div>
                    </div>
                    <Footer />
                </div>
            </ScrollTrigger>
        </div>
    );
}
