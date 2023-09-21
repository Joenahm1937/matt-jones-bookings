export interface IEnvironmentVars {
    CLIENT_ID: string;
    CLIENT_SECRET: string;
    REDIRECT_URL: string;
    CLIENT_URL: string;
    PORT: string;
    SESSION_SECRET: string;
    SERVICE_ACCOUNT_KEY_FILENAME: string;
    OWNER_CALENDAR_ID: string;
}

export interface IServiceAccount {
    type: string;
    project_id: string;
    private_key_id: string;
    private_key: string;
    client_email: string;
    client_id: string;
    auth_uri: string;
    token_uri: string;
    auth_provider_x509_cert_url: string;
    client_x509_cert_url: string;
    universe_domain: string;
}
