
import type { Assignment, AssignmentAttempt, SubmitAssignmentPayload } from '@/types/assignment';
import { http } from '../http';

class AssignmentService {
    /**
     * Get assignment details by ID
     */
    async getAssignment(courseId: string, assignmentId: string): Promise<{ data: Assignment }> {
        const response = await http.get(`/teacher/courses/${courseId}/assignments/${assignmentId}`);
        return response.data;
    }

    /**
     * Submit quiz answers or essay submission
     */
    async submitAssignment(
        courseId: string,
        assignmentId: string,
        payload: SubmitAssignmentPayload
    ): Promise<{ data: AssignmentAttempt }> {
        const response = await http.post(
            `/student/courses/${courseId}/assignments/${assignmentId}/submit`,
            payload
        );
        return response.data;
    }

    /**
     * Get assignment attempt details
     */
    async getAssignmentAttempt(attemptId: string): Promise<{ data: AssignmentAttempt }> {
        const response = await http.get(`/student/assignment-attempts/${attemptId}`);
        return response.data;
    }

    /**
     * Get student's attempts for an assignment
     */
    async getMyAttempts(courseId: string, assignmentId: string): Promise<{ data: AssignmentAttempt[] }> {
        const response = await http.get(`/student/courses/${courseId}/assignments/${assignmentId}/my-attempts`);
        return response.data;
    }

    /**
     * Upload assignment file
     */
    async uploadAssignmentFile(file: File): Promise<{ data: { objectKey: string } }> {
        const formData = new FormData();
        formData.append('file', file);

        const response = await http.post('/media/upload/assignment', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    }
}

export const assignmentService = new AssignmentService();
export default assignmentService;
