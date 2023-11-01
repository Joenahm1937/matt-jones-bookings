"use client";

import { useState, useEffect, useRef, Dispatch, SetStateAction } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useLogin } from "@/app/Contexts/LoginContext";
import { useGlobalStyles } from "@/app/Contexts/StylesContext";
import DesktopMenu from "./NavDesktopView";
import MobileMenu from "./NavMobileView";
import classNames from "classnames";

import { IPAGES, PAGES, WEBSITE_TITLE } from "@/app/constants";

export interface ILinks {
    href: string;
    text: string;
}

export default function NavBar() {
    const pathname = usePathname();
    const headerRef = useRef<HTMLDivElement | null>(null);
    const { isLoggedIn } = useLogin();
    const { setNavHeight } = useGlobalStyles();

    const [currentPage, setCurrentPage] = useState<number>(
        PAGES[pathname as IPAGES],
    );
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [screenSize, setScreenSize] = useState(false);

    const onPageTransition = (href: IPAGES) => {
        setMobileMenuOpen(false);
        setCurrentPage(PAGES[href]);
    };

    useEffect(() => {
        const updateNavHeight = () => {
            if (headerRef.current) {
                setNavHeight(`${headerRef.current.offsetHeight}px`);
            }
        };

        updateNavHeight();

        const handleScreenChange = () => {
            setScreenSize((prev) => !prev);
            setMobileMenuOpen(false);
        };

        const mediaQuery = window.matchMedia("(min-width: 1280px)");
        mediaQuery.addEventListener("change", handleScreenChange);

        return () => {
            mediaQuery.removeEventListener("change", handleScreenChange);
        };
    }, [setNavHeight]);

    const links: ILinks[] = [
        { href: "/", text: "Home" },
        { href: "/Booking", text: "Booking" },
        ...(isLoggedIn ? [{ href: "/MyEvents", text: "My Events" }] : []),
    ];

    return (
        <div className="fixed z-50 w-full">
            <header ref={headerRef} className="py-1 shadow-md">
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
                        links={links}
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
                links={links}
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

const HamburgerIcon: React.FC<IHamburgerIconProps> = ({
    mobileMenuOpen,
    setMobileMenuOpen,
}) => {
    const pathname = usePathname();
    const baseClass =
        "block h-0.5 w-6 rounded-sm transition-all duration-300 ease-out";
    const colorClass = classNames({
        "bg-white": pathname === "/",
        "bg-stone-500": pathname !== "/",
    });

    const topLineClass = classNames(baseClass, colorClass, {
        "translate-y-1 -rotate-45": mobileMenuOpen,
        "-translate-y-0.5": !mobileMenuOpen,
    });

    const middleLineClass = classNames("my-0.5", baseClass, colorClass, {
        "opacity-0": mobileMenuOpen,
        "opacity-100": !mobileMenuOpen,
    });

    const bottomLineClass = classNames(baseClass, colorClass, {
        "-translate-y-1 rotate-45": mobileMenuOpen,
        "translate-y-0.5": !mobileMenuOpen,
    });

    return (
        <div className="xl:hidden">
            <button
                onClick={() => setMobileMenuOpen((prev) => !prev)}
                className="flex cursor-pointer flex-col items-center justify-center"
            >
                <span className={topLineClass}></span>
                <span className={middleLineClass}></span>
                <span className={bottomLineClass}></span>
            </button>
        </div>
    );
};
