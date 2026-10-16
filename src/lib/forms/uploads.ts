export const UPLOAD_MAX_BYTES = 10 * 1024 * 1024;

export const UPLOAD_MAX_FILES = 20;

export const UPLOAD_MIME_TYPES = [
  "application/pdf",
  "image/jpeg",
  "image/png",
  "image/webp",
] as const;

export const UPLOAD_ACCEPT = ".pdf,.jpg,.jpeg,.png,.webp";
