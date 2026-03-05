import { ChevronLeft, ChevronRight } from "lucide-react";

interface TeachersPagePaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function TeachersPagePagination({
  currentPage,
  totalPages,
  onPageChange,
}: TeachersPagePaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-1 sm:gap-2 mt-4 sm:mt-6 md:mt-0 md:h-[32px]">
      <button
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
        className="p-1.5 sm:p-2 rounded-full disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#eceffd] transition-colors cursor-pointer"
      >
        <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 text-[#3b3d48]" />
      </button>
      {Array.from({ length: Math.min(7, totalPages) }, (_, i) => {
        let pageNum;
        if (totalPages <= 7) {
          pageNum = i + 1;
        } else if (currentPage <= 4) {
          pageNum = i + 1;
        } else if (currentPage >= totalPages - 3) {
          pageNum = totalPages - 6 + i;
        } else {
          pageNum = currentPage - 3 + i;
        }
        return (
          <button
            key={pageNum}
            onClick={() => onPageChange(pageNum)}
            className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full text-xs sm:text-sm font-medium transition-all cursor-pointer ${
              currentPage === pageNum
                ? "bg-[#4162e7] text-white shadow-md"
                : "text-[#3b3d48] hover:bg-[#eceffd]"
            }`}
          >
            {pageNum}
          </button>
        );
      })}
      <button
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
        className="p-1.5 sm:p-2 rounded-full disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#eceffd] transition-colors cursor-pointer"
      >
        <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-[#3b3d48]" />
      </button>
    </div>
  );
}
