import { z } from 'zod';

/**
 * Profile validation schemas
 */

export const updateStudentProfileSchema = z.object({
  fullName: z.string().min(1, 'Họ và tên là bắt buộc').optional(),
  bio: z.string().optional(),
  phone: z.string().optional(),
  dateOfBirth: z.string().optional(),
  gender: z.enum(['male', 'female', 'other']).optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  country: z.string().optional(),
  preferredLanguages: z.string().optional(),
  schoolName: z.string().optional(),
  interests: z.string().optional(),
  learningGoals: z.string().optional(),
});

export const updateTeacherProfileSchema = z.object({
  fullName: z.string().min(1, 'Full name is required').optional(),
  professionalTitle: z.string().optional(),
  bio: z.string().optional(),
  yearsExperience: z.string().optional(),
  expertise: z.string().optional(),
  education: z.array(z.object({
    degree: z.string(),
    school: z.string(),
    year: z.string(),
  })).optional(),
  certifications: z.array(z.object({
    name: z.string(),
    issuer: z.string(),
    year: z.string(),
    url: z.string().url().optional(),
  })).optional(),
  teachingImages: z.array(z.string().url()).optional(),
  socialLinks: z.object({
    facebook: z.string().url().optional(),
    twitter: z.string().url().optional(),
    linkedin: z.string().url().optional(),
    website: z.string().url().optional(),
  }).optional(),
});

export type UpdateStudentProfileInput = z.infer<typeof updateStudentProfileSchema>;
export type UpdateTeacherProfileInput = z.infer<typeof updateTeacherProfileSchema>;
