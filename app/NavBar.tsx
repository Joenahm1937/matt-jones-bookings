"use client";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { WEBSITE_TITLE } from "./constants";

interface IMenuLinksProps {
    linkStyle?: string;
    onClick?: () => void;
}

interface IMobileMenuProps {
    topValue: string;
    isMenuOpen: boolean;
    hideMobileMenu: () => void;
}

interface IHamburgerIconProps {
    isMenuOpen: boolean;
    toggleMobileMenu: () => void;
}

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
        <>
            <header
                ref={headerRef}
                className="fixed z-50 w-full bg-white bg-opacity-70 py-1 shadow-md"
            >
                <nav className="mx-auto flex w-11/12 items-center">
                    <Image src="/logo.png" alt="logo" width={60} height={60} />
                    <div className="mx-12 flex-grow whitespace-nowrap text-center font-serif text-2xl xl:text-left">
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
        </>
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
    const links = [
        { href: "/", text: "Home" },
        { href: "/About", text: "About" },
        { href: "/Booking", text: "Booking" },
        { href: "/Contact", text: "Contact" },
    ];
    return links.map((link) => (
        <div className="group">
            <Link
                key={link.href}
                onClick={onClick}
                href={link.href}
                className={`relative block px-4 py-2 text-lg font-medium transition-colors duration-200 ${linkStyle}`}
            >
                {link.text}
                <span className="absolute bottom-0 left-0 h-0.5 w-0 transform bg-stone-500 transition-all duration-200 group-hover:w-full"></span>
            </Link>
        </div>
    ));
};

const DesktopMenu = () => (
    <div className="hidden xl:block">
        <ul className="flex gap-36">
            <MenuLinks />
        </ul>
    </div>
);

const MobileMenu = (props: IMobileMenuProps) => {
    const { topValue, isMenuOpen, hideMobileMenu } = props;

    const menuContainerClasses = () => {
        let baseClasses = `absolute w-full overflow-hidden rounded-b-lg bg-white bg-opacity-70 transition-all ease-in-out z-10`;
        let stateClasses = isMenuOpen
            ? "max-h-[500px] opacity-100 transition-opacity duration-300 px-2 py-4"
            : "max-h-0 opacity-0 transition-opacity duration-700";
        return `${baseClasses} ${stateClasses}`;
    };

    return (
        <div className={menuContainerClasses()} style={{ top: topValue }} >
            <ul className="flex flex-col gap-2">
                <div className="ml-2 w-[6rem]">
                    <MenuLinks onClick={hideMobileMenu} linkStyle="" />
                </div>
            </ul>
        </div>
    );
};
