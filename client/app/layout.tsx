import "./globals.css";
import type { Metadata } from "next";
import { Libre_Franklin } from "next/font/google";
import GlobalContextProvider from "@/app/Contexts/GlobalContextProvider";
import NavBar from "@/app/GlobalComponents/NavBar";

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
            <body className="overflow-hidden bg-[#f4eee6]">
                <GlobalContextProvider>
                    {
                        <>
                            <NavBar />
                            {children}
                        </>
                    }
                </GlobalContextProvider>
            </body>
        </html>
    );
}
