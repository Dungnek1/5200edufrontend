"use client";

import { Home, ChevronRight } from "lucide-react";
import Link from "next/link";

interface BreadcrumbProps {
  items: Array<{
    label: string;
    href?: string;
  }>;
  locale?: string;
}

export function Breadcrumb({ items, locale = "vi" }: BreadcrumbProps) {
  return (
    <nav
      className="flex items-center gap-2 text-sm leading-[20px]"
      aria-label="Breadcrumb"
      style={{ fontFamily: "Roboto, sans-serif" }}
    >
      <Link
        href={`/${locale}`}
        className="flex items-center text-[#63687a] hover:text-[#7F859D] transition-colors"
        aria-label="Home"
      >
        <Home className="h-4 w-4 text-[#63687a]" strokeWidth={1.5} />
      </Link>
      {items.map((item, index) => (
        <div key={index} className="flex items-center gap-2">
          <ChevronRight className="h-4 w-4 text-[#7F859D]" strokeWidth={1.5} />
          {item.href ? (
            <Link
              href={item.href}
              className="text-[#63687a] hover:text-[#7F859D] transition-colors"
            >
              {item.label}
            </Link>
          ) : (
            <span className="text-[#3B3D48]">{item.label}</span>
          )}
        </div>
      ))}
    </nav>
  );
}
