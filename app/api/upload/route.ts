import { createUploadRouteHandler, route, UploadFileError } from 'better-upload/server';
import { Resource } from 'sst';

import { r2 } from 'better-upload/server/helpers';

import { auth } from '@/auth';
import { headers } from 'next/headers';

export const r2Client = r2({
  accountId: Resource.CLOUDFLARE_ACCOUNT_ID.value,
  accessKeyId: Resource.CLOUDFLARE_ACCESS_KEY_ID.value,
  secretAccessKey: Resource.CLOUDFLARE_SECRET_ACCESS_KEY.value,
});

export const { POST } = createUploadRouteHandler({
  client: r2Client,
  bucketName: Resource.BucketLinkable.publicBucketName,
  routes: {
    courseImage: route({
      fileTypes: ['image/*'],
    }),
    courseAttachment: route({
      fileTypes: [
        "image/*",
        "application/pdf",
        "application/json",
        "application/vnd.openxmlformats-officedocument.presentationml.presentation",
        "application/vnd.openxmlformats.officedocument.wordprocessingml.document",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "application/x-zip-compressed",
        "application/zip",
      ],
      multipleFiles: true,
      maxFileSize: 1024 * 1024 * 10,
      maxFiles: 5,
      onBeforeUpload: async () => {
        const session = await auth.api.getSession({
          headers: await headers()
        })

        if (!session) {
          throw new UploadFileError("Not authenticated");
        }
      },
    }),
  },
});