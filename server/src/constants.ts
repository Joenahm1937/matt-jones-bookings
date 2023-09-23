import path from "path";
import { IEnvironmentVars } from "./interfaces";

export const serverURL = "http://localhost:3001";

export const redirectURLs = {
    client: `${serverURL}/OAuth2ClientCallback`,
    owner: `${serverURL}/OAuth2OwnerCallback`,
};

export const requiredEnvironmentVariables: Array<keyof IEnvironmentVars> = [
    "CLIENT_ID",
    "CLIENT_SECRET",
    "CLIENT_URL",
    "PORT",
    "SESSION_SECRET",
    "OWNER_CALENDAR_ID",
    "OWNER_AUTH_PASSPHRASE",
];

export const keyDirectoryPath = path.join(__dirname, "..", "keys");
export const keyFilePath = path.join(keyDirectoryPath, "owner_refresh_token.txt");
