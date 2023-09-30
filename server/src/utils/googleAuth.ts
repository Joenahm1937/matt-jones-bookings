import { google, oauth2_v2 } from "googleapis";
import { UserInfo } from "../interfaces";
import type { OAuth2Client, Credentials } from "google-auth-library";
import "dotenv/config";

const CLIENT_ID = process.env.CLIENT_ID!;
const CLIENT_SECRET = process.env.CLIENT_SECRET!;
const CLIENT_REDIRECT_URL = process.env.CLIENT_REDIRECT_URL!;

const oAuth2Client = new google.auth.OAuth2(
    CLIENT_ID,
    CLIENT_SECRET,
    CLIENT_REDIRECT_URL
);

function getAuthURL(oAuth2Owner?: OAuth2Client): string {
    const oAuth2Instance = oAuth2Owner || oAuth2Client;
    return oAuth2Instance.generateAuthUrl({
        access_type: "offline",
        scope: [
            "https://www.googleapis.com/auth/userinfo.email",
            "https://www.googleapis.com/auth/userinfo.profile",
            "https://www.googleapis.com/auth/calendar.events",
        ],
    });
}

async function getTokens(
    code: string,
    oAuth2Owner?: OAuth2Client
): Promise<UserInfo> {
    const oAuth2Instance = oAuth2Owner || oAuth2Client;
    try {
        const { tokens } = await oAuth2Instance.getToken(code);
        oAuth2Instance.setCredentials(tokens);

        const oauth2 = google.oauth2({ version: "v2", auth: oAuth2Instance });
        const response = await oauth2.userinfo.get();
        const userInfo: oauth2_v2.Schema$Userinfo = response.data;

        return {
            userTokens: tokens,
            email: userInfo.email || "",
        };
    } catch (err: any) {
        throw Error(`Error Retrieving token from google: ${err.message}`);
    }
}

async function revokeToken(tokens: Credentials): Promise<void> {
    oAuth2Client.setCredentials(tokens);
    try {
        await oAuth2Client.revokeCredentials();
    } catch (err: any) {
        throw Error(`Error revoking Google token: ${err.message}`);
    }
}

export { oAuth2Client, getAuthURL, getTokens, revokeToken };
