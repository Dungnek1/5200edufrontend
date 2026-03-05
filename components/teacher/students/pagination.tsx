import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  const pages = getPageNumbers(currentPage, totalPages);

  return (
    <div className="flex gap-[8px] items-center justify-center mt-[16px]">
      {pages.map((page, index) => {
        if (page === "...") {
          return (
            <span
              key={`ellipsis-${index}`}
              className="w-[24px] h-[24px] flex items-center justify-center rounded-[2.667px] text-[#a8b7f4]"
            >
              ...
            </span>
          );
        }

        return (
          <PaginationButton
            key={page}
            onClick={() => onPageChange(page as number)}
            isActive={page === currentPage}
          >
            {page}
          </PaginationButton>
        );
      })}

      <PaginationButton
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
        ariaLabel="Next page"
      >
        <ChevronRight className="h-[10.667px] w-[10.667px] text-[#2e46a4]" />
      </PaginationButton>
    </div>
  );
}

interface PaginationButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  isActive?: boolean;
  ariaLabel?: string;
}

function PaginationButton({
  children,
  onClick,
  disabled = false,
  isActive = false,
  ariaLabel,
}: PaginationButtonProps) {
  const baseClasses =
    "w-[24px] h-[24px] flex items-center justify-center rounded-[2.667px] transition-colors cursor-pointer";

  const stateClasses = isActive
    ? "bg-[#3b59d2] text-[#eceffd] shadow-[0px_2px_8px_0px_rgba(59,89,210,0.2)]"
    : "text-[#a8b7f4] hover:bg-[#eceffd]";

  const disabledClasses = disabled ? "disabled:opacity-50" : "";

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      className={`${baseClasses} ${stateClasses} ${disabledClasses}`}
    >
      <span className="text-[14px] leading-[20px]">{children}</span>
    </button>
  );
}

function getPageNumbers(
  currentPage: number,
  totalPages: number
): Array<number | string> {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  if (currentPage <= 3) {
    return [1, 2, 3, 4, "...", totalPages];
  }

  if (currentPage >= totalPages - 2) {
    return [
      1,
      "...",
      totalPages - 3,
      totalPages - 2,
      totalPages - 1,
      totalPages,
    ];
  }

  return [
    1,
    "...",
    currentPage - 1,
    currentPage,
    currentPage + 1,
    "...",
    totalPages,
  ];
}
