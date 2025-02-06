"use client";
import * as z from 'zod';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import MuxPlayer from '@mux/mux-player-react'

import React, { useState } from 'react'
import { Pencil, PlusCircle, Video } from 'lucide-react';
import { useToast } from '@/components/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { Chapter, MuxData } from '@prisma/client';
import { DialogUploader } from '@/components/upload-component/dialog-uploader';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';

interface ChapterVideoProps {
    initialData: Chapter & { muxData?: MuxData | null };
    courseId: string;
    chapterId: string;
}


const formSchema = z.object({
    videoUrl: z.string().min(1),
});

const initialState = {
    message: "",
    status: "",
}


export const ChapterVideoForm = ({ initialData, courseId, chapterId }: ChapterVideoProps) => {
    const [isEditting, setIsEditting] = useState(false);
    const { toast } = useToast();
    const router = useRouter();

    const toggleEditting = () => {
        setIsEditting((prev) => !prev);
    }


    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
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
                Course video
                <Dialog open={isEditting} onOpenChange={setIsEditting}>
                    <DialogTrigger asChild>
                        <Button onClick={toggleEditting} variant='ghost' type='button'>
                            {!isEditting && !initialData.videoUrl && (
                                <>

                                    <PlusCircle className='h-4 w-4 mr-2' />
                                    Upload video

                                </>
                            )}
                            {!isEditting && initialData.videoUrl && (
                                <>
                                    <Pencil className='h-4 w-4 mr-2' />
                                    Edit video
                                </>
                            )}
                        </Button>
                    </DialogTrigger>
                    <DialogUploader
                        multiple={false}
                        maxFileCount={1}
                        maxSize={1024 * 1024 * 5000}
                        accept={{
                            "video/*": [],
                        }}
                        onGetUrl={(responseData) => {
                            if (responseData) {
                                onSubmit({ videoUrl: responseData.fileUrl })
                            }
                        }}
                    />
                </Dialog>

            </div>
            {!isEditting && (
                !initialData.videoUrl ? (
                    <div className='flex items-center justify-center h-60 bg-slate-200 rounded-md'>
                        <Video className='h-10 w-10 text-slate-500' />
                    </div>
                ) : (
                    <div className='relative aspect-video mt-2'>
                        <MuxPlayer
                            playbackId={initialData.muxData?.playbackId || ""}
                        />
                    </div>
                )
            )}
            {initialData.videoUrl && !isEditting && (
                <div className='text-xs text-muted-foreground mt-2'>
                    Videos can take a few minutes to process. Refresh the page if video does not appear.
                </div>
            )}
        </div >
    )
}
