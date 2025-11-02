import { useRef, useEffect } from "react";
import { formatTime } from "@/utils/time-utils";
import { useTranscriptStore } from "@/stores/transcript-store";
import { cn } from "@/lib/utils";
import type { Sentence } from "@/types/transcript";

interface SentenceItemProps {
  sentence: Sentence;
  isActive: boolean;
}

export const SentenceItem = ({ sentence, isActive }: SentenceItemProps) => {
  const sentenceRef = useRef<HTMLDivElement>(null);
  const { toggleHighlight, seekToSentence } = useTranscriptStore();

  useEffect(() => {
    if (isActive && sentenceRef.current) {
      sentenceRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [isActive]);

  const handleTimestampClick = () => {
    seekToSentence(sentence.id);
  };

  const handleCheckboxChange = () => {
    toggleHighlight(sentence.id);
  };

  return (
    <div
      ref={sentenceRef}
      onClick={handleCheckboxChange}
      className={cn(
        "flex items-start gap-2 p-3 rounded cursor-pointer transition-all",
        sentence.isHighlight && "bg-blue-500 text-white",
        !sentence.isHighlight && "bg-gray-50 hover:bg-gray-100"
      )}
    >
      <button
        onClick={(e) => {
          e.stopPropagation();
          handleTimestampClick();
        }}
        className="text-blue-600 hover:text-blue-700 font-medium text-sm shrink-0 cursor-pointer"
      >
        {formatTime(sentence.start)}
      </button>

      <p className="text-sm leading-relaxed flex-1">{sentence.text}</p>
    </div>
  );
};
