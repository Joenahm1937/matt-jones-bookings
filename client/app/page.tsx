import dynamic from "next/dynamic";

// Uses window match query on first render so no SSR
const NonSSRCarousel = dynamic(() => import("./Carousel"), {
    ssr: false,
    loading: () => <div className="h-screen"></div>,
});

export default function Home() {
    return (
        <div>
            <div className="relative flex h-screen justify-center">
                <div
                    className="absolute left-0 top-0 h-full w-full bg-cover bg-center bg-no-repeat"
                    style={{ backgroundImage: `url('/backgroundImage.jpg')` }}
                ></div>

                <div className="absolute top-0 flex h-full w-full items-center justify-center bg-black bg-opacity-10 p-8">
                    <div className="space-y-10 text-left text-white xl:space-y-44">
                        <div className="space-y-4 xl:space-y-8">
                            <h1 className="p-2 text-5xl font-bold xl:text-6xl">
                                Matt's Booking
                            </h1>
                            <p className="text-xl xl:text-3xl">
                                You take care of each other, and I'll take care
                                of the rest
                            </p>
                        </div>

                        <button className="rounded-full bg-slate-500 px-14 py-4  text-white shadow-md transition-all duration-200 hover:bg-slate-600 hover:text-white  active:translate-x-0.5 active:translate-y-0.5 active:bg-gray-800 active:shadow-inner">
                            Book Now
                        </button>
                    </div>
                </div>
            </div>

            <NonSSRCarousel />
        </div>
    );
}