"use client";

import { Button } from '@/components/ui/button';
import { useTranslations, useLocale } from 'next-intl';

import { getThumbnailUrl } from '@/utils/media';
import { formatPrice } from '@/utils/formatPrice';
import { calculateTotalDiscount } from '@/utils/calculateTotalDiscount';
import { StarRating } from './star-rating';

interface CourseDetailSidebarProps {
  price: number;
  originalPrice?: number;
  lessonsCount?: number;
  duration?: string;
  level?: string;
  isEnrolled?: boolean;
  thumbnail?: string;
  category?: string | { id: string; name: string; slug: string };
  tags?: string[];
  coupons?: Array<{
    id: string;
    code: string;
    description?: string;
    discountValue: string;
  }>;
  onPurchase?: () => void;
  onTrial?: () => void;
  enrollmentData?: {
    progress: number;
    completedLessons: number;
    totalLessons: number;
    lastAccessed: string;
  } | null;
}

export function CourseDetailSidebar({
  price,
  originalPrice,
  lessonsCount = 45,
  duration = '45 hours',
  level = 'Cơ bản',
  isEnrolled = false,
  thumbnail,
  category,
  tags,
  coupons,
  onPurchase,
  onTrial,
  enrollmentData,
}: CourseDetailSidebarProps) {
  const t = useTranslations("course");
  const locale = useLocale();

  const freeText = t("free");

  const totalDiscount = calculateTotalDiscount(coupons);

  return (
    <div className="w-full">
      <div className="w-[271px] bg-white rounded-[11px] shadow-lg overflow-hidden">

        <div className="relative w-full h-[162px] bg-gray-100 overflow-hidden">
          {thumbnail ? (
            <img
              src={`${process.env.NEXT_PUBLIC_MINIO}/${thumbnail}`}
              alt="Course thumbnail"
              className="object-cover w-full h-full rounded-[11px]"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-100">
              <div className="text-gray-400 text-sm" style={{ fontFamily: 'Roboto, sans-serif' }}>
                {t('videoPreview')}
              </div>
            </div>
          )}

          {totalDiscount > 0 && (
            <div className="absolute bg-[#4162e7] left-[12px] px-[12px] py-[2px] rounded-full top-[12px] z-10">
              <p
                className="text-white font-normal text-sm"
                style={{ fontFamily: "Roboto, sans-serif", lineHeight: "20px" }}
              >
                {totalDiscount}%
              </p>
            </div>
          )}
        </div>


        <div className="px-4 pt-4 pb-2">
          <div className="flex gap-[10px] items-center">
            {originalPrice && originalPrice > 0 && originalPrice > price ? (
              <>
                <div className="text-[16px] font-bold text-[#0A0BD9]">
                  {formatPrice(price, locale === 'vi' ? 'vi-VN' : 'en-US')}
                </div>

                <span className="text-[14px] text-[#8C92AC] line-through">
                  {formatPrice(originalPrice, locale === 'vi' ? 'vi-VN' : 'en-US')}
                </span>


              </>
            ) : (
              <div className="text-[16px] font-bold text-[#0A0BD9]">
                {formatPrice(price, locale === 'vi' ? 'vi-VN' : 'en-US', freeText)}
              </div>
            )}
          </div>
        </div>

        <div className="px-4 pb-4 flex flex-col gap-2">
          <Button
            size="lg"
            className="w-full bg-[#4162e7] hover:bg-[#3652d3] text-white py-2.5 text-sm"
            onClick={onPurchase}
            style={{ fontFamily: 'Roboto, sans-serif' }}
          >
            {isEnrolled ? t('startLearningNow') : t('buyNow')}
          </Button>
          {!isEnrolled && (
            <Button
              size="lg"
              variant="outline"
              className="w-full border-[#4162e7] text-[#4162e7] hover:bg-[#4162e7] hover:text-white py-2.5 text-sm"
              style={{ fontFamily: 'Roboto, sans-serif' }}
              onClick={onTrial}
            >
              {t('trial')}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}