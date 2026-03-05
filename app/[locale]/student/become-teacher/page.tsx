"use client";

import { BecomeTeacherPageLayout } from "@/components/teacher/become-teacher/page-layout";
import { useBecomeTeacherPage } from "@/hooks/use-become-teacher-page";

export default function BecomeTeacherPage() {
  const pageData = useBecomeTeacherPage();
  return <BecomeTeacherPageLayout pageData={pageData} />;
}
