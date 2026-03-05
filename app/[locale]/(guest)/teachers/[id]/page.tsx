"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, MoreVertical } from "lucide-react";
import teacherPublicService from "@/services/apis/teacher-public.service";
import publicCourseService from "@/services/apis/public-course.service";
import type { TeacherPublic } from "@/services/apis/teacher-public.service";
import type { Course, Review } from "@/types/course";
import type { GalleryImage } from "@/types/teacher";
import { TeacherHero } from "@/components/teacher/profile/teacher-hero";
import { TeacherCoursesSection } from "@/components/teacher/profile/teacher-courses-section";
import { TeacherCommunityEventsSection } from "@/components/teacher/profile/teacher-community-events-section";
import { TeacherGallerySection } from "@/components/teacher/profile/teacher-gallery-section";
import { TeacherFeaturedCourse } from "@/components/teacher/profile/teacher-featured-course";
import { CourseDetailReviews } from "@/components/courses/course-detail-reviews";
import { useTranslations } from "next-intl";

export default function TeacherDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const locale = (params.locale as string) || "vi";
  const tTeacher = useTranslations("teacher");

  const [teacher, setTeacher] = useState<TeacherPublic | null>(null);
  const [featuredCourse, setFeaturedCourse] = useState<Course | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [education, setEducation] = useState<any[]>([]);
  const [certificates, setCertificates] = useState<any[]>([]);
  const [gallery, setGallery] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);

  const [loadingStates, setLoadingStates] = useState({
    courses: false,
    gallery: false,
    reviews: false,
  });


  const [loadedSections, setLoadedSections] = useState({
    courses: false,
    gallery: false,
    reviews: false,
  });

  const coursesRef = useRef<HTMLDivElement>(null);
  const galleryRef = useRef<HTMLDivElement>(null);
  const reviewsRef = useRef<HTMLDivElement>(null);


  const observerRef = useRef<IntersectionObserver | null>(null);


  useEffect(() => {
    if (id) {
      fetchInstructor();
      fetchFeaturedCourse();
    }
  }, [id]);

  const fetchTeacherCourses = useCallback(async () => {
    if (loadedSections.courses || loadingStates.courses) return;

    try {
      setLoadingStates(prev => ({ ...prev, courses: true }));

      const response = await publicCourseService.getCourses({
        page: 1,
        teacherId: id,
      });

      if (response.success && response.data) {
        //@ts-ignore
        setCourses(response.data);
      }
    } catch (error) {
      setCourses([]);
    } finally {
      setLoadingStates(prev => ({ ...prev, courses: false }));
      setLoadedSections(prev => ({ ...prev, courses: true }));
    }
  }, [id, loadedSections.courses, loadingStates.courses]);

  const fetchTeacherGallery = useCallback(async () => {
    if (loadedSections.gallery || loadingStates.gallery) return;

    try {
      setLoadingStates(prev => ({ ...prev, gallery: true }));

      const response = await teacherPublicService.getTeacherGalleryImages(id);
      //@ts-ignore
      if (response.data.status === 'success' && response.data.data) {
        //@ts-ignore
        setGallery(response.data.data || []);
      }
    } catch (error) {
      setGallery([]);
    } finally {
      setLoadingStates(prev => ({ ...prev, gallery: false }));
      setLoadedSections(prev => ({ ...prev, gallery: true }));
    }
  }, [id, loadedSections.gallery, loadingStates.gallery]);

  const fetchTeacherReviews = useCallback(async () => {
    if (loadedSections.reviews || loadingStates.reviews) return;


    if (!featuredCourse) {

      return;
    }

    try {
      setLoadingStates(prev => ({ ...prev, reviews: true }));

      const reviewsResponse = await publicCourseService.getReviews(featuredCourse.slug, 1, 4);
      if (reviewsResponse) {
        setReviews(reviewsResponse.data.data);
      }
    } catch (error) {
      setReviews([]);
    } finally {
      setLoadingStates(prev => ({ ...prev, reviews: false }));
      setLoadedSections(prev => ({ ...prev, reviews: true }));
    }
  }, [featuredCourse, loadedSections.reviews, loadingStates.reviews]);

  // Setup Intersection Observer
  useEffect(() => {
    if (!id) return;

    // Cleanup previous observer
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    // Create new observer with optimized options
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const target = entry.target;

            // Trigger fetch based on which section is visible
            if (target === coursesRef.current && !loadedSections.courses) {
              fetchTeacherCourses();
            } else if (target === galleryRef.current && !loadedSections.gallery) {
              fetchTeacherGallery();
            } else if (target === reviewsRef.current && !loadedSections.reviews) {
              fetchTeacherReviews();
            }
          }
        });
      },
      {
        rootMargin: '300px',
        threshold: 0.01
      }
    );


    const currentCoursesRef = coursesRef.current;
    const currentGalleryRef = galleryRef.current;
    const currentReviewsRef = reviewsRef.current;

    if (currentCoursesRef) observerRef.current.observe(currentCoursesRef);
    if (currentGalleryRef) observerRef.current.observe(currentGalleryRef);
    if (currentReviewsRef) observerRef.current.observe(currentReviewsRef);


    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [id, loadedSections, fetchTeacherCourses, fetchTeacherGallery, fetchTeacherReviews]);

  useEffect(() => {

    if (featuredCourse && !loadedSections.reviews && reviewsRef.current) {
      const rect = reviewsRef.current.getBoundingClientRect();
      const isVisible = rect.top < window.innerHeight + 300;

      if (isVisible) {

        fetchTeacherReviews();
      }
    }
  }, [featuredCourse, loadedSections.reviews, fetchTeacherReviews]);

  const fetchInstructor = async () => {
    try {
      setLoading(true);
      const response = await teacherPublicService.getTeacherById(id);
      if (response.success && response.data) {
        const teacherData = response.data;
        setEducation(teacherData.educations || teacherData.education || []);
        setCertificates(teacherData.certificates || []);
        setTeacher(teacherData);
      } else {
        router.push(`/${locale}/teachers`);
      }
    } catch (error) {
      router.push(`/${locale}/teachers`);
    } finally {
      setLoading(false);
    }
  };

  const fetchFeaturedCourse = async () => {
    try {
      const response = await publicCourseService.getFeaturedCourse(id);
      //@ts-ignore
      if (response.status === 'success' && response.data) {
        //@ts-ignore
        setFeaturedCourse(response.data);
      }
    } catch (error) {
      setFeaturedCourse(null);
    }
  };

  if (loading) {
    return (
      <div className="bg-white flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#4162e7]"></div>
      </div>
    );
  }

  if (!teacher) {
    return null;
  }

  return (
    <div className="bg-[#FAFAFA] min-h-screen overflow-x-hidden  sm:py-6 md:py-8 md:pb-16 lg:py-8 lg:pb-20 px-4 sm:px-6 lg:px-16">

      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-[#dbdde5]">
        <div className="flex items-center justify-between px-4 py-3">
          <button
            onClick={() => router.back()}
            className="w-10 h-10 flex items-center justify-center hover:opacity-70 transition-opacity"
          >
            <ArrowLeft className="w-6 h-6 text-[#3b3d48]" />
          </button>
          <button className="w-10 h-10 flex items-center justify-center hover:opacity-70 transition-opacity">
            <MoreVertical className="w-6 h-6 text-[#3b3d48]" />
          </button>
        </div>
      </div>

      <div className='flex flex-col gap-[32px] '>

        <TeacherHero teacher={teacher} />

        {featuredCourse && (
          <TeacherFeaturedCourse course={featuredCourse} />
        )}


        <div ref={coursesRef}>
          {loadingStates.courses && !courses.length ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#4162e7]"></div>
            </div>
          ) : (
            <TeacherCoursesSection courses={courses} />
          )}
        </div>

        <TeacherCommunityEventsSection />

        <div ref={galleryRef}>
          {loadingStates.gallery && !gallery.length ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#4162e7]"></div>
            </div>
          ) : (
            <TeacherGallerySection gallery={gallery} />
          )}
        </div>

        <div ref={reviewsRef}>
          {!featuredCourse ? (

            <div className="flex items-center justify-center py-12">
              <div className="flex flex-col items-center gap-2">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#4162e7]"></div>
                <p className="text-sm text-gray-500">
                  {tTeacher("loadingCourses")}
                </p>
              </div>
            </div>
          ) : loadingStates.reviews && !reviews.length ? (

            <div className="flex items-center justify-center py-12">
              <div className="flex flex-col items-center gap-2">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#4162e7]"></div>
                <p className="text-sm text-gray-500">
                  {tTeacher("loadingReviews")}
                </p>
              </div>
            </div>
          ) : (
            <div
              className="pb-[32px]">
              <CourseDetailReviews
                reviews={reviews}
                courseName={featuredCourse?.title}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}