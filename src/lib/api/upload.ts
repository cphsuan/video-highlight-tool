const UPLOAD_ENDPOINT = "/api/upload";

type UploadVideoResponse = {
  id: string;
};

export const uploadVideo = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(UPLOAD_ENDPOINT, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error("Failed to upload video");
  }

  const data = (await response.json()) as UploadVideoResponse;
  if (!data.id) {
    throw new Error("Upload response missing transcript id");
  }

  return data.id;
};
