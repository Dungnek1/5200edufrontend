"use client";

import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Pack } from "@/types/pack";

interface PackageCardProps {
  package: Pack;
  onConsultClick?: () => void;
}

import { useTranslations } from "next-intl";

export function PackageCard({
  package: pkg,
  onConsultClick,
}: PackageCardProps) {
  const t = useTranslations("packs");

  const ribbonColors = [
    { light: "#16A34A", dark: "#09441F", price: "#16A34A", button: "#16A34A" }, // Ribbon 1 - Green
    { light: "#E86E6E", dark: "#DC2626", price: "#E35151", button: "#E86E6E" }, // Ribbon 2 - Red/Coral
    { light: "#FFB854", dark: "#6B3F00", price: "#FF9500", button: "#FF9500" }, // Ribbon 3 - Orange
    { light: "#2B7FFF", dark: "#12356B", price: "#2B7FFF", button: "#2B7FFF" }, // Ribbon 4 - Blue
  ];

  const colors = ribbonColors[(Number(pkg.id) - 1) % 4] || ribbonColors[0];

  return (
    <div
      className="relative"
      style={{
        overflow: "visible",
      }}
    >
      {/* Badge Ribbon - 3D Effect, thò ra ngoài card */}
      <div
        className="absolute z-10"
        style={{
          top: "20px",
          left: "-10px",
        }}
      >
        <div className="relative">
          {/* Main ribbon body - chéo từ trên xuống (trái cao → phải thấp) */}
          <div
            className="text-white font-semibold shadow-lg relative"
            style={{
              fontFamily: "Roboto, sans-serif",
              fontSize: "14px",
              fontWeight: 600,
              backgroundColor: colors.light,
              padding: "0 18px",
              height: "36px",
              display: "flex",
              alignItems: "center",
              borderRadius: "0 10px 10px 0",
              boxShadow:
                "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)",
              minWidth: "200px",
              clipPath:
                "polygon(0 0, 92% 0, calc(92% + 4px) 2px, calc(100% - 2px) calc(100% - 2px), 100% 100%, 0 100%)",
            }}
          >
            {pkg.header || t("defaultHeader")}
          </div>

          {/* Phần màu tối hơn ở góc dưới trái ribbon - bo tròn góc dưới trái theo đường cong */}
          <div
            className="absolute"
            style={{
              top: "36px",
              left: "0",
              width: "10px",
              height: "6px",
              backgroundColor: colors.dark,
              borderRadius: "0 0 0 6px",
            }}
          />
        </div>
      </div>

      {/* Card */}
      <div
        className="bg-white flex flex-col h-full"
        style={{
          borderRadius: "16px",
          padding: "24px",
          boxShadow:
            "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)",
          border: "1px solid #E5E7EB",
          width: "100%",
          maxWidth: "360px",
        }}
      >
        {/* Body Content */}
        <div className="flex-1 flex flex-col" style={{ marginTop: "24px" }}>
          {/* Title */}
          <h3
            className="font-bold text-left"
            style={{
              fontFamily: "Roboto, sans-serif",
              fontSize: "20px",
              fontWeight: 700,
              color: "#111827",
              marginTop: "24px",
              marginBottom: "8px",
            }}
          >
            {pkg.title}
          </h3>

          {/* Description */}
          <p
            className="text-left"
            style={{
              fontFamily: "Roboto, sans-serif",
              fontSize: "14px",
              lineHeight: 1.6,
              color: "#4B5563",
              marginTop: "8px",
              marginBottom: "16px",
            }}
          >
            {pkg.description}
          </p>

          {/* Features List with Blue Checkmarks */}
          <ul className="flex-1" style={{ marginBottom: "20px" }}>
            {(pkg.features || []).map((feature, index) => (
              <li
                key={index}
                className="flex items-start"
                style={{
                  marginBottom:
                    index < (pkg.features?.length || 0) - 1 ? "12px" : "0",
                }}
              >
                {/* Blue Circle with Checkmark */}
                <div
                  className="flex-shrink-0 flex items-center justify-center"
                  style={{
                    width: "18px",
                    height: "18px",
                    borderRadius: "50%",
                    border: "2px solid #3B82F6",
                    backgroundColor: "transparent",
                    marginRight: "12px",
                    marginTop: "2px",
                  }}
                >
                  <Check
                    className="text-blue-600"
                    style={{
                      width: "12px",
                      height: "12px",
                      strokeWidth: 3,
                    }}
                  />
                </div>
                <span
                  className="text-left"
                  style={{
                    fontFamily: "Roboto, sans-serif",
                    fontSize: "14px",
                    lineHeight: 1.5,
                    color: "#374151",
                  }}
                >
                  {typeof feature === 'string' ? feature : feature.content}
                </span>
              </li>
            ))}
          </ul>

          {/* Price Section */}
          <div
            className="border-t"
            style={{
              borderTop: "1px solid #E5E7EB",
              paddingTop: "20px",
            }}
          >
            <div
              className="flex items-end justify-between"
              style={{
                marginBottom: "20px",
                gap: "16px",
              }}
            >
              {/* Left: Price */}
              <div className="flex-1 min-w-0">
                <p
                  className="text-left"
                  style={{
                    fontFamily: "Roboto, sans-serif",
                    fontSize: "12px",
                    color: "#6B7280",
                    marginBottom: "4px",
                  }}
                >
                  {t("fullPackage")}
                </p>
                <span
                  className="font-bold block text-left"
                  style={{
                    fontFamily: "Roboto, sans-serif",
                    fontSize: "20px",
                    fontWeight: 700,
                    color: colors.price,
                  }}
                >
                  {pkg.price}
                </span>
              </div>

              {/* Right: Tag Badge */}
              <span
                className="px-3 py-1 rounded-lg whitespace-nowrap flex-shrink-0"
                style={{
                  fontFamily: "Roboto, sans-serif",
                  fontSize: "13px",
                  backgroundColor: "#F3F4F6",
                  color: "#374151",
                  borderRadius: "8px",
                }}
              >
                {pkg.unit || t("defaultUnit")}
              </span>
            </div>

            {/* CTA Button */}
            <Button
              className="text-white font-semibold"
              style={{
                fontFamily: "Roboto, sans-serif",
                backgroundColor: colors.button,
                padding: "8px 16px",
                borderRadius: "10px",
                fontSize: "15px",
                fontWeight: 600,
                marginTop: "20px",
                width: "fit-content",
                display: "block",
                marginLeft: "auto",
                marginRight: "auto",
              }}
              onMouseEnter={(e) => {
                const hoverColors = {
                  "#16A34A": "#15803D",
                  "#E86E6E": "#DC5C5C",
                  "#FF9500": "#E68600",
                  "#2B7FFF": "#2566CC",
                };
                e.currentTarget.style.backgroundColor =
                  hoverColors[colors.button as keyof typeof hoverColors] ||
                  colors.button;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = colors.button;
              }}
              onClick={onConsultClick}
            >
              {t("getConsultation")}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
