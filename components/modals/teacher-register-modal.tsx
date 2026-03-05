"use client";

import { useState, useMemo } from "react";
import { X, ArrowRight } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import consultationService from "@/services/apis/consultation.service";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import Image from "next/image";

type TeacherRegisterFormData = {
  name: string;
  email: string;
  phone?: string;
};

interface TeacherRegisterModalProps {
  open: boolean;
  onClose: () => void;
}

export function TeacherRegisterModal({ open, onClose }: TeacherRegisterModalProps) {
  const t = useTranslations();
  const tModal = useTranslations("page.becomeTeacher.registerModal");
  const tConsultation = useTranslations("page.home.consultation");
  const [isLoading, setIsLoading] = useState(false);

  const teacherRegisterSchema = useMemo(() => z.object({
    name: z.string().min(2, tModal("nameMinLength")),
    email: z.string().email(tModal("emailInvalid")),
    phone: z.string().min(10, tModal("phoneInvalid")).optional(),
  }), [tModal]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<TeacherRegisterFormData>({
    resolver: zodResolver(teacherRegisterSchema),
  });

  const onSubmit = async (data: TeacherRegisterFormData) => {
    setIsLoading(true);
    try {
      const response = await consultationService.submitConsultation({
        fullName: data.name,
        email: data.email,
        phone: data.phone || "",
      });

      if (response.status === "success") {
        toast.success(tConsultation("successMessage"));
        reset();
        setTimeout(() => {
          onClose();
        }, 1000);
      } else {
        toast.error(response.message || tConsultation("errorGeneric"));
      }
    } catch (error) {
      toast.error(tConsultation("errorSubmit"));
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-[790px] p-0 bg-white rounded-2xl overflow-hidden [&>button]:hidden">
        <div className="relative flex w-full gap-0">
          {/* Left panel - SVG Image */}
          <div className="relative hidden md:block w-[250px] shrink-0 bg-[#4162e7] overflow-hidden rounded-l-2xl">
            <div className="absolute inset-0" style={{ borderRadius: '1rem 0 0 1rem', overflow: 'hidden' }}>
              <Image
                src="/icons/Frame.svg"
                alt="Teacher registration"
                width={250}
                height={444}
                className="w-full h-full"
                style={{
                  objectFit: 'cover',
                  borderRadius: '1rem 0 0 1rem'
                }}
                priority
              />
            </div>
          </div>

          {/* Right panel - Form */}
          <div className="flex flex-1 flex-col gap-6 sm:gap-8 p-6 sm:p-8 md:p-10">
            {/* Close button */}
            <button
              type="button"
              onClick={handleClose}
              className="absolute right-4 sm:right-6 top-4 sm:top-6 h-6 w-6 sm:h-8 sm:w-8 text-gray-400 transition-colors hover:text-gray-600 z-10 cursor-pointer"
              aria-label="Close"
            >
              <X className="h-6 w-6 sm:h-8 sm:w-8" />
            </button>

            {/* Title */}
            <DialogTitle asChild>
              <div className="flex flex-col gap-1">
                <h2
                  className="text-xl sm:text-2xl md:text-[30px] font-medium leading-7 sm:leading-8 md:leading-[40px] text-[#0f172a]"
                  style={{ fontFamily: "Be Vietnam Pro, sans-serif" }}
                >
                  {tModal("title")}
                </h2>
                <p
                  className="text-base sm:text-lg md:text-[20px] leading-6 sm:leading-7 text-[#0f172a]"
                  style={{ fontFamily: "Be Vietnam Pro, sans-serif" }}
                >
                  {tModal("subtitle")}
                </p>
              </div>
            </DialogTitle>

            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 sm:gap-6">
              {/* Name input */}
              <div className="flex flex-col gap-1">
                <label
                  htmlFor="name"
                  className="text-sm leading-5 text-[#7f859d]"
                  style={{ fontFamily: "Roboto, sans-serif", fontWeight: "normal" }}
                >
                  {tModal("nameLabel")}
                </label>
                <input
                  id="name"
                  type="text"
                  placeholder={tModal("namePlaceholder")}
                  className="h-10 sm:h-11 rounded-lg border border-[#f4f4f7] bg-[#fafafa] px-3 py-1 text-sm leading-5 text-[#0f172a] placeholder:text-[#7f859d] focus:border-[#4162e7] focus:outline-none"
                  style={{ fontFamily: "Roboto, sans-serif", fontWeight: "normal" }}
                  minLength={2}
                  required
                  onInvalid={(e) => {
                    const target = e.target as HTMLInputElement;
                    if (target.validity.valueMissing) {
                      target.setCustomValidity(
                        t("page.home.consultation.form.requiredMessage")
                      );
                    } else if (target.validity.tooShort) {
                      target.setCustomValidity(tModal("nameMinLength"));
                    } else {
                      target.setCustomValidity("");
                    }
                  }}
                  onInput={(e) => {
                    const target = e.target as HTMLInputElement;
                    target.setCustomValidity("");
                  }}
                  {...register("name")}
                />
              </div>

              {/* Email input */}
              <div className="flex flex-col gap-1">
                <label
                  htmlFor="email"
                  className="text-sm leading-5 text-[#7f859d]"
                  style={{ fontFamily: "Roboto, sans-serif", fontWeight: "normal" }}
                >
                  {tModal("emailLabel")}
                </label>
                <input
                  id="email"
                  type="email"
                  placeholder={tModal("emailPlaceholder")}
                  className="h-10 sm:h-11 rounded-lg border border-[#f4f4f7] bg-[#fafafa] px-3 py-1 text-sm leading-5 text-[#0f172a] placeholder:text-[#7f859d] focus:border-[#4162e7] focus:outline-none"
                  style={{ fontFamily: "Roboto, sans-serif", fontWeight: "normal" }}
                  required
                  onInvalid={(e) => {
                    const target = e.target as HTMLInputElement;
                    if (target.validity.valueMissing) {
                      target.setCustomValidity(
                        t("page.home.consultation.form.requiredMessage")
                      );
                    } else if (target.validity.typeMismatch) {
                      target.setCustomValidity(tModal("emailInvalid"));
                    } else {
                      target.setCustomValidity("");
                    }
                  }}
                  onInput={(e) => {
                    const target = e.target as HTMLInputElement;
                    target.setCustomValidity("");
                  }}
                  {...register("email")}
                />
              </div>

              {/* Phone input */}
              <div className="flex flex-col gap-1">
                <label
                  htmlFor="phone"
                  className="text-sm leading-5 text-[#7f859d]"
                  style={{ fontFamily: "Roboto, sans-serif", fontWeight: "normal" }}
                >
                  {tModal("phoneLabel")}
                </label>
                <input
                  id="phone"
                  type="tel"
                  placeholder={tModal("phonePlaceholder")}
                  className="h-10 sm:h-11 rounded-lg border border-[#f4f4f7] bg-[#fafafa] px-3 py-1 text-sm leading-5 text-[#0f172a] placeholder:text-[#7f859d] focus:border-[#4162e7] focus:outline-none"
                  style={{ fontFamily: "Roboto, sans-serif", fontWeight: "normal" }}
                  minLength={10}
                  onInvalid={(e) => {
                    const target = e.target as HTMLInputElement;
                    if (target.validity.tooShort) {
                      target.setCustomValidity(tModal("phoneInvalid"));
                    } else {
                      target.setCustomValidity("");
                    }
                  }}
                  onInput={(e) => {
                    const target = e.target as HTMLInputElement;
                    target.setCustomValidity("");
                  }}
                  {...register("phone")}
                />
              </div>

              {/* Submit button */}
              <button
                type="submit"
                disabled={isLoading}
                className="flex h-11 items-center justify-center gap-2 rounded-md bg-[#4162e7] px-4 py-2 text-sm font-medium leading-5 text-white shadow-[inset_0px_2px_4px_0px_#6b81da,inset_0px_-2px_4px_0px_#2848cb] transition-all hover:bg-[#3554d4] disabled:opacity-50 disabled:cursor-not-allowed mt-2 cursor-pointer"
                style={{ fontFamily: "Roboto, sans-serif" }}
              >
                {isLoading ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <span>{tModal("submit")}</span>
                    <ArrowRight className="h-5 w-5 shrink-0" />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
