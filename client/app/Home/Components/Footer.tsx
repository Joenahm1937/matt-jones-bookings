import {
    FaTwitter,
    FaFacebookF,
    FaInstagram,
    FaEnvelope,
} from "react-icons/fa";

interface SocialLinkProps {
    href: string;
    icon: JSX.Element;
    color?: string;
}

export default function Footer() {
    const socialLinks: SocialLinkProps[] = [
        {
            href: "https://twitter.com/yourusername",
            icon: <FaTwitter size={24} color="#1DA1F2" />,
        },
        {
            href: "https://facebook.com/yourusername",
            icon: <FaFacebookF size={24} color="#6f95c7" />,
        },
        {
            href: "https://instagram.com/yourusername",
            icon: <FaInstagram size={24} color="#E4405F" />,
        },
        {
            href: "mailto:youremail@example.com",
            icon: <FaEnvelope size={24} />,
        },
    ];

    return (
        <footer className="mt-auto w-full bg-white bg-opacity-90 py-4 shadow-md md:py-2">
            <div className="flex justify-center space-x-16">
                {socialLinks.map((link, index) => (
                    <a
                        key={index}
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="transition-colors duration-300 hover:text-stone-700"
                    >
                        {link.icon}
                    </a>
                ))}
            </div>
        </footer>
    );
}
