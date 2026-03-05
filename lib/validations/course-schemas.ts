import { z } from 'zod';

/**
 * Course validation schemas
 */

export const createCourseSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  category: z.string().min(1, 'Category is required'),
  level: z.enum(['beginner', 'intermediate', 'advanced']),
  price: z.number().min(0, 'Price must be positive'),
  originalPrice: z.number().min(0).optional(),
  thumbnail: z.string().url().optional(),
  tags: z.array(z.string()).optional(),
  learningOutcomes: z.array(z.string()).optional(),
  isPublished: z.boolean().optional(),
});

export const updateCourseSchema = createCourseSchema.partial();

export const createModuleSchema = z.object({
  title: z.string().min(1, 'Module title is required'),
  description: z.string().optional(),
  order: z.number().int().positive(),
  isPublished: z.boolean().optional(),
});

export const createLessonSchema = z.object({
  moduleId: z.number().int().positive(),
  title: z.string().min(1, 'Lesson title is required'),
  description: z.string().optional(),
  videoUrl: z.string().url().optional(),
  duration: z.number().int().positive().optional(),
  order: z.number().int().positive(),
  isPreview: z.boolean().optional(),
});

export type CreateCourseInput = z.infer<typeof createCourseSchema>;
export type UpdateCourseInput = z.infer<typeof updateCourseSchema>;
export type CreateModuleInput = z.infer<typeof createModuleSchema>;
export type CreateLessonInput = z.infer<typeof createLessonSchema>;
