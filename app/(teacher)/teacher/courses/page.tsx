
import { db } from '@/db'
import { redirect } from 'next/navigation'
import React from 'react'
import { DataTable } from './_components/data-table'
import { columns } from './_components/columns'

import { auth } from '@/auth'
import { headers } from 'next/headers'

import * as schema from '@/drizzle/app-schema'
import { desc, eq } from 'drizzle-orm'

const TeacherCourses = async () => {
  const session = await auth.api.getSession({
    headers: await headers()
  })

  if (!session) {
    return redirect("/login");
  }

  const courses = await db.query.course.findMany({
    where: eq(schema.course.userId, session.user.id),
    orderBy: [desc(schema.course.createdAt)]
  })

  return (
    <div className='p-6'>
      <DataTable columns={columns} data={courses} />
    </div>
  )
}

export default TeacherCourses