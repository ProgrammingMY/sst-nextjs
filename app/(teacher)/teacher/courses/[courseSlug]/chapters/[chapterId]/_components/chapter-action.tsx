"use client";

import { useToast } from "@/components/hooks/use-toast";
import { ConfirmModal } from "@/components/modals/confirm-modal";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface ChapterActionProps {
    disabled: boolean;
    courseId: string;
    chapterId: string;
    isPublished: boolean;
}

const ChapterAction = ({
    disabled,
    courseId,
    chapterId,
    isPublished
}: ChapterActionProps) => {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast();

    const onClick = async () => {
        try {
            setIsLoading(true);

            if (isPublished)  {
                await axios.patch(`/api/courses/${courseId}/chapters/${chapterId}/unpublish`);
                toast({
                    title: "Success",
                    description: "Chapter unpublished successfully.",
                    variant: "default",
                });
            } else {
                await axios.patch(`/api/courses/${courseId}/chapters/${chapterId}/publish`);
                toast({
                    title: "Success",
                    description: "Chapter published successfully.",
                    variant: "default",
                });
            }

            router.refresh();

        } catch (error) {
            toast({
                title: "Error",
                description: "Something went wrong.",
                variant: "destructive",
            })
        } finally {
            setIsLoading(false);
        }
    }

    const onDelete = async () => {
        try {
            setIsLoading(true);
            await axios.delete(`/api/courses/${courseId}/chapters/${chapterId}`);
            toast({
                title: "Success",
                description: "Chapter deleted successfully.",
                variant: "default",
            });
            router.refresh();
            router.push(`/teacher/courses/${courseId}`);

        } catch (error) {
            toast({
                title: "Error",
                description: "Something went wrong.",
                variant: "destructive",
            })
        } finally {
            setIsLoading(false);
        }
    }
    return (
        <div className="flex items-center gap-x-2">
            <Button
                onClick={onClick}
                disabled={disabled || isLoading}
                variant='outline'
                size={'sm'}
            >
                {isPublished ? "Unpublish" : "Publish"}
            </Button>
            <ConfirmModal onConfirm={onDelete}>
                <Button size={'sm'} variant='destructive' disabled={isLoading}>
                    <Trash className='h-4 w-4' />
                </Button>
            </ConfirmModal>
        </div>
    )
}

export default ChapterAction