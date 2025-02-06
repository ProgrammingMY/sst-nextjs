import { db } from '@/db'
import { Categories } from './_components/categories';
import { SearchInput } from '@/components/search-input';
import { getCourses } from '@/actions/get-courses';
import { redirect } from 'next/navigation';
import { CoursesList } from '@/components/courses-list';
import * as schema from "@/drizzle/app-schema";

import { auth } from "@/auth";
import { headers } from 'next/headers';

interface SearchProps {
    searchParams: {
        title: string;
        categoryId: string;
    }
}

const Search = async ({
    searchParams,
}: SearchProps) => {
    const session = await auth.api.getSession({
        headers: await headers()
      })

    if (!session) {
        return redirect('/login');
    }

    const categories = await db
    .select()
    .from(schema.category)
    .orderBy(schema.category.name)

    const courses = await getCourses({
        userId: session.user.id,
        ...searchParams,
    });

    return (
        <>
            <div className='px-6 pt-6 block'>
                <SearchInput />
            </div>
            <div className='p-6 space-y-4'>
                <Categories
                    items={categories}
                />
                <CoursesList
                    items={courses}
                />
            </div>
        </>
    )
}

export default Search