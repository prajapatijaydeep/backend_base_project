import * as admin from "firebase-admin";
import axios from "axios";

type Props = {
  imageUrl: string;
  folderName: string;
  metadata: Record<string, any>;
};

export async function uploadImageToStorage({
  imageUrl,
  metadata,
  folderName,
}: Props) {
  try {
    const response = await axios.get(imageUrl, { responseType: "arraybuffer" });

    const buffer = Buffer.from(response.data, "binary");

    // Generate a unique filename based on the current timestamp
    const timestamp = Date.now();
    const extension = response.headers["content-type"].split("/")[1];
    const storagePath = `${folderName}/${timestamp}.${extension}`;

    const bucket = admin.storage().bucket();
    const file = bucket.file(storagePath);

    await file.save(buffer, { metadata });

    const publicUrl = `https://firebasestorage.googleapis.com/v0/b/${
      bucket.name
    }/o/${encodeURIComponent(file.name)}?alt=media`;
    console.log("Image uploaded successfully. URL:", publicUrl);

    return publicUrl;
  } catch (error) {
    console.error("Error while uploading image to Firebase Storage:", error);
    throw error;
  }
}
