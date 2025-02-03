import { db } from "@/db";
import { CategoryType, ChapterType, CourseType } from "@/drizzle/app-schema";
import { getProgress } from "@/actions/get-progress";
import { eq } from "drizzle-orm";
import * as schema from "@/drizzle/app-schema";
type CourseWithProgressWithCategory = CourseType & {
    category: CategoryType;
    chapters: ChapterType[];
    progress: number | null;
};

type DashboardCourse = {
    completedCourses: CourseWithProgressWithCategory[];
    coursesInProgress: CourseWithProgressWithCategory[];
};

export const getDashboardCourses = async (
    userId: string
): Promise<DashboardCourse> => {
    try {
        const purchasedCourses = await db.query.purchase.findMany({
            where: eq(schema.purchase.userId, userId),
            with: {
                course: {
                    with: {
                        chapters: {
                            where: eq(schema.chapter.isPublished, true),
                        }
                    }
                }
            }
        })

        const courses = purchasedCourses.map(
            (purchase) => purchase.course
        ) as CourseWithProgressWithCategory[];

        for (let course of courses) {
            const progress = await getProgress(userId, course.id);
            course["progress"] = progress;
        }

        const completedCourses = courses.filter(
            (course) => course.progress === 100
        );
        const coursesInProgress = courses.filter(
            (course) => (course.progress ?? 0) < 100
        );

        return {
            completedCourses,
            coursesInProgress,
        };
    } catch (error) {
        console.log("[DASHBOARD COURSES]", error);
        return {
            completedCourses: [],
            coursesInProgress: [],
        };
    }
};
