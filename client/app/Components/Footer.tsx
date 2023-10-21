import {
    FaTwitter,
    FaFacebookF,
    FaInstagram,
    FaEnvelope,
} from "react-icons/fa";

export const Footer = () => (
    <footer className="mt-auto w-full bg-white bg-opacity-90 md:py-2 py-4 shadow-md">
        <div className="flex justify-center space-x-16">
            <a
                href="https://twitter.com/yourusername"
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors duration-300 hover:text-stone-700"
            >
                <FaTwitter size={24} color="#1DA1F2" />
            </a>
            <a
                href="https://facebook.com/yourusername"
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors duration-300 hover:text-stone-700"
            >
                <FaFacebookF size={24} color="#6f95c7" />
            </a>
            <a
                href="https://instagram.com/yourusername"
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors duration-300 hover:text-stone-700"
            >
                <FaInstagram size={24} color="#E4405F" />
            </a>
            <a
                href="mailto:youremail@example.com"
                className="flex items-center space-x-4 text-stone-500 transition-colors duration-300 hover:text-stone-700"
            >
                <FaEnvelope size={24} />
            </a>
        </div>
    </footer>
);
