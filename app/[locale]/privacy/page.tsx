"use client";

import { useRouter, useParams } from "next/navigation";
import PartnerTeacherPolicy from "@/components/forms/partner-teacher-policy";

export default function PrivacyPage() {
  const router = useRouter();
  const params = useParams();
  const locale = (params?.locale as string) || "vi";

  const handleBack = () => {
    router.push(`/${locale}/register`);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 sm:py-12">
      <PartnerTeacherPolicy onBack={handleBack} />
    </div>
  );
}
