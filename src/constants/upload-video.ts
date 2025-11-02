export const ACCEPTED_VIDEO_TYPES = [
  "video/mp4",
  "video/quicktime",
  "video/x-msvideo",
] as const;

export type AcceptedVideoType = (typeof ACCEPTED_VIDEO_TYPES)[number];

export const ACCEPTED_VIDEO_MAP: Record<AcceptedVideoType, string[]> = {
  "video/mp4": [".mp4"],
  "video/quicktime": [".mov"],
  "video/x-msvideo": [".avi"],
};

export const isAcceptedVideoType = (type: string): type is AcceptedVideoType =>
  ACCEPTED_VIDEO_TYPES.includes(type as AcceptedVideoType);
