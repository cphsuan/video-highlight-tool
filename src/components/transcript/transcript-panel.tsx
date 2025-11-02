import { SectionItem } from "./section-item";
import { useTranscriptStore } from "@/stores/transcript-store";
import { FileText } from "lucide-react";

export const TranscriptPanel = () => {
  const transcript = useTranscriptStore((state) => state.transcript);

  if (!transcript) {
    return (
      <div className="h-full flex items-center justify-center bg-muted">
        <div className="text-center space-y-3">
          <FileText className="w-12 h-12 text-muted-foreground mx-auto" />
          <p className="text-muted-foreground">No transcript loaded</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-white">
      <div className="shrink-0 border-b border-gray-200 bg-white px-6 py-4">
        <h1 className="text-2xl font-bold text-black">Transcript</h1>
      </div>
      <div className="flex-1 overflow-y-auto px-6 py-4">
        {transcript.sections.map((section) => (
          <SectionItem key={section.id} section={section} />
        ))}
      </div>
    </div>
  );
};
