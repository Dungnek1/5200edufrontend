import { LargeNumberLike } from "crypto";

export enum CourseStatus {
  DRAFT = "draft",
  PUBLISHED = "published",
  ARCHIVED = "archived",
  HIDDEN = "hidden",
}

export interface Course {
  id: string;
  title: string;
  slug: string;
  subtitle: string | null;
  description: string;
  learningOutcomes: string[];
  language: string;
  level: string | null;
  thumbnailUrl: string;
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  featured: 'NORMAL' | 'FEATURED';
  ownerTeacherId: string | null;
  createdByRole: 'TEACHER' | 'ADMIN';
  price: number;
  originPrice: number;
  currency: 'VND' | 'USD';
  feeMode: 'TEACHER_SELECTED' | 'SYSTEM';
  selectedFeePlanId: string | null;
  averageRating: number;
  reviewCount: number;
  enrolledCount?: number;
  completionRate?: number;
  publishedAt: string | null;
  scheduledPublishAt: string | null;
  createdAt: Record<string, any>;
  updatedAt: Record<string, any>;
  createdBy: string;
  updatedBy: string | null;
  sections: CourseSection[];
  categoryIds?: string[];
  ownerTeacher: {
    id: string;
    fullName: string;
  },
  coupons: Coupon[];
  isEnrolled?: boolean;
  enrollmentId?: string | null;
  tags: string[];
}

export interface Coupon {

  id: string;
  code: string;
  description: string;
  discountValue: string;

}

export interface ModuleDocument {
  id: string;
  documentId: string;
  fileName: string;
  documentUrl: string;
  fileSize: number | string;
  mimeType: string;
}

export interface CourseSection {
  id: string;
  courseId: string;
  title: string;
  description: string;
  sortOrder: number;
  minFinsish: number;
  documents: ModuleDocument[];
  targetSection: string[];
  moduleId?: string;
  videoId?: string;
}


export interface CourseFilters {
  search?: string;
  category?: string;
  level?: string;
  sortBy?: string;
  priceRange?: string;
  page?: number;
  limit?: number;
}

export interface Module {
  id: number | string;
  courseId: number;
  title: string;
  description?: string;
  order?: number;
  sortOrder?: number;
  duration?: string;
  documents?: ModuleDocument[];
  assignments?: any[];
  isPublished?: boolean;
}

export interface Review {
  id: string;
  courseId: string;
  studentUserId: string;
  rating: number;
  comment: string;
  type?: string;
  createdAt: string | Record<string, any>;
  updatedAt: string | Record<string, any>;
  student: {
    id: string;
    fullName: string;
    avatarUrl?: string;
  };
}

export interface Enrollment {
  id: number;
  courseId: number;
  userId: number;
  enrolledAt: string;
  progress?: number;
  completedLessons?: number[];
  certificate?: {
    id: string;
    issuedAt: string;
    url: string;
  };
}


export type {
  EngagementData,
  Review as CourseReview,
  ReviewsResponse,
  AssignmentStats,
  CourseStudentProgress as CourseStudent,
  StudentsResponse,
} from "@/services/apis/course-analytics.service";

