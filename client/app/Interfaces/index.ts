import { RefObject } from "react";

export interface IBackgroundImageProps {
    isVisible: boolean;
}

export interface IContentOverlayProps {
    isVisible: boolean;
    isLoggedIn: boolean;
}

export interface IScrollSectionProps {
    onVisible: () => void;
    children: React.ReactNode;
}

export interface ISection1Props {
    reference: RefObject<HTMLDivElement>
    isVisible: boolean;
    backgroundVisible: boolean;
    isLoggedIn: boolean;
}

export interface ISection2Props {
    reference: RefObject<HTMLDivElement>
    isVisible: boolean;
}

export interface ISection3Props {
    reference: RefObject<HTMLDivElement>
    isVisible: boolean;
}

export interface ISection4Props {
    reference: RefObject<HTMLDivElement>
    isVisible: boolean;
}

// export interface IPhoto {
//     src: string;
//     alt: string;
//     description: string;
// }

// export interface ICardProps {
//     photo: IPhoto;
//     isActive: boolean;
//     isLeft: boolean;
//     isRight: boolean;
//     showAdjacentImages: boolean;
// }

export interface IMenuLinksProps {
    linkStyle?: string;
    onClick?: () => void;
}

export interface IMobileMenuProps {
    topValue: string;
    isMenuOpen: boolean;
    hideMobileMenu: () => void;
}

export interface IHamburgerIconProps {
    isMenuOpen: boolean;
    toggleMobileMenu: () => void;
}
