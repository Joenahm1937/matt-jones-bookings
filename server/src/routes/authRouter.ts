import express from "express";
import { getAuthURL, getTokens, revokeToken } from "../utils/googleAuth";
import { CLIENT_URL } from "../constants";
import { owner } from "../server";
import { GetLoginStatusResponse } from "../interfaces";

const router = express.Router();

router.get("/login", (req, res) => {
    res.redirect(getAuthURL());
});

router.get("/logout", (req, res) => {
    if (req.session && req.session.userTokens) {
        revokeToken(req.session.userTokens).catch((err) => {
            console.error("Failed to revoke Google access token:", err);
        });
    }

    req.session.destroy((err) => {
        if (err) {
            return res.status(500).send("Failed to logout");
        }
        res.clearCookie("connect.sid");
        res.redirect(CLIENT_URL);
    });
});

router.get("/isLoggedIn", (req, res) => {
    const isAuthenticated = !!(req.session && req.session.userTokens);
    const response: GetLoginStatusResponse = { loggedIn: isAuthenticated };
    res.json(response);
});

router.get("/owner-auth", (req, res) => {
    res.redirect(getAuthURL(owner.oAuth2Client));
});

router.get("/oauth2ClientCallback", async (req, res) => {
    const code = req.query.code as string;
    try {
        const { userTokens, email } = await getTokens(code);
        req.session.userTokens = userTokens;
        req.session.email = email;

        const redirectTo = req.session.redirectTo || CLIENT_URL;
        delete req.session.redirectTo;
        res.redirect(redirectTo);
    } catch (error: any) {
        res.status(500).send(`Error authenticating user: ${error.message}`);
    }
});

router.get("/oauth2OwnerCallback", async (req, res) => {
    const code = req.query.code as string;
    try {
        const { userTokens } = await getTokens(code, owner.oAuth2Client);
        await owner.saveTokensToRedis(userTokens);
        res.send("Successfully authenticated and stored tokens for the owner.");
    } catch (error: any) {
        res.status(500).send(`Error authenticating owner: ${error.message}`);
    }
});

export default router;
