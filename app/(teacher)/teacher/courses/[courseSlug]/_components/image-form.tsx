
"use client";

import * as z from 'zod';
import { Button } from '@/components/ui/button';

import { useState } from 'react'
import { ImageIcon, PlusCircle } from 'lucide-react';

import { CourseFormProps } from '@/lib/types';
import { UploadDropzone } from '@/components/ui/upload-dropzone';
import { toast } from 'sonner';
import { updateCourse } from './course-action';
import Image from 'next/image';

const formSchema = z.object({
    imageUrl: z.string().min(1, {
        message: "Image is required",
    }),
});


export const ImageForm = ({ initialData, courseSlug }: CourseFormProps) => {
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

    return (
        <div className='mt-6 border bg-slate-100 rounded-md p-4' >
            <div className='font-medium flex items-center justify-between'>
                Course Image
                <Button onClick={toggleEditting} variant='ghost' type='button'>
                    {isEditting ? (
                        <>Cancel</>
                    ) : (
                        <>
                            <PlusCircle className='h-4 w-4 mr-2' />
                            Upload image
                        </>
                    )
                    }
                </Button>
            </div>
            {!isEditting ? (
                !initialData.imageUrl ? (
                    <div className='flex items-center justify-center h-60 bg-slate-200 rounded-md'>
                        <ImageIcon className='h-10 w-10 text-slate-500' />
                    </div>
                ) : (
                    <div className='relative aspect-video mt-2'>
                        <Image
                            src={`/api/download/${encodeURIComponent(initialData.imageUrl)}`}
                            alt="Course image"
                            className='object-cover'
                            fill
                        />
                    </div>
                )
            ) : (
                <UploadDropzone
                    route='courseImage'
                    accept='image/*'
                    multiple={false}
                    maxFileCount={1}
                    description={{
                        maxFiles: 1,
                        maxFileSize: '10MB',
                        fileTypes: 'JPEG, PNG',
                    }}
                    onUploadComplete={({ files, metadata }) => {
                        if (files.length > 0) {
                            const formData = new FormData();
                            formData.append('imageUrl', files[0].objectKey);
                            updateCourseWithSlug(formData);
                        }

                        toast.success("Course updated successfully.");

                    }}
                    onUploadError={(error) => {
                        toast.error("Something went wrong.");
                    }}
                />
            )}
        </div >
    )
}
