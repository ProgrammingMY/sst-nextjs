import { createAuthClient } from "better-auth/react"

export const authClient = createAuthClient({
    baseURL: process.env.NODE_ENV === "development" ? "http://localhost:3000" : process.env.BETTER_AUTH_URL!
})