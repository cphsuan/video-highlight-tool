import { isAcceptedVideoType } from "@/constants/upload-video";

export const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / (1024 * 1024)).toFixed(1) + " MB";
};

export const validateFile = (
  file: File,
  maxFileSize: number
): string | null => {
  if (!isAcceptedVideoType(file.type)) {
    return "Please upload a valid video file (MP4, MOV, or AVI)";
  }
  if (file.size > maxFileSize) {
    const readableSize = formatFileSize(maxFileSize);
    return `File size must be less than ${readableSize}`;
  }
  return null;
};

export const getUploadVideoErrorMessage = (message?: string) => {
  if (!message) {
    return "Unable to upload file";
  }

  if (message.toLowerCase().includes("type")) {
    return "Please upload a valid video file (MP4, MOV, or AVI)";
  }

  if (message.toLowerCase().includes("large")) {
    return "File size must be less than 500MB";
  }

  return message;
};
