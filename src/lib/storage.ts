// Upload une image vers Cloudinary via l'API unsigned upload
// Pas besoin d'API Secret côté client — uniquement le preset "unsigned"

const CLOUD_NAME   = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!;
const UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!;

export interface UploadResult {
  url: string;        // URL optimisée
  publicId: string;   // ID pour suppression future
}

export async function uploadImage(
  file: File,
  folder = "bao-portfolio/projects"
): Promise<UploadResult> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", UPLOAD_PRESET);
  formData.append("folder", folder);

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
    { method: "POST", body: formData }
  );

  if (!res.ok) throw new Error("Cloudinary upload failed");

  const data = await res.json();
  return {
    url:      data.secure_url,
    publicId: data.public_id,
  };
}

export async function deleteImage(publicId: string): Promise<void> {
  // La suppression nécessite l'API Secret → à faire via une route API Next.js
  await fetch("/api/delete-image", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ publicId }),
  });
}

// Génère une URL optimisée avec transformation Cloudinary
export function getOptimizedUrl(url: string, width = 800): string {
  if (!url.includes("cloudinary.com")) return url;
  return url.replace("/upload/", `/upload/w_${width},q_auto,f_auto/`);
}