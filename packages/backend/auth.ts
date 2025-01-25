import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import * as schema from "./schema";
import { db } from "./drizzle";

export const setAuth = () => betterAuth({
    trustedOrigins: ["http://localhost:3000", "https://kelastech.com"],
    baseURL: "https://kelastech.com",
    database: drizzleAdapter(db(), {
        provider: "sqlite",
        schema: {
            ...schema
        },
    }),
    emailAndPassword: {
        enabled: true,
    },
    advanced: {
        cookiePrefix: "kelastech",
        crossSubDomainCookies: {
            enabled: true,
        },
    }
    // socialProviders: {
    //     google: {
    //         clientId: process.env.GOOGLE_CLIENT_ID!,
    //         clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    //         enabled: true,
    //     }
    // }
})
