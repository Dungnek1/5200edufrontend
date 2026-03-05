import type { ApiResponse } from '../http/types';

import { logger } from '@/lib/logger';
/**
 * Module Draft Data
 */
export interface ModuleDraftData {
  title: string;
  description: string;
  sessionId: string;
  savedAt: string;
  courseId: string;
  moduleId: string;
}

/**
 * Course Drafts Response
 */
export interface CourseDraftsResponse {
  sessionId: string;
  modules: ModuleDraftData[];
}

/**
 * Course Draft Service
 * Handles module drafts with sessionId tracking for server-side session management
 * Currently uses localStorage with sessionId prefix for hybrid approach
 * Ready to migrate to backend session APIs when available
 */
class CourseDraftService {
  private readonly baseUrl = '/packs';
  private currentSessionId: string | null = null;

  /**
   * Get or create session ID for a course
   * Uses sessionStorage to track the current draft session
   */
  getOrCreateSessionId(courseId: string): string {
    if (typeof window === 'undefined') return '';

    const sessionKey = `draft_session_${courseId}`;
    let existingSession = sessionStorage.getItem(sessionKey);

    if (!existingSession) {
      existingSession = `draft_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
      sessionStorage.setItem(sessionKey, existingSession);
    }

    this.currentSessionId = existingSession;
    return existingSession;
  }

  /**
   * Get current session ID
   */
  getCurrentSessionId(): string | null {
    return this.currentSessionId;
  }

  /**
   * Clear session ID for a course
   */
  clearSessionId(courseId: string): void {
    if (typeof window === 'undefined') return;

    const sessionKey = `draft_session_${courseId}`;
    sessionStorage.removeItem(sessionKey);
    this.currentSessionId = null;
  }

  /**
   * Generate localStorage key for a module draft
   * Format: {sessionId}_{courseId}_module_{moduleId}
   */
  private getStorageKey(courseId: string, moduleId: string): string {
    const sessionId = this.getOrCreateSessionId(courseId);
    return `${sessionId}_${courseId}_module_${moduleId}`;
  }

  /**
   * Save module draft to localStorage with sessionId prefix
   * POST /api/v1/packs/{courseId}/draft/modules/{moduleId} (when backend API exists)
   */
  async saveModuleDraft(
    courseId: string,
    moduleId: string,
    data: { title: string; description: string }
  ): Promise<void> {
    if (typeof window === 'undefined') return;

    try {
      const sessionId = this.getOrCreateSessionId(courseId);
      const key = this.getStorageKey(courseId, moduleId);

      const draftData: ModuleDraftData = {
        title: data.title,
        description: data.description,
        sessionId,
        savedAt: new Date().toISOString(),
        courseId,
        moduleId,
      };

      localStorage.setItem(key, JSON.stringify(draftData));

    } catch (error) {
      logger.error('[CourseDraftService] Error saving module draft:', error);
    }
  }

  /**
   * Get module draft from localStorage
   * GET /api/v1/packs/{courseId}/draft/modules/{moduleId} (when backend API exists)
   */
  async getModuleDraft(courseId: string, moduleId: string): Promise<ModuleDraftData | null> {
    if (typeof window === 'undefined') return null;

    try {
      const key = this.getStorageKey(courseId, moduleId);
      const data = localStorage.getItem(key);

      if (!data) return null;

      const draft = JSON.parse(data) as ModuleDraftData;

      const currentSessionId = this.getOrCreateSessionId(courseId);
      if (draft.sessionId !== currentSessionId) {
        logger.warn(`[CourseDraftService] Ignoring draft from old session: ${draft.sessionId}`);
        return null;
      }

      return draft;
    } catch (error) {
      logger.error('[CourseDraftService] Error loading module draft:', error);
      return null;
    }
  }

  /**
   * Get all drafts for a course
   * GET /api/v1/packs/{courseId}/draft/modules (when backend API exists)
   */
  async getCourseDrafts(courseId: string): Promise<CourseDraftsResponse> {
    if (typeof window === 'undefined') {
      return { sessionId: '', modules: [] };
    }

    try {
      const sessionId = this.getOrCreateSessionId(courseId);
      const prefix = `${sessionId}_${courseId}_module_`;

      const drafts: ModuleDraftData[] = [];

      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith(prefix)) {
          try {
            const data = localStorage.getItem(key);
            if (data) {
              const draft = JSON.parse(data) as ModuleDraftData;
              if (draft.sessionId === sessionId) {
                drafts.push(draft);
              }
            }
          } catch (parseError) {
            logger.error('[CourseDraftService] Error parsing draft:', parseError);
          }
        }
      }

      return { sessionId, modules: drafts };

    } catch (error) {
      logger.error('[CourseDraftService] Error loading course drafts:', error);
      return { sessionId: '', modules: [] };
    }
  }

  /**
   * Delete a specific module draft
   * DELETE /api/v1/packs/{courseId}/draft/modules/{moduleId} (when backend API exists)
   */
  async deleteModuleDraft(courseId: string, moduleId: string): Promise<void> {
    if (typeof window === 'undefined') return;

    try {
      const key = this.getStorageKey(courseId, moduleId);
      localStorage.removeItem(key);

    } catch (error) {
      logger.error('[CourseDraftService] Error deleting module draft:', error);
    }
  }

  /**
   * Clear all drafts for a course (current session only)
   * DELETE /api/v1/packs/{courseId}/draft (when backend API exists)
   */
  async clearCourseDrafts(courseId: string): Promise<void> {
    if (typeof window === 'undefined') return;

    try {
      const sessionId = this.getOrCreateSessionId(courseId);
      const prefix = `${sessionId}_${courseId}_module_`;

      const keysToRemove: string[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith(prefix)) {
          keysToRemove.push(key);
        }
      }

      keysToRemove.forEach(key => localStorage.removeItem(key));

      this.clearSessionId(courseId);

    } catch (error) {
      logger.error('[CourseDraftService] Error clearing course drafts:', error);
    }
  }

  /**
   * Check if a module has unsaved edits in the current session
   */
  async hasUnsavedEdits(
    courseId: string,
    moduleId: string,
    currentTitle: string,
    currentDescription: string
  ): Promise<boolean> {
    const draft = await this.getModuleDraft(courseId, moduleId);
    if (!draft) return false;

    return draft.title !== currentTitle || draft.description !== currentDescription;
  }

  /**
   * Apply all drafts to the course (when publishing)
   * POST /api/v1/packs/{courseId}/draft/apply (when backend API exists)
   */
  async applyDrafts(courseId: string): Promise<void> {


    await this.clearCourseDrafts(courseId);
  }

  /**
   * Get metadata about drafts for UI display
   */
  async getDraftsMetadata(courseId: string): Promise<{
    totalDrafts: number;
    sessionId: string;
    lastSavedAt: string | null;
  }> {
    const response = await this.getCourseDrafts(courseId);

    const lastSavedAt =
      response.modules.length > 0
        ? response.modules
          .map(m => new Date(m.savedAt).getTime())
          .sort((a, b) => b - a)[0]
          .toString()
        : null;

    return {
      totalDrafts: response.modules.length,
      sessionId: response.sessionId,
      lastSavedAt,
    };
  }

  /**
   * Save modules list to session storage
   * Used to persist sidebar state on page reload
   */
  saveModulesToSession(courseId: string, modules: any[]): void {
    if (typeof window === 'undefined') return;

    try {
      const key = `course_${courseId}_modules_cache`;
      sessionStorage.setItem(key, JSON.stringify(modules));
      logger.info('[CourseDraftService] Saved modules to session:', modules.length);
    } catch (error) {
      logger.error('[CourseDraftService] Error saving modules to session:', error);
    }
  }

  /**
   * Load modules list from session storage
   * Returns cached modules or null if not found
   */
  loadModulesFromSession(courseId: string): any[] | null {
    if (typeof window === 'undefined') return null;

    try {
      const key = `course_${courseId}_modules_cache`;
      const data = sessionStorage.getItem(key);
      if (data) {
        const modules = JSON.parse(data);
        logger.info('[CourseDraftService] Loaded modules from session:', modules.length);
        return modules;
      }
      return null;
    } catch (error) {
      logger.error('[CourseDraftService] Error loading modules from session:', error);
      return null;
    }
  }

  /**
   * Clear modules cache from session
   */
  clearModulesSession(courseId: string): void {
    if (typeof window === 'undefined') return;

    try {
      const key = `course_${courseId}_modules_cache`;
      sessionStorage.removeItem(key);
      logger.info('[CourseDraftService] Cleared modules session');
    } catch (error) {
      logger.error('[CourseDraftService] Error clearing modules session:', error);
    }
  }

  /**
   * Track if user is creating a new module (not yet saved)
   */
  setCreatingNewModule(courseId: string, value: boolean): void {
    if (typeof window === 'undefined') return;

    try {
      const key = `course_${courseId}_creating_new`;
      sessionStorage.setItem(key, value.toString());
      logger.info('[CourseDraftService] Set creating new module:', value);
    } catch (error) {
      logger.error('[CourseDraftService] Error setting creating new module:', error);
    }
  }

  /**
   * Check if user is currently creating a new module
   */
  isCreatingNewModule(courseId: string): boolean {
    if (typeof window === 'undefined') return false;

    try {
      const key = `course_${courseId}_creating_new`;
      const value = sessionStorage.getItem(key);
      return value === 'true';
    } catch (error) {
      logger.error('[CourseDraftService] Error checking creating new module:', error);
      return false;
    }
  }
}

export default new CourseDraftService();
