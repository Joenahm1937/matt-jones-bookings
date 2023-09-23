export const requiredEnvironmentVariables = [
    "CLIENT_ID",
    "CLIENT_SECRET",
    "CLIENT_URL",
    "PORT",
    "SERVICE_ACCOUNT_KEY_FILENAME",
    "OWNER_CALENDAR_ID",
];

export const redirectURLs = {
    client: "http://localhost:3001/OAuth2ClientCallback",
    owner: "http://localhost:3001/OAuth2OwnerCallback",
};
