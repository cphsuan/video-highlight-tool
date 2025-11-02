import { FileVideo, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { formatFileSize } from "@/utils/video-utils";

type UploadSelectedFileProps = {
  file: File;
  onClear: () => void;
  className?: string;
};

export const UploadSelectedFile = ({
  file,
  onClear,
  className,
}: UploadSelectedFileProps) => (
  <div
    className={cn(
      "flex w-full items-center justify-between rounded-md bg-primary/5 px-4 py-3",
      className
    )}
  >
    <div className="flex items-center space-x-3 text-left">
      <FileVideo className="h-8 w-8 text-primary" />
      <div>
        <p className="text-sm font-medium">{file.name}</p>
        <p className="text-xs text-muted-foreground">
          {formatFileSize(file.size)}
        </p>
      </div>
    </div>
    <Button
      variant="ghost"
      size="icon"
      onClick={(event) => {
        event.stopPropagation();
        onClear();
      }}
    >
      <X className="h-4 w-4" />
    </Button>
  </div>
);
