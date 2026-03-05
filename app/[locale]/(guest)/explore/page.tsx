"use client";

import { useState } from "react";
import { CourseSection } from "@/components/home/course-section";
import { TeacherSection } from "@/components/home/teacher-section";
import { PackageSection } from "@/components/home/package-section";
import { HeroSection } from "@/components/explore/hero-section";
import { ConsultationModal } from "@/components/modals/consultation-modal";

export default function ExplorePage() {
  const [showConsultation, setShowConsultation] = useState(false);

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
