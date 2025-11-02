import { Dropzone } from "@/components/ui/dropzone";
import { cn } from "@/lib/utils";
import type { AcceptedVideoType } from "@/constants/upload-video";
import { UploadEmptyState } from "./upload-empty-state";
import { UploadSelectedFile } from "./upload-selected-file";
import { UploadErrorState } from "./upload-error-state";

type AcceptMap = Record<AcceptedVideoType, string[]>;

type UploadDropzoneProps = {
  selectedFile: File | null;
  error: string | null;
  accept: AcceptMap;
  maxFileSize: number;
  onDrop: (file: File) => void;
  onClear: () => void;
  onError: (message?: string) => void;
  className?: string;
};

export const UploadDropzone = ({
  selectedFile,
  error,
  accept,
  maxFileSize,
  onDrop,
  onClear,
  onError,
  className,
}: UploadDropzoneProps) => {
  const renderUploadState = () => {
    if (error) return <UploadErrorState message={error} onRetry={onClear} />;
    if (!selectedFile) return <UploadEmptyState />;
    return <UploadSelectedFile file={selectedFile} onClear={onClear} />;
  };

  return (
    <Dropzone
      accept={accept}
      maxFiles={1}
      maxSize={maxFileSize}
      src={selectedFile ? [selectedFile] : undefined}
      onDrop={(acceptedFiles) => {
        const file = acceptedFiles[0];
        if (file) onDrop(file);
      }}
      onError={(e) => onError?.(e.message)}
      className={cn(
        "cursor-pointer rounded-lg border-2 border-dashed bg-transparent transition-all hover:border-primary/50 hover:bg-muted/50",
        selectedFile && !error && "border-primary bg-primary/5",
        error && "border-destructive bg-destructive/5",
        className
      )}
    >
      <div className="flex w-full flex-col items-center space-y-3 p-8">
        {renderUploadState()}
      </div>
    </Dropzone>
  );
};
