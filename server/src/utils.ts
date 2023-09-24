import fs from "fs";
import dotenv from "dotenv";
import { google } from "googleapis";

import {
    requiredEnvironmentVariables,
    serverURL,
    keyDirectoryPath,
    keyFilePath,
    redirectURLs,
} from "./constants";
import { User } from "./interfaces";

dotenv.config();

/**
 * Ensures all critical environment variables are set.
 * Throws an error and exits the application if any are missing.
 */
export const validateEnvVariables = (): void => {
    const missingEnvironmentVariables = requiredEnvironmentVariables.filter(
        (variable) => !process.env[variable]
    );

    if (missingEnvironmentVariables.length) {
        throw new Error(`🔥 The following environment variables are missing:
        ${missingEnvironmentVariables.join(", ")}
        Exiting application.`);
    } else {
        console.log("✅ All Required Environment Variables Loaded");
    }
};

/**
 * Retrieves the owner's refresh token from a file.
 *
 * @returns {string | null} The refresh token if found, otherwise null.
 */
export function getOwnerRefreshTokenFromFile(): string | null {
    try {
        if (fs.existsSync(keyFilePath)) {
            const refreshToken = fs.readFileSync(keyFilePath, "utf8");
            console.log("✅ Owner token retrieved successfully from file");
            return refreshToken;
        } else {
            console.log(
                `✋ Owner needs to authenticate for calendar usage. Navigate to ${serverURL}/auth-url-owner`
            );
            return null;
        }
    } catch (error) {
        console.error("Error reading the refresh token from file:", error);
        return null;
    }
}

/**
 * Persists the owner's refresh token to a file.
 *
 * @param refreshToken - The refresh token to be stored.
 */
export function setOwnerRefreshTokenFromFile(refreshToken: string): void {
    if (!fs.existsSync(keyDirectoryPath)) {
        fs.mkdirSync(keyDirectoryPath, { recursive: true });
    }

    fs.writeFileSync(keyFilePath, refreshToken, "utf8");
}

/**
 * Retrieves or initializes a user's session containing the OAuth client and calendar instance.
 *
 * @param req - The Express request object.
 * @returns {User} The User object containing the OAuth2 client and Google Calendar instance.
 */
export function getUserSession(req: Express.Request): User {
    if (!req.session.user) {
        const oauth2Client = new google.auth.OAuth2(
            process.env.CLIENT_ID,
            process.env.CLIENT_SECRET,
            redirectURLs.client
        );
        const calendar = google.calendar({ version: "v3", auth: oauth2Client });
        Object.assign(req.session, {
            user: { oauth2Client, calendar },
        });
    }
    return req.session.user as User;
}
