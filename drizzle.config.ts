import { defineConfig } from "drizzle-kit";

export default defineConfig({
    schema: "./drizzle/*",
    dialect: "postgresql",
    out: "./migrations",
    dbCredentials: {
        url: process.env.DATABASE_URL!
    }
});