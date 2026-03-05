"use client";

import { X, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import type { VideoUploadProgress as UploadProgress } from "@/services/apis/video-upload.service";

interface VideoUploadProgressProps {
  progress: UploadProgress;
  onCancel: () => void;
}

export function VideoUploadProgress({ progress, onCancel }: VideoUploadProgressProps) {
  const percentage = Math.min(100, Math.round((progress.uploadedBytes / progress.totalBytes) * 100));
  const uploadedMB = (progress.uploadedBytes / 1024 / 1024).toFixed(1);
  const totalMB = (progress.totalBytes / 1024 / 1024).toFixed(1);
  const speedMBps = (progress.speed / 1024 / 1024).toFixed(2);

  const remainingBytes = progress.totalBytes - progress.uploadedBytes;
  const remainingSeconds = progress.speed > 0 ? remainingBytes / progress.speed : 0;
  const formatTime = (seconds: number) => {
    if (seconds < 60) return `${Math.round(seconds)}s`;
    if (seconds < 3600) return `${Math.round(seconds / 60)}m ${Math.round(seconds % 60)}s`;
    return `${Math.floor(seconds / 3600)}h ${Math.round((seconds % 3600) / 60)}m`;
  };

  return (
    <div className="bg-white border border-[#f4f4f7] rounded-[12px] p-4 space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Upload className="h-5 w-5 text-[#4162e7]" />
          <span
            className="text-sm font-medium text-[#3b3d48]"
            style={{ fontFamily: "Roboto, sans-serif", fontWeight: 500 }}
          >
            Đang tải video lên...
          </span>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={onCancel}
          className="h-6 w-6 text-[#7f859d] hover:text-[#e35151] hover:bg-red-50"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Progress Bar */}
      <div className="space-y-2">
        <Progress value={percentage} className="h-2" />
        <div className="flex items-center justify-between text-xs">
          <span className="text-[#7f859d]" style={{ fontFamily: "Roboto, sans-serif" }}>
            {uploadedMB} MB / {totalMB} MB
          </span>
          <span className="text-[#7f859d]" style={{ fontFamily: "Roboto, sans-serif" }}>
            {percentage}%
          </span>
        </div>
      </div>

      {/* Stats */}
      <div className="flex items-center gap-4 text-xs text-[#7f859d]">
        <div style={{ fontFamily: "Roboto, sans-serif" }}>
          Part {progress.currentPart} / {progress.totalParts}
        </div>
        <div style={{ fontFamily: "Roboto, sans-serif" }}>
          {speedMBps} MB/s
        </div>
        <div style={{ fontFamily: "Roboto, sans-serif" }}>
          Còn lại: {formatTime(remainingSeconds)}
        </div>
      </div>
    </div>
  );
}
