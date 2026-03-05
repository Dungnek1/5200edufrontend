"use client";

import { NextIntlClientProvider } from "next-intl";
import { notFound, usePathname } from "next/navigation";
import { locales, type Locale } from "@/i18n";
import { useParams } from "next/navigation";
import { useEffect, useState, useMemo } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { PageTransitionProvider } from "@/components/shared/page-transition-provider";
import { Toaster } from "@/components/ui/sonner";
import { LogoSplashLoader } from "@/components/shared";

/** Auth routes that should not display the Footer */
const AUTH_ROUTES = ["/login", "/register", "/verify-otp", "/forgot-password"];

export default function LocaleLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const params = useParams();
  const locale = params.locale as string;
  const pathname = usePathname();

  // Hide footer on auth pages (login, register, OTP, forgot-password)
  const isAuthPage = useMemo(() => {
    const pathWithoutLocale = pathname.replace(`/${locale}`, "") || "/";
    return AUTH_ROUTES.some((route) => pathWithoutLocale === route);
  }, [pathname, locale]);

  const [messages, setMessages] = useState<any>(null);

  useEffect(() => {
    import(`@/messages/${locale}.json`).then((m) => setMessages(m.default || m));
  }, [locale]);

  if (!locales.includes(locale as Locale)) {
    notFound();
  }

  if (!messages) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <LogoSplashLoader />
      </div>
    );
  }

  return (
    <NextIntlClientProvider messages={messages} locale={locale}>
      <PageTransitionProvider />
      <div className="min-h-screen flex flex-col overflow-x-clip overflow-y-visible">
        <Header />
        <main className="flex-1 overflow-x-clip overflow-y-visible">
          {children}
        </main>
        {!isAuthPage && <Footer />}
      </div>
      <Toaster position="top-right" offset="72px" richColors />
    </NextIntlClientProvider>
  );
}
