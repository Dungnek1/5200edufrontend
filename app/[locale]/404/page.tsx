"use client";

import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { useState } from "react";
import { useTranslations } from "next-intl";

// Local image path - 404 illustration
const img404Illustration = "/images/ui/404-illustration.png";

export default function NotFoundPage() {
  const router = useRouter();
  const params = useParams();
  const locale = (params?.locale as string) || "vi";
  const t = useTranslations("pageNotFound");
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(
        `/${locale}/explore?search=${encodeURIComponent(searchQuery)}`
      );
    }
  };

  return (

    <div className="bg-white min-h-[700px] flex items-center justify-center px-4 sm:px-6 lg:px-16 py-12 md:py-16 overflow-x-hidden">
      <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-12 lg:gap-16 max-w-[1280px] w-full">
        {/* Left Content */}
        <div className="flex flex-col gap-6 md:gap-8 lg:gap-12 items-start w-full md:w-auto md:flex-1 md:pr-8">
          {/* Heading and supporting text */}
          <div className="flex flex-col gap-6 w-full">
            <div className="flex flex-col gap-0">
              <h1
                className="text-3xl sm:text-4xl md:text-5xl lg:text-[48px] font-medium leading-tight md:leading-[60px] text-[#181d27] tracking-[-0.96px]"
                style={{
                  fontFamily: "Roboto, sans-serif",
                  fontWeight: 500,
                }}
              >
                {t("title")}
              </h1>
            </div>
            <p
              className="text-sm sm:text-base text-[#8c92ac] max-w-[480px] leading-6"
              style={{
                fontFamily: "Roboto, sans-serif",
                fontWeight: 400,
                fontSize: "16px",
                lineHeight: "24px",
              }}
            >
              {t("description")}
            </p>
          </div>

          {/* Search Bar */}
          <form
            onSubmit={handleSearch}
            className="flex flex-col sm:flex-row gap-2 w-full md:w-auto"
          >
            <div className="flex flex-col gap-1 w-full sm:w-[380px]">
              <div className="bg-[#fafafa] flex gap-2 h-10 items-center px-3 py-1 rounded-lg w-full">
                <div className="relative shrink-0 size-6">
                  <Search className="h-6 w-6 text-[#7f859d]" />
                </div>
                <input
                  type="text"
                  placeholder={t("searchPlaceholder")}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 min-w-0 font-normal leading-5 min-h-px min-w-px text-sm text-[#7f859d] outline-none bg-transparent"
                  style={{
                    fontFamily: "Roboto, sans-serif",
                    fontWeight: 400,
                    fontSize: "14px",
                    lineHeight: "20px",
                  }}
                />
              </div>
            </div>
            <Button
              type="submit"
              className="bg-[#4162e7] h-11 px-4 py-2 rounded-md text-white hover:bg-[#3556d4] transition-colors whitespace-nowrap"
              style={{
                fontFamily: "Roboto, sans-serif",
                fontWeight: 500,
                fontSize: "14px",
                lineHeight: "20px",
              }}
            >
              {t("searchButton")}
            </Button>
          </form>
        </div>

        {/* Right Content - 404 Illustration */}
        <div className="flex flex-1 flex-col items-center justify-center min-h-[242px] md:min-h-[400px] lg:min-h-[640px] w-full md:w-auto">
          <div className="relative w-full max-w-[569px] aspect-[569/242] md:aspect-[569/400] lg:aspect-[569/640]">
            <img
              src={img404Illustration}
              alt="404 Illustration"
              className="object-contain w-full h-full"
            />
          </div>
        </div>
      </div>
    </div>

  );
}
