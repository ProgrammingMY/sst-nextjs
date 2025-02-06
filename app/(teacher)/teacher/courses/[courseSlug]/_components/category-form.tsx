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
import { Input } from '@/components/ui/input';

import React, { useState } from 'react'
import { Pencil } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { CourseType, CategoryType } from '@/drizzle/app-schema';
import { cn } from '@/lib/utils';
import { Combobox } from '@/components/ui/combobox';
import { updateCourse } from './course-action';


interface CategoryFormProps {
    initialData: CourseType;
    courseSlug: string;
    options: {
        label: string;
        value: string;
    }[]
}


const formSchema = z.object({
    categoryId: z.number(),
});


function CategoryForm({ initialData, courseSlug, options }: CategoryFormProps) {
    const [isEditting, setIsEditting] = useState(false);
    const router = useRouter();

    const toggleEditting = () => {
        setIsEditting((prev) => !prev);
    }

    const updateCourseWithSlug = async (formData: FormData) => {
        await updateCourse(courseSlug, formData);
    };

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),

        defaultValues: {
            categoryId: initialData?.categoryId || undefined,
        },

    });

    const { isSubmitting, isValid } = form.formState;

    const selectedOption = options.find((option) => option.value === initialData.categoryId?.toString());


    return (
        <div className='mt-6 border bg-slate-100 rounded-md p-4'>
            <div className='font-medium flex items-center justify-between'>
                Course Category
                <Button onClick={toggleEditting} variant='ghost' type='button'>
                    {isEditting ? (
                        <>Cancel</>
                    ) : <>
                        <Pencil className='h-4 w-4 mr-2' />
                        Edit Category
                    </>
                    }
                </Button>
            </div>
            {!isEditting ? (
                <p className={cn("text-sm mt-2", !initialData.categoryId && "text-slate-500 italic")}>
                    {selectedOption?.label || "No category"}
                </p>
            ) : (
                <Form {...form}>
                    <form action={updateCourseWithSlug} className='space-y-4 mt-4'>
                        <FormField
                            control={form.control}
                            name='categoryId'

                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Combobox
                                            options={options}
                                            value={field.value?.toString() || ""}
                                            onChange={field.onChange}
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
                                disabled={!isValid || isSubmitting}
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

export default CategoryForm