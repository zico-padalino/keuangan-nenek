import type { SupabaseClient } from "@supabase/supabase-js";

export const BUKTI_BUCKET = "bukti";
export const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
const ALLOWED_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
]);

export function getBuktiPublicUrl(path: string | null | undefined) {
  if (!path) return null;
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!base) return null;
  return `${base}/storage/v1/object/public/${BUKTI_BUCKET}/${path}`;
}

export async function uploadBuktiImage(
  supabase: SupabaseClient,
  file: File,
  folder: "contributions" | "expenses",
  userId: string,
) {
  if (!ALLOWED_TYPES.has(file.type)) {
    return { error: "Format gambar harus JPG, PNG, WEBP, atau GIF." };
  }
  if (file.size > MAX_IMAGE_BYTES) {
    return { error: "Ukuran gambar maksimal 5 MB." };
  }

  const ext =
    file.type === "image/png"
      ? "png"
      : file.type === "image/webp"
        ? "webp"
        : file.type === "image/gif"
          ? "gif"
          : "jpg";
  const path = `${folder}/${userId}/${crypto.randomUUID()}.${ext}`;

  const { error } = await supabase.storage.from(BUKTI_BUCKET).upload(path, file, {
    cacheControl: "3600",
    upsert: false,
    contentType: file.type,
  });

  if (error) return { error: error.message };
  return { path };
}

export async function deleteBuktiImage(
  supabase: SupabaseClient,
  path: string | null | undefined,
) {
  if (!path) return;
  await supabase.storage.from(BUKTI_BUCKET).remove([path]);
}
