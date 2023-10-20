"use client";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { WEBSITE_TITLE } from "../Constants";
import {
    IHamburgerIconProps,
    IMenuLinksProps,
    IMobileMenuProps,
} from "../Interfaces";
import { LoginButton, LogoutButton } from "./LoginButtons";
import { useLogin } from "../GlobalContext";
import { useLoading } from "../template";

export default function NavBar() {
    const headerRef = useRef<HTMLDivElement | null>(null);
    const [isMenuOpen, setMenuOpen] = useState(false);
    const [headerHeight, setHeaderHeight] = useState("0");

    const toggleMobileMenu = () => setMenuOpen((prevState) => !prevState);
    const hideMobileMenu = () => setMenuOpen(false);

    useEffect(() => {
        if (headerRef.current) {
            setHeaderHeight(`${headerRef.current.offsetHeight}px`);
        }

        const mediaQuery = window.matchMedia("(min-width: 1280px)"); // Tailwind's xl breakpoint
        mediaQuery.addEventListener("change", hideMobileMenu);
        return () => {
            mediaQuery.removeEventListener("change", hideMobileMenu);
        };
    }, []);

    return (
        <div className="fixed z-50 w-full">
            <header
                ref={headerRef}
                className=" bg-white bg-opacity-90 py-1 shadow-md"
            >
                <nav className="mx-auto flex w-11/12 items-center">
                    <Image src="/logo.png" alt="logo" width={50} height={50} />
                    <div className="mx-10 flex-grow whitespace-nowrap text-center text-xl xl:text-left">
                        {WEBSITE_TITLE}
                    </div>
                    <DesktopMenu />
                    <HamburgerIcon
                        isMenuOpen={isMenuOpen}
                        toggleMobileMenu={toggleMobileMenu}
                    />
                </nav>
            </header>
            <MobileMenu
                isMenuOpen={isMenuOpen}
                hideMobileMenu={hideMobileMenu}
                topValue={headerHeight}
            />
        </div>
    );
}

const HamburgerIcon = (props: IHamburgerIconProps) => {
    const { isMenuOpen, toggleMobileMenu } = props;

    return (
        <div className="xl:hidden">
            <button
                onClick={toggleMobileMenu}
                className="flex cursor-pointer flex-col items-center justify-center"
            >
                <span
                    className={`block h-0.5 w-6 rounded-sm bg-stone-500 
                    transition-all duration-300 ease-out ${
                        isMenuOpen
                            ? "translate-y-1 -rotate-45"
                            : "-translate-y-0.5"
                    }`}
                ></span>
                <span
                    className={`my-0.5 block h-0.5 w-6 rounded-sm 
                    bg-stone-500 transition-all duration-300 ease-out ${
                        isMenuOpen ? "opacity-0" : "opacity-100"
                    }`}
                ></span>
                <span
                    className={`block h-0.5 w-6 rounded-sm bg-stone-500 
                    transition-all duration-300 ease-out ${
                        isMenuOpen
                            ? "-translate-y-1 rotate-45"
                            : "translate-y-0.5"
                    }`}
                ></span>
            </button>
        </div>
    );
};

const MenuLinks = (props: IMenuLinksProps) => {
    const { linkStyle, onClick } = props;
    const { loading, setLoading } = useLoading();
    const { isLoggedIn } = useLogin();
    const links = [
        { href: "/", text: "Home" },
        { href: "/Booking", text: "Booking" },
    ];
    if (isLoggedIn) links.push({ href: "/MyEvents", text: "My Events" });
    const onPageTransition = (href: string) => {
        /**
         * Navigating to the same page prevent template.tsx from loading,
         * meaning the loading state will infinitely remain true.
         * Therefore, we need to only set loading state to true
         * when navigating to a diferent page.
         * As a fail safe, we kill loading state after 2 sec which is unacceptable latency.
         */
        if (window.location.pathname !== href) {
            setLoading(true);
            setTimeout(() => loading && setLoading(false), 2000);
        }

        onClick && onClick();
    };
    return links.map((link) => (
        <div className="group" key={link.href}>
            <Link
                key={link.href}
                onClick={() => onPageTransition(link.href)}
                href={link.href}
                className={`relative block px-4 py-2 text-lg font-medium transition-colors duration-200 ${linkStyle}`}
            >
                {link.text}
                <span className="absolute bottom-0 left-0 h-0.5 w-0 transform bg-stone-500 transition-all duration-200 group-hover:w-full"></span>
            </Link>
        </div>
    ));
};

const DesktopMenu = () => {
    const { isLoggedIn } = useLogin();
    return (
        <div className="hidden xl:block">
            <ul className="flex gap-36">
                <MenuLinks />
                {isLoggedIn ? <LogoutButton /> : <LoginButton />}
            </ul>
        </div>
    );
};

const MobileMenu = (props: IMobileMenuProps) => {
    const { isLoggedIn } = useLogin();
    const { topValue, isMenuOpen, hideMobileMenu } = props;

    const menuContainerClasses = () => {
        let baseClasses = `absolute w-full overflow-hidden rounded-b-lg bg-white bg-opacity-90 transition-all ease-in-out z-10`;
        let stateClasses = isMenuOpen
            ? "max-h-[500px] opacity-100 transition-opacity duration-300 px-2 py-4"
            : "max-h-0 opacity-0 transition-opacity duration-700";
        return `${baseClasses} ${stateClasses}`;
    };

    return (
        <div className={menuContainerClasses()} style={{ top: topValue }}>
            <ul className="flex flex-col gap-2">
                <div className="ml-2 w-full">
                    <MenuLinks onClick={hideMobileMenu} linkStyle="" />
                    <ul className="px-3 pt-5">
                        {isLoggedIn ? <LogoutButton /> : <LoginButton />}
                    </ul>
                </div>
            </ul>
        </div>
    );
};
