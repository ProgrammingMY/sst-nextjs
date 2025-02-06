import { File } from "lucide-react"

interface FilePreviewProps {
    file: File & {
        preview: string;
        progress: number;
    }
}

export default function FilePreview({ file }: FilePreviewProps) {
    if (file.type.startsWith("image/")) {
        return (
            <img
                src={file.preview}
                alt={file.name}
                width={48}
                height={48}
                loading="lazy"
                className="aspect-square shrink-0 rounded-md object-cover"
            />
        )
    }

    return (
        <File
            className="size-10 text-muted-foreground"
            aria-hidden="true"
        />
    )
}