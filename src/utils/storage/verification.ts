import { supabase } from '../../lib/supabase';

export const verifyFileInStorage = async (
  bucket: 'cases' | 'documents',
  path: string
): Promise<boolean> => {
  try {
    const folderPath = path.split('/').slice(0, -1).join('/');
    const fileName = path.split('/').pop();

    if (!fileName) return false;

    const { data, error } = await supabase.storage
      .from(bucket)
      .list(folderPath, {
        limit: 1,
        search: fileName
      });

    if (error) {
      console.error('Storage verification error:', error);
      return false;
    }

    return data.some(file => file.name === fileName);
  } catch (error) {
    console.error('File verification error:', error);
    return false;
  }
};