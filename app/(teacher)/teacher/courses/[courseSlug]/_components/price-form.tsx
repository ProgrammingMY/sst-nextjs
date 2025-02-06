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
import { CourseFormProps } from '@/lib/types';
import { cn } from '@/lib/utils';
import { formatPrice } from '@/lib/format';
import { updateCourse } from './course-action';
import { toast } from 'sonner';

const formSchema = z.object({
    price: z.coerce.number(),
});


export const PriceForm = ({ initialData, courseSlug }: CourseFormProps) => {
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
        defaultValues: { price: initialData?.price || undefined },
    });

    const { isSubmitting, isValid } = form.formState;

    return (
        <div className='mt-6 border bg-slate-100 rounded-md p-4' >
            <div className='font-medium flex items-center justify-between'>
                Course Price
                <Button onClick={toggleEditting} variant='ghost' type='button'>
                    {isEditting ? (
                        <>Cancel</>
                    ) : <>
                        <Pencil className='h-4 w-4 mr-2' />
                        Edit Price
                    </>
                    }
                </Button>
            </div>
            {!isEditting ? (
                <p className={cn("text-sm mt-2", !initialData.price && "text-slate-500 italic")}>
                    {
                        initialData.price
                            ? formatPrice(initialData.price)
                            : "Free course"
                    }
                </p>
            ) : (
                <Form {...form}>
                    <form action={updateCourseWithSlug} className='space-y-4 mt-4'>
                        <FormField
                            control={form.control}
                            name='price'
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Input
                                            type='number'
                                            step={0.01}
                                            disabled={!isEditting}
                                            placeholder='Set the price of your course'
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
                                disabled={!isValid || isSubmitting}
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
