import { MutableRefObject, RefObject } from "react";

export interface IScrollSectionProps {
    onVisible: () => void;
    children: React.ReactNode;
}

export interface ISection1Props {
    reference: RefObject<HTMLDivElement>;
    isVisible: boolean;
    backgroundVisible: boolean;
    isLoggedIn: boolean;
}

export interface ISection2Props {
    reference: RefObject<HTMLDivElement>;
    isVisible: boolean;
}

export interface ISection3Props {
    reference: RefObject<HTMLDivElement>;
    isVisible: boolean;
}

export interface ISection4Props {
    reference: RefObject<HTMLDivElement>;
    isVisible: boolean;
}

export type LinkHref = "/" | "/Booking" | "/MyEvents";

export interface IMenuLinksProps {
    linkStyle?: string;
    onClick?: () => void;
    handleRouteChange: (href: LinkHref) => void;
    menuItemsRef: MutableRefObject<(HTMLDivElement | null)[]>;
    activeLink?: number;
    isMobile?: boolean;
}

export interface IMobileMenuProps {
    topValue: string;
    isMenuOpen: boolean;
    hideMobileMenu: () => void;
    activeLink: number;
    handleRouteChange: (href: LinkHref) => void;
}

export interface IDesktopMenuProps {
    activeLink: number;
    handleRouteChange: (href: LinkHref) => void;
}

export interface IHamburgerIconProps {
    isMenuOpen: boolean;
    toggleMobileMenu: () => void;
}
