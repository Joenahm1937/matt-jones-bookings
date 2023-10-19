import { SERVER_URL } from "../Constants";

export const LoginButton = () => {
    return (
        <li>
            <button
                className="rounded-md bg-stone-500 px-8 py-2 text-lg font-medium text-white transition-colors duration-200 hover:text-black"
                onClick={async () => {
                    try {
                        window.location.href = `${SERVER_URL}/auth/login`;
                    } catch (error) {
                        console.error("There was an error:", error);
                    }
                }}
            >
                Login
            </button>
        </li>
    );
};

export const LogoutButton = () => {
    return (
        <li>
            <button
                className={`rounded-md bg-slate-500 px-6 py-2 text-lg font-medium text-white transition-colors duration-200 hover:text-black`}
                onClick={() => {
                    console.log("Logging out");
                }}
            >
                Logout
            </button>
        </li>
    );
};