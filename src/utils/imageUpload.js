import imageCompression from "browser-image-compression";
import { supabase, USE_SUPABASE, BUCKETS } from "../config/supabase";

const COMPRESSION_OPTIONS = {
  maxSizeMB: 0.5,
  maxWidthOrHeight: 1600,
  useWebWorker: true,
  fileType: "image/jpeg",
  initialQuality: 0.85,
};

export async function uploadImage(file, folder = "albums") {
  try {
    const compressed = await imageCompression(file, COMPRESSION_OPTIONS);

    if (!USE_SUPABASE) {
      return {
        url: URL.createObjectURL(compressed),
        path: null,
        error: null,
        local: true,
      };
    }

    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 8);
    const filename = `${folder}/${timestamp}-${random}.jpg`;

    const { data, error } = await supabase.storage
      .from(BUCKETS.GALLERY)
      .upload(filename, compressed, {
        cacheControl: "3600",
        upsert: false,
        contentType: "image/jpeg",
      });

    if (error) throw error;

    const { data: urlData } = supabase.storage
      .from(BUCKETS.GALLERY)
      .getPublicUrl(data.path);

    return { url: urlData.publicUrl, path: data.path, error: null };
  } catch (e) {
    console.error("[uploadImage]", e);
    return { url: null, path: null, error: e.message };
  }
}

export async function uploadImages(files, folder, onProgress) {
  const results = [];
  let completed = 0;

  for (const file of files) {
    const result = await uploadImage(file, folder);
    results.push(result);
    completed++;
    if (onProgress) {
      onProgress({
        completed,
        total: files.length,
        percent: Math.round((completed / files.length) * 100),
      });
    }
  }

  return results;
}

export async function deleteImage(path) {
  if (!USE_SUPABASE || !path) return { error: null };
  try {
    const { error } = await supabase.storage
      .from(BUCKETS.GALLERY)
      .remove([path]);
    if (error) throw error;
    return { error: null };
  } catch (e) {
    console.error("[deleteImage]", e);
    return { error: e.message };
  }
}

export function validateImageFile(file) {
  const MAX_SIZE = 10 * 1024 * 1024;
  const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/heic"];

  if (file.size > MAX_SIZE) {
    return `File terlalu besar (max 10 MB). File Anda: ${(file.size / 1024 / 1024).toFixed(1)} MB`;
  }
  if (!ALLOWED_TYPES.includes(file.type) && !file.type.startsWith("image/")) {
    return `Format tidak didukung. Pakai JPG, PNG, atau WebP`;
  }
  return null;
}
