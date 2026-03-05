import { Home, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";

interface GradingBreadcrumbsProps {
  locale: string;
}

export function GradingBreadcrumbs({ locale }: GradingBreadcrumbsProps) {
  const router = useRouter();

  return (
    <div className="flex gap-[8px] items-center mb-[20px]">
      <Home className="h-5 w-5 text-[#8c92ac]" />
      <ChevronRight className="h-4 w-4 text-[#8c92ac]" />
      <button
        onClick={() => router.push(`/${locale}/teacher/students`)}
        className="text-[12px] font-medium leading-[16px] text-[#7f859d] hover:text-[#3b3d48] transition-colors"
        style={{ fontFamily: "Roboto, sans-serif", fontWeight: 500 }}
      >
        Quản lý Học viên
      </button>
      <ChevronRight className="h-4 w-4 text-[#8c92ac]" />
      <span
        className="text-[12px] font-medium leading-[16px] text-[#3b59d2]"
        style={{ fontFamily: "Roboto, sans-serif", fontWeight: 500 }}
      >
        Chấm điểm bài tập
      </span>
    </div>
  );
}
