"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTranslations } from "next-intl";
import { ConsultationModal } from "@/components/modals/consultation-modal";

export default function CourseCompletedPage() {
  const params = useParams<{ id: string; locale: string }>();
  const courseId = params?.id;
  const t = useTranslations("page.student.courses.completedPage");

  const [showConsultation, setShowConsultation] = useState(false);

  const couponCode = "NVBACADEMY";

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(couponCode);
    } catch {
    }
  };

  return (

    <main className="bg-white">
      <section className="px-4 md:px-6 lg:px-10 pt-10 pb-12">
        {/* Hero congratulation block */}
        <div className="flex flex-col items-center gap-6 rounded-2xl bg-[#f5f7ff] px-6 py-10 text-center sm:px-10 lg:flex-row lg:items-center lg:gap-10 lg:text-left">
          {/* Illustration placeholder */}
          <div className="flex flex-1 items-center justify-center">
            <div className="h-48 w-48 rounded-3xl bg-gradient-to-b from-[#e0e7ff] to-[#c7d2ff]" />
          </div>

          {/* Text */}
          <div className="flex-1 space-y-4">
            <h1
              className="text-2xl sm:text-3xl font-medium leading-[32px] text-[#1b2961]"
              style={{ fontFamily: "Roboto, sans-serif" }}
            >
              {t("title")}
            </h1>
            <p
              className="text-base leading-6 text-[#3b3d48]"
              style={{ fontFamily: "Roboto, sans-serif" }}
            >
              {t("description")}
            </p>

            {/* Coupon input + copy */}
            <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="flex-1 rounded-lg border border-[#dbdde5] bg-white px-4 py-3 text-left text-sm font-medium text-[#1b2961]">
                {couponCode}
              </div>
              <Button
                type="button"
                className="h-11 rounded-lg bg-[#4162e7] px-6 text-sm font-medium text-white hover:bg-[#3554d4]"
                onClick={handleCopy}
              >
                {t("copy")}
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Packages section */}
      <section className="bg-white pb-16">
        <div className="px-4 md:px-6 lg:px-10">
          <h2
            className="mb-6 text-center text-2xl font-medium text-[#3b3d48]"
            style={{ fontFamily: "Roboto, sans-serif" }}
          >
            {t("toolPackages")}
          </h2>

          <div className={`grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4`}>
            <ToolPackCard
              tagLabel="Gói Setup Automation:"
              tagColor="bg-[#22c55e]"
              title="Kho & Food Cost"
              items={[
                "Dành cho chủ quán bận rộn không thể tự cấu hình nhân bản.",
                "Kết nối dữ liệu POS vào Google Sheets tự động",
                "Setup bot Zalo cảnh báo khi nguyên liệu sắp hết",
                "Dashboard tính Food Cost thực tế hàng ngày",
              ]}
              price="5.000.000đ"
              primaryLabel="Nhận tư vấn"
              secondaryLabel="Setup / Nhà hàng"
              onConsultClick={() => setShowConsultation(true)}
            />

            <ToolPackCard
              tagLabel="Gói Setup Automation:"
              tagColor="bg-[#f97373]"
              title="Zalo Loyalty"
              items={[
                "Hệ thống chăm sóc khách hàng tự động qua Zalo OA & ZNS.",
                "Flow chào mừng khách mới tặng voucher",
                "Setup bot Zalo cảnh báo khi khách quay lại",
                "Flow win-back kéo khách quay lại sau 30 ngày",
              ]}
              price="8.000.000đ"
              primaryLabel={t("consultation")}
              secondaryLabel="Setup / Hệ thống"
              onConsultClick={() => setShowConsultation(true)}
            />

            <ToolPackCard
              tagLabel="Gói Design"
              tagColor="bg-[#f97316]"
              title="Real-time CEO Dashboard"
              items={[
                "Biến dữ liệu thô thành biểu đồ trực quan trên Looker Studio.",
                "Tổng hợp dữ liệu đa kênh (Grab, ShopeeFood, POS)",
                "Báo cáo lãi/lỗ (P&L) chi tiết theo ngày",
                "Theo dõi hiệu suất nhân viên & món ăn",
              ]}
              price="3.500.000đ"
              primaryLabel="Nhận tư vấn"
              secondaryLabel="Setup / Nhà hàng"
              onConsultClick={() => setShowConsultation(true)}
            />

            <ToolPackCard
              tagLabel="1:1 Coaching"
              tagColor="bg-[#2563eb]"
              title="Audit & Chiến lược"
              items={[
                "Tư vấn riêng 1-1 với chuyên gia để giải quyết vấn đề nóng.",
                "Review toàn bộ quy trình vận hành hiện tại",
                "Xây dựng chiến lược giá & menu engineering",
                "Giải đáp vướng mắc kỹ thuật chuyên sâu",
              ]}
              price="2.000.000đ / giờ"
              primaryLabel="Nhận tư vấn"
              onConsultClick={() => setShowConsultation(true)}
            />
          </div>
        </div>
      </section>

      <ConsultationModal
        open={showConsultation}
        onClose={() => setShowConsultation(false)}
      />
    </main>

  );
}

type ToolPackCardProps = {
  tagLabel: string;
  tagColor: string;
  title: string;
  items: string[];
  price: string;
  primaryLabel: string;
  secondaryLabel?: string;
  onConsultClick?: () => void;
};

function ToolPackCard({
  tagLabel,
  tagColor,
  title,
  items,
  price,
  primaryLabel,
  secondaryLabel,
  onConsultClick,
}: ToolPackCardProps) {
  return (
    <Card className="flex h-full flex-col rounded-2xl border border-[#e4e7f5] bg-white shadow-[0_0_10px_rgba(0,0,0,0.05)]">
      <CardHeader className="border-b border-[#e4e7f5] pb-3">
        <div className="inline-flex rounded-t-2xl px-4 py-1 text-xs font-medium text-white">
          <span className={tagColor}>{tagLabel}</span>
        </div>
        <CardTitle
          className="mt-2 text-base font-medium text-[#1b2961]"
          style={{ fontFamily: "Roboto, sans-serif" }}
        >
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col justify-between gap-4 pt-4">
        <ul className="space-y-2 text-sm text-[#3b3d48]">
          {items.map((item) => (
            <li key={item} className="flex gap-2">
              <span className="mt-1 inline-block h-1.5 w-1.5 rounded-full bg-[#4162e7]" />
              <span>{item}</span>
            </li>
          ))}
        </ul>

        <div className="mt-4 space-y-3">
          <p className="text-sm font-medium text-[#1b2961]">{t("fullPackage")}</p>
          <p className="text-xl font-semibold text-[#1b2961]">{price}</p>

          {secondaryLabel && (
            <Button
              variant="outline"
              className="h-9 w-full border-[#dbdde5] text-xs font-medium text-[#3b3d48]"
            >
              {secondaryLabel}
            </Button>
          )}

          <Button
            className="h-9 w-full rounded-md bg-[#22c55e] text-xs font-medium text-white hover:bg-[#16a34a] cursor-pointer"
            onClick={onConsultClick}
          >
            {primaryLabel}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}


