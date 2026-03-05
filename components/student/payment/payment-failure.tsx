"use client";

import { XCircle } from "lucide-react";
import { useTranslations } from "next-intl";
import { useParams, useRouter } from "next/navigation";

export function PaymentFailure({ slug }: { slug: string }) {
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
                            <div className="absolute h-32 w-32 sm:h-36 sm:w-36 rounded-full bg-[#fee2e2] opacity-60" />
                            <div className="relative flex h-28 w-28 sm:h-32 sm:w-32 items-center justify-center rounded-full bg-[#fee2e2]">
                                <XCircle className="h-16 w-16 sm:h-20 sm:w-20 text-[#dc2626]" />
                            </div>
                        </div>
                        <div className="text-center flex flex-col gap-2 sm:gap-3">
                            <p
                                className="text-xl sm:text-2xl font-bold text-[#dc2626]"
                                style={{ fontFamily: "Roboto, sans-serif" }}
                            >
                                {t('failure.title')}
                            </p>
                            <div className="flex flex-col gap-1 sm:gap-1.5">
                                <p
                                    className="text-sm sm:text-base font-normal text-[#3b3d48]"
                                    style={{ fontFamily: "Roboto, sans-serif" }}
                                >
                                    {t('failure.message1')}
                                </p>
                                <p
                                    className="text-sm sm:text-base font-normal text-[#3b3d48]"
                                    style={{ fontFamily: "Roboto, sans-serif" }}
                                >
                                    {t('failure.message2')}
                                </p>
                            </div>
                        </div>
                        <button
                            type="button"
                            className="mt-2 w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-3.5 rounded-lg bg-[#4162e7] hover:bg-[#3652d3] text-white font-medium text-sm sm:text-base transition-colors"
                            style={{ fontFamily: "Roboto, sans-serif" }}
                            onClick={() => router.push(`/${locale}/student/courses/${slug}/checkout`)}
                        >
                            {t('actions.retry')}
                        </button>
                    </div>
                </div>


                <div className="hidden lg:flex flex-col items-center gap-4 bg-white px-4">
                    <div className="flex h-36 w-36 items-center justify-center rounded-full bg-[#fee2e2]">
                        <XCircle className="h-20 w-20 text-[#dc2626]" />
                    </div>
                    <div className="text-center">
                        <p
                            className="text-[30px] font-medium text-[#dc2626]"
                            style={{ fontFamily: "Roboto, sans-serif", lineHeight: "38px" }}
                        >
                            {t('failure.title')}
                        </p>
                        <p
                            className="mt-2 text-[20px] text-black"
                            style={{ fontFamily: "Roboto, sans-serif", lineHeight: "30px" }}
                        >
                            {t('failure.message1')}
                        </p>
                        <p
                            className="text-[20px] text-black"
                            style={{ fontFamily: "Roboto, sans-serif", lineHeight: "30px" }}
                        >
                            {t('failure.message2')}
                        </p>
                    </div>
                    <button
                        type="button"
                        className="mt-2 rounded-md bg-[#4162e7] px-6 py-2 text-sm font-medium text-white"
                        onClick={() => router.push(`/${locale}/student/courses/${slug}/checkout`)}
                    >
                        {t('actions.retry')}
                    </button>
                </div>
            </div>
        </div>
    );
}
