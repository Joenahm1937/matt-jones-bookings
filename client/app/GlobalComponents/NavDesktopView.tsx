import { useState, useRef, useEffect, MutableRefObject } from "react";
import Link from "next/link";
import { LogoutButton, LoginButton } from "@/app/Home/Components/LoginButtons";
import classNames from "classnames";
import { IPAGES } from "../constants";
import { useLogin } from "../Contexts/LoginContext";
import { usePathname } from "next/navigation";

export interface IDesktopMenuProps {
    screenSize: boolean;
    currentPage: number;
    onPageTransition: (href: IPAGES) => void;
}

export default function DesktopMenu({
    screenSize,
    currentPage,
    onPageTransition,
}: IDesktopMenuProps) {
    const { isLoggedIn } = useLogin();
    const pathname = usePathname();
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
        <div className="hidden xl:block">
            <ul className="flex">
                <div className="mr-10 flex-col">
                    <div className="flex">
                        <MenuLinks
                            menuItemsRef={menuItemsRef}
                            activeLink={currentPage}
                            isLoggedIn={isLoggedIn}
                            onPageTransition={onPageTransition}
                        />
                    </div>
                    <div className="relative flex h-[2px] w-full">
                        <div
                            className={`absolute h-full ${
                                pathname === "/" ? "bg-white" : "bg-black"
                            }`}
                            style={{
                                ...underlineStyle,
                                transitionProperty: "left, width",
                                transitionDuration: "1s",
                            }}
                        ></div>
                    </div>
                </div>
                {isLoggedIn ? <LogoutButton /> : <LoginButton />}
            </ul>
        </div>
    );
}

export interface IMenuLinksProps {
    linkStyle?: string;
    menuItemsRef: MutableRefObject<(HTMLDivElement | null)[]>;
    activeLink?: number;
    isMobile?: boolean;
    isLoggedIn: boolean;
    onPageTransition: (href: IPAGES) => void;
}

const MenuLinks = ({
    linkStyle,
    menuItemsRef,
    activeLink,
    isMobile,
    isLoggedIn,
    onPageTransition,
}: IMenuLinksProps) => {
    const links = [
        { href: "/", text: "Home" },
        { href: "/Booking", text: "Booking" },
        ...(isLoggedIn ? [{ href: "/MyEvents", text: "My Events" }] : []),
    ];

    return links.map((link, index) => (
        <div key={link.href} ref={(el) => (menuItemsRef.current[index] = el)}>
            <Link
                key={link.href}
                onClick={() => onPageTransition(link.href as IPAGES)}
                href={link.href}
                className={classNames(
                    "relative flex w-full whitespace-nowrap px-4 py-2 text-center text-lg font-medium transition-colors duration-200 sm:px-16",
                    linkStyle,
                    {
                        "w-[32%] rounded-3xl bg-stone-300":
                            isMobile && index === activeLink,
                    },
                )}
            >
                {link.text}
                <span className="absolute bottom-0 left-0 h-0.5 w-0 transform bg-stone-500 transition-all duration-200 group-hover:w-full"></span>
            </Link>
        </div>
    ));
};
