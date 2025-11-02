import type { ComponentType } from "react";
import { Upload, Brain, FileText } from "lucide-react";

export type ProcessingStep = "idle" | "upload" | "transcript" | "finalizing";

type LoadingStep = {
  icon: ComponentType<{ className?: string }>;
  label: string;
  target: number;
};

export const LOADING_STEPS: Record<ProcessingStep, LoadingStep> = {
  idle: {
    icon: Upload,
    label: "",
    target: 0,
  },
  upload: {
    icon: Upload,
    label: "Uploading video...",
    target: 35,
  },
  transcript: {
    icon: Brain,
    label: "Processing with AI...",
    target: 80,
  },
  finalizing: {
    icon: FileText,
    label: "Preparing transcript...",
    target: 100,
  },
};

export type { LoadingStep };
