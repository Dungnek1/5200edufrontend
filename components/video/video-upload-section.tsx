"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { Upload, Play, Trash2, CheckCircle2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import videoHLSService, { type VideoHLSUploadResponse } from "@/services/apis/video-hls.service";
import teacherCourseService from "@/services/apis/teacher-course.service";
import { VideoHLSPlayer } from "@/components/video/video-hls-player";
import { toast } from "sonner";
import { isValidVideoExtension, validateVideoFile } from "@/utils/video-validation";

export interface ModuleVideo {
  videoUrl: string;
  moduleId: string; // Use moduleId instead of videoId for HLS API
  thumbnailUrl?: string;
  duration?: number;
  uploadedAt: string;
}

interface VideoUploadSectionProps {
  courseId: string;
  moduleId?: string;
  onVideoUploaded?: (video: ModuleVideo) => void;
  existingVideo?: ModuleVideo | null;
  onModuleNeeded?: () => Promise<string | undefined>;
  disabled?: boolean;
}

export function VideoUploadSection({
  courseId,
  moduleId,
  onVideoUploaded,
  existingVideo,
  onModuleNeeded,
  disabled = false,
}: VideoUploadSectionProps) {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadedVideo, setUploadedVideo] = useState<ModuleVideo | null>(existingVideo || null);
  const [abortController, setAbortController] = useState<AbortController | null>(null);
  const [isViewingVideo, setIsViewingVideo] = useState(false);

  const videoInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // CRITICAL FIX: Always sync uploadedVideo with existingVideo prop
    // This ensures video is cleared when switching to a new module
    setUploadedVideo(existingVideo || null);
  }, [existingVideo]);

  const startUpload = useCallback(async (file: File) => {
    let finalModuleId = moduleId;

    if (!finalModuleId && onModuleNeeded) {
      try {
        finalModuleId = await onModuleNeeded();
        if (!finalModuleId) {
          toast.error('Vui lòng nhập tên module trước khi tải video.');
          return;
        }
      } catch (error) {
        toast.error('Không thể tạo module. Vui lòng thử lại.');
        return;
      }
    } else if (!finalModuleId) {
      toast.error('Vui lòng nhập tên module trước khi tải video.');
      return;
    }

    const controller = new AbortController();
    setAbortController(controller);
    setUploading(true);
    setUploadProgress(0);

    try {
      const result = await videoHLSService.uploadVideo(
        courseId,
        finalModuleId,
        file,
        10, // default segment duration in seconds
        (progressEvent) => {
          if (progressEvent.total) {
            const percent = Math.round((progressEvent.loaded / progressEvent.total) * 100);
            setUploadProgress(percent);
          }
        },
        controller.signal
      );

      const videoData: ModuleVideo = {
        videoUrl: result.videoUrl,
        moduleId: result.moduleId, // Use moduleId from response
        thumbnailUrl: result.thumbnailUrl,
        duration: result.videoDuration,
        uploadedAt: new Date().toISOString(),
      };

      setUploadedVideo(videoData);
      onVideoUploaded?.(videoData);
      toast.success('Đã tải video lên thành công!');
    } catch (error: any) {
      if (error.name === 'AbortError' || error.message?.includes('cancelled')) {
        toast.info('Đã hủy tải video lên.');
      } else {
        toast.error(error.message || 'Tải video lên thất bại. Vui lòng thử lại.');
      }
    } finally {
      setUploading(false);
      setAbortController(null);
      setUploadProgress(0);
    }
  }, [moduleId, onModuleNeeded, courseId, onVideoUploaded]);

  const handleVideoSelect = useCallback(async (file: File) => {
    if (disabled) {
      toast.error('Vui lòng tạo module trước khi tải video lên.');
      return;
    }

    if (!isValidVideoExtension(file.name)) {
      toast.error('Phần mở rộng file không hợp lệ. Vui lòng chọn MP4, MOV, AVI hoặc WebM.');
      return;
    }

    const maxSize = 500 * 1024 * 1024;
    if (file.size > maxSize) {
      toast.error(`Kích thước file ${(file.size / 1024 / 1024).toFixed(1)}MB vượt quá giới hạn 500MB.`);
      return;
    }

    toast.loading('Đang kiểm tra file...', { id: 'video-validation' });
    const validation = await validateVideoFile(file);
    toast.dismiss('video-validation');

    if (!validation.valid) {
      toast.error(validation.error || 'File không hợp lệ.');
      return;
    }

    startUpload(file);
  }, [startUpload, disabled]);


  const handleCancelUpload = () => {
    if (abortController) {
      abortController.abort();
    }
  };

  const handleVideoInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleVideoSelect(file);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      handleVideoSelect(file);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDeleteVideo = async () => {
    if (!uploadedVideo) return;

    if (confirm('Bạn có chắc chắn muốn xóa video này?')) {
      try {
        // Call API to delete video from backend
        if (moduleId) {
          await teacherCourseService.deleteModuleVideo(courseId, moduleId);
        }

        // Update UI
        setUploadedVideo(null);
        onVideoUploaded?.(null as any); // Notify parent component
        toast.success('Đã xóa video thành công!');
      } catch (error: any) {
        toast.error(error.message || 'Xóa video thất bại. Vui lòng thử lại.');
      }
    }
  };

  return (
    <div className="w-full flex flex-col items-start rounded-[12px]">
      <div className="bg-white border border-[#f4f4f7] rounded-[12px] flex h-[77px] items-center justify-between px-[25px] py-[25px] w-full">
        <h3
          className="text-[20px] font-bold text-[#3b3d48] leading-[28px] not-italic"
          style={{ fontFamily: "Inter, sans-serif", fontWeight: 700 }}
        >
          Video bài giảng
        </h3>
        {uploadedVideo && (
          <div className="flex items-center gap-2 text-sm text-green-600">
            <CheckCircle2 className="h-4 w-4" />
            <span style={{ fontFamily: "Roboto, sans-serif" }}>Đã tải lên</span>
          </div>
        )}
      </div>

      <div className="bg-[#fafafa] border border-[#f4f4f7] border-t-0 rounded-bl-[12px] rounded-br-[12px] w-full p-[12px] space-y-3">
        {/* Upload Progress */}
        {uploading && uploadProgress > 0 && (
          <div className="bg-white border border-[#f4f4f7] rounded-[12px] p-4">
            <div className="flex items-center justify-between mb-2">
              <span
                className="text-sm font-medium text-[#3b3d48]"
                style={{ fontFamily: "Roboto, sans-serif" }}
              >
                Đang tải lên...
              </span>
              <span
                className="text-sm text-[#7f859d]"
                style={{ fontFamily: "Roboto, sans-serif" }}
              >
                {uploadProgress}%
              </span>
            </div>
            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#4162e7] transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleCancelUpload}
              className="mt-3 text-sm text-[#e35151] hover:text-red-600 hover:bg-red-50"
            >
              Hủy
            </Button>
          </div>
        )}

        {/* Uploaded Video Display */}
        {uploadedVideo && !uploading && (
          <div className="bg-white border border-[#f4f4f7] rounded-[12px] p-4">
            <div className="flex gap-4">
              <div
                onClick={() => setIsViewingVideo(true)}
                className="relative w-[200px] h-[112px] bg-black rounded-lg overflow-hidden flex-shrink-0 cursor-pointer hover:opacity-80 transition-opacity group"
              >
                {uploadedVideo.thumbnailUrl ? (
                  <img
                    src={uploadedVideo.thumbnailUrl}
                    alt="Video thumbnail"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-800">
                    <Play className="h-8 w-8 text-white/50" />
                  </div>
                )}
                {/* Play button overlay */}
                <div className="absolute inset-0 flex items-center justify-center bg-black/40 group-hover:bg-black/60 transition-all">
                  <Play className="h-12 w-12 text-white fill-white" />
                </div>
              </div>

              <div className="flex-1 min-w-0">
                <p
                  className="text-sm font-medium text-[#3b3d48] truncate"
                  style={{ fontFamily: "Roboto, sans-serif", fontWeight: 500 }}
                >
                  Video bài giảng
                </p>
                <p className="text-xs text-[#7f859d] mt-1" style={{ fontFamily: "Roboto, sans-serif" }}>
                  {uploadedVideo.duration ? `${Math.round(uploadedVideo.duration / 60)} phút` : 'Đang xử lý'}
                </p>
                <p className="text-xs text-[#b1b1b1] mt-1 truncate" style={{ fontFamily: "Roboto, sans-serif" }}>
                  {uploadedVideo.videoUrl}
                </p>
              </div>

              {/* <Button
                variant="ghost"
                size="icon"
                onClick={handleDeleteVideo}
                className="h-8 w-8 text-[#e35151] hover:text-red-600 hover:bg-red-50 flex-shrink-0"
              >
                <Trash2 className="h-4 w-4" />
              </Button> */}
            </div>
          </div>
        )}

        {/* Upload Zone (hidden when video exists) */}
        {!uploadedVideo && !uploading && (
          <>
            {/* Disabled Warning */}
            {disabled && (
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 flex items-start gap-2">
                <div className="text-amber-600 text-sm flex-shrink-0 mt-0.5">⚠️</div>
                <p className="text-sm text-amber-800" style={{ fontFamily: "Roboto, sans-serif" }}>
                  Vui lòng tạo module thành công trước khi tải video lên.
                </p>
              </div>
            )}

            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onClick={() => !disabled && videoInputRef.current?.click()}
              className={`bg-white border border-dashed rounded-[12px] flex flex-col gap-[24px] items-center px-[32px] py-[20px] transition-colors ${disabled
                ? 'border-gray-300 cursor-not-allowed opacity-50'
                : 'border-[#dbdde5] cursor-pointer hover:border-[#4162e7]'
                }`}
            >
              <input
                ref={videoInputRef}
                type="file"
                accept=".mp4,.mov,.avi,.webm"
                className="hidden"
                onChange={handleVideoInputChange}
                disabled={disabled}
              />
              <div className="flex flex-col items-center gap-[6.85px] text-center">
                <p
                  className="text-base font-medium text-[#3b3d48] leading-[24px]"
                  style={{ fontFamily: "Manrope, sans-serif", fontWeight: 500 }}
                >
                  Kéo thả video vào đây hoặc click để chọn file
                </p>
                <p
                  className="text-xs font-normal text-[#b1b1b1] leading-[18px]"
                  style={{ fontFamily: "Manrope, sans-serif", fontWeight: 400 }}
                >
                  MP4, MOV, AVI, WebM • Max 500MB
                </p>
              </div>
              <Button
                type="button"
                variant="outline"
                disabled={disabled}
                className="h-[44px] px-[16px] py-[8px] border border-[#4162e7] text-[#4162e7] hover:bg-[#4162e7] hover:text-white rounded-[6px] disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  if (!disabled) {
                    videoInputRef.current?.click();
                  }
                }}
              >
                <Upload className="h-5 w-5 mr-2" />
                <span
                  className="text-sm font-medium leading-[20px]"
                  style={{ fontFamily: "Roboto, sans-serif", fontWeight: 500 }}
                >
                  Chọn Video
                </span>
              </Button>
            </div>
          </>
        )}
      </div>

      {/* Video Viewing Modal */}
      {isViewingVideo && uploadedVideo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-[#3b3d48]">Video bài giảng</h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsViewingVideo(false)}
                className="h-6 w-6 text-[#7f859d] hover:text-[#3b3d48]"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            {/* Modal Body - Video Player */}
            <div className="p-6">
              <VideoHLSPlayer
                videoId={uploadedVideo.moduleId}
                title="Video bài giảng"
                width="100%"
                height="500px"
                autoplay={true}
                controls={true}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
