"use client";

import { useEffect, useState } from "react";
import { CourseSection } from "@/components/home/course-section";
import { TeacherSection } from "@/components/home/teacher-section";
import { PackageSection } from "@/components/home/package-section";
import { HeroSection } from "@/components/explore/hero-section";
import { ConsultationModal } from "@/components/modals/consultation-modal";
import { toast } from "sonner";
import { useTranslations } from "next-intl";

export default function StudentDashboardPage() {
  const [showConsultation, setShowConsultation] = useState(false);
  const t = useTranslations();

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const flag = window.localStorage.getItem("login_success");
      if (flag === "1") {
        const timeoutId = window.setTimeout(() => {
          toast.success(t("auth.messages.loginSuccess"), { duration: 2000 });
          window.localStorage.removeItem("login_success");
        }, 200);
        return () => window.clearTimeout(timeoutId);
      }
    } catch {
      // ignore storage errors
    }
  }, [t]);

  return (
    <>
      <div className="bg-white px-4 md:px-6 lg:px-16 md:py-6 lg:py-8">
        <HeroSection />
      </div>

      <div className="bg-white overflow-x-hidden">
        <div className="bg-[#FAFAFA] py-4 px-4 md:py-6 md:px-6 lg:py-8 lg:px-16">
          <CourseSection />
        </div>

        <div className="bg-[#FAFAFA] py-4 px-4 md:py-6 md:px-6 lg:py-8 lg:px-16">
          <PackageSection onConsultClick={() => setShowConsultation(true)} />
        </div>

        <div className="bg-[#FAFAFA] py-4 px-4 md:py-6 md:px-6 lg:py-8 lg:px-16">
          <TeacherSection />
        </div>
      </div>

      <ConsultationModal
        open={showConsultation}
        onClose={() => setShowConsultation(false)}
      />
    </>
  );
}
