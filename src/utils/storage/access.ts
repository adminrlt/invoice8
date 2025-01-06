import { checkFileExists } from './bucketAccess';
import { getSignedUrl, getPublicUrl } from './urlAccess';
import type { StorageResult, UrlOptions } from './types';

export const getFileAccess = async (
  path: string, 
  options?: UrlOptions
): Promise<StorageResult> => {
  if (!path) {
    throw new Error('Invalid file path');
  }

  // Check cases bucket first
  if (await checkFileExists('cases', path)) {
    try {
      const { data: signedData, error: signedError } = await getSignedUrl('cases', path, options);
      if (!signedError && signedData?.signedUrl) {
        return { url: signedData.signedUrl, bucket: 'cases' };
      }
    } catch (error) {
      console.debug('Cases bucket signed URL failed:', error);
    }
  }

  // Try documents bucket
  if (await checkFileExists('documents', path)) {
    try {
      // Try signed URL first
      const { data: signedData, error: signedError } = await getSignedUrl('documents', path, options);
      if (!signedError && signedData?.signedUrl) {
        return { url: signedData.signedUrl, bucket: 'documents' };
      }

      // Fallback to public URL
      const publicUrl = await getPublicUrl('documents', path, options);
      if (publicUrl) {
        return { url: publicUrl, bucket: 'documents' };
      }
    } catch (error) {
      console.debug('Documents bucket access failed:', error);
    }
  }

  throw new Error(`File not found: ${path}`);
};