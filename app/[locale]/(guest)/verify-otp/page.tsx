"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter, useSearchParams, useParams } from "next/navigation";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import { authService } from "@/services/apis";
import { Logo } from "@/components/shared/logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { OtpInput } from "@/components/forms/otp-input";
import { Loader2, Eye, EyeOff } from "lucide-react";

type VerifyStatus = "idle" | "verifying" | "success";

export default function VerifyOtpPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = useParams();
  const locale = params.locale as string;
  const t = useTranslations("auth.verifyOtp");
  const tVerifyEmail = useTranslations("auth.verifyEmail");

  const email = searchParams.get("email") || "";
  const type = searchParams.get("type");
  const [otpValue, setOtpValue] = useState("");
  const [otpKey, setOtpKey] = useState(0);
  const [verifyStatus, setVerifyStatus] = useState<VerifyStatus>("idle");
  const [otpError, setOtpError] = useState(false);
  const [resendTimer, setResendTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const toastIdRef = useRef<string | number | null>(null);

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => {
        setResendTimer(resendTimer - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [resendTimer]);

  const maskEmail = (email: string) => {
    if (!email) return "";
    const [localPart, domain] = email.split("@");
    if (!localPart || !domain) return email;
    const maskedLocal =
      localPart.length > 2
        ? localPart.slice(0, 2) + "****"
        : localPart[0] + "****";
    return `${maskedLocal}@${domain}`;
  };

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  const handleVerifyWithOtp = async (otp: string) => {
    if (otp.length !== 6) return;
    setOtpError(false);
    if (toastIdRef.current) {
      toast.dismiss(toastIdRef.current);
    }
    setVerifyStatus("verifying");
    try {
      let response;
      if (type === "reset-password") {
        response = await authService.verifyResetOtp({ email, otp });
      } else if (type === "register") {
        response = await authService.verifyRegistrationOTP(email, otp);
      } else {
        response = await authService.verifyEmail({ email, token: otp });
      }
      if (response.success === false || (response as any).status === "error") {
        setVerifyStatus("idle");
        setOtpError(true);
        toastIdRef.current = toast.error(response.message || t("verifyFailed"));
        return;
      }
      setVerifyStatus("success");
      if (type !== "reset-password") {
        toastIdRef.current = toast.success(t("verifySuccess"));
      }
    } catch (error: unknown) {
      setVerifyStatus("idle");
      setOtpError(true);
      let errorMessage = t("verifyFailed");
      if (error && typeof error === "object") {
        if ("response" in error && error.response) {
          const axiosError = error as {
            response?: { data?: { message?: string; data?: { message?: string } } };
          };
          const responseData = axiosError.response?.data;
          if (responseData) {
            errorMessage =
              responseData.message || responseData.data?.message || errorMessage;
          }
        } else if ("message" in error) {
          errorMessage = (error as Error).message;
        }
      }


      if (typeof errorMessage === "string") {
        if (errorMessage === "auth.verify_email.failed") {
          errorMessage = tVerifyEmail("failed");
        } else if (errorMessage === "auth.verify_email.token_expired") {
          errorMessage = tVerifyEmail("tokenExpired");
        }
      }

      toastIdRef.current = toast.error(errorMessage);
    }
  };

  const handleVerify = () => handleVerifyWithOtp(otpValue);

  const handleResend = async () => {
    if (!canResend || isResending || !email) return;
    setIsResending(true);
    try {
      if (type === "reset-password") {
        await authService.forgotPassword({ email });
      } else if (type === "register") {
        await authService.resendRegistrationOTP(email);
      } else {
        await authService.resendVerification({ email });
      }
      toast.success(t("resendSuccess"));
      setOtpKey((prev) => prev + 1);
      setResendTimer(30);
      setCanResend(false);
      setOtpValue("");
      setOtpError(false);
    } catch (error: unknown) {
      const errorMessage = (error as Error)?.message || t("resendFailed");
      toast.error(errorMessage);
    } finally {
      setIsResending(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 6) {
      toast.error(t("passwordMinLength"));
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error(t("passwordMismatch"));
      return;
    }
    setIsResetting(true);
    try {
      const response = await authService.resetPassword({
        email,
        token: otpValue,
        newPassword,
      });
      if (
        response.success === false ||
        (response as any).status === "error"
      ) {
        toast.error((response as any).message || t("verifyFailed"));
        return;
      }
      toast.success(t("resetPasswordSuccess"));
      router.push(`/${locale}/login`);
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message || error?.message || t("verifyFailed")
      );
    } finally {
      setIsResetting(false);
    }
  };

  const handleStartNow = () => {
    router.push(`/${locale}/login?verified=true`);
  };

  useEffect(() => {
    if (!email) {
      router.replace(`/${locale}/register`);
    }
  }, [email, locale, router]);

  if (!email) return null;

  return (
    <div className="flex items-center justify-center py-6 sm:py-12 px-4">
      <div className="w-full max-w-md">
        <div className="w-full bg-white rounded-xl sm:rounded-2xl overflow-hidden">
          {verifyStatus === "success" ? (
            <>
              {type === "reset-password" ? (
                // Reset password form - styled to match auth flow UI
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
                          {t("resetPasswordTitle")}
                        </h1>
                      </div>

                      <div className="p-4 md:p-6 lg:p-8">
                        <form
                          onSubmit={handleResetPassword}
                          className="space-y-5 sm:space-y-6"
                        >
                          <div className="space-y-1.5 sm:space-y-2">
                            <Label
                              htmlFor="newPassword"
                              className="text-xs sm:text-sm text-gray-500 mb-1 block"
                              style={{ fontFamily: "Roboto, sans-serif" }}
                            >
                              {t("newPassword")}
                            </Label>
                            <div className="relative">
                              <Input
                                id="newPassword"
                                type={showNewPassword ? "text" : "password"}
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                placeholder={t("newPassword")}
                                className="h-11 sm:h-12 px-3 pr-10 text-sm sm:text-base bg-gray-100 border-0 rounded-lg focus:ring-2 focus:ring-blue-600 focus:bg-white transition-colors"
                                style={{ fontFamily: "Roboto, sans-serif" }}
                                disabled={isResetting}
                              />
                              <button
                                type="button"
                                onClick={() => setShowNewPassword(!showNewPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                                tabIndex={-1}
                              >
                                {showNewPassword ? (
                                  <EyeOff className="h-4 w-4 sm:h-5 sm:w-5" />
                                ) : (
                                  <Eye className="h-4 w-4 sm:h-5 sm:w-5" />
                                )}
                              </button>
                            </div>
                          </div>

                          <div className="space-y-1.5 sm:space-y-2">
                            <Label
                              htmlFor="confirmPassword"
                              className="text-xs sm:text-sm text-gray-500 mb-1 block"
                              style={{ fontFamily: "Roboto, sans-serif" }}
                            >
                              {t("confirmNewPassword")}
                            </Label>
                            <div className="relative">
                              <Input
                                id="confirmPassword"
                                type={showConfirmPassword ? "text" : "password"}
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder={t("confirmNewPassword")}
                                className="h-11 sm:h-12 px-3 pr-10 text-sm sm:text-base bg-gray-100 border-0 rounded-lg focus:ring-2 focus:ring-blue-600 focus:bg-white transition-colors"
                                style={{ fontFamily: "Roboto, sans-serif" }}
                                disabled={isResetting}
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
                          </div>

                          <Button
                            type="submit"
                            disabled={isResetting}
                            className="w-full py-2.5 sm:py-3 bg-blue-600 hover:bg-blue-700 text-white text-sm sm:text-base font-bold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            style={{ fontFamily: "Roboto, sans-serif" }}
                          >
                            {isResetting ? (
                              <span className="flex items-center justify-center gap-2">
                                <Loader2 className="w-4 h-4 animate-spin" />
                                {t("verifying")}
                              </span>
                            ) : (
                              t("resetPassword")
                            )}
                          </Button>
                        </form>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                // Standard success view for register / verify-email
                <div className="p-6 flex flex-col gap-[20px] text-center">
                  <div className="mx-auto relative">
                    <div className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 mx-auto rounded-full bg-green-100 flex items-center justify-center">
                      <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-full bg-green-600 flex items-center justify-center">
                        <svg
                          className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 text-white"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={3}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col gap-[8px] items-center">
                    <h1
                      className="text-[30px] font-bold text-[#16A34A]"
                      style={{ fontFamily: "Roboto, sans-serif" }}
                    >
                      {type === "verify-email"
                        ? t("verifyEmail")
                        : type === "register"
                          ? t("registerComplete")
                          : t("registerComplete")}
                    </h1>
                    <p
                      className="text-[20px] text-black whitespace-nowrap"
                      style={{ fontFamily: "Roboto, sans-serif" }}
                    >
                      {type === "verify-email"
                        ? t("successMessage")
                        : type === "register"
                          ? t("registerSuccessMessage")
                          : t("registerSuccessMessage")}
                    </p>
                    <Button
                      onClick={handleStartNow}
                      className="w-full px-[16px] py-[8px] bg-[#0A0BD9] h-[44px] w-[115px] text-[#FAFAFA] text-[14px] font-bold rounded-[6px] transition-colors"
                      style={{ fontFamily: "Roboto, sans-serif" }}
                    >
                      {t("startNow")}
                    </Button>
                  </div>
                </div>
              )}
            </>
          ) : (
            // OTP input view
            <div className="p-6 sm:p-8 flex flex-col gap-[12px]">
              <div className="flex justify-center">
                <Logo variant="text" className="h-12 sm:h-14 md:h-16 w-auto" />
              </div>

              <h1
                className="text-[30px] font-bold text-black text-center"
                style={{ fontFamily: "Roboto, sans-serif" }}
              >
                {t("title")}
              </h1>

              <p
                className="text-sm sm:text-base text-gray-700"
                style={{ fontFamily: "Roboto, sans-serif" }}
              >
                {t("enterOtpCode")}
              </p>
              <p
                className="text-sm sm:text-base text-gray-700"
                style={{ fontFamily: "Roboto, sans-serif" }}
              >
                {t("emailSentMessage")}{" "}
                <span className="font-semibold text-gray-900">
                  {maskEmail(email)}
                </span>
              </p>

              <div className="w-full flex justify-between items-center gap-2">
                <OtpInput
                  key={otpKey}
                  length={6}
                  onOtpChange={(otp) => {
                    setOtpValue(otp);
                    if (otpError) setOtpError(false);
                  }}
                  onComplete={(otp) => {
                    setOtpValue(otp);
                    if (otpError) setOtpError(false);
                    // Auto-submit when all 6 digits entered
                    handleVerifyWithOtp(otp);
                  }}
                  disabled={verifyStatus === "verifying"}
                  error={otpError}
                  success={false}
                  className="w-full"
                />
              </div>

              {otpError && (
                <p
                  className="mt-1 text-sm text-red-600 text-center"
                  style={{ fontFamily: "Roboto, sans-serif" }}
                >
                  {t("otpInvalid")}
                </p>
              )}

              <div className="text-center">
                {canResend ? (
                  <div className="flex items-center justify-center gap-2">
                    <p
                      className="text-sm text-gray-700"
                      style={{ fontFamily: "Roboto, sans-serif" }}
                    >
                      {t("resendTimer")}{" "}
                      <span className="font-semibold">00:00</span>
                    </p>
                    <button
                      onClick={handleResend}
                      disabled={isResending}
                      className="text-sm text-[#0A0BD9] hover:text-[#0809b8] font-medium underline disabled:opacity-50 transition-colors"
                      style={{ fontFamily: "Roboto, sans-serif" }}
                    >
                      {isResending ? t("resending") : t("resend")}
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-2">
                    <p
                      className="text-sm text-gray-700"
                      style={{ fontFamily: "Roboto, sans-serif" }}
                    >
                      {t("resendTimer")}{" "}
                      <span className="font-semibold text-[#0A0BD9]">
                        {formatTimer(resendTimer)}
                      </span>
                    </p>
                    <button
                      onClick={handleResend}
                      disabled={true}
                      className="text-sm text-gray-400 font-medium cursor-not-allowed"
                      style={{ fontFamily: "Roboto, sans-serif" }}
                    >
                      {t("resend")}
                    </button>
                  </div>
                )}
              </div>

              <Button
                onClick={handleVerify}
                disabled={otpValue.length !== 6 || verifyStatus === "verifying"}
                className="w-full px-[16px] py-[8px] bg-[#0A0BD9] h-[44px] text-[#FAFAFA] text-[14px] font-bold rounded-[6px] transition-colors"
                style={{ fontFamily: "Roboto, sans-serif" }}
              >
                {verifyStatus === "verifying" ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    {t("verifying")}
                  </span>
                ) : (
                  t("confirm")
                )}
              </Button>

              <Button
                onClick={() => router.push(`/${locale}/login`)}
                variant="outline"
                className="w-full px-[16px] py-[8px] h-[44px] border border-[#0A0BD9] text-[#0A0BD9] text-[14px] rounded-[6px] transition-colors"
                style={{ fontFamily: "Roboto, sans-serif" }}
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M7.97508 4.94141L2.91675 9.99974L7.97508 15.0581"
                    stroke="#0A0BD9"
                    strokeMiterlimit="10"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M17.0833 10H3.05835"
                    stroke="#0A0BD9"
                    strokeMiterlimit="10"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                {t("backToLogin")}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
