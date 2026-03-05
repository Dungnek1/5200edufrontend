"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Clock,
  FileText,
  CheckCircle2,
  PlayCircle,
  XCircle,
  Trophy,
  BadgeCheck,
  BookOpen,
} from "lucide-react";


import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import studentProfileService from "@/services/apis/student-profile.service";
import type { StudentProfile } from "@/services/apis/student-profile.service";

import { logger } from '@/lib/logger';
import { useAuth } from "@/hooks";
import { getAvatarUrl } from "@/utils/media";
import { Mail, Phone, Calendar, MapPin, Globe, GraduationCap, Heart, Target, Camera } from "lucide-react";
import userService from "@/services/apis/user.service";
import { toast } from "sonner";
type Assignment = {
  id: string;
  type: "pending" | "completed";
  title: string;
  courseName?: string;
  moduleTitle?: string;
  dueDate?: string;
  completedAt?: string;
  link?: string;
};

type Activity = {
  id: string;
  type: "completed" | "achievement" | "error" | "learning" | "enrolled";
  title: string;
  description: string;
  time: string;
};

function InfoRow({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value?: string | null }) {
  if (!value) return null;
  return (
    <div className="flex items-start gap-3">
      <Icon className="w-4 h-4 text-[#8c92ac] mt-0.5 flex-shrink-0" />
      <div className="min-w-0">
        <p className="text-xs text-[#8c92ac]">{label}</p>
        <p className="text-sm text-[#3b3d48] break-words">{value}</p>
      </div>
    </div>
  );
}

function formatGender(gender: string | undefined, t: (key: string) => string): string | undefined {
  if (!gender) return undefined;
  const key = gender.toLowerCase();
  if (key === "male") return t("page.student.profile.male");
  if (key === "female") return t("page.student.profile.female");
  return t("page.student.profile.other");
}

function formatDate(dateStr: string | undefined, locale: string): string | undefined {
  if (!dateStr) return undefined;
  try {
    return new Date(dateStr).toLocaleDateString(locale === "vi" ? "vi-VN" : "en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return dateStr;
  }
}

function ProfileInfoSection({
  user,
  studentProfile,
  t,
  locale,
  isMobile,
}: {
  user: { email?: string; phone?: string; fullName?: string };
  studentProfile: StudentProfile | null;
  t: (key: string) => string;
  locale: string;
  isMobile?: boolean;
}) {
  const sectionTitle = isMobile
    ? "mb-3 font-bold text-[#3b3d48]"
    : "mb-2 font-medium text-[#1b2961]";

  const socialLinks = studentProfile?.socialLinks;
  const hasSocialLinks =
    socialLinks?.facebook ||
    socialLinks?.instagram ||
    socialLinks?.twitter ||
    socialLinks?.linkedin ||
    socialLinks?.tiktok;

  const hasPersonalInfo =
    user.email ||
    user.phone ||
    studentProfile?.dateOfBirth ||
    studentProfile?.gender ||
    studentProfile?.address ||
    studentProfile?.city ||
    studentProfile?.country ||
    studentProfile?.schoolName;

  const fullAddress = [studentProfile?.address, studentProfile?.city, studentProfile?.country]
    .filter(Boolean)
    .join(", ");

  return (
    <>
      {hasPersonalInfo && (
        <div>
          <p className={sectionTitle}>{t("page.student.profile.personalInfo")}</p>
          <div className="grid gap-3 grid-cols-2 lg:grid-cols-3">
            <InfoRow icon={Mail} label={t("page.student.profile.email")} value={user.email} />
            <InfoRow icon={Phone} label={t("page.student.profile.phone")} value={user.phone} />
            <InfoRow
              icon={Calendar}
              label={t("page.student.profile.dateOfBirth")}
              value={formatDate(studentProfile?.dateOfBirth, locale)}
            />
            <InfoRow
              icon={Globe}
              label={t("page.student.profile.gender")}
              value={formatGender(studentProfile?.gender, t)}
            />
            {fullAddress && (
              <InfoRow icon={MapPin} label={t("page.student.profile.address")} value={fullAddress} />
            )}
            <InfoRow
              icon={GraduationCap}
              label={t("page.student.profile.schoolName")}
              value={studentProfile?.schoolName}
            />
          </div>
        </div>
      )}

      {studentProfile?.bio && (
        <div>
          <p className={sectionTitle}>{t("page.student.profile.bio")}</p>
          <p className="text-sm text-[#3b3d48] leading-relaxed">{studentProfile.bio}</p>
        </div>
      )}

      {studentProfile?.interests && (
        <div>
          <p className={sectionTitle}>{t("page.student.profile.interests")}</p>
          <div className="flex flex-wrap gap-2">
            {studentProfile.interests.split(",").map((interest, i) => (
              <span
                key={i}
                className="inline-flex items-center gap-1 rounded-full bg-[#f0f1ff] px-3 py-1 text-xs text-[#4162e7]"
              >
                <Heart className="w-3 h-3" />
                {interest.trim()}
              </span>
            ))}
          </div>
        </div>
      )}

      {studentProfile?.learningGoals && (
        <div>
          <p className={sectionTitle}>{t("page.student.profile.learningGoals")}</p>
          <div className="flex flex-wrap gap-2">
            {studentProfile.learningGoals.split(",").map((goal, i) => (
              <span
                key={i}
                className="inline-flex items-center gap-1 rounded-full bg-[#e8faf0] px-3 py-1 text-xs text-[#22c55e]"
              >
                <Target className="w-3 h-3" />
                {goal.trim()}
              </span>
            ))}
          </div>
        </div>
      )}

      <div>
        <p className={sectionTitle}>{t("page.student.profile.contactInfo")}</p>
        <div className="flex flex-col space-y-1.5">
          {hasSocialLinks ? (
            <>
              {socialLinks?.facebook && (
                <a href={socialLinks.facebook} target="_blank" rel="noopener noreferrer" className="text-sm text-[#4162e7] hover:underline">
                  {socialLinks.facebook}
                </a>
              )}
              {socialLinks?.instagram && (
                <a href={socialLinks.instagram} target="_blank" rel="noopener noreferrer" className="text-sm text-[#4162e7] hover:underline">
                  {socialLinks.instagram}
                </a>
              )}
              {socialLinks?.twitter && (
                <a href={socialLinks.twitter} target="_blank" rel="noopener noreferrer" className="text-sm text-[#4162e7] hover:underline">
                  {socialLinks.twitter}
                </a>
              )}
              {socialLinks?.linkedin && (
                <a href={socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="text-sm text-[#4162e7] hover:underline">
                  {socialLinks.linkedin}
                </a>
              )}
              {socialLinks?.tiktok && (
                <a href={socialLinks.tiktok} target="_blank" rel="noopener noreferrer" className="text-sm text-[#4162e7] hover:underline">
                  {socialLinks.tiktok}
                </a>
              )}
            </>
          ) : (
            <p className="text-sm text-[#8c92ac]">{t("page.student.profile.noSocialLinks")}</p>
          )}
        </div>
      </div>
    </>
  );
}

export default function ProfilePage() {
  const { user, refreshSession, updateAvatar } = useAuth();
  const t = useTranslations();
  const params = useParams();
  const locale = (params.locale as string) || "vi";

  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [studentProfile, setStudentProfile] = useState<StudentProfile | null>(null);
  const [loadingData, setLoadingData] = useState(true);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const avatarInputRef = useRef<HTMLInputElement>(null);

  // Resolved avatar: local preview takes priority over auth context
  const resolvedAvatarUrl = avatarPreview || getAvatarUrl(user?.avatar);

  const handleAvatarChange = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = "";

    if (file.size > 5 * 1024 * 1024) {
      toast.error(t("page.student.settings.fileTooLarge"));
      return;
    }

    if (!file.type.match(/image\/(jpeg|png|webp)/)) {
      toast.error(t("page.student.settings.invalidFileType"));
      return;
    }

    // Show instant preview using local file URL
    const localPreview = URL.createObjectURL(file);
    setAvatarPreview(localPreview);

    try {
      setUploadingAvatar(true);
      const uploadRes = await userService.uploadAvatar(file);
      if ((uploadRes.success || uploadRes.status === "success") && uploadRes.data?.avatarUrl) {
        await userService.updateProfile({ avatarUrl: uploadRes.data.avatarUrl });
        const newAvatarUrl = getAvatarUrl(uploadRes.data.avatarUrl) + `?t=${Date.now()}`;
        // Replace local blob with server URL
        setAvatarPreview(newAvatarUrl);
        URL.revokeObjectURL(localPreview);
        // Update avatar globally (Header + all components) instantly
        updateAvatar(newAvatarUrl);
        toast.success(t("page.student.settings.avatarUpdated"));
      }
    } catch {
      setAvatarPreview(null);
      URL.revokeObjectURL(localPreview);
      toast.error(t("page.student.settings.avatarError"));
    } finally {
      setUploadingAvatar(false);
    }
  }, [t, updateAvatar]);

  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        setLoadingData(true);

        // Fetch student profile for socialLinks, bio, city etc.
        try {
          const profileResponse = await studentProfileService.getProfile();
          if (profileResponse.success && profileResponse.data) {
            setStudentProfile(profileResponse.data);
          }
        } catch (profileErr) {
          logger.error("Failed to fetch student profile:", profileErr);
        }
      } catch (err) {
        logger.error("Failed to fetch student data:", err);
      } finally {
        setLoadingData(false);
      }
    };

    if (user) {
      fetchStudentData();
    }
  }, [user, locale, t]);

  // Sync user data (avatar, fullName, etc.) on mount
  useEffect(() => {
    refreshSession();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- run once on mount
  }, []);

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-500">{t("errors.notFound")}</p>
      </div>
    );
  }

  const getActivityIcon = (type: Activity["type"]) => {
    switch (type) {
      case "completed":
        return {
          Icon: CheckCircle2,
          bgColor: "bg-green-500",
          containerBg: "bg-green-50",
        };
      case "achievement":
        return {
          Icon: Trophy,
          bgColor: "bg-yellow-500",
          containerBg: "bg-yellow-50",
        };
      case "error":
        return {
          Icon: XCircle,
          bgColor: "bg-red-500",
          containerBg: "bg-red-50",
        };
      case "learning":
        return {
          Icon: PlayCircle,
          bgColor: "bg-blue-500",
          containerBg: "bg-blue-50",
        };
      case "enrolled":
        return {
          Icon: BookOpen,
          bgColor: "bg-purple-500",
          containerBg: "bg-purple-50",
        };
      default:
        return {
          Icon: Clock,
          bgColor: "bg-gray-500",
          containerBg: "bg-gray-50",
        };
    }
  };

  return (
    <main className="bg-[#FAFAFA] overflow-x-hidden">
      <input
        ref={avatarInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={handleAvatarChange}
      />

      <div className="lg:hidden pb-8">
        <div className="px-4 md:px-6 space-y-4 md:space-y-6">

          <div className="bg-white rounded-lg shadow-[0_0_10px_rgba(0,0,0,0.05)] relative">

            <div className="relative">
              <img
                src="/images/ui/banner-profile-student.png"
                alt="Profile banner"
                className="w-full h-auto block rounded-t-lg"
              />

              <button
                type="button"
                onClick={() => avatarInputRef.current?.click()}
                disabled={uploadingAvatar}
                className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white border border-[#4162e7] shadow-md flex items-center justify-center hover:bg-[#eceffd] transition-colors cursor-pointer disabled:cursor-default"
              >
                <Camera className="w-4 h-4 text-[#4162e7]" />
              </button>

              <div className="absolute bottom-0 left-4 sm:left-6 translate-y-1/2 z-10">
                <div className="relative h-20 w-20 sm:h-24 sm:w-24 md:h-28 md:w-28">
                  <div className="w-full h-full overflow-hidden rounded-full bg-[#ffefe7] shadow-lg ring-4 ring-white">
                    <img
                      src={resolvedAvatarUrl}
                      alt={user.fullName || "User"}
                      className="w-full h-full object-cover rounded-full"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-12 sm:pt-14 md:pt-16 pb-4 px-4 md:pb-6 md:px-6 space-y-3 sm:space-y-4 md:space-y-6">

              <div className="pl-24 sm:pl-28 md:pl-32 text-left min-h-[40px] sm:min-h-[50px] md:min-h-[60px] flex flex-col justify-center">
                <div className="flex items-center justify-start gap-2">
                  <h1
                    className="text-lg md:text-xl font-bold text-[#3b3d48]"
                    style={{ fontFamily: "Roboto, sans-serif" }}
                  >
                    {user.fullName || "User"}
                  </h1>
                  <BadgeCheck className="w-5 h-5 md:w-6 md:h-6 text-[#4162e7]" />
                </div>
                <p
                  className="text-sm md:text-base text-[#8c92ac] mt-1"
                  style={{ fontFamily: "Roboto, sans-serif" }}
                >
                  {studentProfile?.city ||
                    t("page.student.profile.defaultLocation")}
                </p>
              </div>


              <ProfileInfoSection
                user={user}
                studentProfile={studentProfile}
                t={t}
                locale={locale}
                isMobile
              />
            </div>
          </div>


          <div>
            <h2
              className="text-lg sm:text-xl font-bold text-[#3b3d48] mb-4"
              style={{ fontFamily: "Roboto, sans-serif" }}
            >
              {t("page.student.profile.assignments")}
            </h2>
            <div className="space-y-3 sm:space-y-4">
              {assignments.length > 0 ? (
                assignments.map((assignment) => (
                  <div
                    key={assignment.id}
                    className={`rounded-lg p-4 sm:p-5 shadow-[0_0_10px_rgba(0,0,0,0.05)] ${assignment.type === "pending"
                      ? "bg-red-50"
                      : "bg-green-50"
                      }`}
                  >
                    <div className="flex items-start gap-3 md:gap-4">
                      <div
                        className={`w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center flex-shrink-0 ${assignment.type === "pending"
                          ? "bg-red-500"
                          : "bg-green-500"
                          }`}
                      >
                        {assignment.type === "pending" ? (
                          <FileText className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                        ) : (
                          <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p
                          className="text-sm sm:text-base font-medium text-[#3b3d48] mb-1"
                          style={{ fontFamily: "Roboto, sans-serif" }}
                        >
                          {assignment.title}
                        </p>
                        {assignment.courseName && (
                          <p
                            className="text-xs sm:text-sm text-[#8c92ac]"
                            style={{ fontFamily: "Roboto, sans-serif" }}
                          >
                            {assignment.courseName}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="rounded-lg p-6 bg-gray-50 text-center">
                  <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-sm text-[#8c92ac]">
                    {t("page.student.profile.noAssignments")}
                  </p>
                </div>
              )}
            </div>
          </div>


          <div>
            <h2
              className="text-lg sm:text-xl font-bold text-[#3b3d48] mb-4"
              style={{ fontFamily: "Roboto, sans-serif" }}
            >
              {t("page.student.profile.recentActivity")}
            </h2>
            <div className="space-y-3 sm:space-y-4">
              {loadingData ? (
                <div className="flex justify-center py-4">
                  <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                </div>
              ) : activities.length > 0 ? (
                activities.map((activity) => {
                  const { Icon, bgColor, containerBg } = getActivityIcon(
                    activity.type
                  );

                  return (
                    <div
                      key={activity.id}
                      className={`rounded-lg p-4 sm:p-5 shadow-[0_0_10px_rgba(0,0,0,0.05)] ${containerBg}`}
                    >
                      <div className="flex items-start gap-3 md:gap-4">
                        <div
                          className={`w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center flex-shrink-0 ${bgColor}`}
                        >
                          <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p
                            className="text-sm sm:text-base font-medium text-[#3b3d48] mb-1"
                            style={{ fontFamily: "Roboto, sans-serif" }}
                          >
                            {activity.title}
                          </p>
                          <p
                            className="text-xs sm:text-sm text-[#8c92ac] mb-1"
                            style={{ fontFamily: "Roboto, sans-serif" }}
                          >
                            {activity.description}
                          </p>
                          <p
                            className="text-xs sm:text-sm text-[#8c92ac]"
                            style={{ fontFamily: "Roboto, sans-serif" }}
                          >
                            {activity.time}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="rounded-lg p-6 bg-gray-50 text-center">
                  <Clock className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-sm text-[#8c92ac]">
                    {t("page.student.profile.noRecentActivity")}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>


      <section className="hidden lg:block pb-8 lg:pb-12 pt-4 sm:pt-6 md:pt-8">
        <div className="px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16">
          <div className="grid gap-4 lg:gap-6 lg:grid-cols-3">

            <div className="lg:col-span-2">
              <Card className="overflow-hidden rounded-2xl border-none bg-white shadow-[0_0_10px_rgba(0,0,0,0.05)]">

                <div className="relative">
                  <img
                    src="/images/ui/banner-profile-student.png"
                    alt="Profile banner"
                    className="w-full h-auto block rounded-t-2xl"
                  />

                  <button
                    type="button"
                    onClick={() => avatarInputRef.current?.click()}
                    disabled={uploadingAvatar}
                    className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white border border-[#4162e7] shadow-md flex items-center justify-center hover:bg-[#eceffd] transition-colors cursor-pointer disabled:cursor-default"
                  >
                    <Camera className="w-5 h-5 text-[#4162e7]" />
                  </button>

                  <div className="absolute bottom-0 left-4 sm:left-6 transform translate-y-1/2 z-10">
                    <div className="relative h-24 w-24 sm:h-28 sm:w-28 md:h-36 md:w-36">
                      <div className="w-full h-full overflow-hidden rounded-full bg-[#ffefe7] shadow-sm ring-4 ring-white">
                        <img
                          src={resolvedAvatarUrl}
                          alt={user.fullName || "User"}
                          className="w-full h-full object-cover rounded-full"
                        />
                      </div>
                    </div>
                  </div>
                </div>


                <CardContent className="flex flex-col gap-4 sm:gap-6 px-4 sm:px-6 pb-4 sm:pb-6 pt-2 md:px-8 md:pb-8">

                  <div className="flex items-start gap-4">
                    <div className="w-24 sm:w-28 md:w-36"></div>
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center gap-2">
                        <h1
                          className="text-base sm:text-lg font-medium text-[#3b3d48]"
                          style={{ fontFamily: "Roboto, sans-serif" }}
                        >
                          {user.fullName || "User"}
                        </h1>
                        <BadgeCheck className="w-5 h-5 text-[#4162e7]" />
                      </div>
                      <p
                        className="text-sm sm:text-base text-[#8c92ac] -mt-0.5"
                        style={{ fontFamily: "Roboto, sans-serif" }}
                      >
                        {studentProfile?.city ||
                          t("page.student.profile.defaultLocation")}
                      </p>
                    </div>
                  </div>


                  <div className="space-y-6 text-sm text-[#3b3d48]">

                    <ProfileInfoSection
                      user={user}
                      studentProfile={studentProfile}
                      t={t}
                      locale={locale}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>


            <div className="space-y-4">

              <Card className="border border-[#eef0fb] bg-[#f8f9ff] shadow-[0_0_10px_rgba(0,0,0,0.05)]">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-[#0a0a0a]">
                    {t("page.student.profile.assignments")}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {assignments.length > 0 ? (
                    assignments.map((assignment) => (
                      <div
                        key={assignment.id}
                        className="flex items-start gap-2 text-xs"
                      >
                        <div
                          className={`w-2 h-2 rounded-full mt-1.5 ${assignment.type === "pending"
                            ? "bg-red-500"
                            : "bg-green-500"
                            }`}
                        />
                        <div>
                          <p className="font-medium text-[#3b3d48]">
                            {assignment.title}
                          </p>
                          {assignment.courseName && (
                            <p className="text-[#8c92ac]">
                              {assignment.courseName}
                            </p>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-[#7f859d]">
                      {t("page.student.profile.noAssignments")}
                    </p>
                  )}
                </CardContent>
              </Card>


              <Card className="border border-[#eef0fb] bg-[#f8f9ff] shadow-[0_0_10px_rgba(0,0,0,0.05)]">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-[#0a0a0a]">
                    {t("page.student.profile.recentActivity")}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {loadingData ? (
                    <div className="flex justify-center py-2">
                      <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                    </div>
                  ) : activities.length > 0 ? (
                    activities.map((activity) => {
                      const { bgColor } = getActivityIcon(activity.type);
                      return (
                        <div
                          key={activity.id}
                          className="flex items-start gap-2 text-xs"
                        >
                          <div
                            className={`w-2 h-2 rounded-full mt-1.5 ${bgColor}`}
                          />
                          <div>
                            <p className="font-medium text-[#3b3d48]">
                              {activity.title}
                            </p>
                            <p className="text-[#8c92ac]">
                              {activity.description}
                            </p>
                            <p className="text-[#b0b3c1] text-[10px]">
                              {activity.time}
                            </p>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <p className="text-xs text-[#7f859d]">
                      {t("page.student.profile.noRecentActivity")}
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
