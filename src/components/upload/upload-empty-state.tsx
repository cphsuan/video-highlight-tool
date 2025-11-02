import { Upload } from "lucide-react";
import { cn } from "@/lib/utils";

type UploadEmptyStateProps = {
  className?: string;
};

export const UploadEmptyState = ({ className }: UploadEmptyStateProps) => (
  <div
    className={cn(
      "flex flex-col items-center space-y-3 text-center text-sm",
      className
    )}
  >
    <Upload className="h-10 w-10 text-muted-foreground" />
    <div>
      <p className="font-medium">Click to upload or drag and drop</p>
      <p className="mt-1 text-xs text-muted-foreground">
        MP4, MOV, or AVI (MAX. 500MB)
      </p>
    </div>
  </div>
);
