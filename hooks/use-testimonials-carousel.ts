"use client";

import { useEffect, useRef, useState, RefObject } from "react";

export function useTestimonialsCarousel(autoSlideInterval = 3000) {
  const testimonialsRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);

  const scrollTestimonials = (direction: "left" | "right") => {
    if (testimonialsRef.current) {
      const cardWidth = 350;
      const gap = 20;
      const scrollAmount = cardWidth + gap;

      testimonialsRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  useEffect(() => {
    if (isPaused || !testimonialsRef.current) return;

    const interval = setInterval(() => {
      if (testimonialsRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = testimonialsRef.current;
        const maxScroll = scrollWidth - clientWidth;
        const cardWidth = 350;
        const gap = 20;
        const scrollAmount = cardWidth + gap;

        if (scrollLeft >= maxScroll - 10) {
          testimonialsRef.current.scrollTo({ left: 0, behavior: "smooth" });
        } else {
          const currentIndex = Math.round(scrollLeft / scrollAmount);
          const nextPosition = (currentIndex + 1) * scrollAmount;
          const targetPosition = Math.min(nextPosition, maxScroll);

          testimonialsRef.current.scrollTo({ left: targetPosition, behavior: "smooth" });
        }
      }
    }, autoSlideInterval);

    return () => clearInterval(interval);
  }, [isPaused, autoSlideInterval]);

  return { testimonialsRef, isPaused, setIsPaused, scrollTestimonials };
}
