"use server";

import { auth } from "@/auth";
import { headers } from "next/headers";

import { db } from "@/db";
import * as schema from "@/drizzle/app-schema";
import { and } from "drizzle-orm";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export const updateCourse = async (
    courseSlug: string,
    formData: FormData
) => {
    try {
        const session = await auth.api.getSession({
            headers: await headers()
        })

        if (!session) {
            return {
                status: "401",
                message: "Unauthorized"
            }
        }

        // get all values from the formdata object
        const values = Object.fromEntries(formData);

        console.log("[VALUES]: ", values);

        await db.update(schema.course)
            .set({ ...values })
            .where(and(
                eq(schema.course.slug, courseSlug),
                eq(schema.course.userId, session.user.id)
            ))

        revalidatePath(`/teacher/courses/${courseSlug}`);

        return {
            status: "201",
            message: "Course updated successfully"
        }

    } catch (error) {
        console.log("[UPDATE COURSE ERROR]: ", error);
        return {
            status: "500",
            message: "Internal server error"
        }
    }
}

