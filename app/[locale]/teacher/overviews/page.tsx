"use client";

import { useEffect } from "react";
import { BecomeTeacherPageLayout } from "@/components/teacher/become-teacher/page-layout";
import { useBecomeTeacherPage } from "@/hooks/use-become-teacher-page";
import { toast } from "sonner";
import { useTranslations } from "next-intl";

export default function TeacherOverviewsPage() {
  const pageData = useBecomeTeacherPage();
  const t = useTranslations();

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const flag = window.localStorage.getItem("login_success");
      if (flag === "1") {
        const timeoutId = window.setTimeout(() => {
          toast.success(t("auth.messages.loginSuccess"), { duration: 2000 });
          window.localStorage.removeItem("login_success");
        }, 200);
        return () => window.clearTimeout(timeoutId);
      }
    } catch {
      // ignore storage errors
    }
  }, [t]);

  return <BecomeTeacherPageLayout pageData={pageData} />;
}
