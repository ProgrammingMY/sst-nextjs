"use client";

import { useConfettiStore } from "@/components/hooks/use-confetti-store";
import { ConfirmModal } from "@/components/modals/confirm-modal";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface ActionProps {
    disabled: boolean;
    courseSlug: string;
    isPublished: boolean;
}

const PublishAction = ({
    disabled,
    courseSlug,
    isPublished
}: ActionProps) => {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const confetti = useConfettiStore();

    const onClick = async () => {
        try {

        } catch (error) {
        } finally {
            setIsLoading(false);
        }
    }

    const onDelete = async () => {
        try {
        } catch (error) {
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

export default PublishAction