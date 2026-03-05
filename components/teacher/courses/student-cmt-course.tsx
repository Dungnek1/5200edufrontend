"use client";

import React, { useEffect, useState } from 'react';
import { Eye, Star } from 'lucide-react';
import { useTranslations } from 'next-intl';
import teacherCourseService from '@/services/apis/teacher-course.service';
import { toast } from 'sonner';
import { getAvatarUrl } from '@/utils/media';

interface Review {
    id: string;
    rating: number;
    comment: string | null;
    createdAt: string;
    student: {
        id: string;
        fullName: string;
        avatarUrl: string | null;
    };
    avarageRating: number;
    reviewCount: number;
}

interface CourseReviewsProps {
    courseId: string;
    avarageRating: number;
    reviewCount: number;
}

const CourseReviews: React.FC<CourseReviewsProps> = ({ courseId, avarageRating, reviewCount }) => {
    const t = useTranslations("course");
    const [loading, setLoading] = useState(true);
    const [reviews, setReviews] = useState<Review[]>([]);

    useEffect(() => {
        fetchReviews();
    }, [courseId]);

    const fetchReviews = async () => {
        try {
            setLoading(true);
            const response = await teacherCourseService.getCourseReviews(courseId, 2);
            console.log('Reviews response:', response.data);
            if (response.data.data) {
                //@ts-ignore
                setReviews(response.data.data);
            }
        } catch (error) {
            toast.error('Không thể tải đánh giá');
        } finally {
            setLoading(false);
        }
    };

    const StarRating = ({ rating }: { rating: number }) => {
        return (
            <div className="flex gap-[2px]">
                {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                        key={star}
                        className={`h-4 w-4 ${star <= rating ? 'fill-[#F59E0B] text-[#F59E0B]' : 'fill-[#E5E7EB] text-[#E5E7EB]'}`}
                    />
                ))}
            </div>
        );
    };

    const formatTimeAgo = (dateString: string) => {
        try {
            const now = new Date();
            const date = new Date(dateString);
            const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

            if (diffInSeconds < 60) return 'vừa xong';
            if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} phút trước`;
            if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} giờ trước`;
            if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)} ngày trước`;
            return `${Math.floor(diffInSeconds / 2592000)} tháng trước`;
        } catch {
            return 'vừa xong';
        }
    };

    if (loading) {
        return (
            <div className="bg-white rounded-lg p-6">
                <div className="flex items-center justify-center h-[200px]">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#4162e7]"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="rounded-[12px] px-[12px] py-[16px] shadow-lg  w-full border border-[#F4F4F7] flex flex-col gap-[12px]">
            <div className='px-[12px] flex flex-col gap-[12px] w-full'>
                <div className="flex items-center justify-between gap-[4px]">
                    <h3
                        className="text-[18px] font-medium text-[#3B3D48]"
                        style={{ fontFamily: 'Roboto, sans-serif', fontWeight: 500 }}
                    >
                        Đánh giá khóa học
                    </h3>
                    <div className='flex items-center gap-[4px]'>
                        <Star

                            className={`h-4 w-4 fill-[#FF9500] text-[#FF9500]`}
                        />
                        <span className='text-[#3B3D48] text-[16px]'> {avarageRating}/<span>5</span></span>

                        <p className='text-[12px] text-[#8C92AC]'>({reviewCount})</p>

                    </div>

                </div>

                {reviews.length === 0 ? (
                    <div className="text-center">
                        <p className="text-sm text-[#6B7280]">{t("noReviews")}</p>
                    </div>
                ) : (
                    <>

                        {reviews.map((review) => (
                            <div key={review.id}>
                                <div className="flex items-start gap-3">
                                    {/* <div className="h-10 w-10 rounded-full bg-[#eceffd] flex items-center justify-center text-[#4162e7] font-medium flex-shrink-0">
                                        {review.student.avatarUrl ? (
                                            <img
                                                src={getAvatarUrl(review.student.avatarUrl)}
                                                alt={review.student.fullName}
                                                className="h-10 w-10 rounded-full object-cover"
                                            />
                                        ) : (
                                            review.student.fullName.charAt(0).toUpperCase()
                                        )}
                                    </div> */}
                                    <div className="flex-1">
                                        <div className='flex items-center justify-between'>
                                            <p
                                                className="text-sm font-medium text-[#111827]"
                                                style={{ fontFamily: 'Roboto, sans-serif', fontWeight: 500 }}
                                            >
                                                {review.student.fullName}
                                            </p>
                                            <StarRating rating={review.rating || 0} />

                                        </div>

                                        {review.comment && (
                                            <p
                                                className="text-sm text-[#6B7280] mt-2"
                                                style={{ fontFamily: 'Roboto, sans-serif', fontWeight: 400 }}
                                            >
                                                {review.comment}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}


                        <button
                            className="w-full border border-[#3B82F6] rounded-lg py-3 px-4 flex items-center justify-center gap-2 hover:bg-[#EFF6FF] transition-colors"
                        >
                            <Eye size={20} color="#3B82F6" />
                            <span
                                className="text-sm font-medium text-[#3B82F6]"
                                style={{ fontFamily: 'Roboto, sans-serif', fontWeight: 500 }}
                            >
                                Xem tất cả đánh giá
                            </span>
                        </button>
                    </>
                )}
            </div>
        </div>
    );
};

export default CourseReviews;