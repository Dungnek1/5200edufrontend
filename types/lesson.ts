/**
 * Lesson type definitions
 */

export interface Lesson {
  id: number | string;
  moduleId: number | string;
  title: string;
  description?: string;
  videoUrl?: string;
  duration?: number; // in seconds
  order: number;
  isPreview?: boolean;
  resources?: Resource[];
  isPublished?: boolean;
}

export interface Resource {
  id: number;
  lessonId: number;
  title: string;
  type: "pdf" | "video" | "link" | "file";
  url: string;
  size?: number;
}

export interface LessonProgress {
  lessonId: number | string;
  completed: boolean;
  lastWatchedAt?: string;
  watchTime?: number; // in seconds
}
