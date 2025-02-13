"use client";

import * as z from 'zod';
import { Button } from '@/components/ui/button';

import { useState } from 'react'
import { File, Loader2, PlusCircle, X } from 'lucide-react';
import { UploadDropzone } from '@/components/ui/upload-dropzone';
import { AttachmentType, CourseType } from '@/drizzle/app-schema';
import { toast } from 'sonner';
import { updateCourse } from './course-action';
import { addAttachment, deleteAttachment } from '../_actions/attachment-action';

interface AttachmentFormProps {
    initialData: CourseType & { attachments: AttachmentType[] };
    courseSlug: string;
}

const formSchema = z.array(z.object({
    fileUrl: z.string().min(1),
    fileName: z.string().min(1),
}));


export const AttachmentForm = ({ initialData, courseSlug }: AttachmentFormProps) => {
    const [isEditting, setIsEditting] = useState(false);
    const [deletingId, setdeletingId] = useState<string | null>(null);

    const toggleEditting = () => {
        setIsEditting((prev) => !prev);
    }


    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            const res = await addAttachment(courseSlug, values);
            if (res.status === "201") {
                toast.success("Image uploaded successfully.");
                setIsEditting(false);

            } else {
                toast.error(res.message);
            }

        } catch (error) {
            console.log("[ATTACHMENT_FORM_ERROR]: ", error);
            toast.error("Something went wrong.");
        }


    }

    const onDelete = async (id: string) => {
        try {
            setdeletingId(id);
            const res = await deleteAttachment(courseSlug, id);
            if (res.status === "200") {
                toast.success("Attachment deleted successfully");
            } else {
                toast.error("Something went wrong.");
            }

        } catch (error) {
            toast.error("Something went wrong.");
        } finally {
            setdeletingId(null);
        }
    }


    return (
        <div className='mt-6 border bg-slate-100 rounded-md p-4' >
            <div className='font-medium flex items-center justify-between'>
                Course Attachments
                <Button onClick={toggleEditting} variant='ghost' type='button'>
                    {isEditting ? (
                        <>Cancel</>
                    ) : (
                        <>
                            <PlusCircle className='h-4 w-4 mr-2' />
                            Add a file
                        </>
                    )}
                </Button>
            </div>
            {!isEditting ? (
                <>
                    {initialData.attachments.length === 0 && (
                        <p className='text-sm mt-2 text-slate-500 italic'>No attachments</p>
                    )}
                    {initialData.attachments.length > 0 && (
                        <div className='space-y-2'>
                            {initialData.attachments.map((attachment) => (
                                <div key={attachment.id} className='flex items-center p-3 w-full bg-sky-100 border text-sky-700 rounded-md'>
                                    <File className='h-4 w-4 mr-2 flex-shrink-0' />
                                    <p className='text-xs line-clamp-1'>{attachment.fileName}</p>
                                    {deletingId === attachment.id && (
                                        <div>
                                            <Loader2 className='h-4 w-4 animate-spin' />
                                        </div>
                                    )}
                                    <Button variant={'ghost'} size={"sm"} onClick={() => onDelete(attachment.id)} className='ml-auto hover:opacity-75 transition'>
                                        <X />
                                    </Button>
                                </div>
                            ))}

                        </div>
                    )}
                </>
            ) : (
                <UploadDropzone
                    route='courseAttachment'
                    accept='*'
                    multiple
                    maxFileCount={5}
                    description={{
                        maxFiles: 5,
                        maxFileSize: '10MB',
                        fileTypes: 'Any',
                    }}
                    onUploadComplete={({ files, metadata }) => {
                        // update all files in db
                        if (files.length > 0) {
                            onSubmit(files.map((file) => ({ fileUrl: file.objectKey, fileName: file.name })));
                        }
                    }}
                />
            )}
        </div >
    )
}
