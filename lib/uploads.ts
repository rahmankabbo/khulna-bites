import "server-only";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { randomBytes } from "crypto";

/**
 * Saves an uploaded cover image to /public/uploads and returns its public path.
 * Local-disk storage keeps the MVP simple — swap for S3/R2/Uploadthing when
 * deploying serverless (public/ is read-only on most serverless platforms).
 */
const MAX_BYTES = 4 * 1024 * 1024; // 4 MB
const ALLOWED = ["image/jpeg", "image/png", "image/webp", "image/avif"];

export async function saveUpload(file: File | null): Promise<string | null> {
  if (!file || file.size === 0) return null;
  if (!ALLOWED.includes(file.type)) {
    throw new Error("Only JPG, PNG, WebP or AVIF images are allowed.");
  }
  if (file.size > MAX_BYTES) {
    throw new Error("Image must be smaller than 4 MB.");
  }
  const ext = file.type.split("/")[1].replace("jpeg", "jpg");
  const name = `${Date.now()}-${randomBytes(4).toString("hex")}.${ext}`;
  const dir = path.join(process.cwd(), "public", "uploads");
  await mkdir(dir, { recursive: true });
  await writeFile(path.join(dir, name), Buffer.from(await file.arrayBuffer()));
  return `/uploads/${name}`;
}
