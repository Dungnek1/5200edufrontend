import React from "react";
import { Button } from "@/components/ui/button";
import { MoreVertical } from "lucide-react";
import type { Blog } from "@/services/apis/blog.service";
import { useTranslations } from "next-intl";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface TeacherBlogCardProps {
    blog: Blog;
    onEdit: (blog: Blog) => void;
    onDelete: (blogId: string) => void;
    onTogglePublish?: (blog: Blog) => void;
    onHide?: (blog: Blog) => void;
}

export const TeacherBlogCard: React.FC<TeacherBlogCardProps> = ({
    blog,
    onEdit,
    onDelete,
    onTogglePublish,
    onHide,
}) => {
    const t = useTranslations();

    return (
        <div className="group flex flex-col bg-white rounded-xl sm:rounded-2xl overflow-hidden shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_16px_rgba(0,0,0,0.08)] transition-all duration-300">
            <div className="relative overflow-hidden rounded-xl sm:rounded-2xl">
                <img
                    src={
                        blog.thumbnailUrl
                            ? `${process.env.NEXT_PUBLIC_MINIO}/${blog.thumbnailUrl}`
                            : "/images/placeholder.svg"
                    }
                    alt={blog.title}
                    className="w-full h-[200px] transform group-hover:scale-105 transition-transform duration-500"
                />

                <div className="absolute top-3 left-3">
                    <span className={`text-white text-xs sm:text-sm rounded-full shadow-sm tracking-wide flex items-center justify-center px-3 py-1 ${blog.status === "HIDDEN" ? "bg-[#6b7280]" : "bg-[#0A0BD9]"}`}>
                        {blog.status === "PUBLISHED" ? t("blog.status.published") : blog.status === "HIDDEN" ? t("blog.status.hidden") : t("blog.status.draft")}
                    </span>
                </div>
            </div>

            <div className="p-4 sm:p-5 flex flex-col flex-grow justify-between gap-[16px]">
                <h3 className="text-[#3B3D48] font-semibold text-[18px] sm:text-base leading-snug line-clamp-2 min-h-[2.5rem]">
                    {blog.title}
                </h3>

                {blog.tags && blog.tags.length > 0 && (
                    <div className="flex gap-1 flex-wrap">
                        {blog.tags.slice(0, 3).map((tag, idx) => (
                            <div
                                key={idx}
                                className="bg-[#8c92ac] px-2 py-0.5 rounded-full"
                            >
                                <p
                                    className="text-white text-xs leading-4 font-normal"
                                    style={{ fontFamily: "Roboto, sans-serif" }}
                                >
                                    {tag}
                                </p>
                            </div>
                        ))}
                    </div>
                )}

                <div className="flex gap-2 items-center justify-between h-[44px]">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onEdit(blog)}
                        className="flex-1 border-[#4162E7] text-[14px] text-[#4162E7] hover:bg-[#4162E7] hover:text-white transition-colors cursor-pointer"
                    >
                        {t("blog.actions.edit")}
                    </Button>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant="ghost"
                                className="h-10 w-10 p-2 rounded-[6px] hover:bg-[#eceffd] transition-colors cursor-pointer"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <MoreVertical className="h-4 w-4 text-[#4162e7]" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                            align="end"
                            className="w-[160px] rounded-[12px] shadow-lg border border-[#f4f4f7] p-1"
                        >
                            {onTogglePublish && (
                                <DropdownMenuItem
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onTogglePublish(blog);
                                    }}
                                    className="cursor-pointer text-[14px] font-medium rounded-[8px] px-3 py-2 hover:bg-[#eceffd] transition-colors"
                                >
                                    {blog.status === "PUBLISHED"
                                        ? t("blog.actions.unpublish")
                                        : t("blog.actions.publish")}
                                </DropdownMenuItem>
                            )}
                            {onHide && blog.status !== "HIDDEN" && (
                                <DropdownMenuItem
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onHide(blog);
                                    }}
className="cursor-pointer text-[14px] font-medium rounded-[8px] px-3 py-2 hover:bg-[#eceffd] transition-colors"
                                >
                                {t("blog.actions.hide")}
                                </DropdownMenuItem>
                            )}
                            <DropdownMenuItem
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onDelete(blog.id);
                                }}
className="cursor-pointer text-[14px] font-medium rounded-[8px] px-3 py-2 text-red-600 hover:bg-red-50 transition-colors"
                            >
                            {t("blog.actions.delete")}
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
        </div>
    );
}
