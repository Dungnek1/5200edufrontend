
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';


export function getMediaUrl(mediaUrl: string | null | undefined): string {
    if (!mediaUrl) {
        return '/images/placeholder.svg';
    }

    if (mediaUrl.startsWith('http://') || mediaUrl.startsWith('https://')) {
        return mediaUrl;
    }

    if (mediaUrl.startsWith('/')) {
        return mediaUrl;
    }

    const parts = mediaUrl.split('/');
    if (parts.length < 2) {
        return '/images/placeholder.svg';
    }

    const bucket = parts[0];
    const path = parts.slice(1).join('/');

    return `${API_BASE_URL}/api/v1/media/${bucket}/${path}`;
}

export function parseMediaUrl(mediaUrl: string): { bucket: string; path: string } {
    const parts = mediaUrl.split('/');
    const bucket = parts[0];
    const path = parts.slice(1).join('/');

    return { bucket, path };
}

const MINIO_URL = process.env.NEXT_PUBLIC_MINIO || '';

export function getAvatarUrl(avatarUrl: string | null | undefined): string {
    if (!avatarUrl) {
        return '/images/avatars/Ellipse 29.png';
    }
    if (avatarUrl.startsWith('data:') || avatarUrl.startsWith('http://') || avatarUrl.startsWith('https://') || avatarUrl.startsWith('/')) {
        return avatarUrl;
    }
    return `${MINIO_URL}/${avatarUrl}`;
}

export function getThumbnailUrl(thumbnailUrl: string | null | undefined): string {
    if (!thumbnailUrl) {
        return '/images/placeholder.svg';
    }
    return getMediaUrl(thumbnailUrl);
}


export function getFileUrl(fileUrl: string | null | undefined): string {
    if (!fileUrl) {
        return '';
    }
    return getMediaUrl(fileUrl);
}


export function validateFileType(file: File, allowedTypes: string[]): boolean {
    return allowedTypes.some(type => {
        if (type.endsWith('/*')) {
            const baseType = type.split('/')[0];
            return file.type.startsWith(baseType + '/');
        }
        return file.type === type;
    });
}


export function validateFileSize(file: File, maxSizeMB: number): boolean {
    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    return file.size <= maxSizeBytes;
}

export function formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}