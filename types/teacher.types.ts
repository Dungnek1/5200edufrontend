/**
 * Teacher Profile Types
 * Based on backend API specifications
 */

export interface TeacherProfile {
  id: string;
  userId: string;
  avatarUrl: string | null;
  professionalField: string | null;
  professionalTitle: string | null;
  headline: string | null;
  bio: string | null;
  teachingLanguages: string | null;
  yearsExperience: number | null;
  classroomDescription: string | null;
  classroomLocation: string | null;
  introVideoUrl: string | null;
  socialLinks?: SocialLink[];
  educations?: Education[];
  certificates?: Certificate[];
  classroomImages?: ClassroomImage[];
  createdAt: string;
  updatedAt: string;
}

export interface SocialLink {
  id: string;
  platform: 'FACEBOOK' | 'X' | 'YOUTUBE' | 'TIKTOK' | 'LINKEDIN' | 'WEBSITE' | 'OTHER';
  url: string;
}

export interface Education {
  id: string;
  school: string;
  degree?: string | null;
  educationLevel?: 'COLLEGE' | 'UNIVERSITY' | 'GRADUATE' | 'MASTER' | 'DOCTORATE' | 'PROFESSOR' | null;
  fieldOfStudy?: string | null;
  startDate?: string | null;
  endDate?: string | null;
}

export interface Certificate {
  id: string;
  title: string;
  issuer: string | null;
  issueDate: string | null;
  credentialUrl: string | null;
  description: string | null;
  category: string | null;
  imageUrl: string | null;
}

export interface ClassroomImage {
  id: string;
  imageUrl: string;
  caption?: string;
}

export interface GalleryAlbum {
  id: string;
  title: string;
  description: string | null;
  coverImageUrl: string | null;
  sortOrder: number;
  images?: GalleryImage[];
  createdAt: string;
}

export interface GalleryImage {
  id: string;
  albumId: string | null;
  imageUrl: string;
  caption: string | null;
  sortOrder: number;
}


export interface CreateProfileDto {
  avatarUrl?: string;
  professionalField?: string;
  professionalTitle?: string;
  headline?: string;
  bio?: string;
  teachingLanguages?: string;
  yearsExperience?: number;
  classroomDescription?: string;
  classroomLocation?: string;
  introVideoUrl?: string;
}

export interface UpdateProfileDto {
  avatarUrl?: string | null;
  professionalField?: string | null;
  professionalTitle?: string | null;
  headline?: string | null;
  bio?: string | null;
  teachingLanguages?: string | null;
  yearsExperience?: number | null;
  classroomDescription?: string | null;
  classroomLocation?: string | null;
  introVideoUrl?: string | null;
}

export interface CreateSocialLinkDto {
  platform: string;
  url: string;
}

export interface UpdateSocialLinkDto {
  url: string;
}

export interface CreateCertificateDto {
  title: string;
  issuer?: string;
  issueDate?: string;
  credentialUrl?: string;
  description?: string;
  category?: string;
}

export interface UpdateCertificateDto {
  title?: string;
  issuer?: string;
  issueDate?: string;
  credentialUrl?: string;
  description?: string;
  category?: string;
  imageUrl?: string | null;
}

export interface CreateAlbumDto {
  title: string;
  description?: string;
  coverImageUrl?: string;
}

export interface UpdateAlbumDto {
  title?: string;
  description?: string;
  coverImageUrl?: string;
}
