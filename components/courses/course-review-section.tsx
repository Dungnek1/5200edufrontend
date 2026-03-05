"use client";

import { useState, useEffect } from "react";
import { Star, Send } from "lucide-react";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import studentCourseService from "@/services/apis/student-course.service";

interface CourseReviewSectionProps {
    courseId: string;
}

export function CourseReviewSection({ courseId }: CourseReviewSectionProps) {
    const t = useTranslations();
    const [rating, setRating] = useState(0);
    const [hoveredRating, setHoveredRating] = useState(0);
    const [comment, setComment] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [existingReview, setExistingReview] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadExistingReview();
    }, [courseId]);

    const loadExistingReview = async () => {
        try {
            setLoading(true);
            const response = await studentCourseService.getMyReview(courseId);
            if (response.success && response.data) {
                setExistingReview(response.data);
                setRating(response.data.rating || 0);
                setComment(response.data.comment || "");
            }
        } catch (error) {
            console.error("Failed to load review:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async () => {
        if (rating === 0) {
            toast.error(t("courseReview.selectRating"));
            return;
        }

        try {
            setSubmitting(true);
            const response = await studentCourseService.createOrUpdateReview(courseId, {
                rating,
                comment: comment.trim(),
            });

            if (response.success) {
                toast.success(
                    existingReview
                        ? t("courseReview.updateSuccess")
                        : t("courseReview.submitSuccess")
                );
                await loadExistingReview();
            } else {
                toast.error(t("courseReview.error"));
            }
        } catch (error) {
            toast.error(t("courseReview.error"));
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="bg-white rounded-xl shadow-sm p-6 animate-pulse">
                <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
                <div className="h-10 bg-gray-200 rounded mb-4"></div>
                <div className="h-32 bg-gray-200 rounded"></div>
            </div>
        );
    }

    return (
        <div className=" bg-[#fafafa] rounded-xl shadow-sm p-6 lg:p-8 shadow-sm">
            <div className="mb-6">
                <h2 className="text-xl lg:text-2xl font-bold text-gray-900 mb-2">
                    {existingReview ? t("courseReview.yourReview") : t("courseReview.title")}
                </h2>
                <p className="text-sm text-gray-600">
                    {existingReview
                        ? t("courseReview.editHint")
                        : t("courseReview.shareExperience")}
                </p>
            </div>

            {/* Star Rating */}
            <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                    {t("courseReview.satisfaction")} <span className="text-red-500">*</span>
                </label>
                <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <button
                            key={star}
                            type="button"
                            onClick={() => setRating(star)}
                            onMouseEnter={() => setHoveredRating(star)}
                            onMouseLeave={() => setHoveredRating(0)}
                            className="transition-transform hover:scale-110 focus:outline-none"
                            disabled={submitting}
                        >
                            <Star
                                className={`w-8 h-8 lg:w-10 lg:h-10 transition-colors ${star <= (hoveredRating || rating)
                                    ? "fill-yellow-400 text-yellow-400"
                                    : "text-gray-300"
                                    }`}
                            />
                        </button>
                    ))}
                    {rating > 0 && (
                        <span className="ml-3 text-sm font-medium text-gray-700">
                            {rating === 1 && t("courseReview.ratings.veryDissatisfied")}
                            {rating === 2 && t("courseReview.ratings.dissatisfied")}
                            {rating === 3 && t("courseReview.ratings.neutral")}
                            {rating === 4 && t("courseReview.ratings.satisfied")}
                            {rating === 5 && t("courseReview.ratings.verySatisfied")}
                        </span>
                    )}
                </div>
            </div>

            {/* Comment */}
            <div className="mb-6">
                <label className="block text-sm font-medium text-black mb-3">
                    {t("courseReview.commentLabel")} <span className=" text-xs">({t("common.optional")})</span>
                </label>
                <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder={t("courseReview.commentPlaceholder")}
                    rows={5}
                    disabled={submitting}
                    className="w-full px-4 py-3  bg-[#fafafa] shadow-sm rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-gray-700 placeholder-gray-400 disabled:bg-gray-50 disabled:cursor-not-allowed"
                    maxLength={1000}
                />
                <div className="flex justify-between items-center mt-2">
                    <span className="text-xs text-gray-500">
                        {comment.length}/1000 {t("common.characters")}
                    </span>
                </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end">
                <button
                    onClick={handleSubmit}
                    disabled={submitting || rating === 0}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                    {submitting ? (
                        <>
                            <svg
                                className="animate-spin h-5 w-5 text-white"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                            >
                                <circle
                                    className="opacity-25"
                                    cx="12"
                                    cy="12"
                                    r="10"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                ></circle>
                                <path
                                    className="opacity-75"
                                    fill="currentColor"
                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                ></path>
                            </svg>
                            <span>{t("courseReview.submitting")}</span>
                        </>
                    ) : (
                        <>
                            <Send className="w-5 h-5" />
                            <span>{existingReview ? t("courseReview.updateReview") : t("courseReview.submitReview")}</span>
                        </>
                    )}
                </button>
            </div>

            {/* Existing Review Info */}
            {existingReview && (
                <div className="mt-6 pt-6 border-t border-gray-200">
                    <div className="flex items-start gap-3 text-sm text-gray-600">
                        <svg
                            className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                        </svg>
                        <p>
                            Đánh giá của bạn đã được gửi vào{" "}
                            <span className="font-medium">
                                {new Date(existingReview.createdAt).toLocaleDateString("vi-VN", {
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                })}
                            </span>
                            {existingReview.updatedAt !== existingReview.createdAt && (
                                <>
                                    {" "}
                                    và được cập nhật lần cuối vào{" "}
                                    <span className="font-medium">
                                        {new Date(existingReview.updatedAt).toLocaleDateString("vi-VN", {
                                            year: "numeric",
                                            month: "long",
                                            day: "numeric",
                                        })}
                                    </span>
                                </>
                            )}
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}
