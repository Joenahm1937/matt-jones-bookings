import "./globals.css";
import type { Metadata } from "next";
import { Libre_Franklin } from "next/font/google";
import NavBar from "./NavBar";

const font = Libre_Franklin({ weight: "400", subsets: [] });

export const metadata: Metadata = {
    title: "Create Next App",
    description: "Generated by create next app",
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <body
                className={`${font.className} flex h-screen flex-col overflow-y-scroll overscroll-none bg-[#f4eee6]`}
            >
                <NavBar />
                {children}
            </body>
        </html>
    );
}
