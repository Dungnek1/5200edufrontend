export interface IResponse<T> {
    /**
     * Indicates whether the request was successful.
     * Many backend responses follow the shape:
     * { success: boolean; data: T; message: string; timestamp: string }
     */
    success: boolean;
    data: T;
    message: string;
    timestamp: string;
}


export interface NavigationItem {
    id: number;
    href: string;
    label: string;
}