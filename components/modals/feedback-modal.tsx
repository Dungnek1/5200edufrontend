"use client";

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { RatingReviews } from "@/components/shared/rating-reviews";
import { Review } from "@/types/course";
import { useTranslations } from "next-intl";

interface FeedbackModalProps {
  open: boolean;
  onClose: () => void;
  reviews: Review[];
  averageRating?: number;
}

export function FeedbackModal({
  open,
  onClose,
  reviews,
  averageRating = 4.7,
}: FeedbackModalProps) {
  const tCourse = useTranslations("course");

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-[90vw] sm:max-w-[600px] md:max-w-[800px] lg:max-w-[1200px] max-h-[90vh] p-0 bg-white rounded-lg sm:rounded-xl overflow-hidden [&>button]:hidden">
        <DialogTitle className="sr-only">
          {tCourse("studentReviews")}
        </DialogTitle>
        <div className="relative flex flex-col w-full h-full max-h-[90vh] overflow-y-auto">
          <RatingReviews
            reviews={reviews}
            averageRating={averageRating}
            showCloseButton={true}
            onClose={onClose}
            className="p-4 sm:p-6"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}

