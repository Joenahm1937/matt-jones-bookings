"use client";

import { useState, useEffect, useRef, Dispatch, SetStateAction } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useGlobalStyles } from "@/app/Contexts/StylesContext";
import DesktopMenu from "./NavDesktopView";
import MobileMenu from "./NavMobileView";
import classNames from "classnames";

import { IPAGES, PAGES, WEBSITE_TITLE } from "@/app/constants";

export default function NavBar() {
    const pathname = usePathname();
    const [currentPage, setCurrentPage] = useState<number>(
        PAGES[pathname as IPAGES],
    );
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [screenSize, setScreenSize] = useState(false);
    const { setNavHeight } = useGlobalStyles();
    const headerRef = useRef<HTMLDivElement | null>(null);

    const onPageTransition = (href: IPAGES) => {
        setMobileMenuOpen(false);
        setCurrentPage(PAGES[href]);
    };

    useEffect(() => {
        if (headerRef.current) {
            setNavHeight(`${headerRef.current.offsetHeight}px`);
        }

        const onScreenChange = () => {
            setScreenSize((prev) => !prev);
            setMobileMenuOpen(false);
        };

        const mediaQuery = window.matchMedia("(min-width: 1280px)");
        mediaQuery.addEventListener("change", onScreenChange);

        return () => {
            mediaQuery.removeEventListener("change", onScreenChange);
        };
    }, [setNavHeight]);

    return (
        <div className="fixed z-50 w-full">
            <header
                ref={headerRef}
                className={`${
                    pathname === "/" && "text-white"
                } bg-opacity-90 py-1 shadow-md`}
            >
                <nav className="mx-auto flex w-11/12 items-center">
                    <Link href="/" className="flex flex-grow items-center">
                        <Image
                            src="/logo.png"
                            alt="logo"
                            width={50}
                            height={50}
                        />
                        <div className="hitespace-nowrap mx-10 flex-grow text-center text-xl xl:text-left">
                            {WEBSITE_TITLE}
                        </div>
                    </Link>
                    <DesktopMenu
                        screenSize={screenSize}
                        currentPage={currentPage}
                        onPageTransition={onPageTransition}
                    />
                    <HamburgerIcon
                        mobileMenuOpen={mobileMenuOpen}
                        setMobileMenuOpen={setMobileMenuOpen}
                    />
                </nav>
            </header>
            <MobileMenu
                currentPage={currentPage}
                onPageTransition={onPageTransition}
                mobileMenuOpen={mobileMenuOpen}
            />
        </div>
    );
}

export interface IHamburgerIconProps {
    mobileMenuOpen: boolean;
    setMobileMenuOpen: Dispatch<SetStateAction<boolean>>;
}

const HamburgerIcon = ({
    mobileMenuOpen,
    setMobileMenuOpen,
}: IHamburgerIconProps) => {
    const pathname = usePathname();

    const burgerLineBaseClass =
        "block h-0.5 w-6 rounded-sm transition-all duration-300 ease-out";
    const burgerLineColorClass = classNames({
        "bg-white": pathname === "/",
        "bg-stone-500": pathname !== "/",
    });
    const topBurgerLineClass = classNames(
        burgerLineBaseClass,
        burgerLineColorClass,
        {
            "translate-y-1 -rotate-45": mobileMenuOpen,
            "-translate-y-0.5": !mobileMenuOpen,
        },
    );
    const middleBurgerLineClass = classNames(
        "my-0.5",
        burgerLineBaseClass,
        burgerLineColorClass,
        {
            "opacity-0": mobileMenuOpen,
            "opacity-100": !mobileMenuOpen,
        },
    );
    const bottomBurgerLineClass = classNames(
        burgerLineBaseClass,
        burgerLineColorClass,
        {
            "-translate-y-1 rotate-45": mobileMenuOpen,
            "translate-y-0.5": !mobileMenuOpen,
        },
    );

    return (
        <div className="xl:hidden">
            <button
                onClick={() => setMobileMenuOpen((prevState) => !prevState)}
                className="flex cursor-pointer flex-col items-center justify-center"
            >
                <span className={topBurgerLineClass}></span>
                <span className={middleBurgerLineClass}></span>
                <span className={bottomBurgerLineClass}></span>
            </button>
        </div>
    );
};
