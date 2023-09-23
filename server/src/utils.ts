import fs from "fs";
import dotenv from "dotenv";
dotenv.config();
import {
    requiredEnvironmentVariables,
    serverURL,
    keyDirectoryPath,
    keyFilePath,
} from "./constants";

/**
 * Ensure all environment variables are defined, or else exits the script
 */
export const validateEnvVariables = (): void => {
    const missingEnvironmentVariables = requiredEnvironmentVariables.filter(
        (variable) => !process.env[variable]
    );

    if (missingEnvironmentVariables.length) {
        throw new Error(`\n 🔥 The following environment variables are not set:
        ${missingEnvironmentVariables.join(", ")}
        Missing critical environment variables. Exiting application \n`);
    } else {
        console.log("✅ All Required Environment Variables Loaded");
    }
};

/**
 * Retrieves the refresh token for the owner from a file.
 * @returns {string | null} The refresh token if it exists, otherwise null.
 */
export function getOwnerRefreshTokenFromFile(): string | null {
    try {
        if (fs.existsSync(keyFilePath)) {
            const refreshToken = fs.readFileSync(keyFilePath, "utf8");
            console.log("✅ Owner token retrieved successfully from file");
            return refreshToken;
        } else {
            console.log(
                `✋ Owner needs to authenticate for calendar usage. Please navigate to ${serverURL}/auth-url-owner`
            );
            return null;
        }
    } catch (error) {
        console.error("Error reading the refresh token from file:", error);
        return null;
    }
}

/**
 * Writes the refresh token for the owner to a file.
 * @param refreshToken The Google API refresh token that allows us to reauthenticate the owner's OAuth client
 */
export function setOwnerRefreshTokenFromFile(refreshToken: string): void {
    if (!fs.existsSync(keyDirectoryPath)) {
        fs.mkdirSync(keyDirectoryPath, { recursive: true });
    }

    fs.writeFileSync(keyFilePath, refreshToken, "utf8");
}
