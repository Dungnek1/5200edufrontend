
export const calculateTotalDiscount = (
    coupons?: Array<{
        id: string;
        code: string;
        description?: string;
        discountValue: string;
    }>
): number => {
    if (!coupons || coupons.length === 0) return 0;

    const totalDiscount = coupons.reduce((sum, coupon) => {
        const discountValue = parseFloat(coupon.discountValue || "0");
        return sum + discountValue;
    }, 0);

    return Math.round(totalDiscount);
};
