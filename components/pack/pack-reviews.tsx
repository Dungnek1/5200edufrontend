"use client";

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Star } from 'lucide-react';
import { RatingReviews } from '@/components/shared/rating-reviews';
import type { Review } from '@/types/course';
import type { PackReview } from '@/types/pack';
import { useTranslations } from 'next-intl';

interface PackReviewsProps {
  reviews: PackReview[];
  packId: string | number;
  packRating?: number;
  totalReviews?: number;
  isPurchased?: boolean;
}

export function PackReviews({ reviews, packId, packRating = 4.8, totalReviews = 1250, isPurchased = false }: PackReviewsProps) {
  const t = useTranslations('packReview');
  const [isWritingReview, setIsWritingReview] = useState(false);
  const [newReview, setNewReview] = useState({
    rating: 5,
    comment: ''
  });

  const convertedReviews: Review[] = reviews.map((review) => ({
    id: String(review.id),
    studentName: review.userName,
    studentAvatar: review.userAvatar,
    rating: review.rating,
    comment: review.comment,
    createdAt: review.createdAt,
  }));

  const handleSubmitReview = async () => {
    if (!isPurchased) return;

    try {
      setIsWritingReview(false);
      setNewReview({ rating: 5, comment: '' });
    } catch (error) {
      setIsWritingReview(false);
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-5 h-5 ${i < rating
          ? 'fill-[#FF9500] text-[#FF9500]'
          : 'fill-none text-[#8c92ac]'
          }`}
      />
    ));
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Add Review Form for Purchased Users */}
      {isPurchased && (
        <Card>
          <CardHeader>
            <CardTitle>{t('writeTitle')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-1 mb-2">
              {renderStars(newReview.rating)}
              <span className="text-sm text-gray-500">
                {t('selectRating')}
              </span>
            </div>
            <textarea
              placeholder={t('placeholder')}
              value={newReview.comment}
              onChange={(e) => setNewReview(prev => ({ ...prev, comment: e.target.value }))}
              className="w-full p-3 border border-gray-300 rounded-lg resize-none"
              rows={4}
            />
            <Button
              onClick={handleSubmitReview}
              disabled={isWritingReview || !newReview.comment.trim()}
              className="w-full"
            >
              {isWritingReview ? t('sending') : t('submitReview')}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Mobile/Tablet: New RatingReviews Design */}
      <div className="lg:hidden">
        <RatingReviews
          reviews={convertedReviews}
          averageRating={packRating}
          className="py-4 sm:py-6"
        />
      </div>

      {/* Desktop: Keep original design - show RatingReviews (same as mobile for now) */}
      <div className="hidden lg:block">
        <RatingReviews
          reviews={convertedReviews}
          averageRating={packRating}
          className="py-4 sm:py-6 lg:py-8"
        />
      </div>
    </div>
  );
}