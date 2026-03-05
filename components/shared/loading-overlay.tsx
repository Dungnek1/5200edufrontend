"use client";

import Image from "next/image";

interface LoadingOverlayProps {
  loading: boolean;
  children?: React.ReactNode;
  fullScreen?: boolean;
  className?: string;
}

export function LoadingOverlay({
  loading,
  children,
  fullScreen = false,
  className = "",
}: LoadingOverlayProps) {
  if (fullScreen && loading) {
    return (
      <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-white/95 backdrop-blur-sm" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}>
        <div className="flex flex-col items-center justify-center gap-4">
          {/* Logo với animation nhẹ */}
          <div className="relative">
            <div className="absolute inset-0 animate-pulse opacity-20">
              <div className="w-full h-full rounded-full bg-[#4162e7] blur-xl" />
            </div>
            <div
              className="relative animate-bounce"
              style={{ animationDuration: "2s", animationTimingFunction: "ease-in-out" }}
            >
              <Image
                src="/logo/Logo.svg"
                alt="Loading"
                width={80}
                height={80}
                className="object-contain"
                style={{ width: "auto", height: "auto" }}
                priority
              />
            </div>
          </div>

          {/* Spinner ring */}
          <div className="relative w-16 h-16">
            <div className="absolute inset-0 rounded-full border-4 border-[#4162e7]/20" />
            <div
              className="absolute inset-0 rounded-full border-4 border-transparent border-t-[#4162e7] animate-spin"
              style={{ animationDuration: "1s" }}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      {loading && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-white/90 backdrop-blur-sm rounded-lg">
          <div className="flex flex-col items-center justify-center gap-3">
            {/* Logo nhỏ hơn cho inline */}
            <div className="relative">
              <div className="absolute inset-0 animate-pulse opacity-20">
                <div className="w-full h-full rounded-full bg-[#4162e7] blur-lg" />
              </div>
              <div
                className="relative animate-bounce"
                style={{ animationDuration: "2s", animationTimingFunction: "ease-in-out" }}
              >
                <Image
                  src="/logo/Logo.svg"
                  alt="Loading"
                  width={60}
                  height={60}
                  className="object-contain"
                  style={{ width: "auto", height: "auto" }}
                  priority
                />
              </div>
            </div>

            {/* Spinner ring nhỏ hơn */}
            <div className="relative w-12 h-12">
              <div className="absolute inset-0 rounded-full border-3 border-[#4162e7]/20" />
              <div
                className="absolute inset-0 rounded-full border-3 border-transparent border-t-[#4162e7] animate-spin"
                style={{ animationDuration: "1s" }}
              />
            </div>
          </div>
        </div>
      )}
      {children}
    </div>
  );
}
