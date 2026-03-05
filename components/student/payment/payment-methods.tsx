"use client";


import { useTranslations } from "next-intl";
import { Course } from "@/types/course";
import { formatPrice } from "@/utils/formatPrice";
import { calculateTotalDiscount } from "@/utils/calculateTotalDiscount";

interface PaymentMethodsProps {
    course: Course;
    couponCode: string[];
    appliedCouponCodes: string[];
    isCreatingOrder: boolean;
    onRemoveCoupon: (index: number) => void;
    onPayment: (method: "qr" | "momo") => void;
}

export function PaymentMethods({
    course,
    couponCode,
    appliedCouponCodes,
    isCreatingOrder,
    onRemoveCoupon,
    onPayment,
}: PaymentMethodsProps) {
    const t = useTranslations("page.student.checkout");
    const totalDiscountPercent = calculateTotalDiscount(course.coupons);
    const totalDiscount = course.price - (course.price * totalDiscountPercent * 0.01);
    const totalPayment = course.price - totalDiscount;
    return (
        <>

            <div className="lg:hidden md:gap-5 w-full">
                <div className="rounded-lg bg-white p-4 shadow-[0_0_10px_rgba(0,0,0,0.05)]  flex flex-col gap-[10px]">
                    <p
                        className="mb-4 text-base font-medium text-[#3b3d48]"
                        style={{ fontFamily: "Roboto, sans-serif" }}
                    >
                        {t("paymentMethod.title")}
                    </p>



                    <div className="flex items-center justify-between">
                        <span className="text-[14px] text-[#8C92AC]" style={{ fontFamily: "Roboto, sans-serif" }}>
                            {t("summary.subtotal")}
                        </span>
                        <span className="text-[14px] font-medium text-[#8C92AC]" style={{ fontFamily: "Roboto, sans-serif" }}>
                            {formatPrice(course.price || 0)}
                        </span>
                    </div>

                    <div className="flex items-center justify-between">
                        <span className="text-[14px] text-[#8C92AC]" style={{ fontFamily: "Roboto, sans-serif" }}>
                            {t("summary.discount")}
                        </span>
                        <span className="text-[14px] font-medium text-[#8C92AC]" style={{ fontFamily: "Roboto, sans-serif" }}>
                            {formatPrice(totalDiscount)}
                        </span>
                    </div>

                    <div className="flex items-center justify-between">
                        <span className="text-[14px] font-medium text-[#8C92AC]" style={{ fontFamily: "Roboto, sans-serif" }}>
                            {t("summary.total")}
                        </span>
                        <span className="text-[16px] font-bold text-[#4162e7]" style={{ fontFamily: "Roboto, sans-serif" }}>
                            {formatPrice(totalPayment)}
                        </span>
                    </div>


                    <div className="flex items-center gap-2">
                        <input
                            type="text"
                            value={couponCode.join(', ')}
                            onChange={(e) => { }}
                            // onKeyDown={(e) => {
                            //   if (e.key === "Enter") {
                            //     handleApplyCoupon();
                            //   }
                            // }}
                            placeholder={t("placeholders.discountCode")}
                            className="flex-1 h-10 sm:h-11 rounded-lg border border-[#dbdde5] bg-white px-3 sm:px-4 text-sm sm:text-base text-[#3b3d48] outline-none focus:border-[#4162e7]"
                            style={{ fontFamily: "Roboto, sans-serif" }}
                            disabled
                        />
                        <button
                            type="button"
                            // onClick={handleApplyCoupon}
                            disabled={isCreatingOrder}
                            className="h-10 sm:h-11 px-4 sm:px-6 rounded-lg bg-[#4162e7] hover:bg-[#3652d3] text-white font-medium text-sm sm:text-base transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            style={{ fontFamily: "Roboto, sans-serif" }}
                        >
                            {t("actions.apply")}
                        </button>
                    </div>
                    <button
                        onClick={() => onPayment("qr")}
                        disabled={isCreatingOrder}
                        className="w-full rounded-lg bg-[#4162e7] hover:bg-[#3652d3] px-6 py-3 text-base font-medium text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        style={{ fontFamily: "Roboto, sans-serif" }}
                    >
                        <div className='flex items-center gap-[8px] justify-center'>
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M1.33337 5.99967V4.66634C1.33337 2.66634 2.66671 1.33301 4.66671 1.33301H11.3334C13.3334 1.33301 14.6667 2.66634 14.6667 4.66634V5.99967" stroke="white" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round" />
                                <path d="M1.33337 10V11.3333C1.33337 13.3333 2.66671 14.6667 4.66671 14.6667H11.3334C13.3334 14.6667 14.6667 13.3333 14.6667 11.3333V10" stroke="white" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round" />
                                <path d="M1.33337 8H14.6667" stroke="white" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round" />
                            </svg>

                            <p>{t("methods.qrCode")}</p>
                        </div>
                    </button>
                    <button
                        onClick={() => onPayment("momo")}
                        disabled={isCreatingOrder}
                        className="w-full rounded-lg bg-[#a50064] hover:bg-[#8a0053] px-6 py-3 text-base font-medium text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        style={{ fontFamily: "Roboto, sans-serif" }}
                    >
                        <div className='flex items-center gap-[8px] justify-center'>
                            <img src='/momo.svg' alt="Momo" />
                            <p>{t("methods.momo")}</p>
                        </div>
                    </button>
                </div>
            </div>


            <div className="hidden lg:block w-full max-w-full ">
                <div className="rounded-lg bg-white p-6 shadow-[0_0_10px_rgba(0,0,0,0.05)]">
                    <p
                        className="mb-4 text-lg font-medium text-[#3b3d48]"
                        style={{ fontFamily: "Roboto, sans-serif" }}
                    >
                        {t("paymentMethod.title")}
                    </p>


                    <div className="  flex flex-col gap-[10px]">
                        <div className="flex items-center justify-between">
                            <span className="text-[14px] text-[#8C92AC]" style={{ fontFamily: "Roboto, sans-serif" }}>
                                {t("summary.subtotal")}
                            </span>
                            <span className="text-[14px] font-medium text-[#8C92AC]" style={{ fontFamily: "Roboto, sans-serif" }}>
                                {formatPrice(course.price || 0)}
                            </span>
                        </div>

                        <div className="flex items-center justify-between">
                            <span className="text-[14px] text-[#8C92AC]" style={{ fontFamily: "Roboto, sans-serif" }}>
                                {t("summary.discount")}
                            </span>
                            <span className="text-[14px] font-medium text-[#8C92AC]" style={{ fontFamily: "Roboto, sans-serif" }}>
                                {formatPrice(totalDiscount)}
                            </span>
                        </div>

                        <div className="flex items-center justify-between ">
                            <span className="text-[14px] font-medium text-[#8C92AC]" style={{ fontFamily: "Roboto, sans-serif" }}>
                                {t("summary.total")}
                            </span>
                            <span className="text-[16px] font-bold text-[#0A0BD9]" style={{ fontFamily: "Roboto, sans-serif" }}>
                                {formatPrice(totalPayment)}
                            </span>
                        </div>
                        <div className="flex items-center gap-2">
                            <input
                                type="text"
                                value={couponCode.join(', ')}
                                onChange={(e) => { }}
                                // onKeyDown={(e) => {
                                //   if (e.key === "Enter") {
                                //     handleApplyCoupon();
                                //   }
                                // }}
                                placeholder={t("placeholders.discountCode")}
                                className="flex-1 h-10 sm:h-11 rounded-lg border border-[#dbdde5] bg-white px-3 sm:px-4 text-sm sm:text-base text-[#3b3d48] outline-none focus:border-[#4162e7]"
                                style={{ fontFamily: "Roboto, sans-serif" }}
                                disabled
                            />
                            <button
                                type="button"
                                // onClick={handleApplyCoupon}
                                disabled={isCreatingOrder}
                                className="h-10 sm:h-11 px-4 sm:px-6 rounded-lg bg-[#4162e7] hover:bg-[#3652d3] text-white font-medium text-sm sm:text-base transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                style={{ fontFamily: "Roboto, sans-serif" }}
                            >
                                {t("actions.apply")}
                            </button>
                        </div>
                        <button
                            onClick={() => onPayment("qr")}
                            disabled={isCreatingOrder}
                            className="w-full rounded-lg bg-[#4162e7] hover:bg-[#3652d3] px-6 py-3 text-base font-medium text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            style={{ fontFamily: "Roboto, sans-serif" }}
                        >
                            <div className='flex items-center gap-[8px] justify-center'>
                                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M1.33337 5.99967V4.66634C1.33337 2.66634 2.66671 1.33301 4.66671 1.33301H11.3334C13.3334 1.33301 14.6667 2.66634 14.6667 4.66634V5.99967" stroke="white" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round" />
                                    <path d="M1.33337 10V11.3333C1.33337 13.3333 2.66671 14.6667 4.66671 14.6667H11.3334C13.3334 14.6667 14.6667 13.3333 14.6667 11.3333V10" stroke="white" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round" />
                                    <path d="M1.33337 8H14.6667" stroke="white" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round" />
                                </svg>

                                <p>{t("methods.qrCode")}</p>
                            </div>
                        </button>
                        <button
                            onClick={() => onPayment("momo")}
                            disabled={isCreatingOrder}
                            className="w-full rounded-lg bg-[#a50064] hover:bg-[#8a0053] px-6 py-3 text-base font-medium text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            style={{ fontFamily: "Roboto, sans-serif" }}
                        >
                            <div className='flex items-center gap-[8px] justify-center'>
                                <img src='/momo.svg' alt="Momo" />
                                <p>{t("methods.momo")}</p>
                            </div>
                        </button>
                    </div>





                </div>
            </div>
        </>
    );
}
