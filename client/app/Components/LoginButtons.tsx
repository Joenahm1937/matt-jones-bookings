import { useState } from "react";
import { useLogin } from "../GlobalContext";

export const LoginButton = () => {
    const { login } = useLogin();
    const [loginText, setLoginText] = useState("Login");
    const [buttonClicked, triggerButtonClicked] = useState(false);

    const handleClick = () => {
        triggerButtonClicked(true);

        // Wait for the width animation to complete, then change the text and call login
        setTimeout(() => {
            setLoginText("Logging in...");
            login();
        }, 200); // Delay for 500ms (duration of animation)
    };

    return (
        <button
            className={`transition-width rounded-md bg-stone-500 px-8 py-2 text-lg font-medium text-white duration-500
                    ${buttonClicked ? "w-44" : "w-32"}`}
            onClick={handleClick}
        >
            {loginText}
        </button>
    );
};

export const LogoutButton = () => {
    const { logout } = useLogin();
    const [logoutText, setLogoutText] = useState("Logout");
    const [buttonClicked, triggerButtonClicked] = useState(false);

    const handleClick = () => {
        triggerButtonClicked(true);

        setTimeout(() => {
            setLogoutText("Logging out...");
            logout();
        }, 200);
    };

    return (
        <li>
            <button
                className={`transition-width rounded-md bg-slate-500 px-6 py-2 text-lg font-medium text-white duration-500
                    ${buttonClicked ? "w-44" : "w-32"}`}
                onClick={handleClick}
            >
                {logoutText}
            </button>
        </li>
    );
};
