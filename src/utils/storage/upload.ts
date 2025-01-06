import { supabase } from '../../lib/supabase';
import { ensurePdfMimeType } from '../file/mimeTypes';
import { retryOperation } from '../async/retry';

export const uploadToCases = async (path: string, data: Blob): Promise<void> => {
  const pdfBlob = ensurePdfMimeType(data);
  
  await retryOperation(async () => {
    const { error } = await supabase.storage
      .from('cases')
      .upload(path, pdfBlob, {
        contentType: 'application/pdf',
        cacheControl: '3600',
        upsert: true
      });

    if (error) throw error;
  }, 3);
};

export const uploadToDocuments = async (path: string, file: File): Promise<void> => {
  const pdfBlob = ensurePdfMimeType(file);
  
  await retryOperation(async () => {
    const { error } = await supabase.storage
      .from('documents')
      .upload(path, pdfBlob, {
        contentType: 'application/pdf',
        cacheControl: '3600',
        upsert: true
      });

    if (error) throw error;
  }, 3);
};