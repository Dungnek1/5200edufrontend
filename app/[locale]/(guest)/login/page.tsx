"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useParams } from "next/navigation";
import { LoginForm } from "@/components/forms/login-form";
import { RegisterForm } from "@/components/forms/register-form";
import { Logo } from "@/components/shared/logo";
import { useTranslations } from "next-intl";

export default function LoginPage() {
  const t = useTranslations();
  const searchParams = useSearchParams();
  const params = useParams();
  const locale = params.locale as string;
  const tabParam = searchParams.get("tab");
  const [isLoginView, setIsLoginView] = useState<boolean>(
    tabParam !== "register"
  );


  useEffect(() => {
    setIsLoginView(tabParam !== "register");
  }, [tabParam]);

  const handleTabChange = (isLogin: boolean) => {
    setIsLoginView(isLogin);
    // Update URL without navigation to avoid delay
    const newUrl = isLogin ? `/${locale}/login` : `/${locale}/register`;
    window.history.replaceState(null, "", newUrl);
  };

  return (
    <div className={`flex items-center justify-center py-6 sm:py-12 px-4 ${isLoginView ? 'pb-[200px] sm:pb-[240px]' : ''}`}>
      <div className="w-full max-w-md">

        <div className={`flex justify-center mb-6 sm:mb-8`}>
          <Logo
            variant="text"
            className="h-12 sm:h-14 md:h-16 lg:h-20 w-auto"
          />
        </div>


        <div className="w-full bg-white border-2 border-blue-600 rounded-xl sm:rounded-2xl shadow-lg overflow-hidden">

          <div
            className={`flex w-full bg-blue-600 relative h-[50px] sm:h-[60px]`}
          >

            <button

              onClick={() => handleTabChange(true)}
              className={`relative flex-1 text-center font-bold ${isLoginView ? "bg-white text-blue-600 z-20" : "text-white z-10"
                }`}
              style={{
                fontFamily: "Roboto, sans-serif",
                fontSize: "14px",
                borderTopLeftRadius: "12px",

                borderTopRightRadius: isLoginView ? "50px" : "0px",
              }}
            >
              {t("auth.login")}
            </button>


            <button

              onClick={() => handleTabChange(false)}
              className={`relative flex-1 text-center font-bold ${!isLoginView ? "bg-white text-blue-600 z-20" : "text-white z-10"
                }`}
              style={{
                fontFamily: "Roboto, sans-serif",
                fontSize: "14px",
                borderTopRightRadius: "12px",

                borderTopLeftRadius: !isLoginView ? "50px" : "0px",
              }}
            >
              {t("auth.registerAccount")}
            </button>


            <div
              className={`absolute bottom-0 pointer-events-none ${isLoginView
                ? "left-1/2 -translate-x-full"
                : "right-1/2 translate-x-full"
                }`}
              style={{
                width: "60px",
                height: "60px",
                zIndex: 15,

                maskImage: isLoginView
                  ? "radial-gradient(ellipse 60px 50px at 0% 0%, transparent 40px, black 43px)"
                  : "radial-gradient(ellipse 60px 50px at 100% 0%, transparent 40px, black 43px)",
                WebkitMaskImage: isLoginView
                  ? "radial-gradient(ellipse 60px 50px at 0% 0%, transparent 40px, black 43px)"
                  : "radial-gradient(ellipse 60px 50px at 100% 0%, transparent 40px, black 43px)",
                backgroundColor: "#2563eb",
              }}
            />
          </div>


          <div className={`p-4 md:p-6 lg:p-8 overflow-hidden`}>
            {isLoginView ? (
              <div className={`space-y-5 sm:space-y-6`}>
                <LoginForm />
              </div>
            ) : (
              <div className={`space-y-5 sm:space-y-6`}>
                <RegisterForm />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
