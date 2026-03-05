"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  loginSchema,
  type LoginFormData,
} from "@/lib/validations/auth-schemas";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { useRouter, useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { useState, useEffect } from "react";
import { message } from "antd";
import { toast } from "sonner";
import { Eye, EyeOff } from "lucide-react";

const REMEMBER_EMAIL_KEY = "5200_remembered_email";

export function LoginForm() {
  const t = useTranslations();
  const router = useRouter();
  const params = useParams();
  const locale = params.locale as string;
  const { login, isLoading } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Load remembered email from localStorage
  const savedEmail = typeof window !== "undefined" ? localStorage.getItem(REMEMBER_EMAIL_KEY) : null;

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    watch,
    setValue,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      rememberMe: false,
    },
  });

  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      const savedEmail = window.localStorage.getItem(REMEMBER_EMAIL_KEY);
      if (savedEmail) {
        setValue("email", savedEmail);
        setValue("rememberMe", true);
      }
    } catch {
      // ignore storage errors
    }
  }, [setValue]);

  const onSubmit = async (data: LoginFormData) => {
    if (isSubmitting || isLoading) {
      return;
    }

    setIsSubmitting(true);

    let timeoutId: NodeJS.Timeout | null = setTimeout(() => {
      setIsSubmitting(false);
      message.error(t("auth.messages.loginTimeout"));
    }, 30000);

    try {

      const res = await login({
        email: data.email,
        password: data.password,
        rememberMe: data.rememberMe,
      });
      const errorObj = res.data.data as any;
      if (errorObj.sessionId) {
        // Đánh dấu đã đăng nhập thành công để landing page hiển thị toast
        try {
          if (typeof window !== "undefined") {
            if (data.rememberMe) {
              window.localStorage.setItem(REMEMBER_EMAIL_KEY, data.email);
            } else {
              window.localStorage.removeItem(REMEMBER_EMAIL_KEY);
            }
            window.localStorage.setItem("login_success", "1");
          }
        } catch {
          // ignore storage errors
        }
        window.location.href = `/${locale}/${(errorObj.user.role).toLowerCase()}/overviews`;
      }
      else if (errorObj.status == 2) {
        const emailNotVerifiedMessage = errorObj.message || t("auth.messages.emailNotVerified");
        message.error(emailNotVerifiedMessage, 6);
        router.push(`/${locale}/verify-otp?email=${encodeURIComponent(data.email)}&type=verify-email`);
      } else {
        message.error(errorObj.message || t("auth.messages.loginFailed"));
      }

    } catch (error: unknown) {
      message.error(t("auth.messages.loginFailed"));
    } finally {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      setIsSubmitting(false);
    }
  };

  const handleFormSubmit = handleSubmit(
    (data) => {
      onSubmit(data);
    },
    (errors) => {
      const firstError = Object.values(errors)[0];
      if (firstError?.message) {
        message.error(firstError.message);
      }
    }
  );

  return (
    <form onSubmit={handleFormSubmit} className="space-y-4 sm:space-y-5">
      <div className="space-y-1.5 sm:space-y-2">
        <Label
          htmlFor="email"
          className="text-xs sm:text-sm leading-normal text-gray-500 mb-1 block"
        >
          {t("auth.form.username")}
        </Label>
        <Input
          id="email"
          type="email"
          {...register("email")}
          placeholder={t("auth.form.emailPlaceholder")}
          className="h-12 sm:h-14 px-3 text-sm sm:text-base bg-gray-100 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600 focus:bg-white focus:outline-none transition-colors"
        />
        {errors.email && (
          <p className="text-xs sm:text-sm text-red-600 mt-1 flex items-center gap-1">
            <span className="w-1 h-1 bg-red-600 rounded-full" />
            {errors.email.message}
          </p>
        )}
      </div>

      <div className="space-y-1.5 sm:space-y-2">
        <Label
          htmlFor="password"
          className="text-xs sm:text-sm leading-normal text-gray-500 mb-1 block"
        >
          {t("auth.password")}
        </Label>
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            {...register("password")}
            placeholder={t("auth.form.passwordPlaceholder")}
            className="h-12 sm:h-14 px-3 pr-10 text-sm sm:text-base bg-gray-100 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600 focus:bg-white focus:outline-none transition-colors"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
            tabIndex={-1}
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4 sm:h-5 sm:w-5" />
            ) : (
              <Eye className="h-4 w-4 sm:h-5 sm:w-5" />
            )}
          </button>
        </div>
        {errors.password && (
          <p className="text-xs sm:text-sm text-red-600 mt-1 flex items-center gap-1">
            <span className="w-1 h-1 bg-red-600 rounded-full" />
            {errors.password.message}
          </p>
        )}
      </div>

      <div className="flex flex-row items-center justify-between gap-2 sm:gap-0">
        <div className="flex items-center gap-2">
          <Controller
            name="rememberMe"
            control={control}
            render={({ field }) => (
              <Checkbox
                id="remember"
                checked={field.value || false}
                onCheckedChange={(checked) => field.onChange(checked === true)}
                className="border-gray-300 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600 w-4 h-4 sm:w-5 sm:h-5"
              />
            )}
          />
          <Label
            htmlFor="remember"
            className="text-xs sm:text-sm text-gray-700 cursor-pointer"
          >
            {t("auth.form.rememberMe")}
          </Label>
        </div>
        <Link
          href={`/${locale}/forgot-password`}
          className="text-xs sm:text-sm text-[#4162e7] hover:text-[#3556d4] hover:underline font-medium transition-colors whitespace-nowrap"
        >
          {t("auth.forgotPassword")}
        </Link>
      </div>

      <Button
        type="submit"
        className="w-full py-2.5 sm:py-3 bg-blue-600 hover:bg-blue-700 text-white text-sm sm:text-base font-bold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={isLoading || isSubmitting}
      >
        {isLoading || isSubmitting ? (
          <span className="flex items-center justify-center gap-2">
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            {t("auth.form.processing")}
          </span>
        ) : (
          t("auth.login")
        )}
      </Button>
    </form>
  );
}
