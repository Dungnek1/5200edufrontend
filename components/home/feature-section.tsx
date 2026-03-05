"use client";

import { Card, CardContent } from '@/components/ui/card';
import { GraduationCap, Clock, CheckSquare } from 'lucide-react';
import { Logo } from '@/components/shared/logo';

export function FeatureSection() {
  const features = [
    {
      icon: <GraduationCap className="h-8 w-8 text-blue-600" />,
      title: "Giảng viên chuyên gia",
      description: "Học hỏi từ các chuyên gia trong ngành với kinh nghiệm thực tế và kỹ năng giảng dạy đã được chứng minh.",
      color: "bg-blue-50"
    },
    {
      icon: <Clock className="h-8 w-8 text-purple-600" />,
      title: "Học tập linh hoạt",
      description: "Học theo tốc độ của riêng bạn với quyền truy cập trọn đời vào tài liệu khóa học và tài nguyên có thể tải xuống.",
      color: "bg-purple-50"
    },
    {
      icon: <CheckSquare className="h-8 w-8 text-green-600" />,
      title: "Nền tảng đáng tin cậy",
      description: "Tham gia cùng hàng triệu người học trên toàn thế giới trên một nền tảng an toàn, đáng tin cậy với sự hỗ trợ tuyệt vời.",
      color: "bg-green-50"
    }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <h2
              className="text-3xl lg:text-4xl font-bold text-gray-900"
              style={{ fontFamily: 'Roboto, sans-serif', fontWeight: 500, lineHeight: '1.5' }}
            >
              Lí do chọn
            </h2>
            <Logo variant="text" className="h-8" />
          </div>
        </div>

        {/* Features Grid - 3 cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {features.map((feature, index) => (
            <Card key={index} className="group hover:shadow-lg transition-all duration-300 border border-gray-100 shadow-sm">
              <CardContent className="p-6">
                <div className="space-y-4">
                  {/* Icon Container */}
                  <div className={`w-16 h-16 ${feature.color} rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                    {feature.icon}
                  </div>

                  {/* Content */}
                  <div>
                    <h3
                      className="text-lg font-semibold text-gray-900 mb-3"
                      style={{ fontFamily: 'Roboto, sans-serif' }}
                    >
                      {feature.title}
                    </h3>
                    <p
                      className="text-sm text-gray-600 leading-relaxed"
                      style={{ fontFamily: 'Roboto, sans-serif', fontSize: '14px', lineHeight: '20px' }}
                    >
                      {feature.description}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
