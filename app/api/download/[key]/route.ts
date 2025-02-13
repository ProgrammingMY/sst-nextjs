import { Resource } from "sst";
import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { headers } from "next/headers";

import { r2Client } from "@/lib/r2-client";
import { GetObjectCommand } from "@aws-sdk/client-s3";
export const GET = async (request: Request, { params }: { params: { key: string } }) => {
    try {
        const session = await auth.api.getSession({
            headers: await headers()
        })

        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { key } = await params;

        // Decode the key before using it
        const decodedKey = decodeURIComponent(key);

        const object = await r2Client.send(
            new GetObjectCommand({
                Bucket: Resource.BucketLinkable.publicBucketName,
                Key: decodedKey
            })
        )

        if (!object) {
            return NextResponse.json({ error: "Object not found" }, { status: 404 });
        }

        // Get content type from the object metadata, fallback to octet-stream
        const contentType = object.ContentType || 'application/octet-stream';

        // Create response with the object's body stream and appropriate headers
        return new NextResponse(object.Body?.transformToWebStream(), {
            status: 200,
            headers: {
                'Content-Type': contentType,
                'Content-Length': object.ContentLength?.toString() || '',
                'Content-Disposition': `attachment; filename="${decodedKey}"`,
            },
        });
    } catch (error) {
        console.log("[DOWNLOAD_ERROR]: ", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
