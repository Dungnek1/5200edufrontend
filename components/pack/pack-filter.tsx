"use client";

import { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { X, ChevronDown, ChevronUp, User } from 'lucide-react';
import type { PackFilters } from '@/types/pack';

interface FilterOption {
  categories: string[];
  levels: string[];
  teachers: string[];
  priceRanges: Array<{
    label: string;
    value: string;
  }>;
}

interface PackFilterProps {
  filters: FilterOption;
  selectedFilters: PackFilters;
  onFilterChange: (filters: Partial<PackFilters>) => void;
}

export function PackFilter({ filters, selectedFilters, onFilterChange }: PackFilterProps) {
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    categories: true,
    levels: true,
    teachers: false,
    priceRanges: false
  });

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const toggleCategory = (category: string) => {
    const newCategory = selectedFilters.category === category ? '' : category;
    onFilterChange({ category: newCategory });
  };

  const toggleLevel = (level: string) => {
    const newLevel = selectedFilters.level === level ? '' : level;
    onFilterChange({ level: newLevel });
  };

  const toggleTeacher = (teacher: string) => {
    const newTeacher = selectedFilters.teacher === teacher ? '' : teacher;
    onFilterChange({ teacher: newTeacher });
  };

  const togglePriceRange = (priceRange: string) => {
    const newPriceRange = selectedFilters.priceRange === priceRange ? '' : priceRange;
    onFilterChange({ priceRange: newPriceRange });
  };

  const clearAllFilters = () => {
    onFilterChange({
      category: '',
      level: '',
      teacher: '',
      priceRange: ''
    });
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (selectedFilters.category) count++;
    if (selectedFilters.level) count++;
    if (selectedFilters.teacher) count++;
    if (selectedFilters.priceRange) count++;
    return count;
  };

  const levelLabels = {
    'beginner': 'Cơ bản',
    'intermediate': 'Trung bình',
    'advanced': 'Nâng cao'
  };

  return (
    <div className="space-y-6">
      {/* Clear Filters */}
      {getActiveFiltersCount() > 0 && (
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">
            {getActiveFiltersCount()} bộ lọc đang hoạt động
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={clearAllFilters}
            className="text-blue-600 hover:text-blue-700 h-auto p-0"
          >
            <X className="h-4 w-4 mr-1" />
            Xóa tất cả
          </Button>
        </div>
      )}

      {/* Categories Section */}
      <div className="space-y-3">
        <button
          onClick={() => toggleSection('categories')}
          className="flex items-center justify-between w-full text-left hover:text-gray-700 transition-colors"
        >
          <Label className="font-medium text-gray-900 cursor-pointer">
            Danh mục
          </Label>
          {expandedSections.categories ? (
            <ChevronUp className="h-4 w-4 text-gray-500" />
          ) : (
            <ChevronDown className="h-4 w-4 text-gray-500" />
          )}
        </button>

        {expandedSections.categories && (
          <div className="space-y-2 pt-2">
            {filters.categories.map((category) => (
              <div key={category} className="flex items-center space-x-2">
                <Checkbox
                  id={`category-${category}`}
                  checked={selectedFilters.category === category}
                  onCheckedChange={() => toggleCategory(category)}
                />
                <Label
                  htmlFor={`category-${category}`}
                  className="text-sm font-normal cursor-pointer flex-1"
                >
                  {category}
                </Label>
              </div>
            ))}
          </div>
        )}
      </div>

      <Separator />

      {/* Levels Section */}
      <div className="space-y-3">
        <button
          onClick={() => toggleSection('levels')}
          className="flex items-center justify-between w-full text-left hover:text-gray-700 transition-colors"
        >
          <Label className="font-medium text-gray-900 cursor-pointer">
            Cấp độ
          </Label>
          {expandedSections.levels ? (
            <ChevronUp className="h-4 w-4 text-gray-500" />
          ) : (
            <ChevronDown className="h-4 w-4 text-gray-500" />
          )}
        </button>

        {expandedSections.levels && (
          <div className="space-y-2 pt-2">
            {filters.levels.map((level) => (
              <div key={level} className="flex items-center space-x-2">
                <Checkbox
                  id={`level-${level}`}
                  checked={selectedFilters.level === level}
                  onCheckedChange={() => toggleLevel(level)}
                />
                <Label
                  htmlFor={`level-${level}`}
                  className="text-sm font-normal cursor-pointer flex-1 capitalize"
                >
                  {levelLabels[level as keyof typeof levelLabels] || level}
                </Label>
              </div>
            ))}
          </div>
        )}
      </div>

      <Separator />

      {/* Teachers Section */}
      <div className="space-y-3">
        <button
          onClick={() => toggleSection('teachers')}
          className="flex items-center justify-between w-full text-left hover:text-gray-700 transition-colors"
        >
          <Label className="font-medium text-gray-900 cursor-pointer">
            Giảng viên
          </Label>
          {expandedSections.teachers ? (
            <ChevronUp className="h-4 w-4 text-gray-500" />
          ) : (
            <ChevronDown className="h-4 w-4 text-gray-500" />
          )}
        </button>

        {expandedSections.teachers && (
          <div className="space-y-2 pt-2">
            {filters.teachers.map((teacher) => (
              <div key={teacher} className="flex items-center space-x-2">
                <Checkbox
                  id={`teacher-${teacher}`}
                  checked={selectedFilters.teacher === teacher}
                  onCheckedChange={() => toggleTeacher(teacher)}
                />
                <Label
                  htmlFor={`teacher-${teacher}`}
                  className="text-sm font-normal cursor-pointer flex-1"
                >
                  {teacher}
                </Label>
              </div>
            ))}
          </div>
        )}
      </div>

      <Separator />

      {/* Price Range Section */}
      <div className="space-y-3">
        <button
          onClick={() => toggleSection('priceRanges')}
          className="flex items-center justify-between w-full text-left hover:text-gray-700 transition-colors"
        >
          <Label className="font-medium text-gray-900 cursor-pointer">
            Mức giá
          </Label>
          {expandedSections.priceRanges ? (
            <ChevronUp className="h-4 w-4 text-gray-500" />
          ) : (
            <ChevronDown className="h-4 w-4 text-gray-500" />
          )}
        </button>

        {expandedSections.priceRanges && (
          <div className="space-y-2 pt-2">
            {filters.priceRanges.map((range) => (
              <div key={range.value} className="flex items-center space-x-2">
                <Checkbox
                  id={`price-${range.value}`}
                  checked={selectedFilters.priceRange === range.value}
                  onCheckedChange={() => togglePriceRange(range.value)}
                />
                <Label
                  htmlFor={`price-${range.value}`}
                  className="text-sm font-normal cursor-pointer flex-1"
                >
                  {range.label}
                </Label>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Active Filters Summary */}
      {getActiveFiltersCount() > 0 && (
        <>
          <Separator />
          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-700">
              Đã chọn:
            </Label>
            <div className="flex flex-wrap gap-2">
              {selectedFilters.category && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  {selectedFilters.category}
                  <button
                    onClick={() => selectedFilters.category && toggleCategory(selectedFilters.category)}
                    className="ml-1 hover:text-gray-700"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              )}
              {selectedFilters.level && (
                <Badge variant="secondary" className="flex items-center gap-1 capitalize">
                  {levelLabels[selectedFilters.level as keyof typeof levelLabels] || selectedFilters.level}
                  <button
                    onClick={() => selectedFilters.level && toggleLevel(selectedFilters.level)}
                    className="ml-1 hover:text-gray-700"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              )}
              {selectedFilters.teacher && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  {selectedFilters.teacher}
                  <button
                    onClick={() => selectedFilters.teacher && toggleTeacher(selectedFilters.teacher)}
                    className="ml-1 hover:text-gray-700"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              )}
              {selectedFilters.priceRange && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  {filters.priceRanges.find(r => r.value === selectedFilters.priceRange)?.label}
                  <button
                    onClick={() => togglePriceRange(selectedFilters.priceRange!)}
                    className="ml-1 hover:text-gray-700"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}