"use client";

import { useEffect, useState } from "react";
import { PackageCard } from "@/components/home/package-card";
import packagesService from "@/services/apis/packages.service";
import type { Package } from "@/services/apis/packages.service";
import { useTranslations } from "next-intl";

interface PackageSectionProps {
  onConsultClick?: () => void;
}

export function PackageSection({ onConsultClick }: PackageSectionProps) {
  const t = useTranslations();
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const data = await packagesService.getPackagesLimit(4);
        setPackages(data);
      } catch (error) {
        setPackages([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPackages();
  }, []);

  if (loading) {
    return (
      <section className="py-16">
        <div className="text-center text-gray-500">{t("common.loading")}</div>
      </section>
    );
  }

  return (
    <section style={{ overflow: "visible" }} className='flex flex-col gap-[20px]'>


      <h2
        className="text-xl sm:text-2xl md:text-[24px] font-semibold text-[#3b3d48] text-center"
        style={{
          fontFamily: "Roboto, sans-serif",
          fontWeight: 600,
          lineHeight: "32px",
        }}
      >
        {t("page.home.packages")}
      </h2>


      <div
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 2xl:grid-cols-4 gap-[20px] justify-items-center"
        style={{ overflow: "visible" }}
      >
        {packages.map((pkg, index) => (
          <PackageCard
            key={pkg.id}
            package={pkg}
            index={index}
            onConsultClick={onConsultClick}
          />
        ))}
      </div>
    </section>
  );
}
