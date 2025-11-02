import { describe, it, expect } from "vitest";
import { http, HttpResponse } from "msw";
import { uploadVideo } from "@/lib/api/upload";
import { fetchTranscript } from "@/lib/api/transcript";
import { server } from "@/mocks/server";

const createFile = () =>
  new File(["dummy"], "sample.mp4", {
    type: "video/mp4",
    lastModified: Date.now(),
  });

describe("uploadVideo api", () => {
  it("returns upload id when upload succeeds", async () => {
    const id = await uploadVideo(createFile());
    expect(id).toBe("sample-job");
  });

  it("throws when server responds with error", async () => {
    server.use(
      http.post("/api/upload", () =>
        HttpResponse.json({ message: "fail" }, { status: 500 }),
      ),
    );

    await expect(uploadVideo(createFile())).rejects.toThrow("Failed to upload video");
  });
});

describe("fetchTranscript api", () => {
  it("returns transcript payload when job exists", async () => {
    const { transcript, videoUrl } = await fetchTranscript("sample-job");
    expect(transcript.videoId).toBe("sample_subtitle");
    expect(transcript.sections.length).toBeGreaterThan(0);
    expect(videoUrl).toBe("/sample_video.mp4");
  });

  it("throws when transcript cannot be found", async () => {
    server.use(
      http.get("/api/transcript/:id", () =>
        HttpResponse.json({ message: "missing" }, { status: 404 }),
      ),
    );

    await expect(fetchTranscript("unknown"))
      .rejects.toThrow("Failed to fetch transcript");
  });
});
