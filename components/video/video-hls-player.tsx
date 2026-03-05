"use client";

import { useEffect, useRef, useState } from 'react';
import Hls from 'hls.js';
import { toast } from 'sonner';
import { progressService } from '@/services/apis/progress.service';

interface VideoHLSPlayerProps {
  videoId: string; // Module/Document ID để sử dụng với HLS API
  courseId?: string; // Course ID để track progress
  sectionId?: string; // Section ID để track progress
  currentdocumentId?: string; // Document ID để track progress
  title?: string;
  width?: string | number;
  height?: string | number;
  autoplay?: boolean;
  controls?: boolean;
  muted?: boolean;
  /** Khi true, player fill khung cha (cùng size cố định với placeholder không có video) */
  fillContainer?: boolean;
}

/**
 * HLS Video Player Component
 * Plays HLS (.m3u8) video streams từ backend API
 * Auto-saves progress every 10 seconds, on pause, and before page unload
 */
export function VideoHLSPlayer({
  videoId,
  courseId,
  sectionId,
  currentdocumentId,
  title = 'Video Player',
  width = '100%',
  height = '600px',
  autoplay = false,
  controls = true,
  muted = false,
  fillContainer = false,
}: VideoHLSPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const hlsRef = useRef<Hls | null>(null);
  const [hasError, setHasError] = useState(false);

  // Track which milestones have been reached to avoid duplicate API calls
  const milestonesReachedRef = useRef<{ [key: number]: boolean }>({
    20: false,
    50: false,
    90: false,
  });

  // Track if progress tracking is enabled (requires courseId and sectionId)
  const progressTrackingEnabled = courseId && sectionId;

  const wrapperClass = fillContainer ? 'w-full h-full min-h-0' : 'w-full';
  const errorWrapperClass = fillContainer
    ? 'w-full h-full min-h-0 flex items-center justify-center bg-[#0f0f0f] rounded-lg'
    : 'w-full flex items-center justify-center bg-[#0f0f0f] rounded-lg min-h-[320px]';
  const videoClass = fillContainer
    ? 'w-full h-full object-contain rounded-lg bg-black'
    : 'w-full rounded-lg bg-black';

  if (hasError) {
    return (
      <div className={errorWrapperClass}>
        <p className="text-white/90 text-base sm:text-lg text-center px-4">
          Khóa học này không có video
        </p>
      </div>
    );
  }

  useEffect(() => {
    setHasError(false);
    if (!videoId || !videoRef.current || !currentdocumentId) return;

    const video = videoRef.current;
    // Construct HLS playlist URL từ backend API
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:7000/api/v1';
    const hlsPlaylistUrl = `${apiUrl}/video-hls/hls/${videoId}/playlist.m3u8`;

    // Check if browser supports HLS.js
    if (Hls.isSupported()) {
      // Initialize HLS.js
      const hls = new Hls({
        debug: false, // Disable debug mode
        enableWorker: true,
        lowLatencyMode: true,
      });

      hlsRef.current = hls;

      // Attach video element to HLS instance
      hls.attachMedia(video);

      // Listen for media buffering
      hls.on(Hls.Events.MEDIA_ATTACHED, () => {
        console.log('[HLS Player] Media attached to HLS instance');
      });

      // Load HLS stream
      hls.loadSource(hlsPlaylistUrl);

      // List of HLS events
      hls.on(Hls.Events.MANIFEST_PARSED, (event: any, data: any) => {
        console.log('[HLS Player] Manifest parsed, found', data.levels.length, 'quality levels');

        // Auto-play if enabled
        if (autoplay) {
          video.play().catch(err => console.error('[HLS Player] Autoplay failed:', err));
        }
      });

      hls.on(Hls.Events.ERROR, (event: any, data: any) => {
        console.error('[HLS Player] HLS Error:', data);
        if (data.fatal) {
          switch (data.type) {
            case Hls.ErrorTypes.NETWORK_ERROR:
              console.error('[HLS Player] Fatal network error encountered');
              hls.startLoad();
              break;
            case Hls.ErrorTypes.MEDIA_ERROR:
              console.error('[HLS Player] Fatal media error encountered');
              hls.recoverMediaError();
              break;
            default:
              console.error('[HLS Player] Fatal error encountered, destroying HLS instance');
              hls.destroy();
              setHasError(true);
              break;
          }
        }
      });

      return () => {
        // Cleanup on unmount
        if (hlsRef.current) {
          hlsRef.current.destroy();
          hlsRef.current = null;
        }
      };
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      // Safari natively supports HLS
      video.src = hlsPlaylistUrl;
      console.log('[HLS Player] Using native HLS support (Safari)');
    }
  }, [videoId, courseId, sectionId, autoplay, progressTrackingEnabled]);

  // ✅ Auto-save progress every 10 seconds
  useEffect(() => {
    if (!progressTrackingEnabled) return;

    const saveInterval = setInterval(() => {
      const video = videoRef.current;
      if (video && video.currentTime > 0 && video.duration && !video.paused && currentdocumentId) {
        const watchPercent = (video.currentTime / video.duration) * 100;

        progressService.updateModuleProgress(
          courseId!,
          sectionId!,
          currentdocumentId,
          {
            currentTime: Math.floor(video.currentTime),
            duration: Math.floor(video.duration),
            isCompleted: watchPercent >= 90,
          }
        ).catch((error) => {
          console.error('[Progress] Auto-save failed:', error);
        });

        // Show completion toast once when reaching 90%
        if (watchPercent >= 90) {
          toast.success('🎉 Chúc mừng! Bạn đã hoàn thành video này');
        }
      }
    }, 10000); // Every 10 seconds

    return () => clearInterval(saveInterval);
  }, [videoId, courseId, sectionId, progressTrackingEnabled]);

  // ✅ Save progress when video is paused
  useEffect(() => {
    if (!progressTrackingEnabled) return;

    const video = videoRef.current;
    if (!video) return;

    const handlePause = () => {
      if (video.currentTime > 0 && video.duration && currentdocumentId) {
        const watchPercent = (video.currentTime / video.duration) * 100;

        progressService.updateModuleProgress(
          courseId!,
          sectionId!,
          currentdocumentId,
          {
            currentTime: Math.floor(video.currentTime),
            duration: Math.floor(video.duration),
            isCompleted: watchPercent >= 90,
          }
        ).catch((error) => {
          console.error('[Progress] Pause save failed:', error);
        });
      }
    };

    video.addEventListener('pause', handlePause);
    return () => video.removeEventListener('pause', handlePause);
  }, [videoId, courseId, sectionId, progressTrackingEnabled]);

  // ✅ Save progress before page unload
  useEffect(() => {
    if (!progressTrackingEnabled) return;

    const handleBeforeUnload = () => {
      const video = videoRef.current;
      if (video && video.currentTime > 0 && video.duration && currentdocumentId) {
        const watchPercent = (video.currentTime / video.duration) * 100;

        // Use special progressService method for reliable delivery on page unload
        progressService.saveProgressOnUnload(
          courseId!,
          sectionId!,
          currentdocumentId,
          {
            currentTime: Math.floor(video.currentTime),
            duration: Math.floor(video.duration),
            isCompleted: watchPercent >= 90,
          }
        );
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [videoId, courseId, sectionId, progressTrackingEnabled]);

  return (
    <div className={wrapperClass}>
      <video
        ref={videoRef}
        className={videoClass}
        width={fillContainer ? undefined : width}
        height={fillContainer ? undefined : height}
        controls={controls}
        autoPlay={autoplay}
        muted={muted}
        title={title}
        onError={() => setHasError(true)}
      />
    </div>
  );
}
