import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useLogin } from "@/app/Contexts/LoginContext";
import { LogoutButton, LoginButton } from "@/app/Home/Components/LoginButtons";
import { IPAGES } from "../constants";
import { ILinks } from "./NavBar";

export interface IDesktopMenuProps {
    links: ILinks[];
    screenSize: boolean;
    currentPage: number;
    onPageTransition: (href: IPAGES) => void;
}

export default function DesktopMenu({
    links,
    screenSize,
    currentPage,
    onPageTransition,
}: IDesktopMenuProps) {
    const { isLoggedIn } = useLogin();
    const [underlineStyle, setUnderlineStyle] = useState({
        left: "0%",
        width: "0%",
    });
    const menuItemsRef = useRef<(HTMLDivElement | null)[]>([]);

    useEffect(() => {
        const updateUnderlineStyle = () => {
            const menuItem = menuItemsRef.current[currentPage];
            if (menuItem) {
                const parentRect =
                    menuItem.parentElement!.getBoundingClientRect();
                const menuItemRect = menuItem.getBoundingClientRect();
                setUnderlineStyle({
                    left: `${
                        ((menuItemRect.left - parentRect.left) /
                            parentRect.width) *
                        100
                    }%`,
                    width: `${(menuItemRect.width / parentRect.width) * 100}%`,
                });
            }
        };

        updateUnderlineStyle();
    }, [currentPage, isLoggedIn, screenSize]);

    return (
        <div className="hidden xl:flex">
            <ul className="flex space-x-4">
                <div className="mr-10">
                    <div className="flex">
                        {links.map((link, index) => (
                            <div
                                key={link.href}
                                ref={(el) => (menuItemsRef.current[index] = el)}
                            >
                                <Link
                                    href={link.href}
                                    onClick={() =>
                                        onPageTransition(link.href as IPAGES)
                                    }
                                    className="flex whitespace-nowrap px-4 pt-2 text-center text-lg font-medium hover:italic sm:px-16"
                                >
                                    {link.text}
                                </Link>
                            </div>
                        ))}
                    </div>
                    <div className="relative flex h-1 w-full">
                        <div
                            className="absolute flex h-full justify-center"
                            style={{
                                ...underlineStyle,
                                transitionProperty: "left, width",
                                transitionDuration: "1.5s",
                                animationTimingFunction: "ease-in-out",
                            }}
                        >
                            <div className="h-full w-1/2 rounded-full bg-[#82593e]"></div>
                        </div>
                    </div>
                </div>
                {isLoggedIn ? <LogoutButton /> : <LoginButton />}
            </ul>
        </div>
    );
}
