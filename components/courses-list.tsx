
import { CategoryType, CourseType } from '@/drizzle/app-schema';
import { CourseCard } from '@/components/course-card';

type CourseWithProgressWithCategory = CourseType & {
    category: CategoryType | null;
    chapters: { id: string }[];
    progress: number | null;
};

interface CoursesListProps {
    items: CourseWithProgressWithCategory[]
}

export const CoursesList = ({
    items,
}: CoursesListProps) => {
    return (
        <div>
            <div className='grid gap-4 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4'>
                {items.map((item) => (
                    <CourseCard 
                     key={item.id}
                     id={item.id}
                     title={item.title}
                     imageUrl={item.imageUrl!}
                     chaptersLength={item.chapters.length}
                     price={item.price!}
                     progress={item.progress}
                     category={item?.category?.name!}
                    />
                ))}
            </div>
            {items.length === 0 && (
                <div className='text-center text-sm text-muted-foreground mt-10'>
                    No courses found.
                </div>
            )}
        </div>
    )
}
