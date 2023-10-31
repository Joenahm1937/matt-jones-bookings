import { Dispatch, MutableRefObject, SetStateAction, useRef } from "react";
import Link from "next/link";
import { useLogin } from "@/app/Contexts/LoginContext";
import { LogoutButton, LoginButton } from "@/app/Home/Components/LoginButtons";
import classNames from "classnames";
import { IPAGES } from "../constants";

export interface IMobileMenuProps {
    currentPage: number;
    onPageTransition: (href: IPAGES) => void;
    mobileMenuOpen: boolean;
}

export default function MobileMenu({
    currentPage,
    onPageTransition,
    mobileMenuOpen,
}: IMobileMenuProps) {
    const { isLoggedIn } = useLogin();

    const menuContainerClass = classNames(
        "absolute w-full overflow-hidden rounded-b-lg bg-opacity-90 transition-all ease-in-out z-10",
        {
            "max-h-[500px] opacity-100 transition-opacity duration-300 px-2 py-4":
                mobileMenuOpen,
            "max-h-0 opacity-0 transition-opacity duration-700":
                !mobileMenuOpen,
        },
    );

    return (
        <div className={menuContainerClass}>
            <ul className="flex flex-col gap-2">
                <div className="ml-2 w-full">
                    <MenuLinks
                        menuItemsRef={useRef<(HTMLDivElement | null)[]>([])}
                        currentPage={currentPage}
                        onPageTransition={onPageTransition}
                    />
                    <ul className="px-3 pt-5">
                        {isLoggedIn ? <LogoutButton /> : <LoginButton />}
                    </ul>
                </div>
            </ul>
        </div>
    );
}

export interface IMenuLinksProps {
    menuItemsRef: MutableRefObject<(HTMLDivElement | null)[]>;
    currentPage: number;
    onPageTransition: (href: IPAGES) => void;
}

const MenuLinks = ({
    menuItemsRef,
    currentPage,
    onPageTransition,
}: IMenuLinksProps) => {
    const { isLoggedIn } = useLogin();
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
                    {
                        "w-[32%] rounded-3xl bg-stone-300":
                            index === currentPage,
                    },
                )}
            >
                {link.text}
                <span className="absolute bottom-0 left-0 h-0.5 w-0 transform bg-stone-500 transition-all duration-200 group-hover:w-full"></span>
            </Link>
        </div>
    ));
};
