"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import { Bell } from "lucide-react";
import { useClickOutside } from "@/hooks/useClickOutside";
import { useDeviceType } from "@/hooks/useDeviceType";
import notificationService from "@/services/apis/notification.service";
import { useTranslations } from "next-intl";

interface NotificationDropdownProps {
    locale?: string;
}

function sanitizeHtml(raw: string): string {

    try {
        const cleaned = JSON.parse('"' + raw.replace(/"/g, '\\"').replace(/\n/g, "\\n") + '"');
        return cleaned;
    } catch {
        return raw.replace(/\\n/g, " ").replace(/\n/g, " ");
    }
}

export function NotificationDropdown({ locale = "vi" }: NotificationDropdownProps) {
    const tCommon = useTranslations("common");
    const [open, setOpen] = useState(false);
    const [notifications, setNotifications] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);
    const [fetched, setFetched] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null!);
    const { isMobile, isTablet } = useDeviceType();
    const isMobileOrTablet = isMobile || isTablet;

    const handleClose = useCallback(() => setOpen(false), []);
    useClickOutside(containerRef, handleClose);

    const fetchNotifications = useCallback(async () => {
        if (loading) return;
        setLoading(true);
        try {
            const res = await notificationService.getNotifications({
                limit: 5,
                page: 1,
                locale: locale === "vi" ? "vi" : "en",
                format: "full",
            });
            setNotifications(res.data ?? []);
        } catch {
            setNotifications([]);
        } finally {
            setLoading(false);
            setFetched(true);
        }
    }, [locale, loading]);

    // Fetch ngay khi component mount để badge số lượng luôn hiển thị,
    // sau đó chỉ refresh khi người dùng bấm nút "Làm mới".
    useEffect(() => {
        if (!fetched) {
            fetchNotifications();
        }
    }, [fetched, fetchNotifications]);

    const handleToggle = () => {
        setOpen((prev) => !prev);
    };

    const handleRefresh = () => {
        setFetched(false);
        fetchNotifications();
    };

    const notificationContent = (
        <>
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3">
                <h3
                    className="text-sm font-semibold text-[#1f2937]"
                    style={{ fontFamily: "Roboto, sans-serif" }}
                >
                    {tCommon("notifications")}
                </h3>
                <button
                    onClick={handleRefresh}
                    disabled={loading}
                    className="text-xs text-[#4162e7] hover:underline disabled:opacity-40 transition-opacity"
                    style={{ fontFamily: "Roboto, sans-serif" }}
                >
                    {loading
                        ? tCommon("loading")
                        : tCommon("refresh")}
                </button>
            </div>

            {/* Body */}
            <div className="overflow-y-auto" style={{ maxHeight: isMobileOrTablet ? "calc(100vh - 120px)" : "480px" }}>
                {loading && notifications.length === 0 ? (
                    /* Skeleton */
                    <div className="flex flex-col">
                        {Array.from({ length: 3 }).map((_, i) => (
                            <div
                                key={i}
                                className="flex items-start gap-3 px-4 py-4 border-b border-gray-50 animate-pulse"
                            >
                                <div className="w-12 h-12 rounded-full bg-gray-200 flex-shrink-0" />
                                <div className="flex-1 flex flex-col gap-2 pt-1">
                                    <div className="h-3 bg-gray-200 rounded w-1/3" />
                                    <div className="h-3 bg-gray-200 rounded w-4/5" />
                                    <div className="h-3 bg-gray-200 rounded w-2/5" />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : notifications.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
                        <Bell className="h-10 w-10 text-gray-300 mb-3" />
                        <p
                            className="text-sm text-gray-400"
                            style={{ fontFamily: "Roboto, sans-serif" }}
                        >
                            {tCommon("notificationsEmpty")}
                        </p>
                    </div>
                ) : (
                    notifications.map((rawHtml, idx) => (
                        <div
                            key={idx}
                            className="notification-item hover:bg-[#eceffd] transition-colors overflow-hidden"
                            style={{ maxWidth: "700px" }}
                            dangerouslySetInnerHTML={{ __html: sanitizeHtml(rawHtml) }}
                        />
                    ))
                )}
            </div>
        </>
    );

    return (
        <div ref={containerRef} className="relative">

            {/* Bell button */}
            <button
                onClick={handleToggle}
                className="w-10 h-10 flex items-center justify-center rounded-lg border border-[#CACDD9] hover:bg-[#eceffd] transition-colors relative cursor-pointer"
                aria-label={tCommon("notifications")}
            >
                <Bell className="h-5 w-5 text-[#3B3D48]" />
                {notifications.length > 0 && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-white text-[10px] font-bold flex items-center justify-center leading-none">
                        {notifications.length > 9 ? "9+" : notifications.length}
                    </span>
                )}
            </button>

            {open && (
                <>
                    {isMobileOrTablet ? (
                        <>
                            {/* Backdrop */}
                            <div
                                className="fixed inset-0 z-[40] bg-black/30"
                                style={{ top: isMobile ? "56px" : "64px" }}
                                onClick={handleClose}
                            />
                            {/* Slide-down panel (giống MobileMenu) */}
                            <div
                                className="fixed left-0 right-0 z-[45] bg-white shadow-lg border-b border-gray-100 overflow-hidden"
                                style={{
                                    top: isMobile ? "56px" : "64px",
                                    animation: "notifSlideDown 0.2s ease-out",
                                }}
                            >
                                {notificationContent}
                            </div>
                        </>
                    ) : (
                        /* Desktop: absolute dropdown */
                        <div
                            className="absolute right-0 top-[calc(100%+8px)] z-50 bg-white rounded-xl shadow-[0px_0px_10px_0px_rgba(0,0,0,0.05)] overflow-hidden"
                            style={{ width: "min(700px, calc(100vw - 24px))" }}
                        >
                            {notificationContent}
                        </div>
                    )}
                </>
            )}

            {/* Animation keyframes */}
            <style jsx>{`
                @keyframes notifSlideDown {
                    from {
                        opacity: 0;
                        transform: translateY(-10px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
            `}</style>
        </div>
    );
}
