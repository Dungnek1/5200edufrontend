"use client";

import { useState, useEffect } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { PackageCard } from "@/components/pack/pack-card";
import { PackSearch } from "@/components/pack/pack-search";
import { PackFilter } from "@/components/pack/pack-filter";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import { Pagination } from "@/components/ui/pagination";
import { Badge } from "@/components/ui/badge";
import {
  Package,
  Filter,
  SlidersHorizontal,
  Grid,
  List,
  Star,
  TrendingUp,
  Sparkles,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { packService } from "@/services/apis/pack.service";
import type { Pack, PackFilters } from "@/types/pack";

export default function PacksPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const locale = params.locale as string;
  const t = useTranslations();

  const [packs, setPacks] = useState<Pack[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPacks, setTotalPacks] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize, setPageSize] = useState(12);

  const [filters, setFilters] = useState<PackFilters>({
    search: searchParams.get("search") || "",
    category: searchParams.get("category") || "",
    level: searchParams.get("level") || "",
    teacher: searchParams.get("teacher") || "",
    priceRange: searchParams.get("priceRange") || "",
    sortBy: searchParams.get("sort") || "featured",
  });

  const filterOptions = {
    categories: [
      "F&B Automation",
      "Marketing Automation",
      "Data Analytics",
      "AI Tools",
      "Kỹ năng mềm",
    ],
    levels: ["beginner", "intermediate", "advanced"],
    teachers: ["Đỗ Hồng", "Nguyễn Văn An", "Trần Thị Bình", "Lê Văn Cường"],
    priceRanges: [
      { label: t("packs.price.free"), value: "free" },
      { label: t("packs.price.under5m"), value: "0-5000000" },
      { label: t("packs.price.5to10m"), value: "5000000-10000000" },
      { label: t("packs.price.10to15m"), value: "10000000-15000000" },
      { label: t("packs.price.over15m"), value: "15000000+" },
    ],
  };

  const fetchPacks = async () => {
    try {
      setLoading(true);
      const response = await packService.getPacks({
        page: currentPage,
        limit: pageSize,
        search: filters.search || undefined,
        category: filters.category || undefined,
        level: filters.level || undefined,
        teacher: filters.teacher || undefined,
        priceRange: filters.priceRange || undefined,
        sortBy: filters.sortBy || "featured",
      });

      setPacks(response.data || []);
      setTotalPacks(response.total || 0);
      setTotalPages(response.totalPages || 1);
    } catch (error) {
      toast.error(t("packs.errorLoading"));
      setPacks([]);
      setTotalPacks(0);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPacks();
  }, [currentPage, pageSize, filters]);

  const handleFilterChange = (newFilters: Partial<PackFilters>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
    setCurrentPage(1); // Reset to first page when filters change
  };

  const clearFilters = () => {
    setFilters({
      search: "",
      category: "",
      level: "",
      teacher: "",
      priceRange: "",
      sortBy: "featured",
    });
    setCurrentPage(1);
  };

  const getActiveFiltersCount = () => {
    return Object.values(filters).filter(
      (value) => value !== "" && value !== "featured"
    ).length;
  };

  const sortOptions = [
    { value: "featured", label: t("packs.sortOptions.featured"), icon: Sparkles },
    { value: "newest", label: t("packs.sortOptions.newest") },
    { value: "rating", label: t("packs.sortOptions.rating"), icon: Star },
    { value: "popular", label: t("packs.sortOptions.popular"), icon: TrendingUp },
    { value: "price-low", label: t("packs.sortOptions.priceLow") },
    { value: "price-high", label: t("packs.sortOptions.priceHigh") },
  ];

  const levelLabels = {
    beginner: t("packs.level.beginner"),
    intermediate: t("packs.level.intermediate"),
    advanced: t("packs.level.advanced"),
  };

  return (
    <div className="bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className={`px-4 md:px-6 lg:px-16 py-12 sm:py-16 md:py-20 lg:py-20 xl:py-24`}>
          {/* Breadcrumb */}
          <div className="mb-6">
            <nav className="flex items-center gap-2 text-sm text-gray-500">
              <a href={`/${locale}/explore`} className="hover:text-gray-700">{t("nav.explore")}</a>
              <span>/</span>
              <span className="text-gray-900 font-medium">{t("packs.breadcrumb")}</span>
            </nav>
          </div>

          <div className={`flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6`}>
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                {t("packs.title")}
              </h1>
              <p className="text-lg text-gray-600">
                {t("packs.subtitle", { count: totalPacks.toLocaleString() })}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Button
                variant={viewMode === "grid" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("grid")}
                className={`hidden sm:flex`}
              >
                <Grid className="h-4 w-4 mr-2" />
                Grid
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("list")}
                className={`hidden sm:flex`}
              >
                <List className="h-4 w-4 mr-2" />
                List
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 sm:px-6 lg:px-16 py-12 sm:py-16 md:py-20 lg:py-20 xl:py-24">
        <div className={`grid lg:grid-cols-4 gap-8`}>
          {/* Filter Sidebar - Desktop */}
          <aside className={`hidden lg:block lg:col-span-1`}>
            <div className="sticky top-6">
              <div className="bg-white rounded-lg border p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <Filter className="h-5 w-5" />
                    {t("common.filter")}
                  </h3>
                  {getActiveFiltersCount() > 0 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={clearFilters}
                      className="text-blue-600 hover:text-blue-700 h-auto p-0"
                    >
                      {t("common.clearAll")}
                    </Button>
                  )}
                </div>

                <PackFilter
                  filters={filterOptions}
                  selectedFilters={filters}
                  onFilterChange={handleFilterChange}
                />
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <div className={`lg:col-span-3`}>
            {/* Mobile Filter Toggle */}
            <div className="lg:hidden mb-6">
              <Button
                variant="outline"
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className="w-full justify-between"
              >
                <div className="flex items-center gap-2">
                  <SlidersHorizontal className="h-4 w-4" />
                  {t("common.filter")}
                  {getActiveFiltersCount() > 0 && (
                    <Badge variant="secondary" className="ml-2">
                      {getActiveFiltersCount()}
                    </Badge>
                  )}
                </div>
              </Button>
            </div>

            {/* Mobile Filter Panel */}
            {isFilterOpen && (
              <div className="lg:hidden mb-6">
                <div className="bg-white rounded-lg border p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {t("common.filter")}
                    </h3>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={clearFilters}
                      className="text-blue-600 hover:text-blue-700"
                    >
                      {t("common.clearAll")}
                    </Button>
                  </div>

                  <PackFilter
                    filters={filterOptions}
                    selectedFilters={filters}
                    onFilterChange={handleFilterChange}
                  />
                </div>
              </div>
            )}

            {/* Search and Sort Bar */}
            <div className={`flex flex-col sm:flex-row gap-4 mb-6`}>
              <div className="flex-1">
                <PackSearch
                  value={filters.search}
                  onChange={(value) => handleFilterChange({ search: value })}
                  onSearch={(value) => handleFilterChange({ search: value })}
                  placeholder={t("packs.searchPlaceholder")}
                />
              </div>

              <Select
                value={filters.sortBy}
                onValueChange={(value) =>
                  handleFilterChange({ sortBy: value })
                }
              >
                <SelectTrigger className={`w-full sm:w-48`}>
                  <SelectValue placeholder={t("packs.sortBy")} />
                </SelectTrigger>
                <SelectContent>
                  {sortOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      <div className="flex items-center gap-2">
                        {option.icon && <option.icon className="h-4 w-4" />}
                        {option.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Active Filters */}
            {getActiveFiltersCount() > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {filters.category && (
                  <Badge
                    variant="secondary"
                    className="flex items-center gap-1"
                  >
                    {filters.category}
                    <button
                      onClick={() => handleFilterChange({ category: "" })}
                      className="ml-1 hover:text-gray-700"
                    >
                      ×
                    </button>
                  </Badge>
                )}
                {filters.level && (
                  <Badge
                    variant="secondary"
                    className="flex items-center gap-1"
                  >
                    {levelLabels[filters.level as keyof typeof levelLabels]}
                    <button
                      onClick={() => handleFilterChange({ level: "" })}
                      className="ml-1 hover:text-gray-700"
                    >
                      ×
                    </button>
                  </Badge>
                )}
                {filters.instructor && (
                  <Badge
                    variant="secondary"
                    className="flex items-center gap-1"
                  >
                    {filters.instructor}
                    <button
                      onClick={() => handleFilterChange({ instructor: "" })}
                      className="ml-1 hover:text-gray-700"
                    >
                      ×
                    </button>
                  </Badge>
                )}
                {filters.priceRange && (
                  <Badge
                    variant="secondary"
                    className="flex items-center gap-1"
                  >
                    {
                      filterOptions.priceRanges.find(
                        (r) => r.value === filters.priceRange
                      )?.label
                    }
                    <button
                      onClick={() => handleFilterChange({ priceRange: "" })}
                      className="ml-1 hover:text-gray-700"
                    >
                      ×
                    </button>
                  </Badge>
                )}
                {filters.search && (
                  <Badge
                    variant="secondary"
                    className="flex items-center gap-1"
                  >
                    "{filters.search}"
                    <button
                      onClick={() => handleFilterChange({ search: "" })}
                      className="ml-1 hover:text-gray-700"
                    >
                      ×
                    </button>
                  </Badge>
                )}
              </div>
            )}

            {/* Results Count */}
            <div className="mb-6">
              <p className="text-sm text-gray-600">
                {t("packs.showing", { count: packs.length, total: totalPacks.toLocaleString() })}
              </p>
            </div>

            {/* Packs Grid/List */}
            {loading ? (
              <div
                className={
                  viewMode === "grid"
                    ? `grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6`
                    : "space-y-4"
                }
              >
                {[...Array(6)].map((_, i) => (
                  <div
                    key={i}
                    className="bg-white rounded-lg border overflow-hidden"
                  >
                    <Skeleton className="h-64 w-full" />
                    <div className="p-6 space-y-4">
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-6 w-full" />
                        <Skeleton className="h-4 w-3/4" />
                      </div>
                      <div className="flex gap-2">
                        <Skeleton className="h-8 w-20" />
                        <Skeleton className="h-8 w-20" />
                      </div>
                      <Skeleton className="h-10 w-full" />
                    </div>
                  </div>
                ))}
              </div>
            ) : packs.length === 0 ? (
              <div className="text-center py-16">
                <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {t("packs.notFoundTitle")}
                </h3>
                <p className="text-gray-600 mb-6 max-w-md mx-auto">
                  {t("packs.notFoundDesc")}
                </p>
                <Button onClick={clearFilters} variant="outline">
                  {t("packs.clearFilters")}
                </Button>
              </div>
            ) : (
              <>
                <div
                  className={
                    viewMode === "grid"
                      ? `grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6`
                      : "space-y-4"
                  }
                >
                  {packs.map((pack) => (
                    <PackageCard
                      key={pack.id}
                      package={pack}
                      onConsultClick={() => { }}
                    />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="mt-8">
                    <Pagination
                      currentPage={currentPage}
                      totalPages={totalPages}
                      onPageChange={setCurrentPage}
                      pageSize={pageSize}
                      onPageSizeChange={setPageSize}
                      totalItems={totalPacks}
                      showPageSizeSelector={true}
                    />
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
