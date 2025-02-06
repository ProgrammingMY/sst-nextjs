"use client";

import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage
} from "@/components/ui/form";

import React, { useState } from 'react'
import { Pencil } from 'lucide-react';
import { CourseFormProps } from '@/lib/types';

import { updateCourse } from './course-action';
import { toast } from 'sonner';

// 30 alphanumeric characters and spaces and _ only
const formSchema = z.object({
    title: z.string().min(5).max(30).regex(/^[a-zA-Z0-9\s_]+$/, {
        message: "Max 30 alphanumeric characters, space and '_' only",
    }),
});

function TitleForm({ initialData, courseSlug }: CourseFormProps) {
    const [isEditting, setIsEditting] = useState(false);

    const updateCourseWithSlug = async (formData: FormData) => {
        const res = await updateCourse(courseSlug, formData);
        if (res.status === "201") {
            toast.success(res.message);
        } else {
            toast.error(res.message);
        }
        setIsEditting(false);
    };



    const toggleEditting = () => {
        setIsEditting((prev) => !prev);
    }

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: initialData,
    });

    const { isSubmitting } = form.formState;

    return (
        <div className='mt-6 border bg-slate-100 rounded-md p-4'>
            <div className='font-medium flex items-center justify-between'>
                Course Title
                <Button onClick={toggleEditting} variant='ghost' type='button'>
                    {isEditting ? (
                        <>Cancel</>
                    ) : <>
                        <Pencil className='h-4 w-4 mr-2' />
                        Edit Title
                    </>
                    }
                </Button>
            </div>
            {!isEditting ? (
                <div className='text-sm mt-2'>
                    {initialData.title}
                </div>
            ) : (
                <Form {...form}>
                    <form action={updateCourseWithSlug} className='space-y-4 mt-4'>
                        <FormField
                            control={form.control}
                            name='title'

                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Input
                                            disabled={!isEditting}
                                            placeholder='e.g. Introduction to Computer Science'
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className='flex items-center justify-end mt-6 gap-x-2'>
                            <Button
                                type='submit'
                                variant='default'
                                disabled={isSubmitting}
                            >
                                Save
                            </Button>
                        </div>
                    </form>
                </Form>
            )}
        </div>
    )
}

export default TitleForm