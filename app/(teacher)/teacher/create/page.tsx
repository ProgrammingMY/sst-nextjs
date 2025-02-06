"use client";

import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import { useForm } from '@conform-to/react';
import { parseWithZod } from '@conform-to/zod';
import { useActionState } from 'react';
import { titleSchema } from './_components/title-schema';
import { createCourse } from './_components/create-course';
import { Label } from '@/components/ui/label';


function CreatePage() {
    const [lastResult, action] = useActionState(createCourse, undefined);


    const [form, fields] = useForm({
        // Sync the result of last submission
        lastResult,

        // Reuse the validation logic on the client
        onValidate({ formData }) {
            return parseWithZod(formData, { schema: titleSchema });
        },

        // Validate the form on blur event triggered
        shouldValidate: 'onBlur',
        shouldRevalidate: 'onInput',
    });



    return (
        <div className='max-w-5xl mx-auto flex md:items-center md:justify-center h-full p-6'>
            <div>
                <h1 className='text-2xl'>
                    Name Your Course
                </h1>
                <p className='text-sm'>
                    What would you like to name your course? You can change this later.
                </p>
                <form action={action} className='space-y-8 mt-8' onSubmit={form.onSubmit} id={form.id}>
                    <div>
                        <Label htmlFor='title'>Course Title</Label>
                        <Input
                            type='text'
                            key={fields.title.key}
                            name={fields.title.name}
                            defaultValue={fields.title.initialValue}
                            placeholder='e.g. "Advanced Web Development"'
                        />
                        <div>{fields.title.errors}</div>

                    </div>
                    <div className='flex items-center gap-x-2'>
                        <Link href="/teacher/courses">
                            <Button variant='ghost' type='button' className='text-sm'>
                                Cancel
                            </Button>
                        </Link>
                        <Button type='submit'>
                            Create Course
                        </Button>
                    </div>

                </form>
            </div>
        </div>
    )
}

export default CreatePage