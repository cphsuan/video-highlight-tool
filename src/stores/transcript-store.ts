import { create } from "zustand";
import type {
  Transcript,
  ViewState,
  HighlightSegment,
} from "@/types/transcript";
import { uploadVideo } from "@/lib/api/upload";
import { fetchTranscript } from "@/lib/api/transcript";
import type { ProcessingStep } from "@/constants/loading";
import {
  getHighlightSegments,
  getSentenceTextAtTime,
} from "@/utils/highlight-playback";

interface TranscriptState {
  transcript: Transcript | null;
  videoUrl: string | null;

  viewState: ViewState;
  processingStep: ProcessingStep;
  currentTime: number;
  isPlaying: boolean;
  activeSentenceId: string | null;
  highlightSegments: HighlightSegment[];

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
  highlightSegments: [] as HighlightSegment[],
};

export const useTranscriptStore = create<TranscriptState>((set, get) => ({
  ...initialState,

  loadTranscript: async (file: File) => {
    const { videoUrl: previousVideoUrl } = get();
    if (previousVideoUrl?.startsWith("blob:")) {
      URL.revokeObjectURL(previousVideoUrl);
    }

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
        currentTime: 0,
        isPlaying: false,
        activeSentenceId: null,
        highlightSegments: getHighlightSegments(transcript),
      });
    } catch (error) {
      console.error("Failed to load transcript:", error);
      set({
        viewState: "upload",
        processingStep: "idle",
        transcript: null,
        videoUrl: null,
        highlightSegments: [],
      });
    }
  },

  toggleHighlight: (sentenceId: string) => {
    const { transcript } = get();
    if (!transcript) return;

    let found = false;
    const updatedTranscript = {
      ...transcript,
      sections: transcript.sections.map((section) => {
        if (found || !section.sentences.some((s) => s.id === sentenceId)) {
          return section;
        }

        const updatedSection = {
          ...section,
          sentences: section.sentences.map((sentence) =>
            sentence.id === sentenceId
              ? { ...sentence, isHighlight: !sentence.isHighlight }
              : sentence
          ),
        };

        found = true;
        return updatedSection;
      }),
    };

    set({
      transcript: updatedTranscript,
      highlightSegments: getHighlightSegments(updatedTranscript),
    });
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
    const { videoUrl } = get();
    if (videoUrl?.startsWith("blob:")) {
      URL.revokeObjectURL(videoUrl);
    }

    set({ ...initialState });
  },
}));

export const computeHighlightedSentences = getHighlightSegments;

export const useCurrentHighlightText = () => {
  return useTranscriptStore((state) => {
    return getSentenceTextAtTime(state.transcript, state.currentTime);
  });
};

export const useHighlightSegments = () =>
  useTranscriptStore((state) => state.highlightSegments);
