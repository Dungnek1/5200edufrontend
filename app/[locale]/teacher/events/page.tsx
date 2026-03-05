"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Plus, BookOpen } from "lucide-react";
import { blogService, type Blog } from "@/services/apis/blog.service";
import { BlogSearchFilter } from "@/components/teacher/blogs/blog-search-filter";
import { TeacherBlogCard } from "@/components/teacher/blogs/teacher-blog-card";
import { BlogForm } from "@/components/teacher/blogs/blog-form";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function TeacherEventsPage() {
    const params = useParams();
    const locale = (params.locale as string) || "vi";
    const t = useTranslations();

    const [view, setView] = useState<"list" | "create" | "edit">("list");
    const [blogs, setBlogs] = useState<Blog[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState<string>("all");
    const [editingBlog, setEditingBlog] = useState<Blog | null>(null);
    const [deletingBlogId, setDeletingBlogId] = useState<string | null>(null);

    const fetchBlogs = async () => {
        try {
            setLoading(true);
            const response = await blogService.getMyBlogs({
                status: statusFilter === "all" ? undefined : (statusFilter as "DRAFT" | "PUBLISHED" | "HIDDEN"),
            });
            //@ts-ignore
            if (response.success) {
                //@ts-ignore
                setBlogs(response.data.blogs);
            }
        } catch (error) {
            toast.error(t("blog.errors.fetchFailed"));
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBlogs();
    }, [statusFilter]);

    const filteredBlogs = blogs.filter((blog) => {
        const matchesSearch =
            !searchQuery ||
            blog.title.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesSearch;
    });

    const handleCreateBlog = () => {
        setView("create");
    };

    const handleEditBlog = (blog: Blog) => {
        setEditingBlog(blog);
        setView("edit");
    };

    const handleDeleteBlog = (blogId: string) => {
        setDeletingBlogId(blogId);
    };

    const confirmDeleteBlog = async () => {
        if (!deletingBlogId) return;
        try {
            await blogService.deleteBlog(deletingBlogId);
            toast.success(t("blog.deleted"));
            fetchBlogs();
        } catch (error) {
            toast.error(t("blog.errors.deleteFailed"));
        } finally {
            setDeletingBlogId(null);
        }
    };

    const handleFormSuccess = () => {
        setView("list");
        setEditingBlog(null);
        fetchBlogs();
    };

    const handleTogglePublish = async (blog: Blog) => {
        try {
            if (blog.status === "PUBLISHED") {
                await blogService.unpublishBlog(blog.id);
                toast.success(t("blog.unpublished"));
            } else {
                await blogService.publishBlog(blog.id);
                toast.success(t("blog.published"));
            }
            fetchBlogs();
        } catch (error) {
            toast.error(t("blog.errors.publishFailed"));
        }
    };

    const handleHideBlog = async (blog: Blog) => {
        try {
            await blogService.hideBlog(blog.id);
            toast.success(t("blog.hidden"));
            fetchBlogs();
        } catch (error) {
            toast.error(t("blog.errors.hideFailed"));
        }
    };

    const handleFormCancel = () => {
        setView("list");
        setEditingBlog(null);
    };

    if (view === "create") {
        return <BlogForm mode="create" onCancel={handleFormCancel} onSuccess={handleFormSuccess} />;
    }

    if (view === "edit" && editingBlog) {
        return (
            <BlogForm
                mode="edit"
                blog={editingBlog}
                onCancel={handleFormCancel}
                onSuccess={handleFormSuccess}
            />
        );
    }

    return (
        <main className="min-h-screen bg-white">
            <div className="bg-white mx-auto max-w-[1990px] w-full px-4 sm:px-6 md:px-8 lg:px-[64px] py-4 sm:py-5 md:py-[20px] pb-6 sm:pb-8 md:pb-[40px] flex flex-col gap-4 sm:gap-6 lg:gap-[28px]">
                <div className="flex flex-col gap-4 md:gap-5 lg:gap-[20px]">
                    <div className="flex flex-col md:flex-row md:items-center justify-between w-full gap-3 md:gap-4">
                        <h1 className="text-xl leading-6 md:text-2xl md:leading-7 lg:text-[30px] lg:leading-[38px] font-medium text-[#0f172a]">
                            {t("blog.manage.title")}
                        </h1>
                        <Button
                            onClick={handleCreateBlog}
                            className="bg-[#4162e7] text-white hover:bg-[#3554d4] font-medium px-3 sm:px-4 lg:px-[16px] py-2 sm:py-[8px] h-[40px] sm:h-[44px] rounded-lg sm:rounded-[6px] w-full sm:w-auto cursor-pointer"
                        >
                            <div className="flex gap-2 sm:gap-[4px] items-center justify-center">
                                <Plus className="h-4 w-4 sm:h-5 sm:w-5" />
                                <span className="text-xs sm:text-sm lg:text-[14px] leading-4 sm:leading-5 lg:leading-[20px] font-medium">
                                    {t("blog.actions.create")}
                                </span>
                            </div>
                        </Button>
                    </div>

                    <BlogSearchFilter
                        searchQuery={searchQuery}
                        onSearchChange={setSearchQuery}
                        statusFilter={statusFilter}
                        onStatusChange={setStatusFilter}
                    />
                </div>

                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#4162e7]"></div>
                    </div>
                ) : filteredBlogs.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                        <div className="h-16 w-16 bg-white rounded-full flex items-center justify-center shadow-sm mb-4">
                            <BookOpen className="h-8 w-8 text-[#94a3b8]" />
                        </div>
                        <p className="text-lg font-medium text-[#334155] mb-1">
                            {t("blog.manage.noBlogsTitle")}
                        </p>
                        <p className="text-sm text-[#64748b]">
                            {searchQuery || statusFilter !== "all"
                                ? t("blog.manage.noMatchingBlogs")
                                : t("blog.manage.createFirstBlog")}
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-5 lg:gap-6">
                        {filteredBlogs.map((blog) => (
                            <TeacherBlogCard
                                key={blog.id}
                                blog={blog}
                                onEdit={handleEditBlog}
                                onDelete={handleDeleteBlog}
                                onTogglePublish={handleTogglePublish}
                                onHide={handleHideBlog}
                            />
                        ))}
                    </div>
                )}
            </div>

            <AlertDialog open={!!deletingBlogId} onOpenChange={(open: any) => !open && setDeletingBlogId(null)}>
                <AlertDialogContent className="rounded-[16px]">
                    <AlertDialogHeader>
                        <AlertDialogTitle>{t("blog.confirmDeleteTitle")}</AlertDialogTitle>
                        <AlertDialogDescription>{t("blog.confirmDelete")}</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel className="rounded-[8px] cursor-pointer">{t("blog.cancelDelete")}</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={confirmDeleteBlog}
                            className="bg-red-600 hover:bg-red-700 rounded-[8px] cursor-pointer"
                        >
                            {t("blog.actions.delete")}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </main>
    );
}
