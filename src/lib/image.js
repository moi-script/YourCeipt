// Phone photos are 4-12 MB. OCR reads a 2000px JPEG just as well, and it
// uploads in a fraction of the time on mobile data.
export async function downscaleImage(file, { maxSide = 2000, quality = 0.85 } = {}) {
  if (!file?.type?.startsWith("image/") || file.type === "image/gif") return file;

  try {
    const bitmap = await createImageBitmap(file, { imageOrientation: "from-image" });
    const scale = Math.min(1, maxSide / Math.max(bitmap.width, bitmap.height));
    if (scale === 1 && file.size < 1.5 * 1024 * 1024) {
      bitmap.close?.();
      return file;
    }

    const canvas = document.createElement("canvas");
    canvas.width = Math.round(bitmap.width * scale);
    canvas.height = Math.round(bitmap.height * scale);
    canvas.getContext("2d").drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    bitmap.close?.();

    const blob = await new Promise((resolve) => canvas.toBlob(resolve, "image/jpeg", quality));
    return blob && blob.size < file.size
      ? new File([blob], file.name.replace(/\.\w+$/, "") + ".jpg", { type: "image/jpeg" })
      : file;
  } catch {
    // HEIC on some browsers, or createImageBitmap unsupported: send as-is.
    return file;
  }
}
