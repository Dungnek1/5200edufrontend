"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Course } from "@/types/course";
import { formatPrice } from "@/utils/formatPrice";
import NextImage from "next/image";
import { Check } from "lucide-react";

interface PaymentProcessingProps {
    course: Course | null;
    method: "qr" | "momo" | null;
    onComplete: () => void;
    onError: () => void;
}

export function PaymentProcessing({
    course,
    method,
    onComplete,
}: PaymentProcessingProps) {
    const t = useTranslations("page.student.checkout");
    const [countdown, setCountdown] = useState(5);

    useEffect(() => {
        const timer = setInterval(() => {
            setCountdown((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    onComplete();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [onComplete]);

    const amount = course?.price || 0;
    const isQr = method === "qr";
    const brandColor = isQr ? "#4162e7" : "#a50064";
    const bgColor = isQr ? "bg-[#eceffd]" : "bg-[#a50064]";
    const textColor = isQr ? "text-[#3b3d48]" : "text-white";
    const qrImage = isQr ? "/qr-ak.svg" : "/qr-ak.svg";
    const titleKey = isQr ? "qrPayment.title" : "momoPayment.title";
    const instructionsKey = isQr ? "qrPayment.instructions" : "momoPayment.instructions";
    const step1Key = isQr ? "qrPayment.step1" : "momoPayment.step1";
    const step1DescKey = isQr ? "qrPayment.step1Desc" : "momoPayment.step1Desc";
    const step2Key = isQr ? "qrPayment.step2" : "momoPayment.step2";
    const step2DescKey = isQr ? "qrPayment.step2Desc" : "momoPayment.step2Desc";
    const step3Key = isQr ? "qrPayment.step3" : "momoPayment.step3";
    const step3DescKey = isQr ? "qrPayment.step3Desc" : "momoPayment.step3Desc";
    const warningKey = isQr ? "qrPayment.warning" : "momoPayment.warning";

    return (
        <div className="px-4 sm:px-6 lg:px-0 pt-4 sm:pt-6 pb-8">
            {/* Progress Steps - Processing state */}
            <div className="flex justify-center pt-0 pb-6 sm:pb-8">
                <div className="relative flex w-full max-w-[1008px] items-start justify-center">
                    <div className="absolute top-[12px] left-1/2 h-px w-[200px] md:w-[300px] lg:w-[470px] -translate-x-1/2 bg-[#e4e7ec]" />
                    <div className="relative z-10 flex w-[280px] md:w-[400px] lg:w-[514px] justify-between">
                        <div className="flex flex-col items-center gap-2 sm:gap-3">
                            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#4162e7] text-white">
                                <Check className="h-3 w-3" strokeWidth={3} />
                            </div>
                            <p className="text-xs font-medium text-[#63687a]">{t("steps.cart")}</p>
                        </div>
                        <div className="flex flex-col items-center gap-2 sm:gap-3">
                            <div className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-[#4162e7] bg-white">
                                <div className="h-2 w-2 rounded-full bg-[#4162e7] animate-pulse" />
                            </div>
                            <p className="text-xs font-medium text-[#4162e7]">{t("steps.payment")}</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="space-y-6 sm:space-y-8 lg:space-y-10">
                {/* Mobile Layout */}
                <div className="lg:hidden flex flex-col gap-4 md:gap-5">
                    <div className={`rounded-t-lg ${bgColor} px-4 py-3 text-center`}>
                        <p
                            className={`text-sm sm:text-base font-medium ${textColor}`}
                            style={{ fontFamily: "Roboto, sans-serif" }}
                        >
                            {t(titleKey)}
                        </p>
                    </div>

                    <div className="rounded-b-lg bg-white shadow-[0_0_10px_rgba(0,0,0,0.05)] px-4 sm:px-6 py-6 sm:py-8">
                        <div className="flex flex-col items-center gap-6 sm:gap-8">
                            <div className="flex items-center justify-center rounded-lg border border-[#dbdde5] bg-white p-3 sm:p-4">
                                <div className="relative h-[240px] w-[240px] sm:h-[280px] sm:w-[280px] overflow-hidden rounded-lg bg-[#f3f4f6]">
                                    <img
                                        src={qrImage}
                                        alt="QR code"
                                        className="object-cover w-full h-full"
                                    />
                                </div>
                            </div>

                            <div className="flex flex-col gap-3 sm:gap-4 w-full">
                                <p
                                    className="text-sm sm:text-base font-medium text-[#3b3d48]"
                                    style={{ fontFamily: "Roboto, sans-serif" }}
                                >
                                    {t(instructionsKey)}
                                </p>
                                <p
                                    className="text-sm sm:text-base font-normal text-[#3b3d48]"
                                    style={{ fontFamily: "Roboto, sans-serif" }}
                                >
                                    <span className="font-medium">{t(step1Key)}</span> {t(step1DescKey)}
                                </p>
                                <p
                                    className="text-sm sm:text-base font-normal text-[#3b3d48]"
                                    style={{ fontFamily: "Roboto, sans-serif" }}
                                >
                                    <span className="font-medium">{t(step2Key)}</span> {t(step2DescKey)}
                                </p>
                                <p
                                    className="text-sm sm:text-base font-bold text-[#dc2626]"
                                    style={{ fontFamily: "Roboto, sans-serif" }}
                                >
                                    {t(warningKey)}
                                </p>
                                <div className="mt-2 w-full rounded-lg bg-[#f4f4f7] px-3 sm:px-4 py-2.5 sm:py-3">
                                    <div className="flex items-center justify-between">
                                        <span
                                            className="text-sm sm:text-base font-medium text-[#3b3d48]"
                                            style={{ fontFamily: "Roboto, sans-serif" }}
                                        >
                                            {t("summary.amount")}:
                                        </span>
                                        <span
                                            className="text-base sm:text-lg font-bold"
                                            style={{ fontFamily: "Roboto, sans-serif", color: brandColor }}
                                        >
                                            {formatPrice(amount)}
                                        </span>
                                    </div>
                                </div>
                                <p
                                    className="text-sm sm:text-base font-normal text-[#3b3d48]"
                                    style={{ fontFamily: "Roboto, sans-serif" }}
                                >
                                    <span className="font-medium">{t(step3Key)}</span> {t(step3DescKey)}
                                </p>
                                <div className="mt-4 rounded-lg px-4 py-3 text-center" style={{ backgroundColor: `${brandColor}1A` }}>
                                    <p
                                        className="text-sm sm:text-base font-medium"
                                        style={{ fontFamily: "Roboto, sans-serif", color: brandColor }}
                                    >
                                        Tự động chuyển hướng trong: <span className="text-lg font-bold">{countdown}</span> giây
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Desktop Layout */}
                <div className="hidden lg:block space-y-6">
                    <div className={`mx-auto max-w-[1024px] rounded-t-lg ${bgColor} px-4 py-3 text-center text-sm font-medium ${textColor}`}>
                        {t(titleKey)}
                    </div>
                    <div className="mx-auto max-w-[1024px] rounded-b-lg bg-white px-6 py-8 shadow-[0_0_10px_rgba(0,0,0,0.05)]">
                        <div className="flex flex-col items-center gap-6 md:flex-row md:items-stretch">
                            <div className="flex items-center justify-center rounded-lg border border-[#dbdde5] bg-white p-3">
                                <div className="relative h-[240px] w-[240px] overflow-hidden rounded-lg bg-[#f3f4f6]">
                                    <NextImage
                                        src={qrImage}
                                        alt="QR code"
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                            </div>
                            <div className="flex flex-1 flex-col gap-2 text-[14px] text-[#3b3d48]">
                                <p className="mb-1 text-base font-medium">{t(instructionsKey)}</p>
                                <p>
                                    <span className="font-medium">{t(step1Key)}</span> {t(step1DescKey)}
                                </p>
                                <p>
                                    <span className="font-medium">{t(step2Key)}</span> {t(step2DescKey)}
                                </p>
                                <p className="mt-1 text-sm text-[#dc2626]">{t(warningKey)}</p>
                                <div className="mt-2 w-full rounded-lg bg-[#f4f4f7] px-3 py-2 text-sm font-medium text-[#3b3d48]">
                                    <div className="flex items-center gap-3">
                                        <span className="w-24">{t("summary.amount")}:</span>
                                        <span className="text-lg font-semibold" style={{ color: brandColor }}>
                                            {formatPrice(amount)}
                                        </span>
                                    </div>
                                </div>
                                <p className="mt-2">
                                    <span className="font-medium">{t(step3Key)}</span> {t(step3DescKey)}
                                </p>
                                <div className="mt-4 rounded-lg px-4 py-3 text-center" style={{ backgroundColor: `${brandColor}1A` }}>
                                    <p className="text-sm font-medium" style={{ fontFamily: "Roboto, sans-serif", color: brandColor }}>
                                        Tự động chuyển hướng trong: <span className="text-lg font-bold">{countdown}</span> giây
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
