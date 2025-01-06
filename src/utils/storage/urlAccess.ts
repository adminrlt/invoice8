import { supabase } from '../../lib/supabase';
import { retryOperation } from '../async/retry';
import type { UrlOptions } from './types';

export const getSignedUrl = async (bucket: string, path: string, options?: UrlOptions) => {
  return retryOperation(
    () => supabase.storage
      .from(bucket)
      .createSignedUrl(path, 3600, options),
    3,
    { initialDelay: 1000 }
  );
};

export const getPublicUrl = async (bucket: string, path: string, options?: UrlOptions) => {
  const { data: { publicUrl }, error } = await supabase.storage
    .from(bucket)
    .getPublicUrl(path, options);
    
  if (error) throw error;
  return publicUrl;
};