import { NavigationConfig, NavigationItem } from "@/types/navigation.types";


export const NAVIGATION_CONFIG: NavigationConfig = {
  TEACHER: [
    { id: 1, label: "nav.courses", href: "/courses" },
    { id: 2, label: "nav.students", href: "/students" },
    { id: 4, label: "nav.communityEvents", href: "/events", absolute: true },
  ],
  STUDENT: [
    { id: 1, label: "nav.explore", href: "/explore", absolute: true },
    { id: 2, label: "nav.teacherTeam", href: "/teachers", absolute: true },
    { id: 3, label: "nav.communityEvents", href: "/events", absolute: true },
    { id: 4, label: "nav.becomeTeacherShort", href: "/become-teacher", absolute: true },
    { id: 5, label: "nav.myCourses", href: "/courses" },
  ],
  GUEST: [
    { id: 1, label: "nav.explore", href: "/explore" },
    { id: 2, label: "nav.teacherTeam", href: "/teachers" },
    { id: 3, label: "nav.communityEvents", href: "/events" },
    { id: 4, label: "nav.becomeTeacherShort", href: "/become-teacher" },
  ],
};


export function getNavigationByRole(
  role: string | null | undefined
): NavigationItem[] {
  if (role === "TEACHER") {
    return NAVIGATION_CONFIG.TEACHER;
  }
  if (role === "STUDENT") {
    return NAVIGATION_CONFIG.STUDENT;
  }
  return NAVIGATION_CONFIG.GUEST;
}


export function getRolePrefix(role: string | null | undefined): string {
  if (role === "TEACHER") return "/teacher";
  if (role === "STUDENT") return "/student";
  return "";
}

export function getLocalizedNavigation(
  role: string | null | undefined,
  locale: string = "vi"
): NavigationItem[] {
  const items = getNavigationByRole(role);
  const rolePrefix = getRolePrefix(role);

  return items.map((item) => ({
    ...item,
    href: item.absolute
      ? `/${locale}${item.href}`
      : `/${locale}${rolePrefix}${item.href}`,
  }));
}


export function getDashboardPath(
  role: string | null | undefined,
  locale: string = "vi"
): string {
  if (role === "TEACHER") return `/${locale}/teacher/overviews`;
  if (role === "STUDENT") return `/${locale}/explore`;
  return `/${locale}`;
}


export function getProfilePath(
  role: string | null | undefined,
  locale: string = "vi"
): string {
  if (role === "TEACHER") return `/${locale}/teacher/settings?tab=profile`;
  if (role === "STUDENT") return `/${locale}/student/profile`;
  return `/${locale}`;
}


export function getSettingsPath(
  role: string | null | undefined,
  locale: string = "vi"
): string {
  if (role === "TEACHER") return `/${locale}/teacher/settings`;
  if (role === "STUDENT") return `/${locale}/student/settings`;
  return `/${locale}`;
}
