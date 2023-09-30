import express from "express";
import session from "express-session";
import RedisStore from "connect-redis";
import { createClient } from "redis";

import authRoutes from "./routes/auth";
import eventRoutes from "./routes/events";
import { UserInfo } from "./interfaces";
import { ensureAuthenticated } from "./utils/middleware";
import checkEnvVars from "./utils/envCheck";
import { Owner } from "./utils/Owner";
import "dotenv/config";

const app = express();

declare module "express-session" {
    interface SessionData extends UserInfo {}
}

checkEnvVars();
const PORT = process.env.PORT;
const IP_ADDR = process.env.IP_ADDR;

const CLIENT_ID = process.env.CLIENT_ID!;
const CLIENT_SECRET = process.env.CLIENT_SECRET!;
const OWNER_REDIRECT_URL = process.env.OWNER_REDIRECT_URL!;

// Redis
let redisClient = createClient();
redisClient.connect().catch((err) => {
    console.error("Error connecting to Redis:", err);
    process.exit(1);
});

let redisStore = new RedisStore({
    client: redisClient,
    prefix: "sessionStore:",
});

export const owner = new Owner(CLIENT_ID, CLIENT_SECRET, OWNER_REDIRECT_URL, redisClient);
owner.refreshTokenIfNeeded();

// Middleware
app.use(express.json());
app.use(
    session({
        store: redisStore,
        secret: process.env.SESSION_SECRET!,
        resave: false,
        saveUninitialized: false,
        cookie: {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 24 * 60 * 60 * 1000,
        },
    })
);

// Routes
app.use("/auth", authRoutes);
app.use("/events", ensureAuthenticated, eventRoutes);

app.listen(PORT, async () => {
    console.log(`Server started on http://${IP_ADDR}:${PORT}`);
});

// Handle graceful shutdown
process.on("SIGINT", () => {
    console.log("Gracefully shutting down...");
    redisClient.disconnect();
    process.exit(0);
});
