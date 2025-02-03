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
    const publicBucket = new sst.cloudflare.Bucket("PublicBucket");
    const privateBucket = new sst.cloudflare.Bucket("PrivateBucket");

    const email = new sst.aws.Email("Email", {
      sender: "notify.kelastech.com",
      dns: sst.cloudflare.dns({
        zone: process.env.CLOUDFLARE_ZONE_ID!,
        proxy: false,
      }),
      dmarc: "v=DMARC1; p=none;"
    });

    new sst.aws.Nextjs("KelasTechWeb", {
      link: [publicBucket, privateBucket, email],
      domain: {
        name: "kelastech.com",
        dns: sst.cloudflare.dns({
          zone: process.env.CLOUDFLARE_ZONE_ID!,
          proxy: false,
          override: true
        }),
      }
    });
  },
});
