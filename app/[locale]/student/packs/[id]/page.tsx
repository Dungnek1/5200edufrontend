"use client";

import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { PackHero } from "@/components/pack/pack-hero";
import { PackCourses } from "@/components/pack/pack-courses";
import { PackReviews } from "@/components/pack/pack-reviews";
import { PackInstructor } from "@/components/pack/pack-instructor";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Star,
  Users,
  Clock,
  BookOpen,
  Award,
  CheckCircle,
  Play,
  ShoppingCart,
} from "lucide-react";
import { packService } from "@/services/apis/pack.service";
import type { Pack, PackReview } from "@/types/pack";

import { logger } from '@/lib/logger';
export default function PackDetailPage() {
  const params = useParams();
  const router = useRouter();
  const locale = params.locale as string;
  const t = useTranslations();

  const [pack, setPack] = useState<Pack | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [reviews, setReviews] = useState<PackReview[]>([]);
  const [isPurchased, setIsPurchased] = useState(false);
  const [isPurchasing, setIsPurchasing] = useState(false);

  useEffect(() => {
    fetchPackData();
  }, [params.id]);

  const fetchPackData = async () => {
    try {
      setLoading(true);
      const packResponse = await packService.getPackById(params.id as string);
      const packData = packResponse.data;

      setPack(packData);

      setReviews([]);

      const ownershipResponse = await packService.checkPackOwnership(
        packData.id
      );
      setIsPurchased(ownershipResponse.data.isOwner);
    } catch (error) {
      logger.error("Failed to fetch pack data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePurchase = async () => {
    if (!pack) return;
    router.push(`/${locale}/courses/${pack.id}/checkout`);
  };

  if (loading) {
    return (
      <>
        <div className="bg-white">
          {/* Breadcrumb */}
          <div className="bg-white border-b">
            <div className="px-4 md:px-6 lg:px-16 py-4">
              <div className="w-64 h-6 bg-gray-200 rounded animate-pulse"></div>
            </div>
          </div>

          {/* Hero Section Skeleton */}
          <div className="bg-gradient-to-br from-blue-50 via-white to-purple-50">
            <div className="px-4 md:px-6 lg:px-16 py-8 sm:py-12">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12">
                <div className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex gap-2">
                      <Skeleton className="h-6 w-24 rounded-full" />
                      <Skeleton className="h-6 w-20 rounded-full" />
                    </div>
                    <Skeleton className="h-12 w-3/4" />
                    <Skeleton className="h-6 w-full" />
                    <Skeleton className="h-6 w-5/6" />
                  </div>
                </div>

                <div className="space-y-6">
                  <Skeleton className="h-96 w-full" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  if (!pack) {
    return (
      <>
        <div className="min-h-screen bg-white flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              {t("page.packDetail.notFound")}
            </h1>
            <p className="text-gray-600 mb-6">
              {t("page.packDetail.notFoundDesc")}
            </p>
            <Button onClick={() => router.back()}>{t("common.back")}</Button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-white">
        {/* Hero Section */}
        <PackHero
          pack={pack}
          locale={locale}
          isPurchased={isPurchased}
          onPurchase={handlePurchase}
        />

        {/* Course Content with Tabs */}
        <div className="px-4 sm:px-6 lg:px-16 py-12 sm:py-16 md:py-20 lg:py-20 xl:py-24">
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-4 mb-8">
              <TabsTrigger value="overview">
                {t("page.packDetail.tabs.overview")}
              </TabsTrigger>
              <TabsTrigger value="courses">
                {t("page.packDetail.tabs.courses")}
              </TabsTrigger>
              <TabsTrigger value="reviews">
                {t("page.packDetail.tabs.reviews")}
              </TabsTrigger>
              <TabsTrigger value="instructor">
                {t("page.packDetail.tabs.instructor")}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="mt-0">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content */}
                <div className="space-y-8 lg:col-span-2">
                  {/* Description */}
                  <Card>
                    <CardHeader>
                      <CardTitle>
                        {t("page.packDetail.sections.introduction")}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-700 leading-relaxed">
                        {pack.description}
                      </p>
                    </CardContent>
                  </Card>

                  {/* What You'll Get */}
                  <Card>
                    <CardHeader>
                      <CardTitle>
                        {t("page.packDetail.sections.whatYouGet")}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {[
                          t("page.packDetail.benefits.accessCourses", {
                            count: pack.totalCourses,
                          }),
                          t("page.packDetail.benefits.duration", {
                            duration: pack.totalDuration,
                          }),
                          t("page.packDetail.benefits.resources"),
                          t("page.packDetail.benefits.certificate"),
                          t("page.packDetail.benefits.lifetimeSupport"),
                          t("page.packDetail.benefits.freeUpdates"),
                        ].map((item, index) => (
                          <div key={index} className="flex items-start gap-3">
                            <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                            <span className="text-gray-700">{item}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Target Audience */}
                  <Card>
                    <CardHeader>
                      <CardTitle>
                        {t("page.packDetail.sections.targetAudience")}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {t
                          .raw("page.packDetail.audience")
                          .map((item: string, index: number) => (
                            <div
                              key={index}
                              className="flex items-center gap-2"
                            >
                              <Users className="h-4 w-4 text-blue-500" />
                              <span className="text-gray-700">{item}</span>
                            </div>
                          ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Requirements */}
                  <Card>
                    <CardHeader>
                      <CardTitle>
                        {t("page.packDetail.sections.requirements")}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-orange-500" />
                          <span className="text-gray-700">
                            {t("page.packDetail.requirements.noExperience")}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-orange-500" />
                          <span className="text-gray-700">
                            {t("page.packDetail.requirements.internet")}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-orange-500" />
                          <span className="text-gray-700">
                            {t("page.packDetail.requirements.commitment")}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Sidebar */}
                <div className="lg:col-span-1">
                  <div className="sticky top-6 space-y-6">
                    {/* Stats */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">
                          {t("page.packDetail.sections.statistics")}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {pack.rating && (
                          <div className="flex items-center gap-2">
                            <Star className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                            <span className="font-semibold text-gray-900">
                              {pack.rating}
                            </span>
                            <span className="text-sm text-gray-500">
                              {t("page.packDetail.stats.reviews", {
                                count: pack.reviewsCount?.toLocaleString() || 0,
                              })}
                            </span>
                          </div>
                        )}
                        {pack.totalStudents && (
                          <div className="flex items-center gap-2">
                            <Users className="h-5 w-5 text-blue-500" />
                            <span className="text-gray-700">
                              {t("page.packDetail.stats.students", {
                                count: pack.totalStudents.toLocaleString(),
                              })}
                            </span>
                          </div>
                        )}
                        <div className="flex items-center gap-2">
                          <BookOpen className="h-5 w-5 text-green-500" />
                          <span className="text-gray-700">
                            {t("page.packDetail.stats.courses", {
                              count: pack.totalCourses,
                            })}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-5 w-5 text-orange-500" />
                          <span className="text-gray-700">
                            {pack.totalDuration}
                          </span>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Tags */}
                    {pack.tags && pack.tags.length > 0 && (
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-lg">
                            {t("page.packDetail.sections.tags")}
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="flex flex-wrap gap-2">
                            {pack.tags.map((tag) => (
                              <Badge key={tag} variant="outline">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    )}

                    {/* Trust Indicators */}
                    <Card>
                      <CardContent className="pt-6">
                        <div className="space-y-3 text-sm">
                          <div className="flex items-center gap-2 text-gray-600">
                            <Award className="h-4 w-4 text-green-500" />
                            <span>
                              {t("page.packDetail.trust.lifetimeWarranty")}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-gray-600">
                            <BookOpen className="h-4 w-4 text-blue-500" />
                            <span>
                              {t("page.packDetail.trust.regularUpdates")}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-gray-600">
                            <Users className="h-4 w-4 text-purple-500" />
                            <span>
                              {t("page.packDetail.trust.support24_7")}
                            </span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="courses" className="mt-0">
              <PackCourses
                courses={pack.courses}
                isPurchased={isPurchased}
                packId={pack.id}
                locale={locale}
              />
            </TabsContent>

            <TabsContent value="reviews" className="mt-0">
              <PackReviews
                reviews={reviews}
                packId={pack.id}
                packRating={pack.rating}
                totalReviews={pack.reviewsCount || 0}
                isPurchased={isPurchased}
              />
            </TabsContent>

            <TabsContent value="instructor" className="mt-0">
              {pack.teacher && (
                <PackInstructor teacher={pack.teacher} pack={pack} />
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  );
}
