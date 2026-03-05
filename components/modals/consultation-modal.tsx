"use client";

import { useState } from "react";
import { X, ArrowRight, Headphones } from "lucide-react";
import { toast } from "sonner";

import consultationService from "@/services/apis/consultation.service";
import { useTranslations } from "next-intl";

type ConsultationModalProps = {
  open: boolean;
  onClose: () => void;
};

export function ConsultationModal({ open, onClose }: ConsultationModalProps) {
  const t = useTranslations("page.home.consultation");
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!open) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await consultationService.submitConsultation({
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
      });

      if (response.status === "success") {
        toast.success(t("successMessage"));
        setFormData({ fullName: "", email: "", phone: "" });
        setTimeout(() => {
          onClose();
        }, 1000);
      } else {
        setError(response.message || t("errorGeneric"));
      }
    } catch (err) {
      setError(t("errorSubmit"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="relative w-full max-w-[790px] rounded-2xl bg-white p-0 shadow-xl overflow-hidden">
        <div className="flex w-full gap-0">
          {/* Left panel - Blue pattern background */}
          {/* Left panel - Image */}
          <div className="relative hidden md:block w-[250px] shrink-0 bg-[#4162e7] overflow-hidden rounded-l-2xl">
            <div className="absolute inset-0" style={{ borderRadius: '1rem 0 0 1rem', overflow: 'hidden' }}>
              <img
                src="/icons/Frame.svg"
                alt="Consultation"
                width={250}
                height={444}
                className="w-full h-full"
                style={{
                  objectFit: 'cover',
                  borderRadius: '1rem 0 0 1rem'
                }}


              />
            </div>
          </div>

          {/* Right panel - Form */}
          <div className="relative flex flex-1 flex-col gap-6 p-6 sm:p-8 md:p-10">
            {/* Close button */}
            <button
              type="button"
              onClick={onClose}
              className="absolute right-4 top-4 h-6 w-6 text-gray-400 transition-colors hover:text-gray-600 sm:right-6 sm:top-6 cursor-pointer"
              aria-label="Close"
            >
              <X className="h-6 w-6" />
            </button>
            {/* Title */}
            <h2
              className="text-[30px] font-medium leading-[40px] text-[#0f172a]"
              style={{ fontFamily: "Be Vietnam Pro, sans-serif" }}
            >
              {t("title")}
            </h2>

            {/* Form */}
            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
              {/* Error message */}
              {error && (
                <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
                  {error}
                </div>
              )}

              {/* Name input */}
              <div className="flex h-16 flex-col gap-1">
                <label
                  className="text-sm leading-5 text-[#7f859d]"
                  style={{
                    fontFamily: "Roboto, sans-serif",
                    fontWeight: "normal",
                  }}
                >
                  {t("form.fullName")}
                </label>
                <input
                  type="text"
                  placeholder={t("form.fullNamePlaceholder")}
                  className="h-10 rounded-lg border border-[#f4f4f7] bg-[#fafafa] px-3 py-1 text-sm leading-5 text-[#0f172a] placeholder:text-[#7f859d] focus:border-[#4163e7] focus:outline-none disabled:opacity-50"
                  style={{
                    fontFamily: "Roboto, sans-serif",
                    fontWeight: "normal",
                  }}
                  value={formData.fullName}
                  onChange={(e) =>
                    setFormData({ ...formData, fullName: e.target.value })
                  }
                  disabled={loading}
                  required
                />
              </div>

              {/* Email input */}
              <div className="flex h-16 flex-col gap-1">
                <label
                  className="text-sm leading-5 text-[#7f859d]"
                  style={{
                    fontFamily: "Roboto, sans-serif",
                    fontWeight: "normal",
                  }}
                >
                  {t("form.email")}
                </label>
                <input
                  type="email"
                  placeholder={t("form.emailPlaceholder")}
                  className="h-10 rounded-lg border border-[#f4f4f7] bg-[#fafafa] px-3 py-1 text-sm leading-5 text-[#0f172a] placeholder:text-[#7f859d] focus:border-[#4163e7] focus:outline-none disabled:opacity-50"
                  style={{
                    fontFamily: "Roboto, sans-serif",
                    fontWeight: "normal",
                  }}
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  disabled={loading}
                  required
                />
              </div>

              {/* Phone input */}
              <div className="flex h-16 flex-col gap-1">
                <label
                  className="text-sm leading-5 text-[#7f859d]"
                  style={{
                    fontFamily: "Roboto, sans-serif",
                    fontWeight: "normal",
                  }}
                >
                  {t("form.phone")}
                </label>
                <input
                  type="tel"
                  placeholder={t("form.phonePlaceholder")}
                  className="h-10 rounded-lg border border-[#f4f4f7] bg-[#fafafa] px-3 py-1 text-sm leading-5 text-[#0f172a] placeholder:text-[#7f859d] focus:border-[#4163e7] focus:outline-none disabled:opacity-50"
                  style={{
                    fontFamily: "Roboto, sans-serif",
                    fontWeight: "normal",
                  }}
                  value={formData.phone}
                  onChange={(e) => {
                    const value = e.target.value.replace(/[^0-9]/g, "");
                    setFormData({ ...formData, phone: value });
                  }}
                  pattern="[0-9]{10,11}"
                  maxLength={11}
                  disabled={loading}
                  required
                />
              </div>

              {/* Submit button */}
              <button
                type="submit"
                disabled={loading}
                className={`flex h-11 items-center justify-center gap-2 rounded-md bg-[#4163e7] px-4 py-2 text-sm font-medium leading-5 text-white shadow-[inset_0px_2px_4px_0px_#6b81da,inset_0px_-2px_4px_0px_#2848cb] transition-all cursor-pointer ${
                  loading ? "opacity-50 cursor-not-allowed" : "hover:bg-[#3554d4]"
                }`}
                style={{ fontFamily: "Roboto, sans-serif" }}
              >
                <Headphones className="w-5 h-5 shrink-0 text-[#c4cef8]" strokeWidth={1.5} />
                <span className="text-sm font-medium leading-5 text-[#fafafa]">
                  {loading ? t("submitSending") : t("form.submit")}
                </span>
                {!loading && <ArrowRight className="h-5 w-5 shrink-0" />}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
