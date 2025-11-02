import { SentenceItem } from "./sentence-item";
import { useTranscriptStore } from "@/stores/transcript-store";
import type { Section } from "@/types/transcript";

interface SectionItemProps {
  section: Section;
}

export const SectionItem = ({ section }: SectionItemProps) => {
  const activeSentenceId = useTranscriptStore(
    (state) => state.activeSentenceId
  );

  return (
    <div className="mb-6">
      <h2 className="font-bold text-lg text-black mb-3">{section.title}</h2>
      <div className="space-y-2">
        {section.sentences.map((sentence) => (
          <SentenceItem
            key={sentence.id}
            sentence={sentence}
            isActive={sentence.id === activeSentenceId}
          />
        ))}
      </div>
    </div>
  );
};
