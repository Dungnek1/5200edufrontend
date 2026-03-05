export interface NavigationItem {
    id: number;
    label: string;
    href: string;
    icon?: string;
    absolute?: boolean;
}

export type UserRole = 'TEACHER' | 'STUDENT' | 'ADMIN';

export interface NavigationConfig {
    [key: string]: NavigationItem[];
}
