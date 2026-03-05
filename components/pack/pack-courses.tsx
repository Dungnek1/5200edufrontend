"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ChevronDown, ChevronRight, PlayCircle, FileText, CheckCircle, Lock, Clock } from 'lucide-react';
import { PackCourse } from '@/types/pack';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useTranslations } from 'next-intl';

interface PackCoursesProps {
  courses: PackCourse[];
  isPurchased?: boolean;
  packId: string | number;
  locale: string;
}

export function PackCourses({ courses, isPurchased = false, packId, locale }: PackCoursesProps) {
  const router = useRouter();
  const [expandedCourse, setExpandedCourse] = useState<number | null>(0);
  const tPack = useTranslations('pack');

  const toggleCourse = (index: number) => {
    setExpandedCourse(expandedCourse === index ? null : index);
  };

  const formatDuration = (duration: string) => {
    return duration;
  };

  const getLessonIcon = (index: number, progress?: number) => {
    if (progress === 100) {
      return <CheckCircle className="h-5 w-5 text-green-500" />;
    }
    return <PlayCircle className="h-5 w-5 text-blue-500" />;
  };

  const calculateProgress = (course: PackCourse) => {
    return course.progress || 0;
  };

  const getTotalDuration = () => {
    return courses.reduce((total, course) => {
      return total + parseInt(course.duration) || 0;
    }, 0);
  };

  const getTotalLessons = () => {
    return courses.reduce((total, course) => {
      return total + course.lessonsCount;
    }, 0);
  };

  const getCompletedLessons = () => {
    return courses.reduce((total, course) => {
      return total + (course.completedLessons || 0);
    }, 0);
  };

  return (
    <div className="space-y-6">
      {/* Overall Progress */}
      <Card>
        <CardHeader>
          <CardTitle>{tPack('content')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-blue-600">{courses.length}</div>
                <div className="text-sm text-gray-600">{tPack('courses')}</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600">{getTotalLessons()}</div>
                <div className="text-sm text-gray-600">{tPack('lessons')}</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-orange-600">{getTotalDuration()}</div>
                <div className="text-sm text-gray-600">{tPack('duration')}</div>
              </div>
            </div>

            {/* Overall Progress Bar */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="font-medium text-gray-700">
                  {tPack('overallProgress')}
                </span>
                <span className="text-gray-600">
                  {getCompletedLessons()} / {getTotalLessons()} {tPack('lessons')}
                </span>
              </div>
              <Progress
                value={getTotalLessons() > 0 ? (getCompletedLessons() / getTotalLessons()) * 100 : 0}
                className="h-3"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Course List */}
      <div className="space-y-4">
        {courses.map((course, courseIndex) => {
          const progress = calculateProgress(course);
          const isExpanded = expandedCourse === courseIndex;

          return (
            <Card key={course.id}>
              <CardContent className="p-0">
                {/* Course Header */}
                <button
                  onClick={() => toggleCourse(courseIndex)}
                  className="w-full p-6 flex items-center justify-between text-left hover:bg-[#eceffd] transition-colors"
                >
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    {/* Course Icon */}
                    <div className="flex-shrink-0">
                      {getLessonIcon(courseIndex, progress)}
                    </div>

                    {/* Course Info */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-semibold text-gray-900 truncate">
                        {course.title}
                      </h3>
                      <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
                        <span className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {formatDuration(course.duration)}
                        </span>
                        <span className="flex items-center gap-1">
                          <FileText className="h-4 w-4" />
                          {course.lessonsCount} {tPack('lessons')}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Expand Icon */}
                  <div className="flex-shrink-0">
                    {isExpanded ? (
                      <ChevronDown className="h-5 w-5 text-gray-400" />
                    ) : (
                      <ChevronRight className="h-5 w-5 text-gray-400" />
                    )}
                  </div>

                  {/* Progress for purchased courses */}
                  {isPurchased && (
                    <div className="flex-shrink-0 ml-4">
                      <div className="text-right">
                        <div className="text-sm font-medium text-gray-700">
                          {progress}%
                        </div>
                        <Progress
                          value={progress}
                          className="w-20 h-2 mt-1"
                        />
                      </div>
                    </div>
                  )}
                </button>

                {/* Expanded Content - Course Details */}
                {isExpanded && (
                  <div className="border-t bg-gray-50 p-6">
                    {course.description && (
                      <div className="mb-4">
                        <p className="text-gray-700">{course.description}</p>
                      </div>
                    )}

                    {/* Course Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div className="text-center">
                        <div className="text-lg font-semibold text-blue-600">
                          {course.lessonsCount}
                        </div>
                <div className="text-sm text-gray-600">{tPack('lessons')}</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-semibold text-green-600">
                          {course.completedLessons || 0}
                        </div>
                <div className="text-sm text-gray-600">{tPack('completed')}</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-semibold text-orange-600">
                          {course.lessonsCount - (course.completedLessons || 0)}
                        </div>
                <div className="text-sm text-gray-600">{tPack('remaining')}</div>
                      </div>
                    </div>

                    {/* CTA Button */}
                    <div className="flex justify-center">
                      {isPurchased ? (
                        <Button
                          className="w-full max-w-xs"
                          onClick={() => router.push(`/${locale}/learn/${course.id}`)}
                        >
                          <PlayCircle className="h-4 w-4 mr-2" />
                      {tPack('continueLearning')}
                        </Button>
                      ) : (
                        <Button variant="outline" className="w-full max-w-xs" disabled>
                          <Lock className="h-4 w-4 mr-2" />
                      {tPack('purchaseRequired')}
                        </Button>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}