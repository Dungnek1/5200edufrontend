/**
 * Quiz type definitions
 */

export interface Quiz {
  id: number | string;
  moduleId: number | string;
  courseId: number | string;
  title: string;
  description?: string;
  type: 'practice' | 'final';
  timeLimit?: number; // in minutes
  passingScore?: number; // percentage
  isPublished?: boolean;
  questions?: Question[];
  createdAt: string;
  updatedAt: string;
}

export interface Question {
  id: number | string;
  quizId: number | string;
  question: string;
  type: 'single' | 'multiple' | 'text';
  options?: QuestionOption[];
  correctAnswer?: string | string[];
  points?: number;
  order: number;
}

export interface QuestionOption {
  id: number | string;
  questionId: number | string;
  text: string;
  order: number;
}

export interface QuizAttempt {
  id: number | string;
  quizId: number | string;
  userId: number | string;
  score?: number;
  passed?: boolean;
  answers?: QuizAnswer[];
  startedAt: string;
  completedAt?: string;
  timeSpent?: number; // in seconds
}

export interface QuizAnswer {
  questionId: number | string;
  answer: string | string[];
  isCorrect?: boolean;
}
