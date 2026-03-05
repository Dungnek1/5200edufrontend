"use client";

import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
import { Logo } from "@/components/shared/logo";

export default function UnauthorizedPage() {
  const params = useParams();
  const router = useRouter();
  const locale = params.locale as string;

  return (
    <>
      <div className="flex flex-col items-center justify-center bg-gray-50 px-4">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="text-center mb-8">
            <Logo variant="text" className="h-12 mx-auto" />
          </div>

          {/* Error Card */}
          <Card className="bg-white shadow-lg">
            <CardContent className="p-8 text-center">
              <div className="flex justify-center mb-6">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                  <AlertCircle className="h-8 w-8 text-red-600" />
                </div>
              </div>

              <h1
                className="text-3xl font-bold text-gray-900 mb-4"
                style={{ fontFamily: "Roboto, sans-serif", fontWeight: 500 }}
              >
                403 - Không có quyền truy cập
              </h1>

              <p
                className="text-base text-gray-600 mb-8"
                style={{ fontFamily: "Roboto, sans-serif" }}
              >
                Bạn không có quyền truy cập trang này. Vui lòng liên hệ quản trị
                viên nếu bạn nghĩ đây là lỗi.
              </p>

              <div className="space-y-3">
                <Button
                  onClick={() => router.push(`/${locale}/dashboard`)}
                  className="w-full bg-[#4162e7] hover:bg-[#3556d4] text-white"
                  style={{ fontFamily: "Roboto, sans-serif" }}
                >
                  Về Dashboard
                </Button>

                <Button
                  variant="outline"
                  onClick={() => router.push(`/${locale}`)}
                  className="w-full border-gray-300"
                  style={{ fontFamily: "Roboto, sans-serif" }}
                >
                  Về Khám phá
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
