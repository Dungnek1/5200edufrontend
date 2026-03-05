
export interface VideoMagicBytePattern {
  extension: string;
  magicBytes: number[];
  offset: number;
}

const VIDEO_SIGNATURES: VideoMagicBytePattern[] = [
  {
    extension: '.mp4',
    magicBytes: [0x66, 0x74, 0x79, 0x70],
    offset: 4
  },
  {
    extension: '.avi',
    magicBytes: [0x52, 0x49, 0x46, 0x46],
    offset: 0,
  },
  {
    extension: '.webm',
    magicBytes: [0x1A, 0x45, 0xDF, 0xA3],
    offset: 0,
  },
  {
    extension: '.mov',
    magicBytes: [0x6D, 0x6F, 0x6F, 0x76],
    offset: 4,
  },
];


async function readFileHeader(file: File, maxLength: number = 12): Promise<Uint8Array> {
  const slice = file.slice(0, maxLength);
  const buffer = await slice.arrayBuffer();
  return new Uint8Array(buffer);
}


function matchesMagicBytes(
  fileBytes: Uint8Array,
  pattern: VideoMagicBytePattern
): boolean {
  for (let i = 0; i < pattern.magicBytes.length; i++) {
    const fileIndex = pattern.offset + i;
    if (fileIndex >= fileBytes.length) {
      return false;
    }
    if (fileBytes[fileIndex] !== pattern.magicBytes[i]) {
      return false;
    }
  }
  return true;
}
export async function validateVideoFile(file: File): Promise<{
  valid: boolean;
  detectedType?: string;
  error?: string;
}> {
  try {
    const header = await readFileHeader(file, 12);

    for (const signature of VIDEO_SIGNATURES) {
      if (matchesMagicBytes(header, signature)) {
        return {
          valid: true,
          detectedType: signature.extension,
        };
      }
    }

    return {
      valid: false,
      error: 'File không phải là video hợp lệ. Vui lòng chọn file MP4, AVI, WebM hoặc MOV.',
    };
  } catch (error) {
    return {
      valid: false,
      error: 'Không thể đọc file. Vui lòng thử lại.',
    };
  }
}

export function isValidVideoExtension(filename: string): boolean {
  const name = filename.toLowerCase();
  return ['.mp4', '.mov', '.avi', '.webm'].some(ext => name.endsWith(ext));
}
