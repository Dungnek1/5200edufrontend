"use client";

import { CheckCircle2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { useParams, useRouter } from "next/navigation";

export function PaymentSuccess() {
    const t = useTranslations("page.student.checkout");
    const params = useParams();
    const router = useRouter();
    const locale = (params.locale as string) || "vi";

    return (
        <div className="px-4 sm:px-6 lg:px-0 pt-4 sm:pt-6 pb-8">
            <div className="space-y-6 sm:space-y-8 lg:space-y-10">

                <div className="lg:hidden flex flex-col gap-6 md:gap-8">
                    <div className="flex flex-col items-center gap-4 md:gap-5 bg-white px-4">
                        <div className="relative flex items-center justify-center">
                            <div className="absolute h-32 w-32 sm:h-36 sm:w-36 rounded-full bg-[#d1fae5] opacity-50" />
                            <div className="relative flex h-28 w-28 sm:h-32 sm:w-32 items-center justify-center rounded-full bg-[#e5f6ed]">
                                <CheckCircle2 className="h-16 w-16 sm:h-20 sm:w-20 text-[#22c55e]" />
                            </div>
                        </div>
                        <div className="text-center flex flex-col gap-2 sm:gap-3">
                            <p
                                className="text-xl sm:text-2xl font-bold text-[#3b3d48]"
                                style={{ fontFamily: "Roboto, sans-serif" }}
                            >
                                {t('success.title')}
                            </p>
                            <p
                                className="text-sm sm:text-base font-normal text-[#3b3d48]"
                                style={{ fontFamily: "Roboto, sans-serif" }}
                            >
                                {t('success.message')}
                            </p>
                        </div>
                        <button
                            type="button"
                            className="mt-2 w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-3.5 rounded-lg bg-[#4162e7] hover:bg-[#3652d3] text-white font-medium text-sm sm:text-base transition-colors"
                            style={{ fontFamily: "Roboto, sans-serif" }}
                            onClick={() => router.push(`/${locale}/student/courses`)}
                        >
                            {t('success.button')}
                        </button>
                    </div>
                </div>


                <div className="hidden lg:flex flex-col gap-[20px]">
                    <div className="flex flex-col items-center gap-[20px] bg-white px-4">
                        <svg width="144" height="144" viewBox="0 0 144 144" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path fillRule="evenodd" clipRule="evenodd" d="M72 0C32.2875 0 0 32.2875 0 72C0 111.713 32.2875 144 72 144C111.713 144 144 111.713 144 72C144 32.2875 111.713 0 72 0Z" fill="#E8F6ED" />
                            <path fillRule="evenodd" clipRule="evenodd" d="M73 11C39.3547 11 12 38.3547 12 72C12 105.645 39.3547 133 73 133C106.645 133 134 105.645 134 72C134 38.3547 106.645 11 73 11Z" fill="#94D5AC" />
                            <path fillRule="evenodd" clipRule="evenodd" d="M72 24C45.525 24 24 45.525 24 72C24 98.475 45.525 120 72 120C98.475 120 120 98.475 120 72C120 45.525 98.475 24 72 24Z" fill="#16A34A" />
                            <path fillRule="evenodd" clipRule="evenodd" d="M95.2129 55.8186C96.3754 56.9811 96.3754 58.8936 95.2129 60.0561L67.0879 88.1811C66.5066 88.7623 65.7379 89.0623 64.9691 89.0623C64.2004 89.0623 63.4316 88.7623 62.8504 88.1811L48.7879 74.1186C47.6254 72.9561 47.6254 71.0436 48.7879 69.8811C49.9504 68.7186 51.8629 68.7186 53.0254 69.8811L64.9691 81.8248L90.9754 55.8186C92.1379 54.6373 94.0504 54.6373 95.2129 55.8186Z" fill="white" />
                        </svg>
                        <div className="text-center flex flex-col gap-[8px]">
                            <p
                                className="text-[30px] font-medium text-[#0A0BD9]"
                                style={{ fontFamily: "Roboto, sans-serif", lineHeight: "38px" }}
                            >
                                {t('success.title')}
                            </p>
                            <p
                                className="text-[20px] text-black"
                                style={{ fontFamily: "Roboto, sans-serif", lineHeight: "30px" }}
                            >
                                {t('success.message')}
                            </p>
                        </div>
                        <button
                            type="button"
                            className="rounded-[6px] h-[44px] bg-[#0A0BD9] px-[16px] py-[8px] text-[14px] font-medium text-[#FAFAFA]"
                            onClick={() => router.push(`/${locale}/student/courses`)}
                        >
                            {t('success.button')}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
