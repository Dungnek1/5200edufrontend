import { CertificateModal } from "@/components/modals/certificate-modal";
import { FeedbackModal } from "@/components/modals/feedback-modal";
import { useTranslations } from "next-intl";

interface Review {
  id: string;
  studentName: string;
  studentAvatar: string;
  rating: number;
  comment: string;
  courseName: string;
}

interface TeachersPageModalsProps {
  showCertificate: boolean;
  showFeedback: boolean;
  selectedReview: string | null;
  reviews: Review[];
  onCertificateClose: () => void;
  onFeedbackClose: () => void;
}

export function TeachersPageModals({
  showCertificate,
  showFeedback,
  selectedReview,
  reviews,
  onCertificateClose,
  onFeedbackClose,
}: TeachersPageModalsProps) {
  const t = useTranslations("page.teachers");
  return (
    <>
      <CertificateModal
        open={showCertificate}
        onClose={onCertificateClose}
        certificateTitle={t("trainingCertificates")}
        certificateImage="/images/placeholder.svg"
      />
      <FeedbackModal
        open={showFeedback}
        onClose={onFeedbackClose}
        reviews={reviews}
        averageRating={5}
      />
    </>
  );
}
