import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { CourseStatus, type Course } from "@/types/course";

interface CourseStatusBadgeProps {
  status: CourseStatus | string;
  className?: string;
  showLabel?: boolean;
}

/**
 * Course Status Badge Component
 * Displays course status with appropriate color coding
 *
 * Status colors:
 * - published: green (Đã xuất bản)
 * - draft: yellow (Bản nháp)
 * - archived: gray (Đã lưu trữ)
 * - hidden: gray (Đang ẩn)
 */
export function CourseStatusBadge({
  status,
  className,
  showLabel = true,
}: CourseStatusBadgeProps) {
  const getStatusConfig = () => {
    switch (status) {
      case CourseStatus.PUBLISHED:
      case "published":
        return {
          label: "Đã xuất bản",
          className: "bg-[#d1fae5] text-[#059669] border-[#059669]",
        };
      case CourseStatus.DRAFT:
      case "draft":
        return {
          label: "Bản nháp",
          className: "bg-[#fef3c7] text-[#d97706] border-[#d97706]",
        };
      case CourseStatus.ARCHIVED:
      case "archived":
        return {
          label: "Đã lưu trữ",
          className: "bg-[#f3f4f6] text-[#4b5563] border-[#4b5563]",
        };
      case CourseStatus.HIDDEN:
      case "hidden":
        return {
          label: "Đang ẩn",
          className: "bg-[#f3f4f6] text-[#4b5563] border-[#4b5563]",
        };
      default:
        return {
          label: status || "Không rõ",
          className: "bg-[#f3f4f6] text-[#4b5563] border-[#4b5563]",
        };
    }
  };

  const config = getStatusConfig();

  if (!showLabel) {
    return (
      <div
        className={cn(
          "h-2 w-2 rounded-full",
          status === CourseStatus.PUBLISHED || status === "published"
            ? "bg-[#059669]"
            : status === CourseStatus.DRAFT || status === "draft"
              ? "bg-[#d97706]"
              : "bg-[#4b5563]",
          className
        )}
      />
    );
  }

  return (
    <Badge
      variant="outline"
      className={cn(
        "px-2.5 py-0.5 text-[11px] font-semibold rounded-full uppercase tracking-wide border",
        config.className,
        className
      )}
    >
      {config.label}
    </Badge>
  );
}

export default CourseStatusBadge;
