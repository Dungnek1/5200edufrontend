
export type UserRole = 0 | 1 | 2;

export function normalizeRole(role: UserRole | string | undefined | null): number | null {
  if (role === undefined || role === null) return null;

  if (typeof role === 'number') return role;

  if (role === '0' || role === '1' || role === '2') return parseInt(role);

  if (role === 'ADMIN') return 0;
  if (role === 'TEACHER') return 1;
  if (role === 'STUDENT') return 2;

  if (role === 'admin') return 0;
  if (role === 'teacher') return 1;
  if (role === 'student') return 2;

  return null;
}

export function isTeacher(role: UserRole | string | undefined | null): boolean {
  const normalized = normalizeRole(role);
  return normalized === 1;
}


export function isAdmin(role: UserRole | string | undefined | null): boolean {
  const normalized = normalizeRole(role);
  return normalized === 0;
}

export function isStudent(role: UserRole | string | undefined | null): boolean {
  const normalized = normalizeRole(role);
  return normalized === 2;
}


export function getRedirectPathByRole(role: UserRole | string | undefined | null, locale: string = 'vi'): string {
  if (isTeacher(role)) {
    return `/${locale}/teacher/dashboard`;
  }
  if (isAdmin(role)) {
    return `/${locale}/admin/dashboard`;
  }
  return `/${locale}/student/dashboard`;
}


