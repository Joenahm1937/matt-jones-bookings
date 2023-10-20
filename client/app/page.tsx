"use client"
import { HOME_HEADER, HOME_SUBHEADER } from "./Constants";

export default function Home() {
    return (
        <div>
            {/* Section 1 */}
            <div className="relative h-screen flex justify-center">
                <div
                    className="absolute left-0 top-0 h-full w-full bg-cover bg-center bg-no-repeat"
                    style={{ backgroundImage: `url('/backgroundImage.jpg')` }}
                ></div>

                <div className="absolute top-0 flex h-full w-full items-center justify-center bg-black bg-opacity-10 p-8">
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
                            Book Now
                        </button>
                    </div>
                </div>
            </div>

            {/* Section 2: Carousel */}
            <div className="h-screen bg-yellow-500 flex items-center justify-center">
                {/* Your content for section 3 here */}
                <h1>Section 2 Content</h1>
            </div>

            {/* Section 3 */}
            <div className="h-screen bg-green-500 flex items-center justify-center">
                {/* Your content for section 3 here */}
                <h1>Section 3 Content</h1>
            </div>

            {/* Section 4 */}
            <div className="h-screen bg-blue-500 flex items-center justify-center">
                {/* Your content for section 4 here */}
                <h1>Section 4 Content</h1>
            </div>
        </div>
    );
}
