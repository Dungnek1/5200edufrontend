export interface QuizOption {
    id: string;
    text: string;
    isCorrect?: boolean; // Only shown after submission or for teacher
    sortOrder: number;
}

export interface QuizQuestion {
    id: string;
    assignmentId: string;
    prompt: string;
    explanation?: string;
    points: number;
    sortOrder: number;
    options: QuizOption[];
}

export interface EssayPrompt {
    id: string;
    assignmentId: string;
    rubric?: string;
    minWords?: number;
    maxWords?: number;
}

export interface Assignment {
    id: string;
    courseId: string;
    sectionId: string;
    lessonId?: string;
    type: 'QUIZ' | 'ESSAY';
    title: string;
    instructions?: string;
    maxScore?: number;
    passScore?: number;
    timeLimitSeconds?: number;
    isPublished: boolean;
    quizQuestions?: QuizQuestion[];
    essayPrompt?: EssayPrompt;
    attempts?: AssignmentAttempt[];
    createdAt: string;
    updatedAt: string;
}

export interface AssignmentAttempt {
    id: string;
    assignmentId?: string;
    studentUserId?: string;
    status: 'IN_PROGRESS' | 'SUBMITTED' | 'GRADED' | 'PASSED' | 'FAILED' | 'PENDING' | 'GRADING';
    score?: number;
    maxScore?: number;
    startedAt?: string;
    submittedAt?: string;
    gradedAt?: string;
    feedbackText?: string;
    answers?: QuizAnswer[];
    essaySubmission?: EssaySubmission;
}

export interface QuizAnswer {
    questionId: string;
    selectedOptionId: string;
}

export interface EssaySubmission {
    content: string;
    attachmentUrl?: string;
    wordCount?: number;
}

export interface SubmitAssignmentPayload {
    assignmentId: string;
    selectedAnswers?: {
        questionId: string;
        selectedOptionId: string;
    }[];
    essayContent?: string;
    attachmentUrl?: string;
}

export interface AssignmentSubmissionResponse {
    attemptId: string;
    score: number | null;
    maxScore: number | null;
    status: 'PENDING' | 'PASSED' | 'FAILED' | 'GRADING';
    isPassed: boolean | null;
    submittedAt: string;
    feedback?: string;
}
