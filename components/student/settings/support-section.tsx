"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import consultationService from "@/services/apis/consultation.service";

export function SupportSettings() {
  const { user } = useAuth();
  const t = useTranslations();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: user?.fullName || "",
    email: user?.email || "",
    phone: "",
    label: "",
    description: "",
  });

  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        fullName: user.fullName || "",
        email: user.email || "",
        phone: "",
      }));
    }
  }, [user]);

  const handleSubmit = async () => {
    if (!formData.fullName || !formData.email || !formData.description) {
      toast.error(t("page.student.settings.supportFormRequired"));
      return;
    }

    try {
      setLoading(true);
      await consultationService.submitConsultation({
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
      });
      toast.success(t("page.student.settings.supportRequestSubmitted"));
      setFormData((prev) => ({
        ...prev,
        phone: "",
        label: "",
        description: "",
      }));
    } catch (error: unknown) {
      toast.error(t("page.student.settings.supportRequestError"));
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
          {t("page.student.settings.supportCenter")}
        </h2>
        <p className="mt-1 text-sm text-[#7f859d]">
          {t("page.student.settings.supportCenterDesc")}
        </p>
      </header>

      {/* Form */}
      <div className="space-y-4">
        <div className="space-y-1.5">
          <label className="text-xs font-medium uppercase tracking-[0.08em] text-[#7f859d]">
            {t("page.student.settings.fullName")}
          </label>
          <Input
            className="h-10 border-[#dbdde5] bg-[#f9fafb]"
            placeholder={t("page.student.settings.enterFullName")}
            value={formData.fullName}
            onChange={(e) =>
              setFormData({ ...formData, fullName: e.target.value })
            }
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-medium uppercase tracking-[0.08em] text-[#7f859d]">
            {t("page.student.settings.email")}
          </label>
          <Input
            type="email"
            className="h-10 border-[#dbdde5] bg-[#f9fafb]"
            placeholder={t("page.student.settings.enterEmail")}
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-medium uppercase tracking-[0.08em] text-[#7f859d]">
            {t("page.student.settings.phone")}
          </label>
          <Input
            type="tel"
            className="h-10 border-[#dbdde5] bg-[#f9fafb]"
            placeholder={t("page.student.settings.enterPhone")}
            value={formData.phone}
            onChange={(e) =>
              setFormData({ ...formData, phone: e.target.value })
            }
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-medium uppercase tracking-[0.08em] text-[#7f859d]">
            {t("page.student.settings.label")}
          </label>
          <Select
            value={formData.label}
            onValueChange={(value) =>
              setFormData({ ...formData, label: value })
            }
          >
            <SelectTrigger className="h-10 border-[#dbdde5] bg-[#f9fafb]">
              <SelectValue placeholder={t("page.student.settings.selectOne")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="technical">
                {t("page.student.settings.technicalIssue")}
              </SelectItem>
              <SelectItem value="billing">
                {t("page.student.settings.billing")}
              </SelectItem>
              <SelectItem value="feedback">
                {t("page.student.settings.feedback")}
              </SelectItem>
              <SelectItem value="other">
                {t("page.student.settings.other")}
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-medium uppercase tracking-[0.08em] text-[#7f859d]">
            {t("page.student.settings.errorDescription")}
          </label>
          <Textarea
            className="min-h-[160px] border-[#dbdde5] bg-[#f9fafb]"
            placeholder={t("page.student.settings.enterDescription")}
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
          />
        </div>

        <div className="flex justify-end">
          <Button
            onClick={handleSubmit}
            disabled={loading}
            variant="outline"
            className="h-10 rounded-md border border-[#4162e7] bg-white px-6 text-sm font-medium text-[#4162e7] hover:bg-[#4162e7] hover:text-white"
          >
            {loading
              ? t("page.student.settings.sending")
              : t("page.student.settings.send")}
          </Button>
        </div>
      </div>
    </div>
  );
}

export function SupportSettingsMobile() {
  const { user } = useAuth();
  const t = useTranslations();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: user?.fullName || "",
    email: user?.email || "",
    phone: "",
    label: "",
    description: "",
  });

  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        fullName: user.fullName || "",
        email: user.email || "",
        phone: "",
      }));
    }
  }, [user]);

  const handleSubmit = async () => {
    if (!formData.fullName || !formData.email || !formData.description) {
      toast.error(t("page.student.settings.supportFormRequired"));
      return;
    }

    try {
      setLoading(true);
      await consultationService.submitConsultation({
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
      });
      toast.success(t("page.student.settings.supportRequestSubmitted"));
      setFormData((prev) => ({
        ...prev,
        phone: "",
        label: "",
        description: "",
      }));
    } catch (error: unknown) {
      toast.error(t("page.student.settings.supportRequestError"));
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
          {t("page.student.settings.supportCenter")}
        </h2>
        <p
          className="mt-1 text-sm text-[#8c92ac]"
          style={{ fontFamily: "Roboto, sans-serif" }}
        >
          {t("page.student.settings.supportCenterDesc")}
        </p>
      </header>

      {/* Form */}
      <div className="space-y-4">
        <div className="space-y-1.5">
          <label
            className="text-xs font-medium uppercase tracking-[0.08em] text-[#7f859d]"
            style={{ fontFamily: "Roboto, sans-serif" }}
          >
            {t("page.student.settings.fullName")}
          </label>
          <Input
            className="h-10 sm:h-11 border-[#dbdde5] bg-[#f9fafb]"
            placeholder={t("page.student.settings.enterFullName")}
            value={formData.fullName}
            onChange={(e) =>
              setFormData({ ...formData, fullName: e.target.value })
            }
          />
        </div>

        <div className="space-y-1.5">
          <label
            className="text-xs font-medium uppercase tracking-[0.08em] text-[#7f859d]"
            style={{ fontFamily: "Roboto, sans-serif" }}
          >
            {t("page.student.settings.email")}
          </label>
          <Input
            type="email"
            className="h-10 sm:h-11 border-[#dbdde5] bg-[#f9fafb]"
            placeholder={t("page.student.settings.enterEmail")}
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
          />
        </div>

        <div className="space-y-1.5">
          <label
            className="text-xs font-medium uppercase tracking-[0.08em] text-[#7f859d]"
            style={{ fontFamily: "Roboto, sans-serif" }}
          >
            {t("page.student.settings.phone")}
          </label>
          <Input
            type="tel"
            className="h-10 sm:h-11 border-[#dbdde5] bg-[#f9fafb]"
            placeholder={t("page.student.settings.enterPhone")}
            value={formData.phone}
            onChange={(e) =>
              setFormData({ ...formData, phone: e.target.value })
            }
          />
        </div>

        <div className="space-y-1.5">
          <label
            className="text-xs font-medium uppercase tracking-[0.08em] text-[#7f859d]"
            style={{ fontFamily: "Roboto, sans-serif" }}
          >
            {t("page.student.settings.label")}
          </label>
          <Select
            value={formData.label}
            onValueChange={(value) =>
              setFormData({ ...formData, label: value })
            }
          >
            <SelectTrigger className="h-10 sm:h-11 border-[#dbdde5] bg-[#f9fafb]">
              <SelectValue placeholder={t("page.student.settings.selectOne")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="technical">
                {t("page.student.settings.technicalIssue")}
              </SelectItem>
              <SelectItem value="billing">
                {t("page.student.settings.billing")}
              </SelectItem>
              <SelectItem value="feedback">
                {t("page.student.settings.feedback")}
              </SelectItem>
              <SelectItem value="other">
                {t("page.student.settings.other")}
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <label
            className="text-xs font-medium uppercase tracking-[0.08em] text-[#7f859d]"
            style={{ fontFamily: "Roboto, sans-serif" }}
          >
            {t("page.student.settings.errorDescription")}
          </label>
          <Textarea
            className="min-h-[120px] sm:min-h-[160px] border-[#dbdde5] bg-[#f9fafb]"
            placeholder={t("page.student.settings.enterDescription")}
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
          />
        </div>

        <div className="flex justify-end pt-4">
          <Button
            onClick={handleSubmit}
            disabled={loading}
            className="h-10 sm:h-11 w-full sm:w-auto rounded-md border border-[#4162e7] bg-white px-6 sm:px-8 text-sm sm:text-base font-medium text-[#4162e7] hover:bg-[#4162e7] hover:text-white"
          >
            {loading
              ? t("page.student.settings.sending")
              : t("page.student.settings.send")}
          </Button>
        </div>
      </div>
    </div>
  );
}
