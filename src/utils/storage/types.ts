export interface StorageResult {
  url: string;
  bucket: 'cases' | 'documents';
}

export interface UrlOptions {
  download?: boolean;
  transform?: {
    width?: number;
    height?: number;
    quality?: number;
  };
}