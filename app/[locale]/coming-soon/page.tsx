"use client";

import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";

const svgBackgroundPath = "/logo/Clip path group.svg";

/**
 * Coming Soon Page
 *
 * Design source: Figma node-id=1240-62444
 * Shows "COMING SOON" text with background illustration and "Quay lại" button
 */
export default function ComingSoonPage() {
  const router = useRouter();
  const params = useParams();
  const locale = params.locale as string;

  return (
    <>
      {/* Full width container - break out of layout padding */}
      <div
        className="bg-white min-h-[700px] flex flex-col items-center justify-center relative overflow-hidden"
        style={{
          width: "100vw",
          marginLeft: "calc(-50vw + 50%)",
          marginRight: "calc(-50vw + 50%)",
        }}
      >
        {/* Background SVG Illustration - dịch xuống dưới cho chạm ngay dưới chữ COMING */}
        <div
          className="absolute left-0 right-0 bottom-0 w-full h-full opacity-20"
          style={{ top: "140px" }} // đẩy bg xuống, giữ COMING sát mép trên của sóng
        >
          <img
            src={svgBackgroundPath}
            alt="Coming Soon Background"
            className="w-full h-full object-cover object-center"
            style={{
              mixBlendMode: "multiply",
            }}
          />
        </div>

        {/* Content Overlay */}
        <div className="relative z-10 flex flex-col items-center justify-center w-full h-full min-h-[700px]">
          {/* COMING Text - brand blue, above SOON */}
          <div className="flex flex-col items-center justify-center mb-4">
            <h1
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold text-center leading-tight"
              style={{
                fontFamily: "Roboto, sans-serif",
                fontWeight: 700,
                color: "#4162E7", // Brand blue theo Figma
              }}
            >
              COMING
            </h1>
          </div>

          {/* SOON Text - White, on background */}
          <div className="flex flex-col items-center justify-center mb-8 md:mb-12">
            <h1
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold text-center leading-tight"
              style={{
                fontFamily: "Roboto, sans-serif",
                fontWeight: 700,
                color: "white",
                textShadow: "0 2px 4px rgba(0,0,0,0.1)",
              }}
            >
              SOON
            </h1>
          </div>

          {/* Back Button - Inside background */}
          <Button
            onClick={() => router.push(`/${locale}`)}
            variant="outline"
            className="bg-white border border-[#4162e7] text-[#4162e7] hover:bg-[#4162e7] hover:text-white hover:border-[#4162e7] h-11 px-4 py-2 rounded-md transition-colors w-[120px]"
            style={{
              fontFamily: "Roboto, sans-serif",
              fontWeight: 500,
              fontSize: "14px",
              lineHeight: "20px",
            }}
          >
            Quay lại
          </Button>
        </div>
      </div>
    </>
  );
}
