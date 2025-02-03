

import { db } from '@/db';
import * as schema from "@/drizzle/app-schema";
import { and, count, eq, inArray } from 'drizzle-orm';


export const getProgress = async (
    userId: string,
    courseId: string,
): Promise<number> => {
    try {
        const publishedChapters = await db.query.chapter.findMany({
            where: and(
                eq(
                    schema.chapter.courseId, courseId
                ),
                eq(
                    schema.chapter.isPublished, true
                )
            ),
            columns: {
                id: true
            }
        })

        const publishedChapterIds = publishedChapters.map((chapter) => chapter.id);

        const validCompletedChapters = await db
            .select({ count: count() })
            .from(schema.userProgress)
            .where(
                and(
                    eq(schema.userProgress.userId, userId),
                    inArray(schema.userProgress.chapterId, publishedChapterIds),
                    eq(schema.userProgress.isCompleted, true)
                )
            );

        const progressPercentage =
            (validCompletedChapters[0].count / publishedChapterIds.length) * 100;

        return progressPercentage;

    } catch (error) {
        console.log("[GET_PROGRESS]", error);
        return 0;
    }
}
