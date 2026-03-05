import type { Course } from './course';


export interface Teacher {
  userId?: string;
  id?: string;
  name?: string;
  title?: string;
  fullName?: string;
  roleTitle?: string;
  professionalTitle?: string;
  professionalField?: string;
  headline?: string;
  avatarUrl?: string;
  avatar?: string;
  thumbnailUrl?: string;
  bio?: string;
  email?: string;
  phone?: string;
  location?: string;
  website?: string;
  linkedin?: string;
  facebook?: string;
  youtube?: string;
  instagram?: string;
  twitter?: string;
  specialties?: string[];
  experience?: string;
  yearsExperience?: number;
  teachingLanguages?: string;
  classroomDescription?: string;
  classroomLocation?: string;
  introVideoUrl?: string | null;
  education?: TeacherEducation[];
  educations?: TeacherEducation[];
  certificates: TeacherCertificate[];
  languages?: string[];
  stats: TeacherStats;
  achievements?: Achievement[];
  socialMedia: SocialMedia[];
  socialLinks?: SocialLink[];
  availability?: Availability;
  courses?: Course[];
  reviews?: TeacherReview[];
  classroomImages?: ClassroomImage[];
}

export interface TeacherCertificate {
  id: string;
  name: string;
  fileUrl: string | null;
  teacherId: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string | null;
  updatedBy: string | null;
}

export interface TeacherEducation {
  id?: string;
  school?: string;
  degree?: string;
  institution?: string;
  educationLevel?: string;
  Department?: string;
  department?: string;
  teacherId?: string;
  createdAt?: string;
}

export interface TeacherStats {
  students: number;
  courses?: number;
  reviews?: number;
  rating?: number;
  yearsOfExperience?: number;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  date: string;
  category: 'award' | 'certification' | 'milestone' | 'recognition';
}

export interface SocialMedia {
  id: string;
  teacherId: string;
  platform: 'linkedin' | 'facebook' | 'youtube' | 'instagram' | 'twitter' | 'website' | 'LINKEDIN' | 'FACEBOOK' | 'YOUTUBE' | 'INSTAGRAM' | 'TWITTER' | 'WEBSITE';
  url: string;
  username: string;
  createdAt: string;
}

export interface SocialLink extends SocialMedia { }

export interface ClassroomImage {
  id: string;
  teacherId: string;
  imageUrl: string;
  createdAt: string;
}

export interface Availability {
  available: boolean;
  schedule: {
    day: string;
    slots: string[];
  }[];
  responseTime: string;
  consultation: {
    enabled: boolean;
    duration: number; // in minutes
    price: number;
  };
}

export interface TeacherReview {
  id: string;
  studentName: string;
  studentAvatar?: string;
  rating: number;
  comment: string;
  courseId?: string;
  courseName?: string;
  createdAt: string;
  helpful?: number;
}

export interface GalleryAlbum {
  id: string;
  teacherUserId: string;
  title: string;
  description: string;
  coverImageUrl: string;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
  createdBy: string | null;
  updatedBy: string | null;
}

export interface GalleryImage {
  id: string;
  teacherUserId: string;
  albumId: string;
  imageUrl: string;
  caption: string;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
  createdBy: string | null;
  updatedBy: string | null;
  album: GalleryAlbum;
}

export interface TeacherFilters {
  search?: string;
  specialties?: string[];
  location?: string;
  minRating?: number;
  maxPrice?: number;
  availability?: boolean;
  sortBy?: 'name' | 'rating' | 'students' | 'courses' | 'experience';
  page?: number;
  limit?: number;
}
