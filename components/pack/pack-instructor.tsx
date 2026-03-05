"use client";

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  MapPin,
  Calendar,
  Users,
  Award,
  BookOpen,
  Star,
  Mail,
  ExternalLink,
  CheckCircle,
  Clock,
  TrendingUp
} from 'lucide-react';
import type { Pack, PackTeacher } from '@/types/pack';
import { useTranslations } from 'next-intl';

interface PackTeacherProps {
  teacher: PackTeacher;
  pack: Pack;
}

export const PackInstructor = PackTeacher;

export function PackTeacher({ teacher, pack }: PackTeacherProps) {
  const tCommon = useTranslations('common');
  const tTeacher = useTranslations('teacher');
  const tPacksLevel = useTranslations('packs.level');

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'beginner':
        return 'bg-green-100 text-green-800';
      case 'intermediate':
        return 'bg-yellow-100 text-yellow-800';
      case 'advanced':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getLevelLabel = (level: string) => {
    try {
      return tPacksLevel(level as any);
    } catch {
      return level;
    }
  };

  const teacherStats = {
    totalStudents: 15420,
    totalCourses: 12,
    totalPacks: 4,
    averageRating: 4.8,
    totalReviews: 3250,
    experienceYears: 8,
    completionRate: 92
  };

  const achievements = [
    {
      icon: <Award className="h-5 w-5" />,
      title: tTeacher('expertTitle'),
      description: tTeacher('expertDesc'),
      color: "text-yellow-600"
    },
    {
      icon: <TrendingUp className="h-5 w-5" />,
      title: tTeacher('topTeacher'),
      description: tTeacher('topTeacherDesc'),
      color: "text-blue-600"
    },
    {
      icon: <Users className="h-5 w-5" />,
      title: tTeacher('studentsAchievement'),
      description: tTeacher('studentsAchievementDesc'),
      color: "text-green-600"
    },
    {
      icon: <CheckCircle className="h-5 w-5" />,
      title: tTeacher('completionAchievement'),
      description: tTeacher('completionAchievementDesc'),
      color: "text-purple-600"
    }
  ];

  const otherPacks = [
    {
      id: "pack-5",
      title: "Advanced Restaurant Analytics",
      price: 8000000,
      originalPrice: 12000000,
      rating: 4.7,
      studentsCount: 2340,
      level: "advanced"
    },
    {
      id: "pack-6",
      title: "F&B Marketing Automation",
      price: 6000000,
      originalPrice: 9000000,
      rating: 4.6,
      studentsCount: 3420,
      level: "intermediate"
    }
  ];

  return (
    <div className="space-y-8">
      {/* Teacher Header */}
      <Card>
        <CardContent className="p-8">
          <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center">
            {/* Avatar */}
            <Avatar className="h-24 w-24 sm:h-32 sm:w-32">
              <AvatarImage src={teacher.avatar} alt={teacher.name} />
              <AvatarFallback className="text-2xl bg-blue-600 text-white">
                {teacher.name?.charAt(0)?.toUpperCase()}
              </AvatarFallback>
            </Avatar>

            {/* Info */}
            <div className="flex-1 text-center sm:text-left">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {teacher.name}
              </h2>
              <p className="text-lg text-gray-600 mb-3">
                {teacher.title}
              </p>

              {/* Rating and Students */}
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 mb-4">
                <div className="flex items-center gap-1">
                  <Star className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                  <span className="font-semibold text-gray-900">
                    {teacherStats.averageRating}
                  </span>
                  <span className="text-gray-500">
                    ({teacherStats.totalReviews.toLocaleString()} {tCommon('reviews')})
                  </span>
                </div>
                <div className="flex items-center gap-1 text-gray-600">
                  <Users className="h-5 w-5" />
                  <span>
                    {teacherStats.totalStudents.toLocaleString()} {tCommon('students')}
                  </span>
                </div>
              </div>

              {/* Badges */}
              <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                  {teacherStats.totalCourses} {tCommon('courses')}
                </Badge>
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                  {teacherStats.totalPacks} {tCommon('packs')}
                </Badge>
                <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                  {teacherStats.experienceYears} {tCommon('experienceYears')}
                </Badge>
                <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
                  {teacherStats.completionRate}% {tCommon('completionRate')}
                </Badge>
              </div>
            </div>

            {/* CTA Button */}
            <div className="flex flex-col gap-2">
              <Button className="whitespace-nowrap">
                <Mail className="h-4 w-4 mr-2" />
                {tTeacher('contact')}
              </Button>
              <Button variant="outline" className="whitespace-nowrap">
                <ExternalLink className="h-4 w-4 mr-2" />
                {tCommon('viewProfile')}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Bio and Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Bio */}
        <Card>
          <CardHeader>
            <CardTitle>{tCommon('about')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-gray-700 leading-relaxed">
                {tTeacher("bio1", { years: teacherStats.experienceYears, name: teacher.name })}
              </p>
              <p className="text-gray-700 leading-relaxed">
                {tTeacher("bio2")}
              </p>
              <p className="text-gray-700 leading-relaxed">
                {tTeacher("bio3")}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Stats */}
        <Card>
          <CardHeader>
            <CardTitle>{tTeacher('stats')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">
                  {teacherStats.totalStudents.toLocaleString()}
                </div>
                <div className="text-sm text-gray-600">{tCommon('students')}</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">
                  {teacherStats.averageRating}
                </div>
                <div className="text-sm text-gray-600">{tCommon('averageRating')}</div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">
                  {teacherStats.totalCourses + teacherStats.totalPacks}
                </div>
                <div className="text-sm text-gray-600">{tCommon('coursesAndPacks')}</div>
              </div>
              <div className="text-center p-4 bg-orange-50 rounded-lg">
                <div className="text-2xl font-bold text-orange-600">
                  {teacherStats.completionRate}%
                </div>
                <div className="text-sm text-gray-600">{tCommon('completionRate')}</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Achievements */}
      <Card>
        <CardHeader>
          <CardTitle>{tTeacher('achievements')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {achievements.map((achievement, index) => (
              <div key={index} className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                <div className={`flex-shrink-0 ${achievement.color}`}>
                  {achievement.icon}
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 text-sm">
                    {achievement.title}
                  </h4>
                  <p className="text-xs text-gray-600 mt-1">
                    {achievement.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Expertise */}
      <Card>
        <CardHeader>
          <CardTitle>{tTeacher('expertise')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {[
                "F&B Management", "Restaurant Automation", "AI Integration",
                "n8n Workflow", "Marketing Automation", "Data Analytics",
                "Digital Marketing", "Customer Experience", "Process Optimization",
                "Chatbot Development", "Zalo Marketing", "Looker Studio"
              ].map((skill) => (
                <Badge key={skill} variant="outline" className="bg-white">
                  {skill}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Other Packs by Teacher */}
      <Card>
        <CardHeader>
          <CardTitle>{tTeacher('otherPacks')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {otherPacks.map((otherPack) => (
              <div key={otherPack.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <h4 className="font-semibold text-gray-900 line-clamp-2">
                      {otherPack.title}
                    </h4>
                    <Badge className={`ml-2 ${getLevelColor(otherPack.level)}`}>
                      {getLevelLabel(otherPack.level)}
                    </Badge>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                      <span>{otherPack.rating}</span>
                    </div>
                    <span>•</span>
                    <span>
                      {otherPack.studentsCount.toLocaleString()} {tCommon('students')}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-bold text-blue-600">
                        ₫{otherPack.price.toLocaleString()}
                      </span>
                      {otherPack.originalPrice && (
                        <span className="text-sm text-gray-400 line-through">
                          ₫{otherPack.originalPrice.toLocaleString()}
                        </span>
                      )}
                    </div>
                    <Button size="sm" variant="outline">
                      {tCommon('viewDetails')}
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}