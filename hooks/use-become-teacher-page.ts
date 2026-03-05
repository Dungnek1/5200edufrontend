"use client";

import { useState, useEffect } from "react";
import packagesService from "@/services/apis/packages.service";
import type { Package } from "@/services/apis/packages.service";
import { logger } from '@/lib/logger';
import { useTestimonialsCarousel } from "@/hooks/use-testimonials-carousel";

export interface UseBecomeTeacherPageReturn {
  showConsultation: boolean;
  setShowConsultation: (value: boolean) => void;
  showRegisterModal: boolean;
  setShowRegisterModal: (value: boolean) => void;
  expandedFAQ: number | null;
  setExpandedFAQ: (value: number | null) => void;
  fetchedPackages: Package[];
  testimonialsRef: ReturnType<typeof useTestimonialsCarousel>["testimonialsRef"];
  isPaused: ReturnType<typeof useTestimonialsCarousel>["isPaused"];
  setIsPaused: ReturnType<typeof useTestimonialsCarousel>["setIsPaused"];
  scrollTestimonials: ReturnType<typeof useTestimonialsCarousel>["scrollTestimonials"];
  handleRegister: () => void;
}

export function useBecomeTeacherPage(): UseBecomeTeacherPageReturn {
  const [showConsultation, setShowConsultation] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(0);
  const [fetchedPackages, setFetchedPackages] = useState<Package[]>([]);
  const { testimonialsRef, isPaused, setIsPaused, scrollTestimonials } = useTestimonialsCarousel();

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const data = await packagesService.getPackagesLimit(4);
        setFetchedPackages(data);
      } catch (error) {
        logger.error("Failed to fetch packages:", error);
      }
    };
    fetchPackages();
  }, []);

  const handleRegister = () => setShowRegisterModal(true);

  return {
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
  };
}
