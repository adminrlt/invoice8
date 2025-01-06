import { useState, useCallback } from 'react';
import { getStorageUrl } from '../utils/storage/fileAccess';
import toast from 'react-hot-toast';

interface UrlOptions {
  download?: boolean;
}

export const useFileAccess = () => {
  const [isLoading, setIsLoading] = useState(false);

  const getFileUrl = useCallback(async (path: string, options?: UrlOptions): Promise<string | null> => {
    if (!path) {
      toast.error('Invalid file path');
      return null;
    }

    setIsLoading(true);

    try {
      const url = await getStorageUrl(path, options);
      if (!url) {
        throw new Error('Failed to get file URL');
      }
      return url;
    } catch (error: any) {
      console.error('File access error:', error);
      toast.error('Unable to access file');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    isLoading,
    getFileUrl
  };
};