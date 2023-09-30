import path from "path";

export const REQUIRED_ENV_VARS = [
    "PORT",
    "IP_ADDR",
    "SESSION_SECRET",
    "CLIENT_ID",
    "CLIENT_SECRET",
    "CLIENT_REDIRECT_URL",
    "OWNER_REDIRECT_URL",
    "OWNER_CALENDAR_ID",
];
export const CLIENT_URL = "http://localhost:3000";
export const TOKEN_DIR_PATH = path.join(__dirname, "..", "keys");
export const TOKEN_FILE_PATH = path.join(TOKEN_DIR_PATH, "token.json");
