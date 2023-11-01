import Link from "next/link";
import { useLogin } from "@/app/Contexts/LoginContext";
import { LogoutButton, LoginButton } from "@/app/Home/Components/LoginButtons";
import { IPAGES } from "../constants";
import { ILinks } from "./NavBar";

export interface IMobileMenuProps {
    links: ILinks[];
    currentPage: number;
    onPageTransition: (href: IPAGES) => void;
    mobileMenuOpen: boolean;
}

export default function MobileMenu({
    links,
    currentPage,
    onPageTransition,
    mobileMenuOpen,
}: IMobileMenuProps) {
    const { isLoggedIn } = useLogin();

    return (
        <div
            className={`w-full bg-black/50 backdrop-blur-sm transition-all duration-1000 ease-in-out ${
                mobileMenuOpen ? "h-screen scale-100" : "h-0 scale-0"
            }`}
            style={{
                transformOrigin: "top left",
                borderBottomRightRadius: "40rem",
            }}
        >
            <div
                className={`h-full w-full p-16 transition-opacity duration-700 ease-in-out ${
                    mobileMenuOpen ? "opacity-100" : "opacity-0"
                }`}
            >
                <ul className="flex flex-col gap-10">
                    {links.map((link, index) => (
                        <li key={link.href}>
                            <Link
                                href={link.href}
                                onClick={() =>
                                    onPageTransition(link.href as IPAGES)
                                }
                                className={`duration-300" w-full rounded-md p-4 text-2xl font-medium text-white transition-colors
                                    ${
                                        index === currentPage
                                            ? "bg-black"
                                            : " hover:bg-stone-800"
                                    }
                                `}
                            >
                                {link.text}
                            </Link>
                        </li>
                    ))}
                    <li className="mt-5">
                        {isLoggedIn ? <LogoutButton /> : <LoginButton />}
                    </li>
                </ul>
            </div>
        </div>
    );
}
