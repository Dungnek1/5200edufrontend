"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowLeft, Menu, Bell, Check } from "lucide-react";
import { Course } from "@/types/course";
import { CourseCard } from "@/components/home/course-card";
import { useTranslations } from "next-intl";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { LoadingOverlay } from "@/components/shared/loading-overlay";
import publicCourseService from "@/services/apis/public-course.service";
import studentCourseService from "@/services/apis/student-course.service";
import { orderService } from "@/services/apis";
import { logger } from "@/lib/logger";
import { formatPrice } from "@/utils/formatPrice";
import { PaymentMethods } from "@/components/student/payment/payment-methods";
import { PaymentProcessing } from "@/components/student/payment/payment-processing";
import { PaymentSuccess } from "@/components/student/payment/payment-success";
import { PaymentFailure } from "@/components/student/payment/payment-failure";

type PaymentStep = "checkout" | "processing" | "success" | "failure";

export default function CourseCheckoutPage() {
  const t = useTranslations("page.student.checkout");
  const params = useParams();
  const locale = (params.locale as string) || "vi";
  const slug = params.slug as string;
  const router = useRouter();
  const { isAuthenticated, user, isLoading } = useAuth();

  const [paymentStep, setPaymentStep] = useState<PaymentStep>("checkout");
  const [paymentMethod, setPaymentMethod] = useState<"qr" | "momo" | null>(null);
  const [isChecking, setIsChecking] = useState(true);
  const [course, setCourse] = useState<Course | null>(null);
  const [couponCode, setCouponCode] = useState<string[]>([]);
  const [appliedCouponCodes, setAppliedCouponCodes] = useState<string[]>([]);
  const [isCreatingOrder, setIsCreatingOrder] = useState(false);
  const [suggestedCourses, setSuggestedCourses] = useState<Course[]>([]);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const response = await publicCourseService.getCourse(slug);
        if (response.success && response.data) {
          setCourse(response.data);
          setCouponCode(response.data.coupons.map(coupon => coupon.code) || []);
        }
      } catch (error) {
        logger.error("Failed to fetch course:", error);
      }
    };

    fetchCourse();
  }, [slug]);



  useEffect(() => {
    if (!course) return;

    const fetchRelatedCourses = async () => {
      try {
        const relatedResponse = await publicCourseService.getCourses({
          categoryIds: course.categoryIds,
          teacherId: course.ownerTeacher?.id,
          limit: 4,
        });
        setSuggestedCourses(relatedResponse.data || []);
      } catch (error) {
        logger.error("Failed to fetch related courses:", error);
      }
    };

    fetchRelatedCourses();
  }, [course]);






  const handlePayment = async (paymentMethod: "qr" | "momo") => {
    if (!course || course.price === undefined) {
      toast.error(t("messages.orderCreationError"));
      return;
    }

    setIsCreatingOrder(true);
    try {
      const payload = {
        cartItems: [
          {
            courseId: course.id,
            price: course.price,
            quantity: 1,
          },
        ],
        ...(appliedCouponCodes.length > 0
          ? { couponCodes: appliedCouponCodes }
          : {}),
      };

      const response = await orderService.createOrder(payload);

      if (!response.success) {
        toast.error(response.message || t("messages.orderCreationError"));
        setIsCreatingOrder(false);
        return;
      }
      setPaymentMethod(paymentMethod);
      setPaymentStep("processing");
      setIsCreatingOrder(false);
    } catch (error: unknown) {
      logger.error("Error creating order:", error);
      let errorMessage = "Có lỗi khi tạo đơn hàng. Vui lòng thử lại.";

      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (
        typeof error === "object" &&
        error !== null &&
        "response" in error
      ) {
        const axiosError = error as {
          response?: { data?: { message?: string } };
        };
        errorMessage = axiosError.response?.data?.message || errorMessage;
      }

      toast.error(errorMessage);
      setIsCreatingOrder(false);
    }
  };

  const handlePaymentComplete = async () => {
    try {
      await studentCourseService.enrollFreeCourse(course?.id || "");
      setPaymentStep("success");
    } catch (error) {
      logger.error("Error enrolling in course:", error);
      setPaymentStep("failure");
    }
  };

  const handlePaymentError = () => {
    setPaymentStep("failure");
  };




  useEffect(() => {
    if (isLoading) return;

    const checkAuth = async () => {
      await new Promise((resolve) => setTimeout(resolve, 300));

      if (!isAuthenticated) {
        toast.warning(t("messages.pleaseLogin"));
        router.push(`/${locale}/login`);
        return;
      }

      if (!user || user.role !== "STUDENT") {
        toast.error(t("messages.studentOnly"));
        router.push(`/${locale}`);
        return;
      }

      setIsChecking(false);
    };

    checkAuth();
  }, [isAuthenticated, user, isLoading, locale, router, t]);

  if (!isAuthenticated || !user || user.role !== "STUDENT") {
    return null;
  }

  if (!course) {
    return (
      <LoadingOverlay loading={true} fullScreen>
        <div></div>
      </LoadingOverlay>
    );
  }


  const MobileHeader = () => (
    <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-[#dbdde5]">
      <div className="flex items-center justify-between px-4 py-3">
        <button
          onClick={() => paymentStep === "processing" ? setPaymentStep("checkout") : router.back()}
          className="w-10 h-10 flex items-center justify-center hover:opacity-70 transition-opacity"
        >
          <ArrowLeft className="w-6 h-6 text-[#3b3d48]" />
        </button>
        <div className="flex items-center gap-2">
          <button className="w-10 h-10 flex items-center justify-center hover:opacity-70 transition-opacity">
            <Bell className="w-6 h-6 text-[#3b3d48]" />
          </button>
          <button className="w-10 h-10 flex items-center justify-center hover:opacity-70 transition-opacity">
            <Menu className="w-6 h-6 text-[#3b3d48]" />
          </button>
        </div>
      </div>
    </div>
  );


  const ProgressSteps = () => {
    const isCompleted = paymentStep === "success" || paymentStep === "failure";
    const lineColor = paymentStep === "success" ? "bg-[#4162e7]" : "bg-[#e4e7ec]";

    return (
      <div className="px-4 sm:px-6 lg:px-0 pt-16 sm:pt-20 lg:pt-8 pb-0">
        <div className="flex justify-center">
          <div className="relative flex w-full max-w-[1008px] items-start justify-center">
            <div className={`absolute top-[12px] left-1/2 h-px w-[200px] md:w-[300px] lg:w-[470px] -translate-x-1/2 ${lineColor}`} />
            <div className="relative z-10 flex w-[280px] md:w-[400px] lg:w-[514px] justify-between">
              <div className="flex flex-col items-center gap-2 sm:gap-3">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#4162e7] text-white">
                  <Check className="h-3 w-3" strokeWidth={3} />
                </div>
                <p className="text-xs font-medium text-[#63687a]">{t("steps.cart")}</p>
              </div>
              <div className="flex flex-col items-center gap-2 sm:gap-3">
                <div className={`flex h-6 w-6 items-center justify-center rounded-full ${isCompleted ? 'bg-[#4162e7] text-white' : 'border border-[#d2d2d2] bg-[#fafafa]'}`}>
                  {isCompleted ? (
                    <Check className="h-3 w-3" strokeWidth={3} />
                  ) : (
                    <div className="h-2 w-2 rounded-full bg-[#d2d2d2]" />
                  )}
                </div>
                <p className="text-xs font-medium text-[#63687a]">{t("steps.payment")}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };


  if (paymentStep === "processing" || paymentStep === "success" || paymentStep === "failure") {
    return (
      <div className="bg-white min-h-screen overflow-x-hidden">
        <MobileHeader />
        {(paymentStep === "success" || paymentStep === "failure") && <ProgressSteps />}

        {paymentStep === "processing" && (
          <PaymentProcessing
            course={course}
            method={paymentMethod}
            onComplete={handlePaymentComplete}
            onError={handlePaymentError}
          />
        )}

        {paymentStep === "success" && <PaymentSuccess />}

        {paymentStep === "failure" && <PaymentFailure slug={slug} />}
      </div>
    );
  }

  return (
    <LoadingOverlay
      loading={isLoading || isChecking || isCreatingOrder}
      fullScreen
    >
      <div className="bg-white min-h-screen overflow-x-hidden">

        <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-[#dbdde5]">
          <div className="flex items-center justify-between px-4 py-3">
            <button
              onClick={() => router.back()}
              className="w-10 h-10 flex items-center justify-center hover:opacity-70 transition-opacity"
            >
              <ArrowLeft className="w-6 h-6 text-[#3b3d48]" />
            </button>
            <div className="flex items-center gap-2">
              <button className="w-10 h-10 flex items-center justify-center hover:opacity-70 transition-opacity">
                <Bell className="w-6 h-6 text-[#3b3d48]" />
              </button>
              <button className="w-10 h-10 flex items-center justify-center hover:opacity-70 transition-opacity">
                <Menu className="w-6 h-6 text-[#3b3d48]" />
              </button>
            </div>
          </div>
        </div>


        <div className="px-4 sm:px-6 lg:px-16 xl:px-16 pt-16 sm:pt-20 lg:pt-0 pb-8">
          <div className="space-y-4 sm:space-y-6 lg:space-y-6 max-w-[1520px] mx-auto">

            <div className="flex justify-center pt-4 md:pt-6">
              <div className="relative flex w-full max-w-[1008px] items-start justify-center">

                <div className="absolute top-[12px] left-1/2 h-px w-[200px] md:w-[300px] lg:w-[470px] -translate-x-1/2 bg-[#e4e7ec]" />

                <div className="relative z-10 flex w-[280px] md:w-[400px] lg:w-[514px] justify-between">

                  <div className="flex flex-col items-center gap-2 sm:gap-3">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#4162e7] text-white">
                      <Check className="h-3 w-3" strokeWidth={3} />
                    </div>
                    <p className="text-xs font-medium text-[#63687a]">
                      {t("steps.cart")}
                    </p>
                  </div>

                  <div className="flex flex-col items-center gap-2 sm:gap-3">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full border border-[#d2d2d2] bg-[#fafafa]">
                      <div className="h-2 w-2 rounded-full bg-[#d2d2d2]" />
                    </div>
                    <p className="text-xs font-medium text-[#63687a]">
                      {t("steps.payment")}
                    </p>
                  </div>
                </div>
              </div>
            </div>


            <div className="lg:flex lg:gap-20 lg:mt-6">
              <div className="flex flex-[3] flex-col gap-2 min-w-0 max-w-[820px]">
                <h1
                  className="text-2xl font-medium text-[#3b3d48]"
                  style={{ fontFamily: "Roboto, sans-serif" }}
                >
                  {t("paymentMethod.title")}
                </h1>
                <div
                  className="max-w-[780px] rounded-lg bg-white p-3 shadow-[0_0_10px_rgba(0,0,0,0.05)]
             flex flex-col gap-2
             sm:flex-row sm:items-center sm:justify-between lg:ml-0"
                >

                  <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:gap-6">


                    <div className="relative h-[158px] w-full sm:h-[60px] sm:w-[100px] rounded-lg overflow-hidden bg-[#d9d9d9]">
                      {course.thumbnailUrl && (
                        <img
                          src={`${process.env.NEXT_PUBLIC_MINIO}/${course.thumbnailUrl}`}
                          alt={course.title}
                          className="h-full w-full object-cover"
                        />
                      )}
                    </div>


                    <div className="flex flex-col gap-1">
                      <p
                        className="text-[16px] sm:text-[18px] font-medium leading-6 sm:leading-7 text-[#3b3d48]"
                        style={{ fontFamily: "Roboto, sans-serif" }}
                      >
                        {course.title}
                      </p>

                      <p
                        className="text-[14px] sm:text-[16px] leading-5 sm:leading-6 text-[#63687a]"
                        style={{ fontFamily: "Roboto, sans-serif" }}
                      >
                        {course.ownerTeacher?.fullName || t("instructorName")}
                      </p>
                    </div>
                  </div>


                  <div
                    className="text-[16px] sm:text-[18px] font-medium text-[#0A0BD9] sm:text-left"
                    style={{ fontFamily: "Roboto, sans-serif" }}
                  >
                    {formatPrice(course.price || 0)}
                  </div>
                </div>


              </div>

              <div className="flex flex-[2] w-full">
                <PaymentMethods
                  course={course}
                  couponCode={couponCode}
                  appliedCouponCodes={appliedCouponCodes}
                  isCreatingOrder={isCreatingOrder}
                  onRemoveCoupon={(index) => {
                    setAppliedCouponCodes(
                      appliedCouponCodes.filter((_, i) => i !== index)
                    );
                  }}
                  onPayment={handlePayment}
                />
              </div>
            </div>


            <section className="hidden lg:block mt-4 bg-white px-0">
              <div className="space-y-4">
                <h2
                  className="text-2xl font-medium text-[#3b3d48]"
                  style={{ fontFamily: "Roboto, sans-serif" }}
                >
                  {t("sections.courses")}
                </h2>
                <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
                  {suggestedCourses.map((c, index) => (
                    <CourseCard
                      key={c.id}
                      course={c}
                      cardIndex={index}
                      showOverlay={false}
                    />
                  ))}
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </LoadingOverlay >
  );
}
