import { v2 as cloudinary } from "cloudinary";
import { UPLOAD_FOLDER } from "./upload-constants";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export { cloudinary };

export interface UploadResult {
  url: string;
  publicId: string;
}

export async function uploadToCloudinary(
  file: File
): Promise<UploadResult> {
  const buffer = Buffer.from(await file.arrayBuffer());
  const base64 = buffer.toString("base64");
  const dataURI = `data:${file.type};base64,${base64}`;

  const result = await cloudinary.uploader.upload(dataURI, {
    folder: UPLOAD_FOLDER,
    resource_type: "image",
    transformation: [
      { width: 1200, height: 1600, crop: "limit" },
      { quality: "auto" },
      { format: "auto" },
    ],
  });

  return {
    url: result.secure_url,
    publicId: result.public_id,
  };
}

export async function deleteFromCloudinary(
  publicId: string
): Promise<void> {
  await cloudinary.uploader.destroy(publicId);
}
