export interface User {
  id: string;
  email: string;
  name?: string;
  fullName?: string; // Backend might return fullName instead of name
  avatar?: string;
  role:
  | 0
  | 1
  | 2
  | "0"
  | "1"
  | "2"
  | "STUDENT"
  | "TEACHER"
  | "ADMIN"
  | "student"
  | "admin"
  | "teacher";
  emailVerified: boolean;
  mustChangePassword?: boolean; // Teacher must change password on first login
  createdAt: string;
  updatedAt: string;
  lastLoginAt?: string;
  profile?: UserProfile;
  phone?: string;
  bio?: string;
  description?: string;
  location?: string;
  city?: string;
  socialLinks?: SocialLinks;
}

export interface UserProfile {
  firstName?: string;
  lastName?: string;
  phone?: string;
  bio?: string;
  location?: string;
  city?: string;
  website?: string;
  linkedin?: string;
  facebook?: string;
  instagram?: string;
  twitter?: string;
  dateOfBirth?: string;
  gender?: "male" | "female" | "other";
  education?: string;
  occupation?: string;
  company?: string;
  interests?: string[];
  languages?: string[];
  skills?: string[];
}

export interface SocialLinks {
  facebook?: string | null;
  instagram?: string | null;
  twitter?: string | null;
  linkedin?: string | null;
  tiktok?: string | null;
  website?: string | null;
}

export interface UserStats {
  totalCoursesEnrolled: number;
  totalCoursesCompleted: number;
  totalPacksPurchased: number;
  totalPacksCompleted: number;
  totalLearningHours: number;
  streakDays: number;
  certificatesEarned: number;
  currentStreak: number;
  longestStreak: number;
  joinedAt: string;
}

export interface Pack {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  purchasedAt: string;
  courses: PackCourse[];
}

export interface PackCourse {
  id: string;
  title: string;
  thumbnail: string;
  progress: number; // 0-100
  totalLessons: number;
  completedLessons: number;
}

export interface EnrolledCourse {
  id: string;
  title: string;
  slug: string;
  thumbnail: string;
  teacher: string;
  progress: number; // 0-100
  lastAccessed: string;
  totalLessons: number;
  completedLessons: number;
  estimatedTimeLeft: string;
  price: number;
  originalPrice?: number;
  category: string;
  level: "beginner" | "intermediate" | "advanced";
  duration: string;
  teacherId: string;
}
