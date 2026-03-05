import { z } from 'zod';

/**
 * Quiz validation schemas
 */

export const createQuizSchema = z.object({
  moduleId: z.number().int().positive(),
  title: z.string().min(1, 'Quiz title is required'),
  description: z.string().optional(),
  type: z.enum(['practice', 'final']),
  timeLimit: z.number().int().positive().optional(),
  passingScore: z.number().min(0).max(100).optional(),
  isPublished: z.boolean().optional(),
  questions: z.array(z.object({
    question: z.string().min(1, 'Question is required'),
    type: z.enum(['single', 'multiple', 'text']),
    options: z.array(z.object({
      text: z.string().min(1, 'Option text is required'),
      order: z.number().int().positive(),
    })).optional(),
    correctAnswer: z.union([z.string(), z.array(z.string())]).optional(),
    points: z.number().int().positive().optional(),
    order: z.number().int().positive(),
  })).optional(),
});

export const updateQuizSchema = createQuizSchema.partial();

export const submitQuizSchema = z.object({
  answers: z.array(z.object({
    questionId: z.union([z.number(), z.string()]),
    answer: z.union([z.string(), z.array(z.string())]),
  })),
});

export type CreateQuizInput = z.infer<typeof createQuizSchema>;
export type UpdateQuizInput = z.infer<typeof updateQuizSchema>;
export type SubmitQuizInput = z.infer<typeof submitQuizSchema>;
