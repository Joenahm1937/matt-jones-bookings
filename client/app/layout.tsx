import "./globals.css";
import type { Metadata } from "next";
import { Libre_Franklin } from "next/font/google";
import { GlobalProvider } from "./GlobalContext";

const font = Libre_Franklin({ weight: "400", subsets: ["latin"] });

export const metadata: Metadata = {
    title: "Matt's Booking Site",
    description: "For Wedding Event Bookings",
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" className={`${font.className}`}>
            <body className="flex h-screen flex-col overflow-y-scroll overscroll-none bg-[#f4eee6]">
                <GlobalProvider>{children}</GlobalProvider>
            </body>
        </html>
    );
}
