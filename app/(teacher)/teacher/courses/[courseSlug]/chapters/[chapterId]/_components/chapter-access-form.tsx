"use client";
import * as z from 'zod';
import axios from 'axios';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
} from "@/components/ui/form";
import { Button } from '@/components/ui/button';

import React, { useState } from 'react'
import { Pencil } from 'lucide-react';
import { useToast } from '@/components/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { ChapterFormProps } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Checkbox } from '@/components/ui/checkbox';

const formSchema = z.object({
    isFree: z.boolean().default(false),
});


export const ChapterAccessForm = ({ initialData, courseId, chapterId }: ChapterFormProps) => {
    const [isEditting, setIsEditting] = useState(false);
    const { toast } = useToast();
    const router = useRouter();

    const toggleEditting = () => {
        setIsEditting((prev) => !prev);
    }

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            isFree: Boolean(initialData.isFree)
        },
    });

    const { isSubmitting, isValid } = form.formState;

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            console.log(values);
            await axios.patch(`/api/courses/${courseId}/chapters/${chapterId}`, values);
            toast({
                title: "Success",
                description: "Chapter updated successfully.",
                variant: "default",
            });
            setIsEditting(false);
            router.refresh();
        } catch (error) {
            toast({
                title: "Error",
                description: "Something went wrong.",
                variant: "destructive",
            });
        }
    }


    return (
        <div className='mt-6 border bg-slate-100 rounded-md p-4' >
            <div className='font-medium flex items-center justify-between'>
                Chapter Access
                <Button onClick={toggleEditting} variant='ghost' type='button'>
                    {isEditting ? (
                        <>Cancel</>
                    ) : <>
                        <Pencil className='h-4 w-4 mr-2' />
                        Edit Access
                    </>
                    }
                </Button>
            </div>
            {!isEditting ? (
                <p className={cn("text-sm mt-2", !initialData.isFree && "text-slate-500 italic")}>
                    {initialData.isFree ? (
                        <>This chapter is free for preview</>
                    ) : (
                        <>This chapter is not free for preview</>
                    )}
                </p>
            ) : (
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4 mt-4'>
                        <FormField
                            control={form.control}
                            name='isFree'
                            render={({ field }) => (
                                <FormItem className='flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4'>
                                    <FormControl>
                                        <Checkbox
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                        />
                                    </FormControl>
                                    <div className='space-y-1 leading-none'>
                                        <FormDescription>
                                            Check this box if you want to make this chapter free
                                        </FormDescription>
                                    </div>
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
