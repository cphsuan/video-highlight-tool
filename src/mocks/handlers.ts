import { http, HttpResponse } from "msw";
import sampleTranscript from "@/mock-data/sample_transcript.json";

const SAMPLE_VIDEO_URL = "/sample_video.mp4";
const SAMPLE_UPLOAD_ID = "sample-job";

export const handlers = [
  http.post("/api/upload", async ({ request }) => {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return HttpResponse.json(
        { message: "Upload requires a video file" },
        { status: 400 }
      );
    }

    await new Promise((resolve) => setTimeout(resolve, 100));

    return HttpResponse.json({
      id: SAMPLE_UPLOAD_ID,
      originalName: file.name,
    });
  }),

  http.get("/api/transcript/:id", async ({ params }) => {
    const { id } = params;

    if (id !== SAMPLE_UPLOAD_ID) {
      return HttpResponse.json(
        { message: "Transcript not found" },
        { status: 404 }
      );
    }

    await new Promise((resolve) => setTimeout(resolve, 300));

    return HttpResponse.json({
      transcript: sampleTranscript,
      videoUrl: SAMPLE_VIDEO_URL,
    });
  }),

  http.get("/test_video.mp4", () => {
    return HttpResponse.arrayBuffer(new ArrayBuffer(8), {
      headers: {
        "Content-Type": "video/mp4",
      },
    });
  }),
];
