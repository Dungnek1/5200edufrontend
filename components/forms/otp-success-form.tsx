"use client";

import { useEffect, useState } from "react";
import { CheckCircle } from "lucide-react";
import { Logo } from "@/components/shared/logo";

export function OtpSuccessForm() {
  const [showCheckmark, setShowCheckmark] = useState(false);
  const [scale, setScale] = useState(0);
  const [opacity, setOpacity] = useState(0);

  useEffect(() => {
    const timer1 = setTimeout(() => setShowCheckmark(true), 100);
    const timer2 = setTimeout(() => setScale(1), 200);
    const timer3 = setTimeout(() => setOpacity(1), 300);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, []);

  return (
    <div className="w-full max-w-md mx-auto flex flex-col items-center px-4">
      {/* Logo - Mobile responsive */}
      <div className="mb-6 sm:mb-8 opacity-0 animate-fade-in" style={{ animation: "fadeIn 0.5s ease-out forwards" }}>
        <Logo variant="text" className="h-10 sm:h-12" />
      </div>

      {/* Success Card - Mobile responsive */}
      <div
        className="w-full bg-white rounded-xl sm:rounded-2xl shadow-xl overflow-hidden border border-green-100"
        style={{
          transform: `scale(${scale})`,
          opacity: opacity,
          transition: "transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.3s ease-out",
        }}
      >
        {/* Green header with gradient - Mobile responsive */}
        <div className="relative h-24 sm:h-32 bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center overflow-hidden">
          {/* Animated background circles - Mobile responsive */}
          <div className="absolute inset-0">
            <div className="absolute top-0 left-0 w-20 h-20 sm:w-32 sm:h-32 bg-white/10 rounded-full -translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 right-0 w-24 h-24 sm:w-40 sm:h-40 bg-white/10 rounded-full translate-x-1/4 translate-y-1/4" />
            <div className="absolute top-1/2 left-1/2 w-16 h-16 sm:w-24 sm:h-24 bg-white/5 rounded-full -translate-x-1/2 -translate-y-1/2 animate-pulse" />
          </div>

          {/* Animated checkmark - Mobile responsive */}
          {showCheckmark && (
            <div className="relative z-10">
              <div
                className="relative"
                style={{
                  animation: "checkmark-bounce 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards",
                }}
              >
                {/* Outer circle - Mobile responsive */}
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-white shadow-lg flex items-center justify-center">
                  {/* Checkmark icon - Mobile responsive */}
                  <svg
                    className="w-10 h-10 sm:w-12 sm:h-12 text-green-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={3}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    style={{
                      animation: "checkmark-draw 0.4s ease-out 0.2s forwards",
                      strokeDasharray: 50,
                      strokeDashoffset: 50,
                    }}
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>

                {/* Ripple effect */}
                <div className="absolute inset-0 rounded-full border-2 sm:border-4 border-white/50 animate-ping" style={{ animationDuration: "1.5s" }} />
              </div>
            </div>
          )}
        </div>

        {/* Content - Mobile responsive */}
        <div className="p-4 sm:p-6 md:p-8 text-center">
          {/* Success Title - Mobile responsive */}
          <h2
            className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 sm:mb-3"
            style={{
              fontFamily: "Roboto, sans-serif",
              opacity: opacity,
              transition: "opacity 0.5s ease-out 0.2s",
            }}
          >
            Xác thực thành công!
          </h2>

          {/* Success Message - Mobile responsive */}
          <p
            className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6"
            style={{
              fontFamily: "Be Vietnam Pro, sans-serif",
              opacity: opacity,
              transition: "opacity 0.5s ease-out 0.3s",
            }}
          >
            Mã OTP của bạn đã được xác thực. Đang chuyển hướng...
          </p>

          {/* Success Details - Mobile responsive */}
          <div
            className="flex items-center justify-center gap-2 px-3 sm:px-4 py-2 sm:py-3 bg-green-50 border border-green-200 rounded-lg"
            style={{
              opacity: opacity,
              transition: "opacity 0.5s ease-out 0.4s",
            }}
          >
            <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 flex-shrink-0" />
            <p
              className="text-xs sm:text-sm font-medium text-green-800"
              style={{ fontFamily: "Roboto, sans-serif" }}
            >
              Tài khoản đã được kích hoạt
            </p>
          </div>

          {/* Loading spinner */}
          <div className="mt-6 flex justify-center" style={{ opacity: opacity, transition: "opacity 0.5s ease-out 0.5s" }}>
            <div className="flex gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
              <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
              <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
            </div>
          </div>
        </div>
      </div>

      {/* Inline styles for animations */}
      <style jsx>{`
        @keyframes checkmark-bounce {
          0% {
            transform: scale(0) rotate(-45deg);
          }
          50% {
            transform: scale(1.1) rotate(0deg);
          }
          100% {
            transform: scale(1) rotate(0deg);
          }
        }

        @keyframes checkmark-draw {
          to {
            stroke-dashoffset: 0;
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
