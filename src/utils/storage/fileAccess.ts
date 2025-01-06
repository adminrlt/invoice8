import { supabase } from '../../lib/supabase';
import { getFileMetadata, ensureCorrectMimeType } from './fileHandler';

const cleanPath = (path: string): string => {
  return path.replace(/^https?:\/\/.*?\/storage\/v1\/object\/(public|sign)\/[^/]+\//, '');
};

const getBucket = (path: string): 'documents' | 'cases' => {
  return path.startsWith('CASE-') ? 'cases' : 'documents';
};

export const getStorageUrl = async (path: string, options?: { download?: boolean }): Promise<string | null> => {
  try {
    const cleanedPath = cleanPath(path);
    const bucket = getBucket(cleanedPath);

    // Get file metadata
    const metadata = await getFileMetadata(cleanedPath, bucket);
    
    // Set content type for signed URL
    const urlOptions = {
      ...options,
      transform: {
        contentType: metadata?.contentType || 'application/pdf'
      }
    };

    // Try signed URL first
    const { data: signedData, error: signedError } = await supabase.storage
      .from(bucket)
      .createSignedUrl(cleanedPath, 3600, urlOptions);

    if (!signedError && signedData?.signedUrl) {
      return ensureCorrectMimeType(signedData.signedUrl);
    }

    // Fallback to public URL
    const { data: { publicUrl }, error: publicError } = await supabase.storage
      .from(bucket)
      .getPublicUrl(cleanedPath);

    if (publicError) throw publicError;
    return ensureCorrectMimeType(publicUrl);
  } catch (error) {
    console.error('Storage URL error:', error);
    return null;
  }
};