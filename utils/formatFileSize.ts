export const formatFileSize = (size: any) => {
  if (!size) return '';
  const sizeNum = Number(size);
  if (isNaN(sizeNum)) return size;
  if (sizeNum < 1024 * 1024) return `${Math.round(sizeNum / 1024)} KB`;
  return `${(sizeNum / (1024 * 1024)).toFixed(1)} MB`;
};