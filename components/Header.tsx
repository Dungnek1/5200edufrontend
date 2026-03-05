"use client";

import { useState, useCallback } from "react";
import { Logo } from "@/components/shared/logo";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks";
import { useDeviceType } from "@/hooks/useDeviceType";
import Link from "next/link";
import { useParams, usePathname, useRouter } from "next/navigation";
import {
  LogOut,
  User,
  Settings,
  ChevronDown,
  Menu,
  X,
  BookOpen,
  Users,
  CalendarDays,
} from "lucide-react";
import {
  getLocalizedNavigation,
  getDashboardPath,
  getProfilePath,
  getSettingsPath,
} from "@/lib/navigation-config";
import { MobileMenu } from "@/components/mobile-menu";
import { useTranslations } from "next-intl";
import { NotificationDropdown } from "@/components/shared/notification-dropdown";
import { getAvatarUrl } from "@/utils/media";

export function Header() {
  const { user, logout, isAuthenticated } = useAuth();
  const { isMobile, isTablet, isDesktop } = useDeviceType();
  const params = useParams();
  const pathname = usePathname();
  const router = useRouter();
  const locale = (params.locale as string) || "vi";
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentLocale, setCurrentLocale] = useState(locale);
  const t = useTranslations();


  const navigationItems = getLocalizedNavigation(user?.role, locale);

  const logoHref =
    user?.role === "STUDENT" ? `/${locale}` : getDashboardPath(user?.role, locale);

  const handleCloseMobileMenu = useCallback(() => {
    setMobileMenuOpen(false);
  }, []);

  const switchLocale = (newLocale: string) => {
    setCurrentLocale(newLocale);
    const newPath = pathname.replace(`/${locale}`, `/${newLocale}`);
    router.push(newPath);
  };

  const getUserInitials = (name: string | undefined) => {
    if (!name) return "U";
    const parts = name.split(" ");
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  const getLocaleFlagIcon = (lang: string) => {
    if (lang === "en") {
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="30"
          height="20"
          viewBox="0 0 30 20"
          fill="none"
        >
          <g clipPath="url(#clip_uk_flag)">
            <rect width="30" height="20" fill="#012169" />
            <path d="M0 0L30 20M30 0L0 20" stroke="white" strokeWidth="4" />
            <path d="M0 0L30 20M30 0L0 20" stroke="#C8102E" strokeWidth="2" />
            <path d="M15 0V20M0 10H30" stroke="white" strokeWidth="6" />
            <path d="M15 0V20M0 10H30" stroke="#C8102E" strokeWidth="4" />
          </g>
          <defs>
            <clipPath id="clip_uk_flag">
              <path
                d="M0 2C0 0.895431 0.895431 0 2 0H28C29.1046 0 30 0.895431 30 2V18C30 19.1046 29.1046 20 28 20H2C0.89543 20 0 19.1046 0 18V2Z"
                fill="white"
              />
            </clipPath>
          </defs>
        </svg>
      );
    }
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="30"
        height="20"
        viewBox="0 0 30 20"
        fill="none"
      >
        <g clipPath="url(#clip0_2064_23775)">
          <path d="M0 0H30V20H0V0Z" fill="#FF0000" />
          <path
            d="M15 4L11.47 14.85L20.71 8.15H9.29004L18.53 14.85L15 4Z"
            fill="#FFEB00"
          />
        </g>
        <defs>
          <clipPath id="clip0_2064_23775">
            <path
              d="M0 2C0 0.895431 0.895431 0 2 0H28C29.1046 0 30 0.895431 30 2V18C30 19.1046 29.1046 20 28 20H2C0.89543 20 0 19.1046 0 18V2Z"
              fill="white"
            />
          </clipPath>
        </defs>
      </svg>
    );
  };


  const headerHeight = isMobile ? "h-14" : isTablet ? "h-16" : "h-20";
  const paddingX = isMobile ? "px-4" : isTablet ? "px-6" : "px-16";

  return (
    <>
      <header className="sticky top-0 z-50 bg-white">
        <div
          className={`flex ${headerHeight} items-center justify-between gap-4 sm:gap-6 ${paddingX}`}
        >

          <div
            className="flex-shrink-0 relative flex items-center"
          >
            <Logo href={logoHref} size={150} />
          </div>


          <div className="flex items-center gap-2 sm:gap-3 lg:gap-5">

            {isDesktop && (
              <nav className="flex items-center gap-2 lg:gap-4">
                {navigationItems.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.id}
                      href={item.href}
                      className={`px-2 lg:px-3 py-2 text-sm lg:text-base font-medium transition-colors rounded-lg whitespace-nowrap cursor-pointer ${isActive
                        ? "text-[#4162e7] bg-blue-50 hover:bg-blue-100"
                        : "text-[#3B3D48] hover:bg-[#eceffd] hover:text-[#3B3D48]"
                        }`}
                      style={{
                        fontFamily: "Roboto, sans-serif",
                        fontWeight: 500,
                      }}
                    >
                      {t(item.label)}
                    </Link>
                  );
                })}
              </nav>
            )}

            {isDesktop && (
              <div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="flex items-center gap-2 px-1 py-0.5 border-[0.5px] border-[#CACDD9] rounded hover:bg-[#eceffd] transition-colors cursor-pointer">
                      <div className="w-9 h-9 rounded-full flex items-center justify-center overflow-hidden">
                        <div className="w-[30px] h-5 rounded-sm overflow-hidden flex items-center justify-center">
                          {getLocaleFlagIcon(currentLocale)}
                        </div>
                      </div>
                      <ChevronDown className="h-3 w-3 text-[#7F859D]" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => switchLocale("vi")} className="cursor-pointer">
                      {t("locale.vi")}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => switchLocale("en")} className="cursor-pointer">
                      {t("locale.en")}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            )}


            {isDesktop && isAuthenticated && (
              <NotificationDropdown locale={locale} />
            )}


            {isDesktop && isAuthenticated && user ? (
              <div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="flex items-center px-1 py-0.5 rounded-full hover:bg-[#eceffd] transition-colors cursor-pointer">
                      <Avatar key={user.avatar} className="h-9 w-9">
                        <AvatarImage
                          src={getAvatarUrl(user.avatar)}
                          alt={user.fullName}
                        />
                        <AvatarFallback className="bg-[#4162e7] text-white text-sm">
                          {getUserInitials(user.fullName)}
                        </AvatarFallback>
                      </Avatar>
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>
                      <div>
                        <p className="font-medium">{user.fullName}</p>
                        <p className="text-xs text-gray-500 font-normal">
                          {user.email}
                        </p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link
                        href={getProfilePath(user?.role, locale)}
                        className="cursor-pointer"
                      >
                        <User className="mr-2 h-4 w-4" />
                        <span>{t("nav.profile")}</span>
                      </Link>
                    </DropdownMenuItem>
                    {user.role === "TEACHER" && (
                      <>
                        <DropdownMenuItem asChild>
                          <Link
                            href={`/${locale}/teacher/courses`}
                            className="cursor-pointer"
                          >
                            <BookOpen className="mr-2 h-4 w-4" />
                            <span>{t("nav.courseManagement")}</span>
                          </Link>
                        </DropdownMenuItem>

                        <DropdownMenuItem asChild>
                          <Link
                            href={`/${locale}/teacher/students`}
                            className="cursor-pointer"
                          >
                            <Users className="mr-2 h-4 w-4" />
                            <span>{t("nav.studentManagement")}</span>
                          </Link>
                        </DropdownMenuItem>

                        <DropdownMenuItem asChild>
                          <Link
                            href={`/${locale}/teacher/events`}
                            className="cursor-pointer"
                          >
                            <CalendarDays className="mr-2 h-4 w-4" />

                            <span>{t("nav.community")}</span>
                          </Link>
                        </DropdownMenuItem>
                      </>
                    )}
                    <DropdownMenuItem asChild>
                      <Link
                        href={getSettingsPath(user?.role, locale)}
                        className="cursor-pointer"
                      >
                        <Settings className="mr-2 h-4 w-4" />
                        <span>{t("nav.settings")}</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={logout}
                      className="cursor-pointer text-red-600"
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>{t("auth.logout")}</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : isDesktop && !isAuthenticated ? (
              <div className="flex items-center gap-2">
                <Link href={`/${locale}/login`} className="cursor-pointer">
                  <Button
                    variant="outline"
                    className="border-[#4162e7] text-[#4162e7] hover:bg-[#4162e7] hover:text-white text-sm transition-colors cursor-pointer"
                    style={{ fontFamily: "Roboto, sans-serif" }}
                  >
                    {t("auth.login")}
                  </Button>
                </Link>
                <Link href={`/${locale}/register`} className="cursor-pointer">
                  <Button
                    className="bg-[#4162e7] text-white hover:bg-[#4162e7]/90 text-sm cursor-pointer"
                    style={{ fontFamily: "Roboto, sans-serif" }}
                  >
                    {t("auth.register")}
                  </Button>
                </Link>
              </div>
            ) : null}


            {(isMobile || isTablet) && isAuthenticated && (
              <NotificationDropdown locale={locale} />
            )}

            {(isMobile || isTablet) && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="h-9 w-9 sm:h-10 sm:w-10 flex-shrink-0 text-gray-700 hover:bg-[#eceffd] hover:text-gray-900 transition-colors"
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </Button>
            )}
          </div>
        </div>
      </header>

      <MobileMenu
        open={mobileMenuOpen}
        onClose={handleCloseMobileMenu}
        isAuthenticated={isAuthenticated}
        user={user}
        navLinks={navigationItems}
        onLogout={logout}
      />
    </>
  );
}
