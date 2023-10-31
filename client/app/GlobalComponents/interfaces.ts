import { MutableRefObject } from "react";

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