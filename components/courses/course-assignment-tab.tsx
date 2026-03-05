"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import { QuizTaker } from "@/components/quiz/quiz-taker";
import { LoadingOverlay } from "@/components/shared/loading-overlay";
import { AlertCircle, ClipboardList } from "lucide-react";
import { Card } from "@/components/ui/card";
import studentCourseService from "@/services/apis/student-course.service";
import type { Assignment } from "@/types/assignment";

interface CourseAssignmentTabProps {
    courseId: string;
    moduleId?: string;
    enrollmentId?: string | null;
}

export function CourseAssignmentTab({ courseId, moduleId, enrollmentId }: CourseAssignmentTabProps) {
    const t = useTranslations();
    const [assignments, setAssignments] = useState<Assignment[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);

    useEffect(() => {
        const fetchAssignments = async () => {
            if (!courseId || !moduleId) {
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                const response = await studentCourseService.getAssignmentsBySection(courseId, moduleId);
                //@ts-ignore
                if (response.status && response.data) {
                    setAssignments(response.data);
                    // Auto select first assignment
                    if (response.data.length > 0) {
                        setSelectedAssignment(response.data[0]);
                    }
                } else {
                    toast.error("Không thể tải danh sách bài tập");
                }
            } catch (error) {
                toast.error(t('quiz.loadErrorGeneric'));
            } finally {
                setLoading(false);
            }
        };

        fetchAssignments();
    }, [courseId, moduleId]);

    if (loading) {
        return <LoadingOverlay loading={true} />;
    }

    if (!courseId || !moduleId) {
        return (
            <Card className="p-6">
                <div className="flex items-center gap-3 text-muted-foreground">
                    <AlertCircle className="w-5 h-5" />
                    <p>{t('quiz.selectModule')}</p>
                </div>
            </Card>
        );
    }

    if (assignments.length === 0) {
        return (
            <Card className="p-12">
                <div className="text-center space-y-3">
                    <ClipboardList className="w-12 h-12 text-muted-foreground mx-auto" />
                    <h3 className="text-lg font-semibold">{t('quiz.noAssignments')}</h3>
                    <p className="text-sm text-muted-foreground">
                        {t('quiz.noAssignmentsDescription')}
                    </p>
                </div>
            </Card>
        );
    }

    return (
        <div className="flex flex-col gap-[20px]">

            {assignments.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-2">
                    {assignments.map((assignment, index) => (
                        <button
                            key={assignment.id}
                            onClick={() => setSelectedAssignment(assignment)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${selectedAssignment?.id === assignment.id
                                ? "bg-primary text-primary-foreground"
                                : "bg-muted hover:bg-muted/80"
                                }`}
                        >
                            {assignment.type === 'QUIZ' ? '📝' : '📄'} {t('quiz.assignmentNumber', { number: index + 1 })}
                        </button>
                    ))}
                </div>
            )}


            {selectedAssignment && (
                <>

                    {enrollmentId && (
                        <QuizTaker
                            assignment={selectedAssignment}
                            enrollmentId={enrollmentId}
                            existingAttemptId={selectedAssignment.attempts?.[0]?.id}
                            onSubmitSuccess={() => {
                                toast.success(t('quiz.submitSuccess'));
                            }}
                        />
                    )}

                </>
            )}
        </div>
    );
}

