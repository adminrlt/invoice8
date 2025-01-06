export const PDF_MIME_TYPE = 'application/pdf';

export const isPdfFile = (file: File | Blob): boolean => {
  return file.type === PDF_MIME_TYPE;
};

export const ensurePdfMimeType = (blob: Blob): Blob => {
  if (blob.type !== PDF_MIME_TYPE) {
    return new Blob([blob], { type: PDF_MIME_TYPE });
  }
  return blob;
};