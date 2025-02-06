import { formatBytes } from "@/lib/format"
import { Progress } from "./progress"
import { Button } from "./button"
import FilePreview from "./file-preview"
import { X } from "lucide-react"

interface fileWithPreview extends File {
    preview: string;
    progress: number;
}

interface FileCardProps {
    file: fileWithPreview
    onRemove: () => void
    progress?: number
}

export function isFileWithPreview(file: File): file is File & { preview: string; progress: number } {
    return "preview" in file && typeof file.preview === "string" && "progress" in file && typeof file.progress === "number"
}

export default function FileCard({ file, progress, onRemove }: FileCardProps) {
    return (
        <div className="relative flex items-center gap-2.5">
            <div className="flex flex-1 gap-2.5">
                {isFileWithPreview(file) ? <FilePreview file={file} /> : null}
                <div className="flex w-full flex-col gap-2">
                    <div className="flex flex-col gap-px">
                        <p className="line-clamp-1 text-sm font-medium text-foreground/80">
                            {file.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                            {formatBytes(file.size)}
                        </p>
                    </div>
                    {progress ? <Progress value={progress} /> : null}
                </div>
            </div>
            <div className="flex items-center gap-2">
                <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    className="size-7"
                    onClick={onRemove}
                >
                    <X className="size-4" aria-hidden="true" />
                    <span className="sr-only">Remove file</span>
                </Button>
            </div>
        </div>
    )
}