"use server";

import { auth } from "@/auth";
import { headers } from "next/headers";

import * as schema from "@/drizzle/app-schema";
import { db } from "@/db";
import { eq, and } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export const addAttachment = async (courseSlug: string, values: { fileUrl: string, fileName: string }[]) => {
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

        const courseOwner = await db.query.course.findFirst({
            where: and(
                eq(schema.course.slug, courseSlug),
                eq(schema.course.userId, session.user.id)
            ),
        });

        if (!courseOwner) {
            return {
                status: "404",
                message: "Course not found"
            }
        }

        if (!values || values.length === 0) {
            return {
                status: "400",
                message: "File URL and file name are required"
            }
        }

        await db.insert(schema.attachment).values(
            values.map((value) => ({
                ...value,
                courseId: courseOwner.id,
            }))
        );

        revalidatePath(`/teacher/courses/${courseSlug}`);

        return {
            status: "201",
            message: "Attachments added successfully"
        }

    } catch (error) {
        console.log("[ADD_ATTACHMENT_ERROR]: ", error);
        return {
            status: "500",
            message: "Internal server error"
        }
    }
}

export const deleteAttachment = async (courseSlug: string, attachmentId: string) => {
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

        const courseOwner = await db.query.course.findFirst({
            where: and(
                eq(schema.course.slug, courseSlug),
                eq(schema.course.userId, session.user.id)
            ),
        });

        if (!courseOwner) {
            return {
                status: "404",
                message: "Course not found"
            }
        }

        await db
            .delete(schema.attachment)
            .where(
                and(
                    eq(schema.attachment.id, attachmentId),
                    eq(schema.attachment.courseId, courseOwner.id)
                )
            );

        revalidatePath(`/teacher/courses/${courseSlug}`);

        return {
            status: "200",
            message: "Attachment deleted successfully"
        }
    } catch (error) {
        console.log("[DELETE_ATTACHMENT_ERROR]: ", error);
        return {
            status: "500",
            message: "Internal server error"
        }
    }
}