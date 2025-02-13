import { IconBadge } from '@/components/icon-badge';
import { db } from '@/db'
import { CircleDollarSign, File, LayoutDashboard, ListCheck } from 'lucide-react';
import { redirect } from 'next/navigation'
import React from 'react'


import TitleForm from './_components/title-form';
import { DescriptionForm } from './_components/description-form';
import { ImageForm } from './_components/image-form';
import CategoryForm from './_components/category-form';
import { PriceForm } from './_components/price-form';
import { AttachmentForm } from './_components/attachment-form';
import { ChaptersForm } from './_components/chapters-form';
import { Banner } from '@/components/banner';
import Action from './_components/action';

import { auth } from '@/auth';
import { headers } from 'next/headers';
import { desc, asc, eq, and } from 'drizzle-orm';

import * as schema from '@/drizzle/app-schema';

async function CourseIdPage(
  { params }: { params: { courseSlug: string } }

) {
  const session = await auth.api.getSession({
    headers: await headers()
  })

  if (!session) {
    return redirect("/login");
  }

  const { courseSlug } = await params;

  const course = await db.query.course.findFirst({
    where: and(
      eq(schema.course.slug, courseSlug),
      eq(schema.course.userId, session.user.id)
    ),
    with: {
      chapters: {
        orderBy: [asc(schema.chapter.position)]
      },
      attachments: {
        orderBy: [desc(schema.attachment.createdAt)]
      }
    }
  })

  const categories = await db.query.category.findMany({
    orderBy: [asc(schema.category.name)]
  });

  if (!course) {
    return redirect("/teacher/courses");
  }

  const requiredField = [
    course.title,
    course.description,
    course.imageUrl,
    course.price,
    course.categoryId,
    course.chapters.some(chapter => chapter.isPublished)
  ];

  const totalField = requiredField.length;
  const completedField = requiredField.filter(Boolean).length;

  const completionText = `(${completedField}/${totalField})`;

  const isComplete = requiredField.every(Boolean);

  return (
    <>
      {!course.isPublished && (
        <Banner
          label="This course is not published yet. It will not be visible to the students."
        />
      )}
      <div className='p-6'>
        <div className='flex items-center justify-between'>
          <div className='flex flex-col gap-y-2'>
            <h1 className='text-2xl font-medium'>Course setup</h1>
            <span className='text-sm text-foreground/60'>
              Complete all fields {completionText}
            </span>
          </div>
          <Action
            disabled={!isComplete}
            courseSlug={courseSlug}
            isPublished={course.isPublished}
          />

        </div>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mt-16'>
          <div>
            <div className='flex items-center gap-x-2'>
              <IconBadge icon={LayoutDashboard} />
              <h2 className='text-xl'>Customize your course</h2>

            </div>
            <TitleForm
              initialData={course}
              courseSlug={courseSlug}
            />
            <DescriptionForm
              initialData={course}
              courseSlug={courseSlug}
            />
            <ImageForm
              initialData={course}
              courseSlug={courseSlug}
            />
            <CategoryForm
              initialData={course}

              courseSlug={courseSlug}
              options={categories.map((category) => ({
                label: category.name,
                value: category.id.toString(),
              }))}

            />
          </div>
          <div className='space-y-6'>
            <div>
              <div className='flex items-center gap-x-2'>
                <IconBadge icon={ListCheck} />
                <h2 className='text-xl'>
                  Course chapters
                </h2>
              </div>
              {/* <ChaptersForm
                initialData={course}
                courseSlug={params.courseSlug}
              /> */}
            </div>


            <div>
              <div className='flex items-center gap-x-2'>
                <IconBadge icon={CircleDollarSign} />
                <h2 className='text-xl'>
                  Sell your course
                </h2>
              </div>
              <PriceForm initialData={course} courseSlug={courseSlug} />
            </div>
            <div>
              <div className='flex items-center gap-x-2'>

                <IconBadge icon={File} />
                <h2 className='text-xl'>
                  Resources & Attachments
                </h2>
              </div>
              <AttachmentForm
                initialData={course}
                courseSlug={courseSlug}
              />
            </div>
          </div>

        </div>
      </div>
    </>
  )
}

export default CourseIdPage