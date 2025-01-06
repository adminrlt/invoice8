import { supabase } from '../../lib/supabase';
import { retryOperation } from '../async/retry';

export const checkFileExists = async (bucket: string, path: string): Promise<boolean> => {
  return retryOperation(async () => {
    try {
      const folderPath = path.split('/').slice(0, -1).join('/');
      const fileName = path.split('/').pop();

      if (!fileName) return false;

      const { data, error } = await supabase.storage
        .from(bucket)
        .list(folderPath);
    
      if (error) throw error;
      
      return data?.some(file => file.name === fileName) || false;
    } catch (error) {
      console.debug(`File check failed for ${bucket}/${path}:`, error);
      return false;
    }
  }, 3, { initialDelay: 1000 });
};