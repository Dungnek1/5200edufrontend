"use client";

import React, { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import teacherCourseService from '@/services/apis/teacher-course.service';
import { toast } from 'sonner';
import { useTranslations } from 'next-intl';

interface StudentEngagementProps {
    courseId: string;
}

interface DailyStat {
    date: string;
    newEnrollments: number;
    activeStudents: number;
    averageProgress: number;
}

interface EngagementData {
    dailyStats: DailyStat[];
    summary: {
        totalNewEnrollments: number;
        totalActiveStudents: number;
        progressGrowth: number;
    };
    completionRates: {
        completedRate: number;
        inProgressRate: number;
        notStartedRate: number;
    };
}

const StudentEngagement: React.FC<StudentEngagementProps> = ({ courseId }) => {
    const t = useTranslations('teacher.courses.detail.engagement');
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState<EngagementData | null>(null);

    useEffect(() => {
        fetchEngagementData();
    }, [courseId]);

    const fetchEngagementData = async () => {
        try {
            setLoading(true);
            const response = await teacherCourseService.getCourseEngagement(courseId, 7);
            if (response.data) {
                //@ts-ignore
                setData(response.data);
            }
        } catch (error) {
            toast.error(t('error'));
        } finally {
            setLoading(false);
        }
    };

    const pieData = [
        {
            name: t('completed'),
            value: data?.completionRates?.completedRate || 0,
            color: '#45B56E'
        },
        {
            name: t('inProgress'),
            value: data?.completionRates?.inProgressRate || 0,
            color: '#FFAA33'
        },
        {
            name: t('notStarted'),
            value: data?.completionRates?.notStartedRate || 0,
            color: '#E35151'
        },
    ];

    if (loading) {
        return (
            <Card className="bg-[#1e293b] rounded-[16px] p-[32px]">
                <div className="flex items-center justify-center h-[400px]">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                </div>
            </Card>
        );
    }

    return (
        <Card className="rounded-[8px] sm:rounded-[12px] px-3 sm:px-[12px] py-3 sm:py-[16px] shadow-lg border border-[#F4F4F7] flex flex-col gap-3 sm:gap-[12px]">

            <h2
                className="text-base sm:text-[18px] leading-6 sm:leading-[36px] font-semibold text-[#3B3D48]"
                style={{ fontFamily: 'Roboto, sans-serif', fontWeight: 600 }}
            >
                {t('title')}
            </h2>


            <div className="grid grid-cols-2 gap-2 sm:gap-[12px]">

                <Card className="p-3 sm:p-[20px] rounded-[6px] sm:rounded-[8px] border border-[#C4CEF8] shadow-sm flex flex-col gap-1 sm:gap-[4px]">
                    <p
                        className="text-xs sm:text-[14px] leading-4 sm:leading-[20px] text-[#7F859D]"
                        style={{ fontFamily: 'Roboto, sans-serif', fontWeight: 400 }}
                    >
                        {t('newStudents')}
                    </p>
                    <p
                        className="text-lg sm:text-[24px] leading-6 sm:leading-[48px] font-bold text-[#3B3D48]"
                        style={{ fontFamily: 'Roboto, sans-serif', fontWeight: 700 }}
                    >
                        +{data?.summary.totalNewEnrollments || 0}
                    </p>
                </Card>


                <Card className="p-3 sm:p-[20px] rounded-[6px] sm:rounded-[8px] border border-[#C4CEF8] shadow-sm flex flex-col gap-1 sm:gap-[4px]">
                    <p
                        className="text-xs sm:text-[14px] leading-4 sm:leading-[20px] text-[#7F859D]"
                        style={{ fontFamily: 'Roboto, sans-serif', fontWeight: 400 }}
                    >
                        {t('progressGrowth')}
                    </p>
                    <p
                        className="text-lg sm:text-[24px] leading-6 sm:leading-[48px] font-bold text-[#3B3D48]"
                        style={{ fontFamily: 'Roboto, sans-serif', fontWeight: 700 }}
                    >
                        {data?.summary.progressGrowth || 0}%
                    </p>
                </Card>
            </div>


            <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-[16px] min-h-[100px] sm:h-[113px]">

                <div className="flex-shrink-0 h-[96px] sm:h-full w-[90px] sm:w-[113px] flex items-center justify-center">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={pieData}
                                cx="50%"
                                cy="50%"
                                innerRadius="35%"
                                outerRadius="65%"
                                paddingAngle={0}
                                dataKey="value"
                                startAngle={90}
                                endAngle={-270}
                            >
                                {pieData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                        </PieChart>
                    </ResponsiveContainer>
                </div>


                <div className="flex flex-col gap-1 sm:gap-[8px] justify-center w-full sm:h-full">
                    {pieData.map((item, index) => (
                        <div key={index} className="flex items-center gap-2 sm:gap-[12px]">
                            <div
                                className="w-2 h-2 sm:w-[12px] sm:h-[12px] rounded-full flex-shrink-0"
                                style={{ backgroundColor: item.color }}
                            />
                            <span
                                className="text-xs sm:text-[14px] leading-4 sm:leading-[20px] text-[#3B3D48]"
                                style={{ fontFamily: 'Roboto, sans-serif', fontWeight: 400 }}
                            >
                                {item.name}{' '}
                                <span className="text-[#8C92AC]">
                                    ({item.value}%)
                                </span>
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </Card>
    );
};

export default StudentEngagement;