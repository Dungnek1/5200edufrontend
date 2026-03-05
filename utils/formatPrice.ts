
export const formatPrice = (
    price: number,
    locale: string = 'vi-VN',
    freeText?: string
): string => {
    if (price === 0) return freeText || 'Miễn phí';
    return price.toLocaleString(locale) + '₫';
};
