export const HOME_HEADER = "Matt's Bookings";
export const HOME_SUBHEADER =
    "You take care of each other, and I'll take care of the rest";
export const WEBSITE_TITLE = "Matt's Bookings";
export const SERVER_URL = "http://localhost:3001";
export const CLIENT_URL = "http://localhost:3000";
export const OWNER_EMAIL = "mattjonesbookings@gmail.com";

export const PAGES = {
    "/": 0,
    "/Booking": 1,
    "/MyEvents": 2,
} as const;
export type IPAGES = keyof typeof PAGES;