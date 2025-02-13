"use server";

import { auth } from "@/auth";
import { headers } from "next/headers";
import { Resource } from "sst";

export const downloadObject = async (objectKey: string) => {
    try {
        const session = await auth.api.getSession({
            headers: await headers()
        })

        if (!session) {
            return {
                status: 401,
                body: {
                    error: "Unauthorized"
                }
            }
        }

        // Get the file directly from R2 using decoded key
        const object = await Resource.PublicBucket.get(objectKey);

        if (!object) {
            return {
                status: 404,
                body: {
                    error: "Object not found"
                }
            }
        }

        // Return the file stream directly
        return {
            status: 200,
            body: object.body,
        };
    } catch (error) {
        console.log("[GET_OBJECT ERROR]", error);
        return {
            status: 500,
            body: {
                error: "Internal Server Error"
            }
        }
    }
}