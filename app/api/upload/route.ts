import { createUploadRouteHandler, route } from 'better-upload/server';
import { Resource } from 'sst';

import { r2 } from 'better-upload/server/helpers';
 
const client = r2({
  accountId: Resource.CLOUDFLARE_ACCOUNT_ID.value,
  accessKeyId: Resource.CLOUDFLARE_ACCESS_KEY_ID.value,
  secretAccessKey: Resource.CLOUDFLARE_SECRET_ACCESS_KEY.value,
});
 
export const { POST } = createUploadRouteHandler({
  client: client,
  bucketName: Resource.BucketLinkable.publicBucketName, 
  routes: {
    courseImage: route({
      fileTypes: ['image/*'],
    }),
  },
});