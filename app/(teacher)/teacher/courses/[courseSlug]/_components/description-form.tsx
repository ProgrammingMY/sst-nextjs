"use client";
import * as z from 'zod';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage
} from "@/components/ui/form";
import { Button } from '@/components/ui/button';

import React, { useState } from 'react'
import { Pencil } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Textarea } from '@/components/ui/textarea';
import { CourseFormProps } from '@/lib/types';

import { updateCourse } from './course-action';
import { toast } from 'sonner';

// 100 alphanumeric characters and spaces and _ only
const formSchema = z.object({
    description: z.string().min(5).max(100).regex(/^[a-zA-Z0-9\s_]+$/, {
        message: "Max 100 alphanumeric characters, space and '_' only",
    }),
});


export const DescriptionForm = ({ initialData, courseSlug }: CourseFormProps) => {
    const [isEditting, setIsEditting] = useState(false);

    const toggleEditting = () => {
        setIsEditting((prev) => !prev);
    }

    const updateCourseWithSlug = async (formData: FormData) => {
        const res = await updateCourse(courseSlug, formData);
        if (res.status === "201") {
            toast.success(res.message);
        } else {
            toast.error(res.message);
        }
        setIsEditting(false);
    };



    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: { description: initialData?.description || "" },
    });

    const { isSubmitting } = form.formState;

    return (
        <div className='mt-6 border bg-slate-100 rounded-md p-4' >
            <div className='font-medium flex items-center justify-between'>
                Course Description
                <Button onClick={toggleEditting} variant='ghost' type='button'>
                    {isEditting ? (
                        <>Cancel</>
                    ) : <>
                        <Pencil className='h-4 w-4 mr-2' />
                        Edit Description
                    </>
                    }
                </Button>
            </div>
            {!isEditting ? (
                <p className={cn("text-sm mt-2", !initialData.description && "text-slate-500 italic")}>
                    {initialData.description || "No description"}
                </p>
            ) : (
                <Form {...form}>
                    <form action={updateCourseWithSlug} className='space-y-4 mt-4'>
                        <FormField
                            control={form.control}
                            name='description'

                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Textarea
                                            disabled={!isEditting}
                                            placeholder='e.g. This course is about...'
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
        </div >
    )
}
