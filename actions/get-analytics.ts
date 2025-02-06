import { db } from "@/db";
import { CourseType, PurchaseType, purchase, course } from "@/drizzle/app-schema";
import { eq } from "drizzle-orm";


type PurchaseWithCourse = PurchaseType & {
  course: CourseType;
};


const groupByCourse = (purchases: PurchaseWithCourse[]) => {
  const grouped: { [courseTitle: string]: number } = {};

  purchases.forEach((purchase) => {
    const courseTitle = purchase.course.title;

    if (!grouped[courseTitle]) {
      grouped[courseTitle] = 0;
    }
    grouped[courseTitle] += purchase.course.price!;
  });

  return grouped;
};

export const getAnalytics = async (userId: string) => {
  try {

    const purchases = await db
    .select({
      id: purchase.id,
      userId: purchase.userId,
      createdAt: purchase.createdAt,
      updatedAt: purchase.updatedAt,
      courseId: purchase.courseId,
      course: course,
    })
    .from(purchase)
    .innerJoin(course, eq(purchase.courseId, course.id))
    .where(eq(course.userId, userId));

    const groupedEarnings = groupByCourse(purchases);

    const data = Object.entries(groupedEarnings).map(
      ([courseTitle, total]) => ({
        name: courseTitle,
        total: total,
      })
    );

    const totalRevenue = data.reduce((acc, curr) => acc + curr.total, 0);
    const totalSales = data.length;

    return {
      data,
      totalRevenue,
      totalSales,
    };
  } catch (error) {
    console.log("[ANALYTICS]", error);
    return {
      data: [],
      totalRevenue: 0,
      totalSales: 0,
    };
  }
};
