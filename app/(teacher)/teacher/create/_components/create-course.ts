"use server";

import { auth } from "@/auth";
import { headers } from "next/headers";

import { parseWithZod } from "@conform-to/zod";
import { titleSchema } from "./title-schema";
import { db } from "@/db";

import * as schema from "@/drizzle/app-schema";
import { redirect } from "next/navigation";

export const createCourse = async (prevState: any, formData: FormData) => {
    const submission = parseWithZod(formData, { schema: titleSchema });

    if (submission.status !== "success") {
        return submission.reply();
    }

    // TODO: Check if the user is authenticated
    const session = await auth.api.getSession({
        headers: await headers()
    });

    if (!session?.user) {
        return submission.reply({ formErrors: ["Unauthorized"] });
    }

    // TODO: Create the course
    const { title } = submission.value;
    const slug = title.toLowerCase().replace(/ /g, "-");

    const course = await db.insert(schema.course).values({
        title: title as string,
        userId: session.user.id,
        slug: slug as string,
    }).returning();

    // TODO: Redirect to the course page
    redirect(`/teacher/courses/${course[0].slug}`);
}
