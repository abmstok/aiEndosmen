
export interface GeneratedImage {
  id: number;
  src: string | null;
  status: 'loading' | 'success' | 'error';
}
