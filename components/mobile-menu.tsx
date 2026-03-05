"use client";

import { useState, useEffect } from "react";
import { X, User, Settings, LogOut, ChevronDown, ChevronUp, BookOpen, Users, CalendarDays } from "lucide-react";
import Link from "next/link";
import { useParams, usePathname, useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useDeviceType } from "@/hooks/useDeviceType";
import { getProfilePath, getSettingsPath } from "@/lib/navigation-config";
import { getAvatarUrl } from "@/utils/media";
import { DropdownMenuItem } from "./ui/dropdown-menu";

interface NavLink {
  href: string;
  label: string;
}

interface MobileMenuProps {
  open: boolean;
  onClose: () => void;
  isAuthenticated: boolean;
  user?: {
    fullName?: string;
    email?: string;
    avatar?: string;
    role?: string;
  } | null;
  navLinks: NavLink[];
  onLogout?: () => void;
}

export function MobileMenu({
  open,
  onClose,
  isAuthenticated,
  user,
  navLinks,
  onLogout,
}: MobileMenuProps) {
  const params = useParams();
  const pathname = usePathname();
  const router = useRouter();
  const locale = (params.locale as string) || "vi";
  const t = useTranslations();
  const { isMobile, isTablet, deviceType } = useDeviceType();
  const [profileExpanded, setProfileExpanded] = useState(false);
  const [currentLocale, setCurrentLocale] = useState(locale);

  useEffect(() => {
    if (!isMobile && !isTablet && open) {
      onClose();
    }
  }, [isMobile, isTablet, open, onClose]);

  const switchLocale = (newLocale: string) => {
    setCurrentLocale(newLocale);
    const newPath = pathname.replace(`/${locale}`, `/${newLocale}`);
    router.push(newPath);
    onClose();
  };

  const getDisplayName = () => {
    if (user?.fullName) return user.fullName;
    return user?.email?.split("@")[0] || "User";
  };

  const displayName = getDisplayName();

  if (!open || (!isMobile && !isTablet)) return null;

  return (
    <>

      <div
        className="fixed left-0 right-0 bottom-0 z-[100] bg-white border-b border-gray-100 shadow-lg"
        style={{
          top: isMobile ? "56px" : isTablet ? "64px" : "80px",
          animation: "fadeInDown 0.2s ease-out",
          overflowX: "hidden",
        }}
      >
        <div
          className="h-full flex flex-col px-4 py-4"
          style={{
            overflowX: "hidden",
            boxSizing: "border-box",
            height: "100%",
            maxHeight: "100%",
          }}
        >

          {isAuthenticated && user && (
            <div className="flex-shrink-0 border-b border-gray-200 pb-4 mb-4">
              <button
                onClick={() => setProfileExpanded(!profileExpanded)}
                className="w-full flex items-center gap-3 px-2 py-3 rounded-lg hover:bg-[#eceffd] transition-colors"
              >
                <Avatar className="h-10 w-10 flex-shrink-0">
                  <AvatarImage src={getAvatarUrl(user.avatar)} alt={displayName} />
                  <AvatarFallback className="bg-[#4162e7] text-white">
                    {displayName.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 text-left min-w-0">
                  <p
                    className="text-sm font-medium text-gray-900 truncate"
                    style={{ fontFamily: "Roboto, sans-serif" }}
                  >
                    {displayName}
                  </p>
                  <p
                    className="text-xs text-gray-500 truncate"
                    style={{ fontFamily: "Roboto, sans-serif" }}
                  >
                    {user.email}
                  </p>
                </div>
                {profileExpanded ? (
                  <ChevronUp className="h-5 w-5 text-gray-500 flex-shrink-0" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-gray-500 flex-shrink-0" />
                )}
              </button>


              {profileExpanded && (
                <div className="mt-2 space-y-1 animate-in slide-in-from-top-2 duration-200">
                  <Link
                    href={getProfilePath(user.role, locale)}
                    onClick={onClose}
                    className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm text-gray-700 hover:bg-[#eceffd] transition-colors"
                    style={{ fontFamily: "Roboto, sans-serif" }}
                  >
                    <User className="h-4 w-4 text-gray-500" />
                    <span>{t("nav.profile")}</span>
                  </Link>

                  <Link
                    href={getSettingsPath(user.role, locale)}
                    onClick={onClose}
                    className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm text-gray-700 hover:bg-[#eceffd] transition-colors"
                    style={{ fontFamily: "Roboto, sans-serif" }}
                  >
                    <Settings className="h-4 w-4 text-gray-500" />
                    <span>{t("nav.settings")}</span>
                  </Link>

                  {user.role === "TEACHER" && (
                    <>

                      <Link
                        href={`/${locale}/teacher/courses`}
                        onClick={onClose}
                        className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm text-gray-700 hover:bg-[#eceffd] transition-colors"
                        style={{ fontFamily: "Roboto, sans-serif" }}
                      >
                        <BookOpen className="h-4 w-4 text-gray-500" />
                        <span>{t("nav.courseManagement")}</span>
                      </Link>

                      <Link
                        href={`/${locale}/teacher/students`}
                        onClick={onClose}
                        className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm text-gray-700 hover:bg-[#eceffd] transition-colors"
                        style={{ fontFamily: "Roboto, sans-serif" }}
                      >
                        <Users className="h-4 w-4 text-gray-500" />
                        <span>{t("nav.studentManagement")}</span>
                      </Link>

                      <Link
                        href={`/${locale}/teacher/events`}
                        onClick={onClose}
                        className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm text-gray-700 hover:bg-[#eceffd] transition-colors"
                        style={{ fontFamily: "Roboto, sans-serif" }}
                      >
                        <CalendarDays className="h-4 w-4 text-gray-500" />
                        <span>{t("nav.community")}</span>
                      </Link>
                    </>
                  )}

                  <button
                    onClick={() => {
                      onLogout?.();
                      onClose();
                    }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm text-red-600 hover:bg-red-50 transition-colors"
                    style={{ fontFamily: "Roboto, sans-serif" }}
                  >
                    <LogOut className="h-4 w-4" />
                    <span>{t("auth.logout")}</span>
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Navigation Links - Scrollable only when needed */}
          <nav
            className="flex-1 flex flex-col justify-between min-h-0"
            style={{ overflowX: "hidden", width: "100%", minHeight: 0 }}
          >
            <div
              className="space-y-1"
              style={{
                overflowY: "auto",
                overflowX: "hidden",
                scrollbarWidth: "thin",
                scrollbarGutter: "stable",
                width: "100%",
                boxSizing: "border-box",
                flex: "1 1 auto",
                minHeight: 0,
              }}
            >
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={onClose}
                    className={`block px-4 py-3 rounded-lg text-sm font-medium transition-colors ${isActive
                      ? "bg-blue-50 text-blue-600"
                      : "text-gray-700 hover:bg-[#eceffd]"
                      }`}
                    style={{
                      fontFamily: "Roboto, sans-serif",
                      width: "100%",
                      boxSizing: "border-box",
                    }}
                  >
                    {t(link.label)}
                  </Link>
                );
              })}
            </div>

            {/* Login/Register Buttons - Fixed at bottom (Only for guests) */}
            {!isAuthenticated && (
              <div
                className="flex-shrink-0 pt-4 pb-4 border-t border-gray-200"
                style={{
                  width: "100%",
                  boxSizing: "border-box",
                  overflowX: "hidden",
                }}
              >
                <Link
                  href={`/${locale}/login`}
                  onClick={onClose}
                  className="block mb-3 cursor-pointer"
                  style={{ width: "100%", boxSizing: "border-box" }}
                >
                  <Button
                    variant="outline"
                    className="w-full border-[#4162e7] text-[#4162e7] hover:bg-[#4162e7] hover:text-white text-sm transition-colors cursor-pointer"
                    style={{
                      fontFamily: "Roboto, sans-serif",
                      width: "100%",
                      boxSizing: "border-box",
                    }}
                  >
                    {t("auth.login")}
                  </Button>
                </Link>
                <Link
                  href={`/${locale}/register`}
                  onClick={onClose}
                  className="block cursor-pointer"
                  style={{ width: "100%", boxSizing: "border-box" }}
                >
                  <Button
                    className="w-full bg-[#4162e7] text-white hover:bg-[#4162e7]/90 text-sm cursor-pointer"
                    style={{
                      fontFamily: "Roboto, sans-serif",
                      width: "100%",
                      boxSizing: "border-box",
                    }}
                  >
                    {t("auth.register")}
                  </Button>
                </Link>
              </div>
            )}

            {/* Language Switcher - Simple design */}
            <div className="flex-shrink-0 border-t border-gray-200 pt-4 mt-4">
              <p
                className="text-xs font-medium text-gray-500 mb-3 px-2"
                style={{ fontFamily: "Roboto, sans-serif" }}
              >
                {t("nav.language")}
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => switchLocale("vi")}
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors cursor-pointer ${currentLocale === "vi"
                    ? "bg-[#4162e7] text-white shadow-sm"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  style={{ fontFamily: "Roboto, sans-serif" }}
                >
                  <div className="w-5 h-[14px] rounded-sm overflow-hidden flex items-center justify-center flex-shrink-0">
                    <svg viewBox="0 0 30 20" className="w-5 h-[14px]">
                      <rect width="30" height="20" fill="#DA251D" />
                      <polygon
                        points="15,4 16.4,9.2 21.8,9.2 17.2,12.4 18.6,17.6 15,14.4 11.4,17.6 12.8,12.4 8.2,9.2 13.6,9.2"
                        fill="#FFFF00"
                      />
                    </svg>
                  </div>
                  <span>Tiếng Việt</span>
                </button>
                <button
                  onClick={() => switchLocale("en")}
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors cursor-pointer ${currentLocale === "en"
                    ? "bg-[#4162e7] text-white shadow-sm"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  style={{ fontFamily: "Roboto, sans-serif" }}
                >
                  <div className="w-5 h-[14px] rounded-sm overflow-hidden flex items-center justify-center flex-shrink-0">
                    <svg viewBox="0 0 30 20" className="w-5 h-[14px]">
                      <rect width="30" height="20" fill="#012169" />
                      <path
                        d="M0 0L30 20M30 0L0 20"
                        stroke="white"
                        strokeWidth="4"
                      />
                      <path
                        d="M0 0L30 20M30 0L0 20"
                        stroke="#C8102E"
                        strokeWidth="2"
                      />
                      <path
                        d="M15 0V20M0 10H30"
                        stroke="white"
                        strokeWidth="6"
                      />
                      <path
                        d="M15 0V20M0 10H30"
                        stroke="#C8102E"
                        strokeWidth="4"
                      />
                    </svg>
                  </div>
                  <span>English</span>
                </button>
              </div>
            </div>
          </nav>
        </div>
      </div>

      {/* Overlay - đè lên content phía dưới menu, KHÔNG che menu */}
      <div
        className="fixed inset-0 z-[40] bg-black/50"
        onClick={onClose}
        style={{
          top: isMobile ? "56px" : isTablet ? "64px" : "80px",
        }}
      />

      {/* Add animation styles */}
      <style jsx>{`
        @keyframes fadeInDown {
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
    </>
  );
}
