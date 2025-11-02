import { useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { useTranscriptStore } from "@/stores/transcript-store";
import { LOADING_STEPS, type ProcessingStep } from "@/constants/loading";

export const LoadingScreen = () => {
  const processingStep = useTranscriptStore((state) => state.processingStep);

  const activeStep: ProcessingStep =
    processingStep === "idle" ? "upload" : processingStep;

  const { icon: ActiveIcon, label } = LOADING_STEPS[activeStep];

  const targetProgress = useMemo(
    () => LOADING_STEPS[processingStep].target,
    [processingStep]
  );

  return (
    <div className="flex min-h-screen items-center justify-center bg-linear-to-br from-gray-50 to-gray-100 p-4 dark:from-gray-900 dark:to-gray-800">
      <Card className="w-full max-w-2xl p-12">
        <div className="flex flex-col items-center space-y-8">
          <div className="relative">
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-primary/10">
              <ActiveIcon className="h-12 w-12 animate-pulse text-primary" />
            </div>
          </div>

          <div className="space-y-2 text-center">
            <h2 className="text-2xl font-semibold text-foreground">{label}</h2>
            <p className="text-muted-foreground">
              Please wait while we prepare your highlights
            </p>
          </div>

          <div className="w-full space-y-2">
            <Progress value={targetProgress} className="h-2" />
            <p className="text-center text-sm text-muted-foreground">
              {Math.round(targetProgress)}% complete
            </p>
          </div>

          <div className="mt-8 w-full space-y-4">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
          </div>
        </div>
      </Card>
    </div>
  );
};
