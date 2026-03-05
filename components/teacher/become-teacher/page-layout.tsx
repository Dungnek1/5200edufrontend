"use client";

import { usePathname } from "next/navigation";
import { ConsultationModal } from "@/components/modals/consultation-modal";
import { TeacherRegisterModal } from "@/components/modals/teacher-register-modal";
import { BecomeTeacherHero } from "@/components/teacher/become-teacher/hero";
import { BecomeTeacherBenefits } from "@/components/teacher/become-teacher/benefits";
import { BecomeTeacherTrustSection } from "@/components/teacher/become-teacher/trust-section";
import { BecomeTeacherDashboardVisualization } from "@/components/teacher/become-teacher/dashboard-visualization";
import { BecomeTeacherTestimonials } from "@/components/teacher/become-teacher/testimonials";
import { BecomeTeacherCtaSection } from "@/components/teacher/become-teacher/cta-section";
import { BecomeTeacherFAQSection } from "@/components/teacher/become-teacher/faq-section";
import { BecomeTeacherAIToolsSection } from "@/components/teacher/become-teacher/ai-tools-section";
import { BackgroundEllipses } from "@/components/shared/background-ellipses";
import type { UseBecomeTeacherPageReturn } from "@/hooks/use-become-teacher-page";

interface BecomeTeacherPageLayoutProps {
  pageData: UseBecomeTeacherPageReturn;
}

export function BecomeTeacherPageLayout({ pageData }: BecomeTeacherPageLayoutProps) {
  const pathname = usePathname();
  const isGuestRoute = pathname?.includes("/(guest)/") ?? false;
  const overflowX = isGuestRoute ? "visible" : "hidden";
  const {
    showConsultation,
    setShowConsultation,
    showRegisterModal,
    setShowRegisterModal,
    expandedFAQ,
    setExpandedFAQ,
    fetchedPackages,
    testimonialsRef,
    isPaused,
    setIsPaused,
    scrollTestimonials,
    handleRegister,
  } = pageData;

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `@media (max-width: 667px) { .ellipse-container { position: fixed !important; left: 0 !important; right: 0 !important; width: 100vw !important; margin-left: 0 !important; } .page-wrapper { overflow-x: hidden !important; } .main-container { overflow-x: hidden !important; } }` }} />
      <div className={`relative overflow-x-${overflowX} w-full page-wrapper`}>
        <div className="bg-transparent mx-auto w-full py-4 md:py-6 lg:py-8 relative overflow-x-${overflowX} main-container" style={{ position: "relative", zIndex: 1 }}>
          <BackgroundEllipses />
          <div className="relative" style={{ zIndex: 10 }}>
            <BecomeTeacherHero onRegister={handleRegister} />
            <BecomeTeacherBenefits />
            <BecomeTeacherTrustSection />
            <BecomeTeacherAIToolsSection
              aiToolPackages={fetchedPackages}
              onConsultClick={() => setShowConsultation(true)}
            />
            <BecomeTeacherDashboardVisualization
              onConsultClick={() => setShowConsultation(true)}
            />
            <BecomeTeacherTestimonials testimonialsRef={testimonialsRef} isPaused={isPaused} setIsPaused={setIsPaused} scrollTestimonials={scrollTestimonials} />
            <BecomeTeacherCtaSection onRegister={handleRegister} />
            <BecomeTeacherFAQSection expandedFAQ={expandedFAQ} setExpandedFAQ={setExpandedFAQ} />
          </div>
        </div>
      </div>
      <ConsultationModal open={showConsultation} onClose={() => setShowConsultation(false)} />
      <TeacherRegisterModal open={showRegisterModal} onClose={() => setShowRegisterModal(false)} />
    </>
  );
}
