"use client";

import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, X, Clock, TrendingUp } from 'lucide-react';
import { useDebounce } from '@/hooks/useDebounce';
import { useTranslations } from 'next-intl';

interface CourseSearchProps {
  value?: string;
  onChange?: (value: string) => void;
  onSearch?: (value: string) => void;
  placeholder?: string;
  showSuggestions?: boolean;
  className?: string;
}

interface SearchSuggestion {
  id: string;
  text: string;
  type: 'recent' | 'trending' | 'suggestion';
  count?: number;
}

export function CourseSearch({
  value = '',
  onChange,
  onSearch,
  placeholder,
  showSuggestions = true,
  className = ""
}: CourseSearchProps) {
  const tCommon = useTranslations('common');
  const tSearch = useTranslations('search');
  const [searchTerm, setSearchTerm] = useState(value);
  const [isFocused, setIsFocused] = useState(false);
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);

  const mockSuggestions: SearchSuggestion[] = [
    { id: '1', text: 'AI Automation', type: 'trending', count: 1250 },
    { id: '2', text: 'Marketing Automation', type: 'trending', count: 890 },
    { id: '3', text: 'F&B Management', type: 'trending', count: 650 },
    { id: '4', text: 'Quản lý nhà hàng', type: 'recent' },
    { id: '5', text: 'Tính Food Cost', type: 'recent' },
    { id: '6', text: 'Dashboard tự động', type: 'suggestion' },
    { id: '7', text: 'Email Marketing', type: 'suggestion' },
    { id: '8', text: 'Social Media Automation', type: 'suggestion' },
  ];

  const debouncedSearch = useDebounce(searchTerm, 300);

  useEffect(() => {
    setSearchTerm(value);
  }, [value]);

  useEffect(() => {
    if (debouncedSearch && showSuggestions) {
      const filtered = mockSuggestions.filter(suggestion =>
        suggestion.text.toLowerCase().includes(debouncedSearch.toLowerCase())
      ).slice(0, 5);
      setSuggestions(filtered);
    } else if (showSuggestions) {
      const defaultSuggestions = mockSuggestions
        .filter(s => s.type === 'trending')
        .slice(0, 5);
      setSuggestions(defaultSuggestions);
    } else {
      setSuggestions([]);
    }
  }, [debouncedSearch, showSuggestions]);

  useEffect(() => {
    if (onSearch && debouncedSearch !== value) {
      onSearch(debouncedSearch);
    }
  }, [debouncedSearch]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setSearchTerm(newValue);
    if (onChange) {
      onChange(newValue);
    }
  };

  const handleSuggestionClick = (suggestion: SearchSuggestion) => {
    setSearchTerm(suggestion.text);
    setIsFocused(false);
    if (onChange) {
      onChange(suggestion.text);
    }
    if (onSearch) {
      onSearch(suggestion.text);
    }
  };

  const handleClear = () => {
    setSearchTerm('');
    setIsFocused(false);
    if (onChange) {
      onChange('');
    }
    if (onSearch) {
      onSearch('');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsFocused(false);
    if (onSearch) {
      onSearch(searchTerm);
    }
  };

  const getSuggestionIcon = (type: SearchSuggestion['type']) => {
    switch (type) {
      case 'recent':
        return <Clock className="h-4 w-4 text-gray-400" />;
      case 'trending':
        return <TrendingUp className="h-4 w-4 text-orange-500" />;
      default:
        return <Search className="h-4 w-4 text-gray-400" />;
    }
  };

  const getSuggestionLabel = (type: SearchSuggestion['type']) => {
    switch (type) {
      case 'recent':
        return tSearch("recent");
      case 'trending':
        return tSearch("trending");
      default:
        return tSearch("suggestion");
    }
  };

  return (
    <div className={`relative ${className}`}>
      <form onSubmit={handleSubmit}>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 pointer-events-none" />
          <Input
            type="text"
            placeholder={placeholder ?? tSearch("coursePlaceholder")}
            value={searchTerm}
            onChange={handleInputChange}
            onFocus={() => setIsFocused(true)}
            onBlur={() => {
              setTimeout(() => setIsFocused(false), 200);
            }}
            className="pl-10 pr-10"
          />
          {searchTerm && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleClear}
              className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0 hover:bg-[#eceffd]"
            >
              <X className="h-4 w-4 text-gray-500" />
            </Button>
          )}
        </div>
      </form>

      {/* Suggestions Dropdown */}
      {showSuggestions && isFocused && suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-80 overflow-y-auto">
          <div className="p-2">
            {/* Group suggestions by type */}
            {['trending', 'recent', 'suggestion'].map(type => {
              const typeSuggestions = suggestions.filter(s => s.type === type);
              if (typeSuggestions.length === 0) return null;

              return (
                <div key={type} className="mb-2 last:mb-0">
                  <div className="px-2 py-1">
                    <Badge variant="outline" className="text-xs">
                      {getSuggestionLabel(type as SearchSuggestion['type'])}
                    </Badge>
                  </div>
                  {typeSuggestions.map((suggestion) => (
                    <button
                      key={suggestion.id}
                      type="button"
                      onClick={() => handleSuggestionClick(suggestion)}
                      className="w-full flex items-center gap-3 px-3 py-2 text-left hover:bg-[#eceffd] rounded-md transition-colors"
                    >
                      {getSuggestionIcon(suggestion.type)}
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-gray-900 truncate">
                          {suggestion.text}
                        </div>
                        {suggestion.count && (
                          <div className="text-xs text-gray-500">
                            {tSearch("courseCount", { count: suggestion.count.toLocaleString() })}
                          </div>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Recent Searches Display */}
      {showSuggestions && !isFocused && searchTerm === '' && false && (
        <div className="mt-3">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm font-medium text-gray-700">{tSearch("recentSearches")}</h4>
            <Button variant="ghost" size="sm" className="text-xs text-gray-500 h-auto p-0">
              {tCommon('clearAll')}
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {mockSuggestions
              .filter(s => s.type === 'recent')
              .slice(0, 5)
              .map((suggestion) => (
                <Badge
                  key={suggestion.id}
                  variant="secondary"
                  className="cursor-pointer hover:bg-gray-200"
                  onClick={() => handleSuggestionClick(suggestion)}
                >
                  {suggestion.text}
                </Badge>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}