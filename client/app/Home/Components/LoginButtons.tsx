import { useState, useEffect, FC } from "react";
import { useLogin } from "@/app/Contexts/LoginContext";
import { AuthButtonProps } from "../interfaces";

const ANIMATION_DURATION = 400;

const AuthButton: FC<AuthButtonProps> = ({
    action,
    initialText,
    inProgressText,
}) => {
    const { login, logout } = useLogin();
    const [buttonText, setButtonText] = useState(initialText);
    const [buttonClicked, triggerButtonClicked] = useState(false);

    useEffect(() => {
        let timeoutId: NodeJS.Timeout;

        if (buttonClicked) {
            timeoutId = setTimeout(() => {
                setButtonText(inProgressText);
                if (action === "login") login();
                if (action === "logout") logout();
            }, ANIMATION_DURATION);
        }

        return () => {
            clearTimeout(timeoutId);
        };
    }, [buttonClicked, action, inProgressText, login, logout]);

    const handleClick = () => {
        triggerButtonClicked(true);
    };

    return (
        <button
            type="button"
            className={`transition-width rounded-md bg-[#82593e] px-6 py-2 text-lg font-medium text-white duration-500 ${
                buttonClicked ? "w-44" : "w-32"
            }`}
            onClick={handleClick}
        >
            {buttonText}
        </button>
    );
};

export const LoginButton: FC = () => (
    <AuthButton
        action="login"
        initialText="Login"
        inProgressText="Logging in..."
    />
);

export const LogoutButton: FC = () => (
    <AuthButton
        action="logout"
        initialText="Logout"
        inProgressText="Logging out..."
    />
);
