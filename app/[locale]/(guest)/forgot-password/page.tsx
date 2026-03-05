"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { Logo } from "@/components/shared/logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authService } from "@/services/apis";
import { Loader2 } from "lucide-react";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const t = useTranslations("auth.forgotPasswordPage");
  const router = useRouter();
  const params = useParams();
  const locale = params.locale as string;

  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const trimmed = email.trim();
    if (!trimmed) {
      toast.error(t("emailRequired"));
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await authService.forgotPassword({ email: trimmed });
      if (response.success === false || (response as any).status === "error") {
        toast.error((response as any).message || t("failed"));
        return;
      }
      toast.success(t("success"));
      router.push(
        `/${locale}/verify-otp?email=${encodeURIComponent(trimmed)}&type=reset-password`
      );
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message || error?.message || t("failed")
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex items-center justify-center py-6 sm:py-12 px-4">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-6 sm:mb-8">
          <Logo variant="text" className="h-12 sm:h-14 md:h-16 lg:h-20 w-auto" />
        </div>

        <div className="w-full bg-white border-2 border-blue-600 rounded-xl sm:rounded-2xl shadow-lg overflow-hidden">
          <div className="bg-blue-600 h-[50px] sm:h-[60px] flex items-center justify-center">
            <h1
              className="text-white font-bold text-sm sm:text-base"
              style={{ fontFamily: "Roboto, sans-serif" }}
            >
              {t("title")}
            </h1>
          </div>

          <div className="p-4 md:p-6 lg:p-8">
            <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
              <p
                className="text-sm sm:text-base text-gray-600"
                style={{ fontFamily: "Roboto, sans-serif" }}
              >
                {t("subtitle")}
              </p>

              <div className="space-y-1.5 sm:space-y-2">
                <Label
                  htmlFor="email"
                  className="text-xs sm:text-sm text-gray-500 mb-1 block"
                  style={{ fontFamily: "Roboto, sans-serif" }}
                >
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t("emailPlaceholder")}
                  className="h-11 sm:h-12 px-3 text-sm sm:text-base bg-white border border-blue-500 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition-colors"
                  style={{ fontFamily: "Roboto, sans-serif" }}
                  disabled={isSubmitting}
                />
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-2.5 sm:py-3 bg-blue-600 hover:bg-blue-700 text-white text-sm sm:text-base font-bold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ fontFamily: "Roboto, sans-serif" }}
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    {t("sending")}
                  </span>
                ) : (
                  t("submit")
                )}
              </Button>

              <div className="text-center">
                <Link
                  href={`/${locale}/login`}
                  className="text-xs sm:text-sm text-[#4162e7] hover:text-[#3556d4] hover:underline font-medium transition-colors"
                  style={{ fontFamily: "Roboto, sans-serif" }}
                >
                  {t("backToLogin")}
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
