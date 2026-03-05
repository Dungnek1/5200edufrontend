export interface Instructor {
  id: string;
  name: string;
  title: string;
  avatar: string;
  bio: string;
  email: string;
  phone?: string;
  location?: string;
  website?: string;
  linkedin?: string;
  facebook?: string;
  youtube?: string;
  instagram?: string;
  twitter?: string;
  specialties: string[];
  experience: string;
  education: string[];
  languages: string[];
  stats: {
    students: number;
    courses: number;
    reviews: number;
    rating: number;
    yearsOfExperience: number;
  };
  achievements: Achievement[];
  socialMedia: SocialMedia[];
  availability: Availability;
  courses: Course[];
  reviews: InstructorReview[];
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
  platform: 'linkedin' | 'facebook' | 'youtube' | 'instagram' | 'twitter' | 'website';
  url: string;
  username?: string;
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

export interface InstructorReview {
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

import type { Course } from './course';

export interface InstructorFilters {
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