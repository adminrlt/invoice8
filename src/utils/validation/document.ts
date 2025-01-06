import { validate as isValidUUID } from 'uuid';

export const validateDocumentId = (id: string | undefined): boolean => {
  if (!id) return false;
  return isValidUUID(id);
};

export const validateFileUrl = (url: string | undefined): boolean => {
  if (!url) return false;
  
  // Handle internal storage paths
  if (url.startsWith('documents/') || url.startsWith('cases/')) {
    // Validate basic path structure
    const parts = url.split('/');
    return parts.length >= 2 && parts[parts.length - 1].length > 0;
  }
  
  // Handle external URLs
  try {
    const urlObj = new URL(url);
    return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
  } catch {
    return false;
  }
};

export const validatePageNumber = (pageNumber: number | undefined): boolean => {
  if (typeof pageNumber !== 'number') return false;
  return Number.isInteger(pageNumber) && pageNumber > 0;
};

export const normalizeFileUrl = (url: string): string => {
  // Remove any leading/trailing whitespace
  url = url.trim();
  
  // Remove any double slashes (except after protocol)
  url = url.replace(/([^:])\/+/g, '$1/');
  
  // Ensure proper storage path format
  if (url.startsWith('documents/') || url.startsWith('cases/')) {
    return url;
  }
  
  // Handle full URLs
  try {
    const urlObj = new URL(url);
    return urlObj.pathname.replace(/^\/storage\/v1\/object\/(public|sign)\/[^/]+\//, '');
  } catch {
    return url;
  }
};