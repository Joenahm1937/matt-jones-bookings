import { SERVER_URL } from "../Constants";

export const fetchEvents = async () => {
    const response = await fetch(`${SERVER_URL}/protected/userEvents`, {
        credentials: "include",
    });
    if (!response.ok) {
        throw new Error("Network response was not ok");
    }
    return response.json();
};
