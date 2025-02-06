import { cn } from '@/lib/utils';
import { useUploadFiles } from 'better-upload/client';
import { Loader2, UploadIcon } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import Dropzone, { FileRejection } from 'react-dropzone';
import FileCard, { isFileWithPreview } from './file-card';
import { Button } from './button';
import { ScrollArea } from './scroll-area';

type UploadDropzoneProps = Parameters<typeof useUploadFiles>[0] & {
  accept?: string;
  metadata?: Record<string, unknown>;

  description?:
  | {
    fileTypes?: string;
    maxFileSize?: string;
    maxFiles?: number;
  }
  | string;
  multiple: boolean;
  maxFileCount: number;
};

type fileWithPreview = File & {
  preview: string;
  progress: number;
}

export function UploadDropzone({
  accept,
  metadata,
  description,
  multiple = false,
  maxFileCount = 1,
  ...params
}: UploadDropzoneProps) {
  const [files, setFiles] = useState<fileWithPreview[]>([]);

  const { upload, isPending } = useUploadFiles({
    ...params,
    onUploadSettled: () => {
      params.onUploadSettled?.();
      setFiles([]);
    },
    onUploadProgress: ({ file, progress }) => {
      progress = progress * 100;
      const newFiles = files.map((f) => {
        if (f.name === file.name) {
          const newFile = f;
          newFile.progress = progress;
          return newFile;
        }
        return f;
      });
      setFiles(newFiles);
    },
  });

  const onDrop = useCallback(
    (acceptedFiles: File[], rejectedFiles: FileRejection[]) => {
      if (!multiple && maxFileCount === 1 && acceptedFiles.length > 1) {
        console.log("Cannot be more 1 file");
        return { message: "Cannot upload more than 1 file at a time" }
      }


      if ((files?.length ?? 0) + acceptedFiles.length > maxFileCount) {
        return { message: `Cannot upload more than ${maxFileCount} files` }
      }

      const newFiles = acceptedFiles.map((file) =>
        Object.assign(file, {
          preview: URL.createObjectURL(file),
          progress: 0,
        })
      )

      const updatedFiles = files ? [...files, ...newFiles] : newFiles

      setFiles(updatedFiles)

      if (rejectedFiles.length > 0) {
        rejectedFiles.forEach(({ file }) => {
          console.log(`File ${file.name} was rejected`)
        })

      }
    },
    [files, maxFileCount, multiple, setFiles]
  )
  const onRemove = (index: number) => {
    if (!files) return
    const newFiles = files.filter((_, i) => i !== index)
    setFiles(newFiles)
  }

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (files.length > 0) {
      upload(files);
    }
  }

  // Revoke preview url when component unmounts
  useEffect(() => {
    return () => {
      if (!files) return
      files.forEach((file) => {
        if (isFileWithPreview(file)) {
          URL.revokeObjectURL(file.preview)
        }
      })
    }
  }, [])

  const isDisabled = (files?.length ?? 0) >= maxFileCount

  return (
    <div>
      <form className="relative flex flex-col gap-6 overflow-hidden" onSubmit={onSubmit}>
        <Dropzone
          onDrop={onDrop}
          maxFiles={maxFileCount}
          multiple={maxFileCount > 1 || multiple}
          disabled={isDisabled}
        >
          {({ getRootProps, getInputProps, isDragActive }) => (
            <div
              {...getRootProps()}
              className={cn(
                "group relative grid h-52 w-full cursor-pointer place-items-center rounded-lg border-2 border-dashed border-muted-foreground/25 px-5 py-2.5 text-center transition hover:bg-muted/25",
                "ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                isDragActive && "border-muted-foreground/50",
                isDisabled && "pointer-events-none opacity-60",
              )}
            >
              <input {...getInputProps()} accept={accept} />
              {isDragActive ? (
                <div className="flex flex-col items-center justify-center gap-4 sm:px-5">
                  <div className="rounded-full border border-dashed p-3">
                    <UploadIcon
                      className="size-7 text-muted-foreground"
                      aria-hidden="true"
                    />
                  </div>
                  <p className="font-medium text-muted-foreground">
                    Drop the files here
                  </p>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center gap-4 sm:px-5">
                  <div className="rounded-full border border-dashed p-3">
                    <UploadIcon
                      className="size-7 text-muted-foreground"
                      aria-hidden="true"
                    />
                  </div>
                  <div className="flex flex-col gap-px">
                    <p className="font-medium text-muted-foreground">
                      Drag {`'n'`} drop files here, or click to select files
                    </p>
                    <p className="text-xs text-muted-foreground/70">
                      {typeof description === 'string' ? (
                        description
                      ) : (
                        <>
                          {description?.maxFiles &&
                            `You can upload ${description.maxFiles} file${description.maxFiles !== 1 ? 's' : ''}.`}{' '}
                          {description?.maxFileSize &&
                            `${description.maxFiles !== 1 ? 'Each u' : 'U'}p to ${description.maxFileSize}.`}{' '}
                          {description?.fileTypes && `Accepted ${description.fileTypes}.`}
                        </>
                      )}
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
        </Dropzone>
        {files?.length > 0 ? (
          <ScrollArea className="h-fit w-full px-3">
            <div className="flex max-h-48 flex-col gap-4">
              {files?.map((file, index) => (
                <FileCard
                  key={index}
                  file={file}
                  onRemove={() => onRemove(index)}
                  progress={file.progress}
                />
              ))}
            </div>
          </ScrollArea>
        ) : null}
        <Button type="submit" className="w-full" aria-disabled={isPending} disabled={isPending}>
          {isPending ? <>
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            Uploading...
          </> : "Upload File"}
        </Button>
      </form>
    </div>
  );
}