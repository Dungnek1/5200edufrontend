"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AlertCircle, Eye, EyeOff } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { authService } from "@/services/apis";
import { toast } from "sonner";
import { useTranslations } from "next-intl";

export function SecuritySettings({
  forceChange = false,
}: {
  forceChange?: boolean;
}) {
  const { user } = useAuth();
  const params = useParams();
  const router = useRouter();
  const locale = (params.locale as string) || "en";
  const t = useTranslations();
  const [loading, setLoading] = useState(false);
  const [showCurrentPw, setShowCurrentPw] = useState(false);
  const [showNewPw, setShowNewPw] = useState(false);
  const [showConfirmPw, setShowConfirmPw] = useState(false);
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleChangePassword = async () => {
    if (!formData.currentPassword) {
      toast.error(t("page.student.settings.enterCurrentPassword"));
      return;
    }

    if (!formData.newPassword) {
      toast.error(t("page.student.settings.enterNewPassword"));
      return;
    }

    if (formData.newPassword.length < 6) {
      toast.error(t("page.student.settings.passwordMinLength"));
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      toast.error(t("page.student.settings.passwordMismatch"));
      return;
    }

    try {
      setLoading(true);

      const response = await authService.changePassword({
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword,
      });

      const resData = response as any;
      if (resData.success === false || resData.status === "error" || resData.statusCode >= 400) {
        toast.error(resData.message || t("page.student.settings.passwordChangeError"));
        return;
      }

      toast.success(t("page.student.settings.passwordChangeSuccess"));

      setFormData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });

      if (forceChange) {
        setTimeout(() => {
          import("@/utils/role-utils").then((module) => {
            const redirectPath = module.getRedirectPathByRole(
              user?.role,
              locale,
            );
            router.push(redirectPath);
          });
        }, 1500);
      }
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message || error?.message || t("page.student.settings.passwordChangeError")
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <header className="mb-2">
        <h2
          className="text-lg font-medium text-[#1b2961]"
          style={{ fontFamily: "Roboto, sans-serif" }}
        >
          {t("page.student.settings.accountSecurity")}
        </h2>
        <p className="mt-1 text-sm text-[#7f859d]">
          {t("page.student.settings.accountSecurityDesc")}
        </p>
      </header>

      {/* Password block */}
      <div className="space-y-3">
        <p className="text-sm font-medium text-[#1b2961]">
          {t("page.student.settings.password")}
        </p>
        <div className="grid gap-3 grid-cols-1 sm:grid-cols-3">
          <div className="relative">
            <Input
              type={showCurrentPw ? "text" : "password"}
              className="h-10 border-[#dbdde5] bg-[#f9fafb] pr-10"
              placeholder={t("page.student.settings.currentPassword")}
              value={formData.currentPassword}
              onChange={(e) =>
                setFormData({ ...formData, currentPassword: e.target.value })
              }
            />
            <button type="button" onClick={() => setShowCurrentPw(!showCurrentPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700" tabIndex={-1}>
              {showCurrentPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          <div className="relative">
            <Input
              type={showNewPw ? "text" : "password"}
              className="h-10 border-[#dbdde5] bg-[#f9fafb] pr-10"
              placeholder={t("page.student.settings.newPassword")}
              value={formData.newPassword}
              onChange={(e) =>
                setFormData({ ...formData, newPassword: e.target.value })
              }
            />
            <button type="button" onClick={() => setShowNewPw(!showNewPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700" tabIndex={-1}>
              {showNewPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          <div className="relative">
            <Input
              type={showConfirmPw ? "text" : "password"}
              className="h-10 border-[#dbdde5] bg-[#f9fafb] pr-10"
              placeholder={t("page.student.settings.confirmPassword")}
              value={formData.confirmPassword}
              onChange={(e) =>
                setFormData({ ...formData, confirmPassword: e.target.value })
              }
            />
            <button type="button" onClick={() => setShowConfirmPw(!showConfirmPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700" tabIndex={-1}>
              {showConfirmPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>
        <Button
          onClick={handleChangePassword}
          disabled={loading}
          variant="outline"
          className="mt-1 h-9 w-fit rounded-[6px] border border-[#4162e7] bg-white px-4 text-xs font-medium text-[#4162e7] hover:bg-[#4162e7] hover:text-white"
        >
          {loading
            ? t("page.student.settings.updatingPassword")
            : t("page.student.settings.updatePassword")}
        </Button>
      </div>

      {/* Email verify */}
      <div className="space-y-3 border-t border-[#f1f1f5] pt-4">
        <p className="text-sm font-medium text-[#1b2961]">
          {t("page.student.settings.emailVerification")}
        </p>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Input
            type="email"
            className="h-10 flex-1 border-[#dbdde5] bg-[#f9fafb]"
            placeholder={user?.email || "mail@gmail.com"}
            disabled
          />
          <Button
            className="h-10 rounded-md bg-[#4162e7] px-6 text-sm font-medium text-white hover:bg-[#3554d4]"
            disabled
          >
            {true
              ? t("page.student.settings.verified")
              : t("page.student.settings.verify")}
          </Button>
        </div>
      </div>

      {/* Connected devices */}
      <div className="space-y-3 border-t border-[#f1f1f5] pt-4">
        <p className="text-sm font-medium text-[#1b2961]">
          {t("page.student.settings.connectedDevices")}
        </p>
        <p className="text-sm text-[#7f859d]">
          {t("page.student.settings.connectedDevicesDesc")}
        </p>
        <Button
          variant="outline"
          className="h-9 w-fit border-[#dbdde5] text-xs font-medium text-[#4162e7]"
          disabled
        >
          {t("page.student.settings.logoutAllDevices")}
        </Button>
      </div>
    </div>
  );
}

export function SecuritySettingsMobile({
  forceChange = false,
}: {
  forceChange?: boolean;
}) {
  const { user } = useAuth();
  const params = useParams();
  const router = useRouter();
  const locale = (params.locale as string) || "en";
  const t = useTranslations();
  const [loading, setLoading] = useState(false);
  const [showCurrentPw, setShowCurrentPw] = useState(false);
  const [showNewPw, setShowNewPw] = useState(false);
  const [showConfirmPw, setShowConfirmPw] = useState(false);
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleChangePassword = async () => {
    if (!formData.currentPassword) {
      toast.error(t("page.student.settings.enterCurrentPassword"));
      return;
    }

    if (!formData.newPassword) {
      toast.error(t("page.student.settings.enterNewPassword"));
      return;
    }

    if (formData.newPassword.length < 6) {
      toast.error(t("page.student.settings.passwordMinLength"));
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      toast.error(t("page.student.settings.passwordMismatch"));
      return;
    }

    try {
      setLoading(true);

      const response = await authService.changePassword({
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword,
      });

      const resData = response as any;
      if (resData.success === false || resData.status === "error" || resData.statusCode >= 400) {
        toast.error(resData.message || t("page.student.settings.passwordChangeError"));
        return;
      }

      toast.success(t("page.student.settings.passwordChangeSuccess"));

      setFormData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });

      if (forceChange) {
        setTimeout(() => {
          import("@/utils/role-utils").then((module) => {
            const redirectPath = module.getRedirectPathByRole(
              user?.role,
              locale,
            );
            router.push(redirectPath);
          });
        }, 1500);
      }
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message || error?.message || t("page.student.settings.passwordChangeError")
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <header>
        <h2
          className="text-lg sm:text-xl font-bold text-[#3b3d48]"
          style={{ fontFamily: "Roboto, sans-serif" }}
        >
          {t("page.student.settings.accountSecurity")}
        </h2>
        <p
          className="mt-1 text-sm text-[#8c92ac]"
          style={{ fontFamily: "Roboto, sans-serif" }}
        >
          {t("page.student.settings.accountSecurityDesc")}
        </p>
      </header>

      {/* Password */}
      <div className="space-y-4">
        <h3
          className="text-base sm:text-lg font-bold text-[#3b3d48]"
          style={{ fontFamily: "Roboto, sans-serif" }}
        >
          {t("page.student.settings.password")}
        </h3>
        <div className="space-y-3">
          <div className="space-y-1.5">
            <label
              className="text-xs font-medium uppercase tracking-[0.08em] text-[#7f859d]"
              style={{ fontFamily: "Roboto, sans-serif" }}
            >
              {t("page.student.settings.currentPassword")} *
            </label>
            <div className="relative">
              <Input
                type={showCurrentPw ? "text" : "password"}
                className="h-10 sm:h-11 border-[#dbdde5] bg-[#f9fafb] pr-10"
                placeholder={t("page.student.settings.currentPassword")}
                value={formData.currentPassword}
                onChange={(e) =>
                  setFormData({ ...formData, currentPassword: e.target.value })
                }
              />
              <button type="button" onClick={() => setShowCurrentPw(!showCurrentPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700" tabIndex={-1}>
                {showCurrentPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>
          <div className="space-y-1.5">
            <label
              className="text-xs font-medium uppercase tracking-[0.08em] text-[#7f859d]"
              style={{ fontFamily: "Roboto, sans-serif" }}
            >
              {t("page.student.settings.newPassword")} *
            </label>
            <div className="relative">
              <Input
                type={showNewPw ? "text" : "password"}
                className="h-10 sm:h-11 border-[#dbdde5] bg-[#f9fafb] pr-10"
                placeholder={t("page.student.settings.newPassword")}
                value={formData.newPassword}
                onChange={(e) =>
                  setFormData({ ...formData, newPassword: e.target.value })
                }
              />
              <button type="button" onClick={() => setShowNewPw(!showNewPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700" tabIndex={-1}>
                {showNewPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>
          <div className="space-y-1.5">
            <label
              className="text-xs font-medium uppercase tracking-[0.08em] text-[#7f859d]"
              style={{ fontFamily: "Roboto, sans-serif" }}
            >
              {t("page.student.settings.confirmPassword")} *
            </label>
            <div className="relative">
              <Input
                type={showConfirmPw ? "text" : "password"}
                className="h-10 sm:h-11 border-[#dbdde5] bg-[#f9fafb] pr-10"
                placeholder={t("page.student.settings.confirmPassword")}
                value={formData.confirmPassword}
                onChange={(e) =>
                  setFormData({ ...formData, confirmPassword: e.target.value })
                }
              />
              <button type="button" onClick={() => setShowConfirmPw(!showConfirmPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700" tabIndex={-1}>
                {showConfirmPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>
          <Button
            onClick={handleChangePassword}
            disabled={loading}
            className="h-10 sm:h-11 rounded-md border border-[#4162e7] bg-white px-6 text-sm sm:text-base font-medium text-[#4162e7] hover:bg-[#4162e7] hover:text-white"
          >
            {loading
              ? t("page.student.settings.updatingPassword")
              : t("page.student.settings.updatePassword")}
          </Button>
        </div>
      </div>

      {/* Email Verification */}
      <div className="space-y-4 border-t border-[#f1f1f5] pt-4">
        <h3
          className="text-base sm:text-lg font-bold text-[#3b3d48]"
          style={{ fontFamily: "Roboto, sans-serif" }}
        >
          {t("page.student.settings.emailVerification")}
        </h3>
        <div className="space-y-3">
          <Input
            type="email"
            className="h-10 sm:h-11 border-[#dbdde5] bg-[#f9fafb]"
            placeholder={user?.email || "mail@gmail.com"}
            disabled
          />
          <Button
            className="w-full h-10 sm:h-11 rounded-md bg-[#4162e7] px-6 text-sm sm:text-base font-medium text-white hover:bg-[#3554d4]"
            disabled
          >
            {true
              ? t("page.student.settings.verified")
              : t("page.student.settings.verify")}
          </Button>
        </div>
      </div>

      {/* Connected Devices */}
      <div className="space-y-4 border-t border-[#f1f1f5] pt-4">
        <h3
          className="text-base sm:text-lg font-bold text-[#3b3d48]"
          style={{ fontFamily: "Roboto, sans-serif" }}
        >
          {t("page.student.settings.connectedDevices")}
        </h3>
        <p
          className="text-sm text-[#8c92ac]"
          style={{ fontFamily: "Roboto, sans-serif" }}
        >
          {t("page.student.settings.connectedDevicesDesc")}
        </p>
        <Button
          variant="outline"
          className="h-10 sm:h-11 w-full border-[#dbdde5] text-sm sm:text-base font-medium text-[#4162e7] hover:bg-[#eef2ff]"
          disabled
        >
          {t("page.student.settings.logoutAllDevices")}
        </Button>
      </div>
    </div>
  );
}

export { AlertCircle };
