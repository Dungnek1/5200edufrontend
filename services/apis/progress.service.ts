import { http } from '../http';
import type { ApiResponse } from '../http/types';
import { parseBackendResponse } from '../http/response-parser';

export interface ModuleProgress {
    id: string;
    enrollmentId: string;
    moduleId: string;
    isCompleted: boolean;
    currentTime?: number;
    duration?: number;
    watchPercent?: number;
    createdAt: string;
    updatedAt: string;
}

export interface SectionProgress {
    id: string;
    enrollmentId: string;
    sectionId: string;
    progressPercent: number;
    completedModules: number;
    totalModules: number;
    createdAt: string;
    updatedAt: string;
}

export interface UpdateModuleProgressPayload {
    isCompleted?: boolean;
    currentTime?: number;
    duration?: number;
}

class ProgressService {
    private readonly baseUrl = '/packs';

    /**
     * Cập nhật tiến độ học module (video hoặc document)
     */
    async updateModuleProgress(
        courseId: string,
        sectionId: string,
        documentId: string,
        data: UpdateModuleProgressPayload,
    ): Promise<ApiResponse<ModuleProgress>> {
        try {
            const response = await http.patch(
                `${this.baseUrl}/${courseId}/sections/${sectionId}/modules/${documentId}/progress`,
                data,
            );
            const parsed = parseBackendResponse<{ data: ModuleProgress }>(response.data);

            return {
                success: true,
                data: parsed?.data,
            };
        } catch (error: any) {
            return {
                success: false,
                data: null as any,
            };
        }
    }

    /**
     * Lấy tiến độ học module
     */
    async getModuleProgress(
        courseId: string,
        sectionId: string,
        documentId: string,
    ): Promise<ApiResponse<ModuleProgress | null>> {
        try {
            const response = await http.get(
                `${this.baseUrl}/${courseId}/sections/${sectionId}/modules/${documentId}/progress`,
            );
            const parsed = parseBackendResponse<{ data: ModuleProgress }>(response.data);

            return {
                success: true,
                data: parsed?.data || null,
            };
        } catch (error: any) {
            return {
                success: false,
                data: null,
            };
        }
    }

    /**
     * Lấy tiến độ học section
     */
    async getSectionProgress(
        courseId: string,
        sectionId: string,
    ): Promise<ApiResponse<SectionProgress | null>> {
        try {
            const response = await http.get(
                `${this.baseUrl}/${courseId}/sections/${sectionId}/progress`,
            );
            const parsed = parseBackendResponse<{ data: SectionProgress }>(response.data);

            return {
                success: true,
                data: parsed?.data || null,
            };
        } catch (error: any) {
            return {
                success: false,
                data: null,
            };
        }
    }

    /**
     * Lấy tất cả tiến độ của một section (bao gồm các modules)
     */
    async getAllModuleProgressInSection(
        courseId: string,
        sectionId: string,
        documentIds: string[],
    ): Promise<ApiResponse<Record<string, ModuleProgress>>> {
        try {
            // Fetch all module progress in parallel
            const progressPromises = documentIds.map((documentId) =>
                this.getModuleProgress(courseId, sectionId, documentId),
            );

            const results = await Promise.all(progressPromises);

            const progressMap: Record<string, ModuleProgress> = {};
            results.forEach((result, index) => {
                if (result.success && result.data) {
                    progressMap[documentIds[index]] = result.data;
                }
            });

            return {
                success: true,
                data: progressMap,
            };
        } catch (error: any) {
            return {
                success: false,
                data: {},
            };
        }
    }

    /**
     * Special method for saving progress on page unload
     * Uses sendBeacon for reliable delivery when page is closing
     */
    saveProgressOnUnload(
        courseId: string,
        sectionId: string,
        documentId: string,
        data: UpdateModuleProgressPayload,
    ): void {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:7000/api/v1';
        const fullUrl = `${apiUrl}${this.baseUrl}/${courseId}/sections/${sectionId}/modules/${documentId}/progress`;

        // Try sendBeacon first (more reliable for page unload)
        const blob = new Blob([JSON.stringify(data)], { type: 'application/json' });
        const beaconSent = navigator.sendBeacon(fullUrl, blob);

        // If sendBeacon fails, fallback to axios http instance (with all configured interceptors)
        if (!beaconSent) {
            http.patch(
                `${this.baseUrl}/${courseId}/sections/${sectionId}/modules/${documentId}/progress`,
                data
            ).catch((error) => {
                console.error('[Progress] Beforeunload save failed:', error);
            });
        }
    }
}

export const progressService = new ProgressService();
