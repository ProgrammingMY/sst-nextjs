import { r2 } from "better-upload/server/helpers";
import { Resource } from "sst";

export const r2Client = r2({
    accountId: Resource.CLOUDFLARE_ACCOUNT_ID.value,
    accessKeyId: Resource.CLOUDFLARE_ACCESS_KEY_ID.value,
    secretAccessKey: Resource.CLOUDFLARE_SECRET_ACCESS_KEY.value,
});