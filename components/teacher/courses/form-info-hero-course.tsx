import React from 'react';
import { Clock, Users, BookOpen, CheckCircle2, Edit } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { Course } from '@/types/course';
import { StarRating } from '@/components/courses/star-rating';
import { useTranslations } from 'next-intl';


interface CourseDetailCardProps {
    course: Course | null;
    totalStudents: number;
    avarageRating: any;
    reviewCount: any;
    onEdit?: () => void;
}

const CourseDetailCard: React.FC<CourseDetailCardProps> = ({ course, totalStudents, avarageRating, reviewCount, onEdit }) => {
    const t = useTranslations('teacher.courses.detail');
    if (!course) return null;

    // Calculate derived data: modules = sections, bài học = tài liệu (documents) trong từng module
    const modules = course.sections?.length || 0;
    const lessons = course.sections?.reduce((total, section) => {
        return total + (section.documents?.length || 0);
    }, 0) || 0;

    const learningOutcomes = course.learningOutcomes || [];
    const totalMinFinishTime = course.sections?.reduce((total, section) => {
        return total + (section.minFinsish || 0);
    }, 0) || 0;



    return (
        <Card className="w-full rounded-[12px] sm:rounded-[16px] overflow-hidden border-[0.5px] sm:border-[1px] border-[#e5e7eb] shadow-sm">
            <div className="flex flex-col md:flex-row gap-4 sm:gap-[24px] p-4 sm:p-[24px]">

                <div className="flex-shrink-0 w-full md:w-auto">
                    <div className="relative w-full md:w-[180px] lg:w-[200px] h-[160px] sm:h-[180px] lg:h-[200px] bg-[#f3f4f6] rounded-[8px] sm:rounded-[12px] overflow-hidden">
                        {course.thumbnailUrl ? (
                            <img
                                src={`${process.env.NEXT_PUBLIC_MINIO}/${course.thumbnailUrl}`}
                                alt={course.title}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center">
                                <BookOpen className="w-[48px] h-[48px] text-[#9ca3af]" />
                            </div>
                        )}

                        {course.status === 'DRAFT' && (
                            <div className="absolute top-2 sm:top-[12px] left-2 sm:left-[12px]">
                                <Badge
                                    className="bg-[#f3f4f6] text-[#6b7280] px-2 sm:px-[12px] py-1 sm:py-[4px] rounded-[6px] sm:rounded-[8px] text-xs sm:text-[14px] leading-4 sm:leading-[20px] font-normal border-none"
                                    style={{ fontFamily: 'Roboto, sans-serif' }}
                                >
                                    {t('draft')}
                                </Badge>
                            </div>
                        )}
                    </div>
                </div>


                <div className="flex-1 flex flex-col gap-3 sm:gap-[16px]">

                    <h2
                        className="text-lg sm:text-[20px] leading-6 sm:leading-[28px] font-medium text-[#111827]"
                        style={{ fontFamily: 'Roboto, sans-serif', fontWeight: 500 }}
                    >
                        {course.title}
                    </h2>


                    <p
                        className="text-sm sm:text-[14px] leading-5 sm:leading-[20px] text-[#6b7280] line-clamp-2 sm:line-clamp-3"
                        style={{
                            fontFamily: 'Roboto, sans-serif',
                            fontWeight: 400,
                            display: '-webkit-box',
                            WebkitLineClamp: 3,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                        }}
                    >
                        {course.description}
                    </p>


                    <div className="flex items-center gap-2 sm:gap-[8px]">
                        <span
                            className="text-sm sm:text-[16px] leading-5 sm:leading-[24px] font-medium text-[#111827]"
                            style={{ fontFamily: 'Roboto, sans-serif', fontWeight: 500 }}
                        >
                            {avarageRating ? avarageRating.toFixed(1) : '0.0'}
                        </span>
                        <StarRating rating={avarageRating || 0} />
                        <span
                            className="text-xs sm:text-[14px] leading-4 sm:leading-[20px] text-[#6b7280] ml-1 sm:ml-[4px]"
                            style={{ fontFamily: 'Roboto, sans-serif', fontWeight: 400 }}
                        >
                            {reviewCount}
                        </span>
                    </div>




                    <div className="grid grid-cols-2 gap-x-4 sm:gap-x-[48px] gap-y-2 sm:gap-y-[12px]">

                        <div className="flex items-center gap-2 sm:gap-[8px]">
                            <Clock className="w-3 h-3 sm:w-[16px] sm:h-[16px] text-[#6b7280] flex-shrink-0" />
                            <span
                                className="text-xs sm:text-[14px] leading-4 sm:leading-[20px] text-[#111827]"
                                style={{ fontFamily: 'Roboto, sans-serif', fontWeight: 400 }}
                            >
                                {totalMinFinishTime || 0} {t('minutes')}
                            </span>
                        </div>


                        <div className="flex items-center gap-2 sm:gap-[8px]">
                            <BookOpen className="w-3 h-3 sm:w-[16px] sm:h-[16px] text-[#6b7280] flex-shrink-0" />
                            <span
                                className="text-xs sm:text-[14px] leading-4 sm:leading-[20px] text-[#111827]"
                                style={{ fontFamily: 'Roboto, sans-serif', fontWeight: 400 }}
                            >
                                {modules} {t('modules')} · {lessons} {t('lessons')}
                            </span>
                        </div>


                        <div className="flex items-center gap-2 sm:gap-[8px]">
                            <Users className="w-3 h-3 sm:w-[16px] sm:h-[16px] text-[#6b7280] flex-shrink-0" />
                            <span
                                className="text-xs sm:text-[14px] leading-4 sm:leading-[20px] text-[#111827]"
                                style={{ fontFamily: 'Roboto, sans-serif', fontWeight: 400 }}
                            >
                                {totalStudents || 0} {t('students')}
                            </span>
                        </div>


                        <div className="flex items-center gap-2 sm:gap-[8px]">
                            <CheckCircle2 className="w-3 h-3 sm:w-[16px] sm:h-[16px] text-[#6b7280] flex-shrink-0" />
                            <span
                                className="text-xs sm:text-[14px] leading-4 sm:leading-[20px] text-[#111827]"
                                style={{ fontFamily: 'Roboto, sans-serif', fontWeight: 400 }}
                            >
                                {course.completionRate || 0}% {t('completed')}
                            </span>
                        </div>
                    </div>


                    {onEdit && (
                        <Button
                            variant="outline"
                            className="w-full h-10 sm:h-[44px] border-[1px] border-[#4162e7] text-[#4162e7] hover:bg-[#4162e7] hover:text-white hover:border-[#4162e7] rounded-[6px] sm:rounded-[8px] mt-2 sm:mt-[8px] transition-colors cursor-pointer"
                            onClick={onEdit}
                        >
                            <div className="flex items-center justify-center gap-2 sm:gap-[8px]">
                                <Edit className="w-4 h-4 sm:w-[20px] sm:h-[20px]" />
                                <span
                                    className="text-xs sm:text-[14px] leading-4 sm:leading-[20px] font-medium"
                                    style={{ fontFamily: 'Roboto, sans-serif', fontWeight: 500 }}
                                >
                                    {t('updateCourse')}
                                </span>
                            </div>
                        </Button>
                    )}
                </div>
            </div>


            <div className="px-4 sm:px-[24px] pb-4 sm:pb-[24px]">
                <h3
                    className="text-sm sm:text-[16px] leading-5 sm:leading-[24px] font-medium text-[#111827] mb-3 sm:mb-[16px]"
                    style={{ fontFamily: 'Roboto, sans-serif', fontWeight: 500 }}
                >
                    {t('learningOutcomes')}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 sm:gap-x-[48px] gap-y-2 sm:gap-y-[12px]">
                    {learningOutcomes.map((highlight, index) => (
                        <div key={index} className="flex items-start gap-2 sm:gap-[8px]">
                            <CheckCircle2 className="w-4 h-4 sm:w-[20px] sm:h-[20px] text-[#10b981] flex-shrink-0 mt-[2px]" />
                            <span
                                className="text-xs sm:text-[14px] leading-4 sm:leading-[20px] text-[#374151]"
                                style={{ fontFamily: 'Roboto, sans-serif', fontWeight: 400 }}
                            >
                                {highlight}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </Card>
    );
};

export default CourseDetailCard;