import { useState } from "react";
import { Upload, Video } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ACCEPTED_VIDEO_MAP } from "@/constants/upload-video";
import {
  getUploadVideoErrorMessage,
  validateFile,
} from "@/utils/video-utils";
import { UploadDropzone } from "@/components/upload/upload-dropzone";

interface UploadAreaProps {
  onUploadClick: (file: File) => Promise<void> | void;
}

export const UploadArea = ({ onUploadClick }: UploadAreaProps) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);

  const MAX_FILE_SIZE = 500 * 1024 * 1024;

  const handleFileSelect = (file: File) => {
    const validationError = validateFile(file, MAX_FILE_SIZE);
    if (validationError) {
      setError(validationError);
      setSelectedFile(null);
      return;
    }

    setError(null);
    setSelectedFile(file);
  };

  const handleClearFile = () => {
    setSelectedFile(null);
    setError(null);
  };

  const handleDropError = (message?: string) => {
    setError(getUploadVideoErrorMessage(message));
    setSelectedFile(null);
  };

  const handleUpload = async () => {
    if (selectedFile) {
      await onUploadClick(selectedFile);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <Card className="w-full max-w-2xl p-12">
        <div className="flex flex-col items-center text-center space-y-6">
          <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center">
            <Video className="w-12 h-12 text-primary" />
          </div>
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-foreground">
              Video Highlight Tool
            </h1>
            <p className="text-muted-foreground text-lg">
              Upload your video to generate AI-powered highlights
            </p>
          </div>

          <div className="w-full">
            <UploadDropzone
              selectedFile={selectedFile}
              error={error}
              accept={ACCEPTED_VIDEO_MAP}
              maxFileSize={MAX_FILE_SIZE}
              onDrop={handleFileSelect}
              onClear={handleClearFile}
              onError={handleDropError}
            />
          </div>

          {selectedFile && !error && (
            <Button size="lg" className="mt-4 gap-2" onClick={handleUpload}>
              <Upload className="w-5 h-5" />
              Process Video
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
};
