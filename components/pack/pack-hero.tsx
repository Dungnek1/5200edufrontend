"use client";

import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Clock, Users, Star, BookOpen, Play, ShoppingCart, Award, Sparkles } from 'lucide-react';
import { Pack } from '@/types/pack';

interface PackHeroProps {
  pack: Pack;
  locale: string;
  isPurchased?: boolean;
  onPurchase?: () => void;
}

export function PackHero({ pack, locale, isPurchased = false, onPurchase }: PackHeroProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };

  const levelLabels = {
    beginner: 'Cơ bản',
    intermediate: 'Trung bình',
    advanced: 'Nâng cao'
  };

  const levelColors = {
    beginner: 'bg-green-100 text-green-800',
    intermediate: 'bg-yellow-100 text-yellow-800',
    advanced: 'bg-red-100 text-red-800'
  };

  const hasDiscount = pack.originalPrice && pack.originalPrice > pack.price;
  const discountPercentage = hasDiscount
    ? Math.round(((pack.originalPrice! - pack.price) / pack.originalPrice!) * 100)
    : 0;

  return (
    <div className="relative bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fillRule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zM0 34v-4H4v4H0v2h4v4h2v-4h4zM6 4V0H4v4H0v2h4v4h2V6h4V4zM36 4V0h-2v4h-4v2h4v4h2V6h4V4z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}></div>
      </div>

      <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
          {/* Left Column - Pack Info */}
          <div className="space-y-6">
            {/* Category Badges */}
            <div className="flex items-center gap-3">
              <Badge variant="secondary" className="bg-blue-100 text-blue-800 hover:bg-blue-200">
                {pack.category}
              </Badge>
              {pack.level && (
                <Badge
                  className={levelColors[pack.level]}
                >
                  {levelLabels[pack.level]}
                </Badge>
              )}
              {pack.isFeatured && (
                <Badge className="bg-gradient-to-r from-blue-500 to-purple-600 text-white border-0 flex items-center gap-1">
                  <Sparkles className="h-3 w-3" />
                  Nổi bật
                </Badge>
              )}
            </div>

            {/* Title */}
            <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 leading-tight">
              {pack.title}
            </h1>

            {/* Description */}
            <p className="text-gray-700 leading-relaxed text-lg">
              {pack.description}
            </p>

            {/* Stats */}
            <div className="flex flex-wrap gap-6 text-sm">
              <div className="flex items-center gap-2">
                <Star className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                <span className="font-semibold text-gray-900">{pack.rating || 4.8}</span>
                <span className="text-gray-500">
                  ({(pack.reviewsCount || 1250).toLocaleString()} đánh giá)
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-gray-400" />
                <span className="text-gray-600">
                  {pack.totalStudents?.toLocaleString() || '15,420'} học viên
                </span>
              </div>
              <div className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-gray-400" />
                <span className="text-gray-600">{pack.totalCourses} khóa học</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-gray-400" />
                <span className="text-gray-600">{pack.totalDuration}</span>
              </div>
            </div>

            {/* Teacher Info */}
            {pack.teacher && (
              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={pack.teacher.avatar} alt={pack.teacher.name} />
                  <AvatarFallback className="bg-blue-600 text-white">
                    {pack.teacher.name?.charAt(0)?.toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium text-gray-900">{pack.teacher.name}</p>
                  {pack.teacher.title && (
                    <p className="text-sm text-gray-500">{pack.teacher.title}</p>
                  )}
                </div>
              </div>
            )}

            {/* What You'll Learn */}
            <div className="space-y-3">
              <h3 className="font-semibold text-gray-900 text-lg">Bạn sẽ học được:</h3>
              <div className="space-y-2">
                {[
                  'Tự động hóa quy trình vận hành với AI và n8n',
                  'Tối ưu hóa chi phí và tăng doanh thu',
                  'Xây dựng dashboard phân tích dữ liệu',
                  'Marketing automation cho F&B',
                  'Sử dụng các công cụ AI hiệu quả'
                ].map((item, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-gray-700">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              {isPurchased ? (
                <Button size="lg" className="bg-green-600 hover:bg-green-700 text-white">
                  <Play className="h-5 w-5 mr-2" />
                  Vào học ngay
                </Button>
              ) : (
                <>
                  <Button
                    size="lg"
                    className="bg-blue-600 hover:bg-blue-700 text-white cursor-pointer"
                    onClick={onPurchase}
                  >
                    <ShoppingCart className="h-5 w-5 mr-2" />
                    Mua ngay
                  </Button>
                  <Button size="lg" variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-50">
                    <Play className="h-5 w-5 mr-2" />
                    Xem giới thiệu
                  </Button>
                </>
              )}
            </div>

            {/* Trust Badges */}
            <div className="flex flex-wrap gap-4 pt-2">
              <div className="flex items-center gap-2 text-xs text-gray-600">
                <Award className="h-4 w-4 text-green-500" />
                <span>Bảo hành trọn đời</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-600">
                <Award className="h-4 w-4 text-green-500" />
                <span>Certificate khi hoàn thành</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-600">
                <Award className="h-4 w-4 text-green-500" />
                <span>Học tập trọn đời</span>
              </div>
            </div>
          </div>

          {/* Right Column - Price & Preview */}
          <div className="space-y-6">
            {/* Pack Preview Card */}
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              <div className="relative h-64 bg-gradient-to-br from-blue-500 to-purple-600">
                <Image
                  src={pack.thumbnail || '/images/pack-placeholder.jpg'}
                  alt={pack.title}
                  fill
                  className="object-cover opacity-90"
                />
                <div className="absolute inset-0 bg-black/30" />

                {/* Play Button Overlay */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <Button size="lg" variant="secondary" className="bg-white/90 hover:bg-white rounded-full p-4">
                    <Play className="h-6 w-6" />
                  </Button>
                </div>
              </div>

              <div className="p-6 space-y-4">
                {/* Price */}
                <div className="text-center">
                  <div className="flex items-center justify-center gap-3">
                    {hasDiscount && (
                      <span className="text-2xl text-gray-400 line-through">
                        {formatPrice(pack.originalPrice!)}
                      </span>
                    )}
                    <span className="text-4xl font-bold text-blue-600">
                      {formatPrice(pack.price)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500">
                    {hasDiscount && (
                      <>Tiết kiệm {formatPrice(pack.originalPrice! - pack.price)}</>
                    )}
                  </p>
                </div>

                {/* Pack Info */}
                <div className="space-y-3 pt-4 border-t">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Số khóa học</span>
                    <span className="font-medium">{pack.totalCourses} khóa</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Thời gian</span>
                    <span className="font-medium">{pack.totalDuration}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Cấp độ</span>
                    <span className="font-medium">
                      {pack.level ? levelLabels[pack.level] : 'Tất cả'}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Ngôn ngữ</span>
                    <span className="font-medium">Tiếng Việt</span>
                  </div>
                </div>

                {/* Included */}
                <div className="space-y-2 pt-4 border-t">
                  <p className="font-medium text-sm text-gray-900">Bao gồm:</p>
                  <ul className="space-y-1">
                    <li className="flex items-center gap-2 text-sm text-gray-600">
                      <BookOpen className="h-4 w-4 text-blue-500" />
                      <span>Video bài giảng HD</span>
                    </li>
                    <li className="flex items-center gap-2 text-sm text-gray-600">
                      <BookOpen className="h-4 w-4 text-blue-500" />
                      <span>Tài liệu và resources</span>
                    </li>
                    <li className="flex items-center gap-2 text-sm text-gray-600">
                      <BookOpen className="h-4 w-4 text-blue-500" />
                      <span>Bài tập thực hành</span>
                    </li>
                    <li className="flex items-center gap-2 text-sm text-gray-600">
                      <Award className="h-4 w-4 text-green-500" />
                      <span>Certificate khi hoàn thành</span>
                    </li>
                    <li className="flex items-center gap-2 text-sm text-gray-600">
                      <Users className="h-4 w-4 text-purple-500" />
                      <span>Hỗ trợ 24/7</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}