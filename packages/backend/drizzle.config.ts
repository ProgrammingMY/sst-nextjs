import { defineConfig } from "drizzle-kit";
import { Resource } from "sst";

export default defineConfig({
    dialect: "sqlite",
    schema: "./schema.ts",
    out: "./migrations",
    driver: "d1-http",
    dbCredentials: {
        accountId: Resource.CfResources.accountId,
        databaseId: Resource.CfResources.dbId,
        token: Resource.CloudflareD1ApiToken.value,
    }
});