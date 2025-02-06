import { getProgress } from "@/actions/get-progress";
import { db } from "@/db";
import { CategoryType, CourseType } from "@/drizzle/app-schema";
import { and, eq, like, desc } from "drizzle-orm";
import * as schema from "@/drizzle/app-schema";


type CourseWithProgressWithCategory = CourseType & {
  category: CategoryType | null;
  chapters: { id: string }[];
  progress: number | null;
};


interface getCourses {
  userId: string;
  title?: string;
  categoryId?: string;
}

export const getCourses = async ({
  userId,
  title,
  categoryId,
}: getCourses): Promise<CourseWithProgressWithCategory[]> => {
  try {
    const courses = await db.query.course.findMany({
      where: and(
          eq(schema.course.isPublished, true),
          title ? like(schema.course.title, `%${title}%`) : undefined
      ),
      with: {
          category: true,
          chapters: {
              where: eq(schema.chapter.isPublished, true),
              columns: {
                  id: true
              }
          },
          purchases: {
              where: eq(schema.purchase.userId, userId),
          }
      },
      orderBy: [desc(schema.course.createdAt)]
  })

    const courseWithProgress: CourseWithProgressWithCategory[] =
      await Promise.all(
        courses.map(async (course) => {
          if (course.purchases.length === 0) {
            return {
              ...course,
              progress: null,
            };
          }

          const coursePercentage = await getProgress(userId, course.id);

          return {
            ...course,
            progress: coursePercentage,
          };
        })
      );

    return courseWithProgress;
  } catch (error) {
    console.log("[GET_COURSES]", error);
    return [];
  }
};
