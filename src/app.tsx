import { useTranscriptStore } from "@/stores/transcript-store";
import { UploadArea } from "@/components/upload/upload-area";
import { LoadingScreen } from "@/components/upload/loading-screen";
import { MainLayout } from "@/components/layout/main-layout";
import { VideoPlayer } from "@/components/video/video-player";
import { TranscriptPanel } from "@/components/transcript/transcript-panel";

function App() {
  const { viewState, loadTranscript } = useTranscriptStore();

  const handleUpload = async (file: File) => {
    await loadTranscript(file);
  };

  if (viewState === "upload") {
    return <UploadArea onUploadClick={handleUpload} />;
  }

  if (viewState === "processing") {
    return <LoadingScreen />;
  }

  return (
    <MainLayout rightPanel={<VideoPlayer />} leftPanel={<TranscriptPanel />} />
  );
}

export default App;
