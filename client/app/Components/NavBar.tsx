"use client";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { WEBSITE_TITLE } from "../Constants";
import {
    IDesktopMenuProps,
    IHamburgerIconProps,
    IMenuLinksProps,
    IMobileMenuProps,
    LinkHref,
} from "../Interfaces";
import { LoginButton, LogoutButton } from "./LoginButtons";
import { useGlobalStyles, useLogin } from "../GlobalContext";
import { useLoading } from "../template";

export default function NavBar() {
    const headerRef = useRef<HTMLDivElement | null>(null);
    const [isMenuOpen, setMenuOpen] = useState(false);
    const [activeLink, setActiveLink] = useState<number>(0);
    const { navHeight, setNavHeight } = useGlobalStyles();

    const toggleMobileMenu = () => setMenuOpen((prevState) => !prevState);
    const hideMobileMenu = () => setMenuOpen(false);

    // Update the active link when the pathname changes
    const handleRouteChange = (href: LinkHref) => {
        const linkOrderMap: Record<LinkHref, number> = {
            "/": 0,
            "/Booking": 1,
            "/MyEvents": 2,
        };
        setActiveLink(linkOrderMap[href as LinkHref]);
    };

    const pathname = usePathname();

    useEffect(() => {
        if (headerRef.current) {
            setNavHeight(`${headerRef.current.offsetHeight}px`);
        }

        handleRouteChange(pathname as LinkHref);

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
                        activeLink={activeLink}
                        handleRouteChange={handleRouteChange}
                    />
                    <HamburgerIcon
                        isMenuOpen={isMenuOpen}
                        toggleMobileMenu={toggleMobileMenu}
                    />
                </nav>
            </header>
            <MobileMenu
                isMenuOpen={isMenuOpen}
                hideMobileMenu={hideMobileMenu}
                topValue={navHeight}
                activeLink={activeLink}
                handleRouteChange={handleRouteChange}
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
    const {
        linkStyle,
        onClick,
        handleRouteChange,
        menuItemsRef,
        activeLink,
        isMobile,
    } = props;
    const { loading, setLoading } = useLoading();
    const { isLoggedIn } = useLogin();
    const links = [
        { href: "/", text: "Home" },
        { href: "/Booking", text: "Booking" },
    ];
    if (isLoggedIn) links.push({ href: "/MyEvents", text: "My Events" });
    const onPageTransition = (href: LinkHref) => {
        handleRouteChange(href);
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
    return links.map((link, index) => (
        <div
            className={index === activeLink ? "active" : ""}
            key={link.href}
            ref={(el) => (menuItemsRef.current[index] = el)}
        >
            <Link
                key={link.href}
                onClick={() => onPageTransition(link.href as LinkHref)}
                href={link.href}
                className={`relative flex w-full whitespace-nowrap px-4 py-2 text-center text-lg font-medium transition-colors duration-200 sm:px-16 ${linkStyle} ${
                    isMobile && index === activeLink
                        ? "w-1/3 rounded-lg bg-stone-300"
                        : ""
                }`}
            >
                {link.text}
                <span className="absolute bottom-0 left-0 h-0.5 w-0 transform bg-stone-500 transition-all duration-200 group-hover:w-full"></span>
            </Link>
        </div>
    ));
};

const DesktopMenu = (props: IDesktopMenuProps) => {
    const { handleRouteChange, activeLink } = props;
    const { isLoggedIn } = useLogin();
    const [underlineStyle, setUnderlineStyle] = useState({
        left: "0%",
        width: "0%",
    });
    const menuItemsRef = useRef<(HTMLDivElement | null)[]>([]);

    const updateUnderlineStyle = () => {
        const menuItem = menuItemsRef.current[activeLink];
        if (menuItem) {
            const parentRect = menuItem.parentElement!.getBoundingClientRect();
            const menuItemRect = menuItem.getBoundingClientRect();
            setUnderlineStyle({
                left: `${
                    ((menuItemRect.left - parentRect.left) / parentRect.width) *
                    100
                }%`,
                width: `${(menuItemRect.width / parentRect.width) * 100}%`,
            });
        }
    };

    const handleResize = () => {
        const activeMenuItem = menuItemsRef.current.find(
            (item) => item && item.classList.contains("active"),
        );
        if (activeMenuItem) {
            const parentRect =
                activeMenuItem.parentElement!.getBoundingClientRect();
            const menuItemRect = activeMenuItem.getBoundingClientRect();
            setUnderlineStyle({
                left: `${
                    ((menuItemRect.left - parentRect.left) / parentRect.width) *
                    100
                }%`,
                width: `${(menuItemRect.width / parentRect.width) * 100}%`,
            });
        }
    };

    useEffect(() => {
        updateUnderlineStyle();
    }, [activeLink, isLoggedIn]);

    useEffect(() => {
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    return (
        <div className="hidden xl:block">
            <ul className="flex">
                <div className="mr-10 flex-col">
                    <div className="flex">
                        <MenuLinks
                            handleRouteChange={handleRouteChange}
                            menuItemsRef={menuItemsRef}
                            activeLink={activeLink}
                        />
                    </div>
                    <div className="relative flex h-[2px] w-full">
                        <div
                            className="absolute h-full bg-black transition-all duration-1000"
                            style={underlineStyle}
                        ></div>
                    </div>
                </div>
                {isLoggedIn ? <LogoutButton /> : <LoginButton />}
            </ul>
        </div>
    );
};

const MobileMenu = (props: IMobileMenuProps) => {
    const { isLoggedIn } = useLogin();
    const {
        topValue,
        isMenuOpen,
        hideMobileMenu,
        handleRouteChange,
        activeLink,
    } = props;

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
                    <MenuLinks
                        onClick={hideMobileMenu}
                        linkStyle=""
                        handleRouteChange={handleRouteChange}
                        menuItemsRef={useRef<(HTMLDivElement | null)[]>([])}
                        activeLink={activeLink}
                        isMobile={true}
                    />
                    <ul className="px-3 pt-5">
                        {isLoggedIn ? <LogoutButton /> : <LoginButton />}
                    </ul>
                </div>
            </ul>
        </div>
    );
};
