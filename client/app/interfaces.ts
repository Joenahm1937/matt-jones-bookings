export interface IPhoto {
    src: string;
    alt: string;
    description: string;
}

export interface ICardProps {
    photo: IPhoto;
    isActive: boolean;
    isLeft: boolean;
    isRight: boolean;
    showAdjacentImages: boolean;
}

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
