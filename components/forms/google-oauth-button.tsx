"use client";

import { toast } from "sonner";
import { GoogleLogin } from "@react-oauth/google";
import { useRouter, useParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { useTranslations } from "next-intl";

/**
 * Google OAuth Button - Uses NextAuth for authentication
 */
export function GoogleOAuthButton() {
  const t = useTranslations();
  const router = useRouter();
  const params = useParams();
  const locale = (params.locale as string) || "vi";
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleSuccess = async (credentialResponse: any) => {
    setIsLoading(true);
    try {
      const { credential } = credentialResponse;

      const payload = JSON.parse(atob(credential.split(".")[1]));

      const result = await signIn("credentials", {
        type: "google",
        token: credential,
        user: JSON.stringify({
          email: payload.email,
          name: payload.name,
          picture: payload.picture,
        }),
        redirect: false,
      });

      if (result?.error) {
        throw new Error(result.error);
      }

      toast.success(t("auth.messages.googleLoginSuccess"));

      router.push(`/${locale}`);
      router.refresh();
    } catch (error: any) {
      toast.error(
        error?.message || t("auth.messages.googleLoginFailed")
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleError = () => {
    toast.error(t("auth.messages.googleLoginError"));
    setIsLoading(false);
  };

  return (
    <div className="relative w-full flex justify-center px-4">
      {isLoading && (
        <div className="absolute inset-0 bg-white/50 flex items-center justify-center z-10 rounded-full">
          <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      <div className="w-full max-w-md flex justify-center">
        <GoogleLogin
          onSuccess={handleGoogleSuccess}
          onError={handleGoogleError}
          useOneTap={false}
          type="standard"
          theme="outline"
          size="large"
          text="signin_with"
          shape="circle"
          width="100%"
        />
      </div>
    </div>
  );
}
