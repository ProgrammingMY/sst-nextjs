import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "./db";
import * as schema from "@/drizzle/schema";
import { nextCookies } from "better-auth/next-js";


export const auth = betterAuth({
    trustedOrigins: process.env.NODE_ENV === "development" ? ["http://localhost:3000"] : ["https://kelastech.com"],
    baseURL: process.env.NODE_ENV === "development" ? "http://localhost:3000" : "https://kelastech.com",
    database: drizzleAdapter(db, {
        provider: "pg",
        schema
    }),
    emailAndPassword: {
        enabled: true,
    },
    advanced: {
        cookiePrefix: "kt",
    },
    plugins: [
        nextCookies()
    ]
})