"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sparkles,
  Zap,
  Image as ImageIcon,
  MessageSquare,
  Code,
  Video,
  Music,
  ExternalLink,
  Star,
  TrendingUp,
  Search,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

export type AIToolCategory =
  | "all"
  | "chatgpt"
  | "midjourney"
  | "dall-e"
  | "stable-diffusion"
  | "claude"
  | "gemini"
  | "code"
  | "video"
  | "audio";

interface AITool {
  id: string;
  name: string;
  description: string;
  category: AIToolCategory;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
  link: string;
  featured?: boolean;
  trending?: boolean;
  rating?: number;
}

const categories: Array<{
  id: AIToolCategory;
  label: string;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
}> = [
  {
    id: "all",
    label: "Tất cả",
    icon: <Sparkles className="h-4 w-4" />,
    color: "text-[#3b3d48]",
    bgColor: "bg-[#fafafa]",
  },
  {
    id: "chatgpt",
    label: "ChatGPT",
    icon: <MessageSquare className="h-4 w-4" />,
    color: "text-[#10a37f]",
    bgColor: "bg-[#d1fae5]",
  },
  {
    id: "midjourney",
    label: "Midjourney",
    icon: <ImageIcon className="h-4 w-4" />,
    color: "text-[#a855f7]",
    bgColor: "bg-[#f3e8ff]",
  },
  {
    id: "dall-e",
    label: "DALL-E",
    icon: <ImageIcon className="h-4 w-4" />,
    color: "text-[#3b82f6]",
    bgColor: "bg-[#dbeafe]",
  },
  {
    id: "stable-diffusion",
    label: "Stable Diffusion",
    icon: <ImageIcon className="h-4 w-4" />,
    color: "text-[#f97316]",
    bgColor: "bg-[#fed7aa]",
  },
  {
    id: "claude",
    label: "Claude",
    icon: <MessageSquare className="h-4 w-4" />,
    color: "text-[#8b5cf6]",
    bgColor: "bg-[#ede9fe]",
  },
  {
    id: "gemini",
    label: "Gemini",
    icon: <Zap className="h-4 w-4" />,
    color: "text-[#06b6d4]",
    bgColor: "bg-[#cffafe]",
  },
  {
    id: "code",
    label: "Code AI",
    icon: <Code className="h-4 w-4" />,
    color: "text-[#6366f1]",
    bgColor: "bg-[#e0e7ff]",
  },
  {
    id: "video",
    label: "Video AI",
    icon: <Video className="h-4 w-4" />,
    color: "text-[#ec4899]",
    bgColor: "bg-[#fce7f3]",
  },
  {
    id: "audio",
    label: "Audio AI",
    icon: <Music className="h-4 w-4" />,
    color: "text-[#14b8a6]",
    bgColor: "bg-[#ccfbf1]",
  },
];

const mockTools: AITool[] = [
  {
    id: "1",
    name: "ChatGPT 4.0",
    description: "Trợ lý AI thông minh cho việc viết nội dung, phân tích và trả lời câu hỏi",
    category: "chatgpt",
    icon: <MessageSquare className="h-6 w-6" />,
    color: "text-[#10a37f]",
    bgColor: "bg-[#d1fae5]",
    link: "#",
    featured: true,
    trending: true,
    rating: 4.9,
  },
  {
    id: "2",
    name: "Midjourney",
    description: "Tạo hình ảnh nghệ thuật từ text prompts với chất lượng cao",
    category: "midjourney",
    icon: <ImageIcon className="h-6 w-6" />,
    color: "text-[#a855f7]",
    bgColor: "bg-[#f3e8ff]",
    link: "#",
    featured: true,
    rating: 4.8,
  },
  {
    id: "3",
    name: "DALL-E 3",
    description: "Tạo hình ảnh từ mô tả văn bản với độ chính xác cao",
    category: "dall-e",
    icon: <ImageIcon className="h-6 w-6" />,
    color: "text-[#3b82f6]",
    bgColor: "bg-[#dbeafe]",
    link: "#",
    trending: true,
    rating: 4.7,
  },
  {
    id: "4",
    name: "Stable Diffusion",
    description: "Công cụ AI mã nguồn mở để tạo hình ảnh từ text",
    category: "stable-diffusion",
    icon: <ImageIcon className="h-6 w-6" />,
    color: "text-[#f97316]",
    bgColor: "bg-[#fed7aa]",
    link: "#",
    rating: 4.6,
  },
  {
    id: "5",
    name: "Claude AI",
    description: "Trợ lý AI mạnh mẽ cho phân tích và viết nội dung",
    category: "claude",
    icon: <MessageSquare className="h-6 w-6" />,
    color: "text-[#8b5cf6]",
    bgColor: "bg-[#ede9fe]",
    link: "#",
    rating: 4.8,
  },
  {
    id: "6",
    name: "GitHub Copilot",
    description: "Trợ lý lập trình AI giúp viết code nhanh hơn",
    category: "code",
    icon: <Code className="h-6 w-6" />,
    color: "text-[#6366f1]",
    bgColor: "bg-[#e0e7ff]",
    link: "#",
    featured: true,
    rating: 4.9,
  },
];

export default function AIToolsPage() {
  const t = useTranslations("teacher.dashboard.aiTools");
  const [activeCategory, setActiveCategory] = useState<AIToolCategory>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredTools = mockTools.filter((tool) => {
    if (activeCategory !== "all" && tool.category !== activeCategory) {
      return false;
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      return (
        tool.name.toLowerCase().includes(query) ||
        tool.description.toLowerCase().includes(query)
      );
    }

    return true;
  });

  return (
    <>
      <div className="bg-gradient-to-b from-[#fafafa] to-white min-h-screen">
        <div className="max-w-[1990px] mx-auto px-[64px] py-[32px] pb-[60px]">
          {/* Header Section */}
          <div className="mb-[32px]">
            <div className="flex items-center gap-[12px] mb-[12px]">
              <div className="h-[48px] w-[48px] rounded-[12px] bg-gradient-to-br from-[#4162e7] to-[#8b5cf6] flex items-center justify-center shadow-lg">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1
                  className="text-[32px] font-medium leading-[40px] text-[#0f172a]"
                  style={{ fontFamily: "Roboto, sans-serif", fontWeight: 500 }}
                >
                  Công cụ AI
                </h1>
              </div>
            </div>
            <p
              className="text-[16px] leading-[24px] text-[#7f859d] max-w-2xl"
              style={{ fontFamily: "Roboto, sans-serif", fontWeight: 400 }}
            >
              Khám phá và sử dụng các công cụ AI mạnh mẽ để nâng cao hiệu quả giảng dạy và tạo nội dung
            </p>
          </div>

          {/* Search Bar */}
          <div className="mb-[28px] relative max-w-[800px]">
            <Search className="absolute left-[20px] top-1/2 -translate-y-1/2 h-5 w-5 text-[#7f859d] z-10" />
            <Input
              type="text"
              placeholder={t("searchPlaceholder")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-[52px] pl-[56px] pr-[56px] bg-white border border-[#e5e7eb] rounded-[12px] text-[15px] leading-[22px] text-[#3b3d48] placeholder:text-[#7f859d] focus-visible:ring-2 focus-visible:ring-[#4162e7] focus-visible:ring-offset-2 focus-visible:border-[#4162e7] shadow-sm hover:shadow-md transition-all"
              style={{ fontFamily: "Roboto, sans-serif", fontWeight: 400 }}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-[20px] top-1/2 -translate-y-1/2 h-6 w-6 text-[#7f859d] hover:text-[#3b3d48] hover:bg-[#eceffd] rounded-full transition-all flex items-center justify-center cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-[10px] mb-[40px] overflow-x-auto scrollbar-hide pb-[6px]">
            {categories.map((category) => {
              const isActive = activeCategory === category.id;
              return (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={cn(
                    "flex items-center gap-[10px] px-[20px] py-[10px] rounded-[10px] transition-all whitespace-nowrap cursor-pointer",
                    isActive
                      ? `${category.bgColor} ${category.color} shadow-md scale-105`
                      : "bg-white text-[#3b3d48] hover:bg-[#eceffd] border border-[#e5e7eb] hover:border-[#d1d5db] shadow-sm"
                  )}
                  style={{ fontFamily: "Roboto, sans-serif", fontWeight: 500 }}
                >
                  <span className={cn(isActive ? category.color : "text-[#7f859d]")}>
                    {category.icon}
                  </span>
                  <span className="text-[14px] leading-[20px] font-medium">{category.label}</span>
                </button>
              );
            })}
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-4 gap-[16px] mb-[40px]">
            <Card className="bg-white p-[24px] rounded-[16px] border border-[#e5e7eb] shadow-sm hover:shadow-md transition-all">
              <div className="flex items-center gap-[16px]">
                <div className="h-[52px] w-[52px] rounded-[12px] bg-gradient-to-br from-[#eceffd] to-[#dbeafe] flex items-center justify-center shadow-sm">
                  <Sparkles className="h-6 w-6 text-[#4162e7]" />
                </div>
                <div>
                  <p
                    className="text-[13px] leading-[18px] text-[#7f859d] mb-[4px]"
                    style={{ fontFamily: "Roboto, sans-serif", fontWeight: 400 }}
                  >
                    Tổng công cụ
                  </p>
                  <p
                    className="text-[28px] font-semibold leading-[36px] text-[#0f172a]"
                    style={{ fontFamily: "Roboto, sans-serif", fontWeight: 600 }}
                  >
                    {mockTools.length}
                  </p>
                </div>
              </div>
            </Card>
            <Card className="bg-white p-[24px] rounded-[16px] border border-[#e5e7eb] shadow-sm hover:shadow-md transition-all">
              <div className="flex items-center gap-[16px]">
                <div className="h-[52px] w-[52px] rounded-[12px] bg-gradient-to-br from-[#fef3c7] to-[#fde68a] flex items-center justify-center shadow-sm">
                  <Star className="h-6 w-6 text-[#f59e0b]" />
                </div>
                <div>
                  <p
                    className="text-[13px] leading-[18px] text-[#7f859d] mb-[4px]"
                    style={{ fontFamily: "Roboto, sans-serif", fontWeight: 400 }}
                  >
                    Nổi bật
                  </p>
                  <p
                    className="text-[28px] font-semibold leading-[36px] text-[#0f172a]"
                    style={{ fontFamily: "Roboto, sans-serif", fontWeight: 600 }}
                  >
                    {mockTools.filter((t) => t.featured).length}
                  </p>
                </div>
              </div>
            </Card>
            <Card className="bg-white p-[24px] rounded-[16px] border border-[#e5e7eb] shadow-sm hover:shadow-md transition-all">
              <div className="flex items-center gap-[16px]">
                <div className="h-[52px] w-[52px] rounded-[12px] bg-gradient-to-br from-[#fce7f3] to-[#fbcfe8] flex items-center justify-center shadow-sm">
                  <TrendingUp className="h-6 w-6 text-[#ec4899]" />
                </div>
                <div>
                  <p
                    className="text-[13px] leading-[18px] text-[#7f859d] mb-[4px]"
                    style={{ fontFamily: "Roboto, sans-serif", fontWeight: 400 }}
                  >
                    Đang hot
                  </p>
                  <p
                    className="text-[28px] font-semibold leading-[36px] text-[#0f172a]"
                    style={{ fontFamily: "Roboto, sans-serif", fontWeight: 600 }}
                  >
                    {mockTools.filter((t) => t.trending).length}
                  </p>
                </div>
              </div>
            </Card>
            <Card className="bg-white p-[24px] rounded-[16px] border border-[#e5e7eb] shadow-sm hover:shadow-md transition-all">
              <div className="flex items-center gap-[16px]">
                <div className="h-[52px] w-[52px] rounded-[12px] bg-gradient-to-br from-[#d1fae5] to-[#a7f3d0] flex items-center justify-center shadow-sm">
                  <Zap className="h-6 w-6 text-[#10a37f]" />
                </div>
                <div>
                  <p
                    className="text-[13px] leading-[18px] text-[#7f859d] mb-[4px]"
                    style={{ fontFamily: "Roboto, sans-serif", fontWeight: 400 }}
                  >
                    Đã sử dụng
                  </p>
                  <p
                    className="text-[28px] font-semibold leading-[36px] text-[#0f172a]"
                    style={{ fontFamily: "Roboto, sans-serif", fontWeight: 600 }}
                  >
                    12
                  </p>
                </div>
              </div>
            </Card>
          </div>

          {/* Tools Grid */}
          {filteredTools.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[24px]">
              {filteredTools.map((tool) => (
                <Card
                  key={tool.id}
                  className="bg-white rounded-[16px] border border-[#e5e7eb] shadow-sm p-[28px] hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group cursor-pointer"
                >
                  {/* Header */}
                  <div className="flex items-start justify-between mb-[20px]">
                    <div className="flex items-start gap-[16px] flex-1">
                      <div
                        className={cn(
                          "h-[56px] w-[56px] rounded-[14px] flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300",
                          tool.bgColor
                        )}
                      >
                        <span className={tool.color}>{tool.icon}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start gap-[8px] mb-[6px] flex-wrap">
                          <h3
                            className="text-[20px] font-semibold leading-[28px] text-[#0f172a] group-hover:text-[#4162e7] transition-colors"
                            style={{ fontFamily: "Roboto, sans-serif", fontWeight: 600 }}
                          >
                            {tool.name}
                          </h3>
                          <div className="flex items-center gap-[6px] flex-shrink-0">
                            {tool.featured && (
                              <Badge className="bg-gradient-to-r from-[#fef3c7] to-[#fde68a] text-[#f59e0b] border-0 px-[10px] py-[4px] text-[11px] font-semibold shadow-sm">
                                ⭐ Nổi bật
                              </Badge>
                            )}
                            {tool.trending && (
                              <Badge className="bg-gradient-to-r from-[#fce7f3] to-[#fbcfe8] text-[#ec4899] border-0 px-[10px] py-[4px] text-[11px] font-semibold shadow-sm">
                                🔥 Hot
                              </Badge>
                            )}
                          </div>
                        </div>
                        {tool.rating && (
                          <div className="flex items-center gap-[6px]">
                            <div className="flex items-center">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={cn(
                                    "h-4 w-4",
                                    i < Math.floor(tool.rating || 0)
                                      ? "text-[#fbbf24] fill-[#fbbf24]"
                                      : "text-[#e5e7eb]"
                                  )}
                                />
                              ))}
                            </div>
                            <span
                              className="text-[14px] leading-[20px] text-[#7f859d] font-medium"
                              style={{ fontFamily: "Roboto, sans-serif", fontWeight: 500 }}
                            >
                              {tool.rating}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  <p
                    className="text-[15px] leading-[22px] text-[#7f859d] mb-[24px] line-clamp-3 min-h-[66px]"
                    style={{ fontFamily: "Roboto, sans-serif", fontWeight: 400 }}
                  >
                    {tool.description}
                  </p>

                  {/* Action Button */}
                  <Button
                    className="w-full h-[48px] bg-gradient-to-r from-[#4162e7] to-[#3b59d2] hover:from-[#3b59d2] hover:to-[#3451b8] text-white rounded-[10px] shadow-md hover:shadow-lg transition-all duration-300 group-hover:scale-[1.02]"
                    style={{ fontFamily: "Roboto, sans-serif", fontWeight: 500 }}
                  >
                    <span className="text-[15px] leading-[22px] mr-[10px] font-medium">
                      Sử dụng ngay
                    </span>
                    <ExternalLink className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-[80px]">
              <Sparkles className="h-16 w-16 text-[#7f859d] mx-auto mb-[16px]" />
              <p
                className="text-[18px] font-medium leading-[26px] text-[#3b3d48] mb-[8px]"
                style={{ fontFamily: "Roboto, sans-serif", fontWeight: 500 }}
              >
                Không tìm thấy công cụ nào
              </p>
              <p
                className="text-[14px] leading-[20px] text-[#7f859d]"
                style={{ fontFamily: "Roboto, sans-serif", fontWeight: 400 }}
              >
                Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

