"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/useAuth";
import { userService, authService } from "@/services/apis";
import { toast } from "sonner";
import { getRedirectPathByRole } from "@/utils/role-utils";
import { useTranslations } from "next-intl";

interface SecuritySettingsProps {
  forceChange?: boolean;
}

export function SecuritySettings({ forceChange = false }: SecuritySettingsProps) {
  const { user, logout } = useAuth();
  const router = useRouter();
  const params = useParams();
  const locale = params.locale as string;
  const [loading, setLoading] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const t = useTranslations("teacher.settings.security");

  const handleChangePassword = async () => {
    if (!formData.currentPassword || !formData.newPassword) {
      toast.error(t("enterCurrentPassword"));
      return;
    }

    if (formData.newPassword.length < 6) {
      toast.error(t("passwordMinLength"));
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      toast.error(t("passwordMismatch"));
      return;
    }

    try {
      setLoading(true);
      await authService.changePassword({
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword,
      });

      toast.success('Đổi mật khẩu thành công');
      setFormData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });

      if (forceChange) {
        setTimeout(() => {
          const redirectPath = getRedirectPathByRole(user?.role, locale);
          router.push(redirectPath);
        }, 1500);
      }
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || t("passwordChangeError");
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      setLoggingOut(true);
      await logout();
      router.push(`/${locale}/login`);
    } catch {
      toast.error(t("logoutError"));
    } finally {
      setLoggingOut(false);
    }
  };

  return (
    <div className="space-y-[20px] px-[12px] py-[20px]">
      <header className="mb-0">
        <h2 className="text-[24px] font-medium leading-[32px] text-[#0f172a]" style={{ fontFamily: "Roboto, sans-serif", fontWeight: 500 }}>
          {t("title")}
        </h2>
        <p className="mt-[4px] text-[16px] leading-[24px] text-[#8c92ac]" style={{ fontFamily: "Roboto, sans-serif", fontWeight: 400 }}>
          {t("subtitle")}
        </p>
      </header>

      {/* Password Section */}
      <div className="space-y-[12px]">
        <p className="text-[16px] font-medium leading-[24px] text-[#3b3d48]" style={{ fontFamily: "Roboto, sans-serif", fontWeight: 500 }}>
          {t("changePassword")}
        </p>
        <div className="flex gap-[12px]">
          <div className="flex-1 flex flex-col gap-[4px]">
            <label className="text-[14px] leading-[20px] text-[#7f859d]" style={{ fontFamily: "Roboto, sans-serif", fontWeight: 400 }}>
              {t("currentPassword")} <span className="text-[#dc2626]">*</span>
            </label>
            <div className="relative">
              <Input
                type={showCurrentPassword ? "text" : "password"}
                autoComplete="current-password"
                className="h-[40px] border-[#f4f4f7] bg-[#f5f5f5] pr-10"
                placeholder="**************"
                value={formData.currentPassword}
                onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
              />
              <button
                type="button"
                onClick={() => setShowCurrentPassword((v) => !v)}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-[#7f859d] hover:text-[#3b3d48] rounded"
                aria-label={showCurrentPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
              >
                {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            <p className="text-[12px] leading-[16px] text-[#8c92ac]" style={{ fontFamily: "Roboto, sans-serif", fontWeight: 400 }}>
              Cập nhật lần cuối: 12 tháng 05 2025
            </p>
          </div>
          <div className="flex-1 flex flex-col gap-[4px]">
            <label className="text-[14px] leading-[20px] text-[#7f859d]" style={{ fontFamily: "Roboto, sans-serif", fontWeight: 400 }}>
              {t("newPassword")} <span className="text-[#dc2626]">*</span>
            </label>
            <div className="relative">
              <Input
                type={showNewPassword ? "text" : "password"}
                autoComplete="new-password"
                className="h-[40px] border-[#f4f4f7] bg-[#fafafa] pr-10"
                placeholder=" "
                value={formData.newPassword}
                onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
              />
              <button
                type="button"
                onClick={() => setShowNewPassword((v) => !v)}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-[#7f859d] hover:text-[#3b3d48] rounded"
                aria-label={showNewPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
              >
                {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>
          <div className="flex-1 flex flex-col gap-[4px]">
            <label className="text-[14px] leading-[20px] text-[#7f859d]" style={{ fontFamily: "Roboto, sans-serif", fontWeight: 400 }}>
              {t("confirmPassword")} <span className="text-[#dc2626]">*</span>
            </label>
            <div className="relative">
              <Input
                type={showConfirmPassword ? "text" : "password"}
                autoComplete="new-password"
                className="h-[40px] border-[#f4f4f7] bg-[#fafafa] pr-10"
                placeholder=" "
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword((v) => !v)}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-[#7f859d] hover:text-[#3b3d48] rounded"
                aria-label={showConfirmPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
              >
                {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>
        </div>
        <Button
          onClick={handleChangePassword}
          disabled={loading}
          variant="outline"
          className="h-[40px] border border-[#4162e7] bg-white text-[#4162e7] hover:bg-[#4162e7] hover:text-white px-[16px] py-[8px] rounded-[6px] cursor-pointer"
        >
          <span className="text-[14px] font-medium leading-[20px]" style={{ fontFamily: "Roboto, sans-serif", fontWeight: 500 }}>
            {loading ? t("updatingPassword") : t("updatePassword")}
          </span>
        </Button>
      </div>

      {/* Divider */}
      <div className="h-px bg-[#f4f4f7]"></div>

      {/* Connected Devices Section */}
      <div className="space-y-[12px]">
        <p className="text-[16px] font-medium leading-[24px] text-[#3b3d48]" style={{ fontFamily: "Roboto, sans-serif", fontWeight: 500 }}>
          {t("connectedDevices")}
        </p>
        <div className="bg-white rounded-[12px] px-[16px] py-[20px] space-y-[16px] min-w-[400px] border border-[#f4f4f7] shadow-[0px_0px_10px_0px_rgba(0,0,0,0.05)]">
          <div className="flex gap-[12px] items-center justify-between">
            <div className="w-[160px]">
              <p className="text-[14px] leading-[20px] text-[#252b37]" style={{ fontFamily: "Roboto, sans-serif", fontWeight: 400 }}>
                Browser
              </p>
            </div>
            <div className="flex-1 flex items-center justify-between">
              <p className="text-[14px] font-medium leading-[20px] text-[#0c0e12]" style={{ fontFamily: "Roboto, sans-serif", fontWeight: 500 }}>
                Safari
              </p>
              <button
                onClick={handleLogout}
                disabled={loggingOut}
                className="text-[14px] leading-[20px] text-[#dc2626] hover:text-[#b91c1c] transition-colors disabled:opacity-50"
                style={{ fontFamily: "Roboto, sans-serif", fontWeight: 400 }}
              >
                {loggingOut ? t("loggingOut") : t("logoutCurrent")}
              </button>
            </div>
          </div>
          <div className="flex gap-[12px]">
            <div className="w-[160px]">
              <p className="text-[14px] leading-[20px] text-[#252b37]" style={{ fontFamily: "Roboto, sans-serif", fontWeight: 400 }}>
                Location (approx)
              </p>
            </div>
            <div className="flex-1">
              <p className="text-[14px] font-medium leading-[20px] text-[#0c0e12]" style={{ fontFamily: "Roboto, sans-serif", fontWeight: 500 }}>
                Ho Chi Minh City, Vietnam
              </p>
            </div>
          </div>
          <div className="flex gap-[12px]">
            <div className="w-[160px]">
              <p className="text-[14px] leading-[20px] text-[#252b37]" style={{ fontFamily: "Roboto, sans-serif", fontWeight: 400 }}>
                IP Address
              </p>
            </div>
            <div className="flex-1">
              <p className="text-[14px] font-medium leading-[20px] text-[#0c0e12]" style={{ fontFamily: "Roboto, sans-serif", fontWeight: 500 }}>
                103.xx.xx.21
              </p>
            </div>
          </div>
          <div className="flex gap-[12px]">
            <div className="w-[160px]">
              <p className="text-[14px] leading-[20px] text-[#252b37]" style={{ fontFamily: "Roboto, sans-serif", fontWeight: 400 }}>
                Last active
              </p>
            </div>
            <div className="flex-1">
              <p className="text-[14px] font-medium leading-[20px] text-[#0c0e12]" style={{ fontFamily: "Roboto, sans-serif", fontWeight: 500 }}>
                5 mins ago
              </p>
            </div>
          </div>
          <Button
            variant="outline"
            onClick={handleLogout}
            disabled={loggingOut}
            className="h-[40px] border border-[#dc2626] bg-white text-[#dc2626] hover:bg-[#dc2626] hover:text-white px-[16px] py-[8px] rounded-[6px] cursor-pointer"
          >
            <span className="text-[14px] font-medium leading-[20px]" style={{ fontFamily: "Roboto, sans-serif", fontWeight: 500 }}>
              {loggingOut ? t("loggingOut") : t("logoutAll")}
            </span>
          </Button>
        </div>
      </div>
    </div>
  );
}
