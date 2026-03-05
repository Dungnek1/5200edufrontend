"use client";

import { useRef, useState, KeyboardEvent, ClipboardEvent, useEffect } from "react";
import { cn } from "@/lib/utils";

interface OtpInputProps {
  length?: number;
  onComplete?: (otp: string) => void;
  disabled?: boolean;
  error?: boolean;
  success?: boolean;
  onOtpChange?: (otp: string) => void;
  className?: string;
}

export function OtpInput({
  length = 6,
  onComplete,
  disabled,
  error = false,
  success = false,
  onOtpChange,
  className,
}: OtpInputProps) {
  const [otp, setOtp] = useState<string[]>(Array(length).fill(""));
  const [focusedIndex, setFocusedIndex] = useState<number>(-1);
  const inputRefs = useRef<(HTMLInputElement | null)[]>(
    Array(length).fill(null)
  );


  useEffect(() => {
    if (!disabled && !success) {
      inputRefs.current[0]?.focus();
    }
  }, [disabled, success]);

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);


    if (onOtpChange) {
      onOtpChange(newOtp.join(""));
    }

    if (value && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }


    if (newOtp.every((digit) => digit !== "") && onComplete) {
      onComplete(newOtp.join(""));
    }
  };

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").slice(0, length);

    const sanitizedData = pastedData.replace(/\D/g, "");
    if (sanitizedData.length === 0) return;

    const newOtp = sanitizedData.split("");
    const finalOtp = [...newOtp, ...Array(length - newOtp.length).fill("")];
    setOtp(finalOtp);

    if (onOtpChange) {
      onOtpChange(finalOtp.join(""));
    }

    if (finalOtp.every((digit) => digit !== "") && onComplete) {
      onComplete(finalOtp.join(""));
    }

    if (finalOtp.length === length) {
      inputRefs.current[length - 1]?.focus();
    } else {
      inputRefs.current[finalOtp.length]?.focus();
    }
  };

  const getInputClassName = (index: number) => {
    return cn(

      "w-12 h-12 sm:w-13 sm:h-13 md:w-14 md:h-14 text-center text-lg sm:text-xl md:text-2xl font-bold",
      "border-2 rounded-lg sm:rounded-xl transition-all duration-200",
      "focus:outline-none focus:ring-0",
      "relative overflow-hidden",
      "px-1 sm:px-2",

      disabled && "opacity-50 cursor-not-allowed bg-gray-100",


      success && "border-green-500 bg-green-50 text-green-700 shadow-lg scale-105",


      error && "border-red-500 bg-red-50 text-red-700 animate-shake",


      !error && !success && focusedIndex === index && "border-[#0A0BD9] shadow-lg scale-105",

      !error && !success && otp[index] && "border-[#0A0BD9] bg-blue-50 text-[#0A0BD9]",


      !error && !success && !otp[index] && "border-[#0A0BD9] bg-white text-gray-900 hover:border-[#0809b8]"
    );
  };

  return (
    <div className={`flex gap-2 justify-between items-center ${className}`}>
      {otp.map((digit, index) => (
        <div key={index} className="relative">
          <input
            ref={(el) => {
              inputRefs.current[index] = el;
            }}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            autoComplete="one-time-code"
            onChange={(e) => handleChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            onPaste={index === 0 ? handlePaste : undefined}
            onFocus={() => setFocusedIndex(index)}
            onBlur={() => setFocusedIndex(-1)}
            disabled={disabled || success}
            className={getInputClassName(index)}
            style={{ fontFamily: "Roboto, sans-serif" }}
          />



          {success && digit && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
