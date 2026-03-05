"use client";

import { useRouter, useParams } from "next/navigation";
import LearnerPolicy from "@/components/forms/learner-policy";

export default function TermsPage() {
  const router = useRouter();
  const params = useParams();
  const locale = (params?.locale as string) || "vi";

  const handleBack = () => {
    router.push(`/${locale}/register`);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 sm:py-12">
      <LearnerPolicy onBack={handleBack} />
    </div>
  );
}
