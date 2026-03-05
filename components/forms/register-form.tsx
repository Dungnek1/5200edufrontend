"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  registerSchema,
  type RegisterFormData,
} from "@/lib/validations/auth-schemas";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authService } from "@/services/apis";
import { useRouter, useParams } from "next/navigation";
import { toast } from "sonner";
import Link from "next/link";
import { useState, useRef } from "react";
import { useTranslations } from "next-intl";
import { Checkbox } from "@/components/ui/checkbox";
import { Eye, EyeOff } from "lucide-react";

export function RegisterForm() {
  const t = useTranslations();
  const router = useRouter();
  const params = useParams();
  const locale = params.locale as string;
  const [isLoading, setIsLoading] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const toastIdRef = useRef<string | number | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    control,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    mode: "onSubmit",
    reValidateMode: "onSubmit",
  });

  const password = watch("password", "");

  const getPasswordStrength = (pwd: string) => {
    let strength = 0;
    if (pwd.length >= 8) strength++;
    if (pwd.length >= 12) strength++;
    if (/[a-z]/.test(pwd)) strength++;
    if (/[A-Z]/.test(pwd)) strength++;
    if (/[0-9]/.test(pwd)) strength++;
    if (/[^A-Za-z0-9]/.test(pwd)) strength++;
    return strength;
  };

  const strength = getPasswordStrength(password);

  const passwordRequirements = {
    minLength: password.length >= 8,
    maxLength: password.length <= 128,
    hasUpperCase: /[A-Z]/.test(password),
    hasLowerCase: /[a-z]/.test(password),
    hasNumber: /[0-9]/.test(password),
    hasSpecialChar: /[^A-Za-z0-9]/.test(password),
  };

  const onSubmit = async (data: RegisterFormData) => {
    if (isLoading) {
      return;
    }

    if (toastIdRef.current) {
      toast.dismiss(toastIdRef.current);
    }

    setIsLoading(true);
    try {
      const response = await authService.register({
        fullName: data.name,
        email: data.email,
        password: data.password,
      });

      // Check if response contains error (e.g. duplicate email)
      const resData = response as any;
      if (resData.success === false || resData.status === 'error' || resData.statusCode >= 400) {
        toastIdRef.current = toast.error(resData.message || t("auth.messages.registerFailed"));
        return;
      }

      toastIdRef.current = toast.success(t("auth.messages.registerSuccess"));

      router.push(
        `/${locale}/verify-otp?email=${encodeURIComponent(data.email)}&type=register`
      );
    } catch (error: unknown) {
      let errorMessage = t("auth.messages.registerFailed");

      if (error && typeof error === "object") {
        if ("response" in error && error.response) {
          const axiosError = error as {
            response?: {
              data?: {
                message?: string;
                status?: string;
                error?: string;
                data?: { message?: string };
              };
            };
          };

          const responseData = axiosError.response?.data;

          if (responseData) {
            errorMessage =
              responseData.message ||
              responseData.data?.message ||
              responseData.error ||
              errorMessage;
          }
        } else if ("message" in error) {
          errorMessage = (error as Error).message;
        }
      }

      if (process.env.NODE_ENV === "development") {
        const errorWithResponse = error as {
          response?: { data?: unknown };
        };
      }
      toastIdRef.current = toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFormSubmit = handleSubmit(
    (data) => {
      onSubmit(data);
    },
    (errors) => {
      const firstError = Object.values(errors)[0];
      if (firstError?.message) {
        toast.error(firstError.message);
      }
    }
  );

  return (
    <form onSubmit={handleFormSubmit} className="space-y-4 sm:space-y-5 w-full">
      <div className="space-y-1.5 sm:space-y-2 w-full">
        <Label
          htmlFor="name"
          className="text-xs sm:text-sm leading-normal text-gray-500 mb-1 block"
        >
          {t("auth.fullName")} *
        </Label>
        <Input
          id="name"
          {...register("name")}
          placeholder={t("auth.form.fullNamePlaceholder")}
          className="h-12 sm:h-14 px-3 text-sm sm:text-base bg-gray-100 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600 focus:bg-white focus:outline-none transition-colors w-full"
        />
        {errors.name && (
          <p className="text-xs sm:text-sm text-red-600 mt-1 flex items-center gap-1">
            <span className="w-1 h-1 bg-red-600 rounded-full" />
            {errors.name.message}
          </p>
        )}
      </div>

      <div className="space-y-1.5 sm:space-y-2 w-full">
        <Label
          htmlFor="email"
          className="text-xs sm:text-sm leading-normal text-gray-500 mb-1 block"
        >
          {t("auth.email")} *
        </Label>
        <Input
          id="email"
          type="email"
          {...register("email")}
          placeholder={t("auth.form.emailPlaceholder")}
          className="h-12 sm:h-14 px-3 text-sm sm:text-base bg-gray-100 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600 focus:bg-white focus:outline-none transition-colors w-full"
        />
        {errors.email && (
          <p className="text-xs sm:text-sm text-red-600 mt-1 flex items-center gap-1">
            <span className="w-1 h-1 bg-red-600 rounded-full" />
            {errors.email.message}
          </p>
        )}
      </div>

      <div className="space-y-1.5 sm:space-y-2 w-full">
        <Label
          htmlFor="password"
          className="text-xs sm:text-sm leading-normal text-gray-500 mb-1 block"
        >
          {t("auth.password")} *
        </Label>
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            {...register("password")}
            placeholder={t("auth.form.passwordPlaceholder")}
            className="h-12 sm:h-14 px-3 pr-10 text-sm sm:text-base bg-gray-100 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600 focus:bg-white focus:outline-none transition-colors w-full"
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
        {/* Password requirements - hiển thị khi đang nhập password */}
        {password && (
          <div className="mt-2 sm:mt-3 space-y-2">
            <div className="flex gap-1 h-1.5 sm:h-2">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className={`h-full flex-1 rounded-full transition-colors ${i < strength
                    ? strength <= 2
                      ? "bg-red-500"
                      : strength === 3
                        ? "bg-yellow-500"
                        : strength === 4
                          ? "bg-blue-500"
                          : "bg-green-500"
                    : "bg-gray-200"
                    }`}
                />
              ))}
            </div>
            <p className="text-xs flex items-center gap-2">
              {t("auth.form.passwordStrength")}{" "}
              <span
                className={`font-medium ${strength <= 2
                  ? "text-red-600"
                  : strength === 3
                    ? "text-yellow-600"
                    : strength === 4
                      ? "text-blue-600"
                      : "text-green-600"
                  }`}
              >
                {strength <= 2 && t("auth.form.passwordStrengthWeak")}
                {strength === 3 && t("auth.form.passwordStrengthMedium")}
                {strength === 4 && t("auth.form.passwordStrengthGood")}
                {strength >= 5 && t("auth.form.passwordStrengthStrong")}
              </span>
            </p>
            {/* Password requirements checklist */}
            <div className="mt-2 space-y-1">
              <p className="text-xs font-medium text-gray-600 mb-1.5">
                {t("auth.form.passwordRequirements")}
              </p>
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-xs">
                  <span
                    className={`w-1 h-1 rounded-full ${passwordRequirements.minLength
                      ? "bg-green-500"
                      : "bg-gray-300"
                      }`}
                  />
                  <span
                    className={
                      passwordRequirements.minLength
                        ? "text-gray-700"
                        : "text-gray-500"
                    }
                  >
                    {t("auth.form.passwordRequirementMinLength")}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <span
                    className={`w-1 h-1 rounded-full ${passwordRequirements.hasUpperCase
                      ? "bg-green-500"
                      : "bg-gray-300"
                      }`}
                  />
                  <span
                    className={
                      passwordRequirements.hasUpperCase
                        ? "text-gray-700"
                        : "text-gray-500"
                    }
                  >
                    {t("auth.form.passwordRequirementUpperCase")}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <span
                    className={`w-1 h-1 rounded-full ${passwordRequirements.hasLowerCase
                      ? "bg-green-500"
                      : "bg-gray-300"
                      }`}
                  />
                  <span
                    className={
                      passwordRequirements.hasLowerCase
                        ? "text-gray-700"
                        : "text-gray-500"
                    }
                  >
                    {t("auth.form.passwordRequirementLowerCase")}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <span
                    className={`w-1 h-1 rounded-full ${passwordRequirements.hasNumber
                      ? "bg-green-500"
                      : "bg-gray-300"
                      }`}
                  />
                  <span
                    className={
                      passwordRequirements.hasNumber
                        ? "text-gray-700"
                        : "text-gray-500"
                    }
                  >
                    {t("auth.form.passwordRequirementNumber")}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <span
                    className={`w-1 h-1 rounded-full ${passwordRequirements.hasSpecialChar
                      ? "bg-green-500"
                      : "bg-gray-300"
                      }`}
                  />
                  <span
                    className={
                      passwordRequirements.hasSpecialChar
                        ? "text-gray-700"
                        : "text-gray-500"
                    }
                  >
                    {t("auth.form.passwordRequirementSpecialChar")}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
        {errors.password && (
          <p className="text-xs sm:text-sm text-red-600 mt-1 flex items-center gap-1">
            <span className="w-1 h-1 bg-red-600 rounded-full" />
            {errors.password.message}
          </p>
        )}
      </div>

      <div className="space-y-1.5 sm:space-y-2 w-full">
        <Label
          htmlFor="confirmPassword"
          className="text-xs sm:text-sm leading-normal text-gray-500 mb-1 block"
        >
          {t("auth.form.confirmPassword")}
        </Label>
        <div className="relative">
          <Input
            id="confirmPassword"
            type={showConfirmPassword ? "text" : "password"}
            {...register("confirmPassword")}
            placeholder={t("auth.form.confirmPasswordPlaceholder")}
            className="h-12 sm:h-14 px-3 pr-10 text-sm sm:text-base bg-gray-100 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600 focus:bg-white focus:outline-none transition-colors w-full"
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
            tabIndex={-1}
          >
            {showConfirmPassword ? (
              <EyeOff className="h-4 w-4 sm:h-5 sm:w-5" />
            ) : (
              <Eye className="h-4 w-4 sm:h-5 sm:w-5" />
            )}
          </button>
        </div>
        {errors.confirmPassword && (
          <p className="text-xs sm:text-sm text-red-600 mt-1 flex items-center gap-1">
            <span className="w-1 h-1 bg-red-600 rounded-full" />
            {errors.confirmPassword.message}
          </p>
        )}
      </div>

      <div className="space-y-1.5 sm:space-y-2 w-full">
        <div className="flex items-start gap-2 pt-2">
          <Checkbox
            id="terms"
            checked={agreeTerms}
            onCheckedChange={(checked) => setAgreeTerms(checked === true)}
            className="border-gray-300 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600 w-4 h-4 sm:w-5 sm:h-5 mt-0.5 sm:mt-1 flex-shrink-0"
          />
          <Label
            htmlFor="terms"
            className="text-xs sm:text-sm text-gray-600 cursor-pointer leading-relaxed"
          >
            {t("auth.terms.agreeWith")}{" "}
            <Link
              href={`/${locale}/terms`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#4162e7] hover:text-[#3556d4] font-medium transition-colors underline"
            >
              {t("auth.terms.termsOfService")}
            </Link>{" "}
            {t("auth.terms.and")}{" "}
            <Link
              href={`/${locale}/privacy`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#4162e7] hover:text-[#3556d4] font-medium transition-colors underline"
            >
              {t("auth.terms.privacyPolicy")}
            </Link>
          </Label>
        </div>
      </div>

      <Button
        type="submit"
        className="w-full py-2.5 sm:py-3 bg-blue-600 hover:bg-blue-700 text-white text-sm sm:text-base font-bold rounded-lg transition-colors"
        disabled={isLoading || !agreeTerms}
      >
        {isLoading ? (
          <span className="flex items-center justify-center gap-2">
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            {t("auth.form.processing")}
          </span>
        ) : (
          t("auth.register")
        )}
      </Button>

      {/* Link to login */}
      <div className="text-center mt-4 sm:mt-5">
        <p
          className="text-xs sm:text-sm text-gray-600"
        >
          {t("auth.alreadyHaveAccount")}{" "}
          <Link
            href={`/${locale}/login`}
            className="text-[#4162e7] hover:text-[#3556d4] font-medium underline"
          >
            {t("auth.loginHere")}
          </Link>
        </p>
      </div>
    </form>
  );
}
