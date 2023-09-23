import dotenv from "dotenv";
dotenv.config();
import { requiredEnvironmentVariables } from "./constants";

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
        Missing critical environment variables. Exiting application \n`
        );
    } else {
        console.log("✅ All Required Environment Variables Loaded")
    }
};
