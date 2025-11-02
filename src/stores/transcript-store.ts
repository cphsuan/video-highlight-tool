import { create } from "zustand";
import type {
  Transcript,
  ViewState,
  HighlightSegment,
} from "@/types/transcript";
import { uploadVideo } from "@/lib/api/upload";
import { fetchTranscript } from "@/lib/api/transcript";
import type { ProcessingStep } from "@/constants/loading";

interface TranscriptState {
  transcript: Transcript | null;
  videoUrl: string | null;

  viewState: ViewState;
  processingStep: ProcessingStep;
  currentTime: number;
  isPlaying: boolean;
  activeSentenceId: string | null;

  loadTranscript: (file: File) => Promise<void>;
  toggleHighlight: (sentenceId: string) => void;
  setCurrentTime: (time: number) => void;
  setIsPlaying: (playing: boolean) => void;
  setActiveSentenceId: (id: string | null) => void;
  seekToSentence: (sentenceId: string) => number | null;
  reset: () => void;
}

const initialState = {
  transcript: null,
  videoUrl: null,
  viewState: "upload" as ViewState,
  processingStep: "idle" as ProcessingStep,
  currentTime: 0,
  isPlaying: false,
  activeSentenceId: null,
};

export const useTranscriptStore = create<TranscriptState>((set, get) => ({
  ...initialState,

  loadTranscript: async (file: File) => {
    set({ viewState: "processing", processingStep: "upload" });

    try {
      const uploadId = await uploadVideo(file);
      set({ processingStep: "transcript" });

      const { transcript, videoUrl } = await fetchTranscript(uploadId);

      const blobUrl = await fetch(videoUrl)
        .then((res) => res.blob())
        .then((blob) => URL.createObjectURL(blob));

      set({ processingStep: "finalizing" });

      await new Promise((resolve) => setTimeout(resolve, 300));

      set({
        transcript,
        videoUrl: blobUrl,
        viewState: "editor",
        processingStep: "idle",
      });
    } catch (error) {
      console.error("Failed to load transcript:", error);
      set({ viewState: "upload", processingStep: "idle" });
    }
  },

  toggleHighlight: (sentenceId: string) => {
    const { transcript } = get();
    if (!transcript) return;

    const updatedTranscript = {
      ...transcript,
      sections: transcript.sections.map((section) => ({
        ...section,
        sentences: section.sentences.map((sentence) =>
          sentence.id === sentenceId
            ? { ...sentence, isHighlight: !sentence.isHighlight }
            : sentence
        ),
      })),
    };

    set({ transcript: updatedTranscript });
  },

  setCurrentTime: (time: number) => {
    set({ currentTime: time });
  },

  setIsPlaying: (playing: boolean) => {
    set({ isPlaying: playing });
  },

  setActiveSentenceId: (id: string | null) => {
    set({ activeSentenceId: id });
  },

  seekToSentence: (sentenceId: string) => {
    const { transcript } = get();
    if (!transcript) return null;
    for (const section of transcript.sections) {
      for (const sentence of section.sentences) {
        if (sentence.id === sentenceId) {
          set({ currentTime: sentence.start });
          return sentence.start;
        }
      }
    }

    return null;
  },

  reset: () => {
    set(initialState);
  },
}));

export const computeHighlightedSentences = (
  transcript: Transcript | null
): HighlightSegment[] => {
  if (!transcript) return [];

  const highlighted: HighlightSegment[] = [];
  for (const section of transcript.sections) {
    for (const sentence of section.sentences) {
      if (sentence.isHighlight) {
        highlighted.push({
          sentenceId: sentence.id,
          start: sentence.start,
          end: sentence.end,
          text: sentence.text,
          sectionId: section.id,
          sectionTitle: section.title,
        });
      }
    }
  }
  return highlighted;
};

export const useCurrentHighlightText = () => {
  return useTranscriptStore((state) => {
    const { transcript, currentTime } = state;
    if (!transcript) return null;

    for (const section of transcript.sections) {
      for (const sentence of section.sentences) {
        if (currentTime >= sentence.start && currentTime < sentence.end) {
          return sentence.text;
        }
      }
    }
    return null;
  });
};
