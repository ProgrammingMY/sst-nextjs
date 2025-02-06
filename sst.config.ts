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

    // create secret for better-upload, get the access key id and secret access key from the cloudflare dashboard
    const cfSecret = {
      CLOUDFLARE_ACCOUNT_ID: new sst.Secret("CLOUDFLARE_ACCOUNT_ID"),
      CLOUDFLARE_ACCESS_KEY_ID: new sst.Secret("CLOUDFLARE_ACCESS_KEY_ID"),
      CLOUDFLARE_SECRET_ACCESS_KEY: new sst.Secret("CLOUDFLARE_SECRET_ACCESS_KEY"),
    }

    const bucketLinkable = new sst.Linkable("BucketLinkable", {
      properties: {
        publicBucketName: publicBucket.name,
        privateBucketName: privateBucket.name,
      }
    })

    const email = new sst.aws.Email("Email", {
      sender: "notify.kelastech.com",
      dns: sst.cloudflare.dns({
        zone: process.env.CLOUDFLARE_ZONE_ID!,
        proxy: false,
      }),
      dmarc: "v=DMARC1; p=none;"
    });

    new sst.aws.Nextjs("KelasTechWeb", {
      link: [publicBucket, privateBucket, email, bucketLinkable, cfSecret.CLOUDFLARE_ACCOUNT_ID, cfSecret.CLOUDFLARE_ACCESS_KEY_ID, cfSecret.CLOUDFLARE_SECRET_ACCESS_KEY],
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
