/**
 * Convert MinIO key to full URL
 * Example: videos/hls/module-456/playlist.m3u8 -> http://103.72.56.121:7099/videos/hls/module-456/playlist.m3u8
 */
export function getMinIOUrl(minioKey: string): string {
  if (!minioKey) return '';
  
  // If already a full URL, return as is
  if (minioKey.startsWith('http://') || minioKey.startsWith('https://')) {
    return minioKey;
  }
  
  // Remove leading slash if present
  const key = minioKey.startsWith('/') ? minioKey.slice(1) : minioKey;
  
  const minioUrl = process.env.NEXT_PUBLIC_MINIO || 'http://103.72.56.121:7099';
  return `${minioUrl}/${key}`;
}
