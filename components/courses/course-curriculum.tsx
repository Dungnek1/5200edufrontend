"use client";

import { useState } from 'react';
import { ChevronDown, ChevronRight, Clock, FileText, Video, PlayCircle, CheckCircle, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

interface Lesson {
  id: string;
  title: string;
  duration: string;
  type: 'video' | 'document' | 'exercise' | 'quiz';
  preview?: boolean;
  isCompleted?: boolean;
}

interface Module {
  id: string;
  title: string;
  lessons: Lesson[];
}

interface CourseCurriculumProps {
  modules: Module[];
  expandedModule?: number | null;
  onModuleToggle?: (moduleId: number) => void;
}

export function CourseCurriculum({
  modules,
  expandedModule = 0,
  onModuleToggle
}: CourseCurriculumProps) {
  const [expandedModules, setExpandedModules] = useState<Set<number>>(
    expandedModule !== null ? new Set([expandedModule]) : new Set()
  );

  const toggleModule = (index: number) => {
    const newExpanded = new Set(expandedModules);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedModules(newExpanded);
    onModuleToggle?.(index);
  };

  const getTotalDuration = (lessons: Lesson[]) => {
    let totalSeconds = 0;
    lessons.forEach(lesson => {
      const [minutes, seconds] = lesson.duration.split(':').map(Number);
      totalSeconds += minutes * 60 + (seconds || 0);
    });

    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);

    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  const getCompletedLessons = (lessons: Lesson[]) => {
    return lessons.filter(lesson => lesson.isCompleted).length;
  };

  const getModuleProgress = (lessons: Lesson[]) => {
    const completed = getCompletedLessons(lessons);
    return lessons.length > 0 ? (completed / lessons.length) * 100 : 0;
  };

  const getLessonIcon = (type: Lesson['type'], isCompleted?: boolean, isLocked?: boolean) => {
    if (isLocked) {
      return <Lock className="h-4 w-4 text-gray-400" />;
    }

    if (isCompleted) {
      return <CheckCircle className="h-4 w-4 text-green-500" />;
    }

    switch (type) {
      case 'video':
        return <PlayCircle className="h-4 w-4 text-blue-500" />;
      case 'document':
        return <FileText className="h-4 w-4 text-orange-500" />;
      case 'exercise':
      case 'quiz':
        return <FileText className="h-4 w-4 text-purple-500" />;
      default:
        return <PlayCircle className="h-4 w-4 text-blue-500" />;
    }
  };

  const totalLessons = modules.reduce((acc, module) => acc + module.lessons.length, 0);
  const totalCompletedLessons = modules.reduce(
    (acc, module) => acc + getCompletedLessons(module.lessons),
    0
  );
  const overallProgress = totalLessons > 0 ? (totalCompletedLessons / totalLessons) * 100 : 0;

  return (
    <div className="space-y-4">
      {/* Overall Progress */}
      <div className="bg-blue-50 rounded-lg p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-blue-900">
            Tiến độ tổng thể
          </span>
          <span className="text-sm text-blue-700">
            {totalCompletedLessons}/{totalLessons} bài học
          </span>
        </div>
        <Progress value={overallProgress} className="h-2" />
        <p className="text-xs text-blue-600 mt-1">
          {Math.round(overallProgress)}% hoàn thành
        </p>
      </div>

      {/* Modules */}
      <div className="space-y-3">
        {modules.map((module, moduleIndex) => {
          const isExpanded = expandedModules.has(moduleIndex);
          const moduleProgress = getModuleProgress(module.lessons);
          const completedLessons = getCompletedLessons(module.lessons);
          const totalDuration = getTotalDuration(module.lessons);

          return (
            <div key={module.id} className="bg-white rounded-lg border overflow-hidden">
              {/* Module Header */}
              <button
                onClick={() => toggleModule(moduleIndex)}
                className="w-full px-4 py-3 flex items-center justify-between hover:bg-[#eceffd] transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="flex-shrink-0">
                    {isExpanded ? (
                      <ChevronDown className="h-5 w-5 text-gray-500" />
                    ) : (
                      <ChevronRight className="h-5 w-5 text-gray-500" />
                    )}
                  </div>
                  <div className="text-left">
                    <h3 className="font-semibold text-gray-900">{module.title}</h3>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span>{module.lessons.length} bài học</span>
                      <span>{totalDuration}</span>
                      <span>{completedLessons}/{module.lessons.length} hoàn thành</span>
                    </div>
                  </div>
                </div>

                {/* Module Progress */}
                <div className="flex items-center gap-2">
                  <div className="w-20">
                    <Progress value={moduleProgress} className="h-1" />
                  </div>
                  <span className="text-xs text-gray-500 w-8">
                    {Math.round(moduleProgress)}%
                  </span>
                </div>
              </button>

              {/* Module Content */}
              {isExpanded && (
                <div className="border-t">
                  {module.lessons.map((lesson, lessonIndex) => {
                    const isLocked = lessonIndex > 0 && !module.lessons[lessonIndex - 1].isCompleted;

                    return (
                      <div
                        key={lesson.id}
                        className={`px-4 py-3 flex items-center justify-between hover:bg-[#eceffd] transition-colors ${
                          lessonIndex !== module.lessons.length - 1 ? 'border-b' : ''
                        }`}
                      >
                        <div className="flex items-center gap-3 flex-1">
                          {/* Lesson Icon */}
                          <div className="flex-shrink-0">
                            {getLessonIcon(lesson.type, lesson.isCompleted, isLocked)}
                          </div>

                          {/* Lesson Info */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <h4 className={`text-sm font-medium truncate ${
                                lesson.isCompleted
                                  ? 'text-gray-500 line-through'
                                  : 'text-gray-900'
                              }`}>
                                {lesson.title}
                              </h4>
                              {lesson.preview && (
                                <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full">
                                  Preview
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-2 mt-1">
                              <Clock className="h-3 w-3 text-gray-400" />
                              <span className="text-xs text-gray-500">{lesson.duration}</span>
                              <span className="text-xs text-gray-400 capitalize">
                                {lesson.type === 'video' ? 'Video' :
                                 lesson.type === 'document' ? 'Tài liệu' :
                                 lesson.type === 'exercise' ? 'Bài tập' : 'Quiz'}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Action Button */}
                        <div className="flex-shrink-0 ml-3">
                          {lesson.isCompleted ? (
                            <Button size="sm" variant="outline" className="text-green-600 border-green-200">
                              <CheckCircle className="h-4 w-4 mr-1" />
                              Hoàn thành
                            </Button>
                          ) : isLocked ? (
                            <Button size="sm" variant="outline" disabled>
                              <Lock className="h-4 w-4 mr-1" />
                              Đã khóa
                            </Button>
                          ) : lesson.preview ? (
                            <Button size="sm" variant="outline" className="text-blue-600">
                              <PlayCircle className="h-4 w-4 mr-1" />
                              Xem preview
                            </Button>
                          ) : (
                            <Button size="sm">
                              Bắt đầu
                            </Button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}