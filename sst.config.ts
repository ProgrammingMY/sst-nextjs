/// <reference path="./.sst/platform/config.d.ts" />

export default $config({
  app(input) {
    return {
      name: "sst-nextjs",
      removal: input?.stage === "production" ? "retain" : "remove",
      protect: ["production"].includes(input?.stage),
      home: "aws",
      providers: {
        aws: true,
        cloudflare: true
      },
    };
  },
  async run() {
    // cloudflare resources
    const db = new sst.cloudflare.D1("KelasTechDB");

    const dbData = new sst.Linkable("CfResources", {
      properties: {
        accountId: db.nodes.database.accountId,
        dbId: db.id,
      },
    });

    // cloudflare d1 secret
    const secret = {
      CloudflareD1ApiToken: new sst.Secret("CloudflareD1ApiToken")
    };

    // Hono API cloudflare
    const api = new sst.cloudflare.Worker("KelasTechApi", {
      handler: "./packages/backend/src/index",
      link: [db, dbData, secret.CloudflareD1ApiToken],
      url: true,
      domain: "api.kelastech.com",
    });

    new sst.aws.Nextjs("KelasTechWeb", {
      link: [api],
      environment: {
        NEXT_PUBLIC_API_URL: api.url,
      },
      domain: {
        name: "kelastech.com",
        dns: sst.cloudflare.dns({
          zone: process.env.CLOUDFLARE_ZONE_ID!,
          proxy: false,
          override: true,
        }),
      }
    });
  },
});
