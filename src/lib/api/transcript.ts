import type { Transcript } from "@/types/transcript";

type TranscriptResponse = {
  transcript: Transcript;
  videoUrl: string;
};

export const fetchTranscript = async (
  id: string,
): Promise<TranscriptResponse> => {
  const response = await fetch(`/api/transcript/${id}`);

  if (!response.ok) {
    throw new Error("Failed to fetch transcript");
  }

  const data = (await response.json()) as Partial<TranscriptResponse>;

  if (!data?.transcript || !data?.videoUrl) {
    throw new Error("Transcript response missing data");
  }

  return {
    transcript: data.transcript,
    videoUrl: data.videoUrl,
  };
};
