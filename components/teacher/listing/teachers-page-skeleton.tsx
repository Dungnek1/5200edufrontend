interface TeachersPageSkeletonProps {
  type: "grid" | "featured";
}

export function TeachersPageSkeleton({ type }: TeachersPageSkeletonProps) {
  if (type === "featured") {
    return (
      <div className="bg-white rounded-2xl border border-[#e5e7eb] shadow-sm overflow-hidden">
        <div className="w-full h-[545px] bg-gray-200 animate-pulse"></div>
        <div className="p-5 space-y-4">
          <div className="h-6 w-3/4 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-4 w-1/2 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-10 w-full bg-gray-200 rounded animate-pulse"></div>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Mobile skeleton */}
      <div className="grid grid-cols-1 gap-3 md:hidden">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="flex gap-3 p-3 rounded-xl bg-white border-2 border-[#f4f4f7]"
          >
            <div className="w-20 h-20 rounded-lg bg-gray-200 animate-pulse flex-shrink-0"></div>
            <div className="flex-1 space-y-2">
              <div className="h-5 w-3/4 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-4 w-full bg-gray-200 rounded animate-pulse"></div>
            </div>
          </div>
        ))}
      </div>
      {/* Desktop skeleton */}
      <div className="hidden md:grid grid-cols-4 gap-3">
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="flex flex-col gap-2 items-center p-2 rounded-xl bg-white border-2 border-[#f4f4f7]"
          >
            <div className="w-full aspect-square rounded-full bg-gray-200 animate-pulse"></div>
            <div className="h-4 w-20 bg-gray-200 rounded animate-pulse"></div>
          </div>
        ))}
      </div>
    </>
  );
}
