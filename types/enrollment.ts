import { Course } from './course';

export interface Enrollment {
    id: string;
    courseId: string;
    enrolledAt: string;
    completedAt: string | null;
    progressPercent: number;
    completedSections: number;
    totalSections: number;
    completedModules: number;
    totalModules: number;
    course: Course;
}

export interface EnrollmentListResponse {
    enrollments: Enrollment[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

export interface EnrolledCourse extends Course {
    enrollment?: {
        id: string;
        progressPercent: number;
        completedModules: number;
        totalModules: number;
        enrolledAt: string;
        completedAt: string | null;
    };
    progress?: number;
    lessonsDone?: number;
    lessonsTotal?: number;
}
