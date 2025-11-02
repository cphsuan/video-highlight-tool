import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type UploadErrorStateProps = {
  message: string;
  onRetry: () => void;
  className?: string;
};

export const UploadErrorState = ({
  message,
  onRetry,
  className,
}: UploadErrorStateProps) => (
  <div
    className={cn(
      "flex flex-col items-center space-y-2 text-center",
      className
    )}
  >
    <X className="h-10 w-10 text-destructive" />
    <p className="text-sm font-medium text-destructive">{message}</p>
    <Button
      variant="outline"
      size="sm"
      onClick={(event) => {
        event.stopPropagation();
        onRetry();
      }}
    >
      Try Again
    </Button>
  </div>
);
