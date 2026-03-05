export interface PackTeacher {
  id: string | number;
  name: string;
  avatar?: string;
  title?: string;
}

export interface PackFeature {
  id: string;
  packageId: string;
  content: string;
  sortOrder: number;
}

export interface Pack {
  id: string | number;
  title: string;
  name?: string; // Compability with Package interface
  code?: string;
  description: string;
  thumbnail?: string;
  price: number;
  currency?: string;
  originalPrice?: number;
  discountPrice?: number;
  level?: "beginner" | "intermediate" | "advanced";
  category: string;
  tags: string[];
  teacher?: PackTeacher;
  courses: PackCourse[];
  totalCourses: number;
  totalDuration: string;
  totalStudents?: number;
  rating?: number;
  reviewsCount?: number;
  isPublished?: boolean;
  isFeatured?: boolean;
  isActive?: boolean;
  createdAt: string;
  updatedAt: string;
  header?: string;
  badgeText?: string; // Compability with Package interface
  features?: string[] | PackFeature[];
  unit?: string;
  priceUnit?: string; // Compability with Package interface
}

export interface PackCourse {
  id: string | number;
  title: string;
  description?: string;
  thumbnail?: string;
  duration: string;
  lessonsCount: number;
  level?: "beginner" | "intermediate" | "advanced";
  progress?: number;
  completedLessons?: number;
}

export interface PackFilters {
  search?: string;
  category?: string;
  level?: string;
  teacher?: string;
  priceRange?: string;
  sortBy?: string;
  page?: number;
  limit?: number;
}

export interface PackReview {
  id: string | number;
  packId: string | number;
  userId: string | number;
  userName: string;
  userAvatar?: string;
  rating: number;
  comment: string;
  createdAt: string;
  helpful?: number;
}

export interface PackEnrollment {
  id: string | number;
  packId: string | number;
  userId: string | number;
  purchasedAt: string;
  status: "active" | "expired" | "revoked";
  expiresAt?: string;
  certificate?: {
    id: string;
    issuedAt: string;
    url: string;
  };
}
