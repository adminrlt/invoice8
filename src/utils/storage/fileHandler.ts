import { supabase } from '../../lib/supabase';

interface FileMetadata {
  contentType: string;
  size: number;
}

export const getFileMetadata = async (path: string, bucket: 'documents' | 'cases'): Promise<FileMetadata | null> => {
  try {
    const { data } = await supabase.storage.from(bucket).list(path.split('/').slice(0, -1).join('/'), {
      limit: 1,
      search: path.split('/').pop()
    });

    if (!data?.[0]) return null;

    return {
      contentType: data[0].metadata?.mimetype || 'application/pdf',
      size: data[0].metadata?.size || 0
    };
  } catch (error) {
    console.error('Error getting file metadata:', error);
    return null;
  }
};

export const ensureCorrectMimeType = async (url: string): Promise<string> => {
  // Add PDF content type parameter if missing
  if (!url.includes('response-content-type=')) {
    const separator = url.includes('?') ? '&' : '?';
    return `${url}${separator}response-content-type=application/pdf`;
  }
  return url;
};