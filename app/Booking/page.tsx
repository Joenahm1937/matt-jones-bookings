import dynamic from "next/dynamic";

// Uses window match query on first render so no SSR
const NonSSRCarousel = dynamic(() => import("./Calendar"), {
    ssr: false,
});

export default function Booking() {
    return (
        <div className="flex h-screen flex-col items-center justify-center gap-10">
            <NonSSRCarousel />
        </div>
    );
}
