"use client";
import * as z from 'zod';
import axios from 'axios';
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
import { Loader2, Pencil, PlusCircle } from 'lucide-react';
import { useToast } from '@/components/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { CourseFormProps } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Chapter, Course } from '@prisma/client';
import { ChaptersList } from './chapters-list';

interface ChapterFormProps {
    initialData: Course & { chapters: Chapter[] };
    courseId: string;
}

const formSchema = z.object({
    title: z.string().min(1),
});


export const ChaptersForm = ({ initialData, courseId }: ChapterFormProps) => {
    const [isCreating, setIsCreating] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);
    const { toast } = useToast();
    const router = useRouter();

    const toggleCreating = () => {
        setIsCreating((prev) => !prev);
    }

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: { title: "" },
    });

    const { isSubmitting, isValid } = form.formState;

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            console.log(values);
            await axios.post(`/api/courses/${courseId}/chapters`, values);
            toast({
                title: "Success",
                description: "Chapter created successfully.",
                variant: "default",
            });
            setIsCreating(false);
            router.refresh();
        } catch (error) {
            toast({
                title: "Error",
                description: "Something went wrong.",
                variant: "destructive",
            });
        }
    }

    const onReorder = async (updateData: { id: string; position: number }[]) => {
        try {
            setIsUpdating(true);
            await axios.put(`/api/courses/${courseId}/chapters/reorder`, {
                list: updateData
            });
            toast({
                title: "Success",
                description: "Chapters reordered successfully.",
                variant: "default",
            })
            router.refresh();
        } catch (error) {
            toast({
                title: "Error",
                description: "Something went wrong.",
                variant: "destructive",
            });
        } finally {
            setIsUpdating(false);
        }
    }

    const onEdit = (id: string) => {
        router.push(`/teacher/courses/${courseId}/chapters/${id}`);
    }


    return (
        <div className='relative mt-6 border bg-slate-100 rounded-md p-4' >
            {isUpdating && (
                <div className='absolute h-full w-full bg-slate-500/20 top-0 right-0 rounded-m flex items-center justify-center'>
                    <Loader2 className='h-6 w-6 animate-spin text-sky-700' />
                </div>
            )}
            <div className='font-medium flex items-center justify-between'>
                Course Chapters
                <Button onClick={toggleCreating} variant='ghost' type='button'>
                    {isCreating ? (
                        <>Cancel</>
                    ) : <>
                        <PlusCircle className='h-4 w-4 mr-2' />
                        Add a chapter
                    </>
                    }
                </Button>
            </div>
            {isCreating && (
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4 mt-4'>
                        <FormField
                            control={form.control}
                            name='title'
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Input
                                            disabled={!isCreating}
                                            placeholder='e.g. Introduction to the course'
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button
                            type='submit'
                            variant='default'
                            disabled={!isValid || isSubmitting}
                        >
                            Create
                        </Button>
                    </form>
                </Form>
            )}
            {!isCreating && (
                <div className={cn(
                    "text-sm mt-2",
                    !initialData.chapters.length && 'text-slate-500 italic'
                )}>
                    {!initialData.chapters.length && "No chapters"}
                    <ChaptersList
                        onEdit={onEdit}
                        onReorder={onReorder}
                        items={initialData.chapters || []}
                    />
                </div>
            )}
            {!isCreating && (
                <p className='text-xs text-muted-foreground mt-4'>
                    Drap and drop to reorder the chapters
                </p>
            )}
        </div >
    )
}
