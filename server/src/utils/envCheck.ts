import { REQUIRED_ENV_VARS } from "../constants";

function checkEnvVars(): void {
    const missingVars = REQUIRED_ENV_VARS.filter(
        (envVar) => process.env[envVar] === undefined
    );
    if (missingVars.length) {
        console.error(
            `Missing required environment variables: ${missingVars.join(", ")}`
        );
        process.exit(1);
    }
    console.log(
        `Server running in ${
            process.env.NODE_ENV === "production" ? "PROD" : "DEV"
        }`
    );
}

export default checkEnvVars;
