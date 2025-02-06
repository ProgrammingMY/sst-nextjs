import { CourseType, ChapterType } from "@/drizzle/app-schema";

export interface CourseFormProps {
  initialData: CourseType;
  courseSlug: string;
}


export interface ChapterFormProps {
  initialData: ChapterType;
  courseSlug: string;
  chapterId: string;
}
