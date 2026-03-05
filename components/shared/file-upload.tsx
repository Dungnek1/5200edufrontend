"use client";

import { useCallback, useState } from "react";
import { Upload, X, FileIcon, ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { formatFileSize, validateFileSize, validateFileType } from "@/utils/media";
import { useTranslations } from "next-intl";


interface FileUploadProps {
  accept?: string;
  maxSizeMB?: number;
  onFileSelect: (file: File) => void;
  onRemove?: () => void;
  currentFile?: File | null;
  currentFileUrl?: string | null;
  disabled?: boolean;
  className?: string;
  label?: string;
  description?: string;
}


export function FileUpload({
  accept = "image/*",
  maxSizeMB = 5,
  onFileSelect,
  onRemove,
  currentFile,
  currentFileUrl,
  disabled = false,
  className,
  label = "Chọn file hoặc kéo thả vào đây",
  description = "PNG, JPG, WEBP (tối đa 5MB)",
}: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const t = useTranslations("common.fileUpload");

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    if (!disabled) {
      setIsDragging(true);
    }
  }, [disabled]);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);

      if (disabled) return;

      const files = Array.from(e.dataTransfer.files);
      if (files.length > 0) {
        handleFile(files[0]);
      }
    },
    [disabled]
  );

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (files && files.length > 0) {
        handleFile(files[0]);
      }
    },
    []
  );

  const handleFile = (file: File) => {
    setError(null);

    const allowedTypes = accept.split(',').map(t => t.trim());
    if (!validateFileType(file, allowedTypes)) {
      setError(`Định dạng file không hợp lệ. Chỉ chấp nhận: ${accept}`);
      return;
    }

    if (!validateFileSize(file, maxSizeMB)) {
      setError(`Kích thước file quá lớn. Tối đa ${maxSizeMB}MB`);
      return;
    }

    onFileSelect(file);
  };

  const isImage = accept.includes('image');
  const hasFile = currentFile || currentFileUrl;

  return (
    <div className={cn("space-y-2", className)}>
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={cn(
          "relative border-2 border-dashed rounded-lg p-8 text-center transition-colors",
          isDragging && !disabled && "border-[#4162e7] bg-[#eceffd]",
          !isDragging && !disabled && "border-[#dbdde5] hover:border-[#4162e7]",
          disabled && "opacity-50 cursor-not-allowed",
          error && "border-red-500"
        )}
      >

        {hasFile && (
          <div className="mb-4">
            {isImage && currentFileUrl ? (
              <div className="relative w-32 h-32 mx-auto">
                <img
                  src={currentFileUrl}
                  alt="Preview"
                  className="w-full h-full object-cover rounded-lg"
                />
                {onRemove && !disabled && (
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute -top-2 -right-2 h-6 w-6 rounded-full"
                    onClick={onRemove}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                )}
              </div>
            ) : currentFile ? (
              <div className="flex items-center justify-center gap-3 p-3 bg-[#f8f9fa] rounded-lg">
                <FileIcon className="h-8 w-8 text-[#4162e7]" />
                <div className="flex-1 text-left">
                  <p className="text-sm font-medium text-[#3b3d48]">{currentFile.name}</p>
                  <p className="text-xs text-[#8c92ac]">{formatFileSize(currentFile.size)}</p>
                </div>
                {onRemove && !disabled && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-red-500"
                    onClick={onRemove}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ) : null}
          </div>
        )}


        {!hasFile && (
          <>
            {isImage ? (
              <ImageIcon className="h-12 w-12 text-[#8c92ac] mx-auto mb-3" />
            ) : (
              <Upload className="h-12 w-12 text-[#8c92ac] mx-auto mb-3" />
            )}
            <p className="text-sm text-[#3b3d48] mb-1 font-medium">{label}</p>
            <p className="text-xs text-[#8c92ac] mb-4">{description}</p>
          </>
        )}

        <input
          type="file"
          accept={accept}
          onChange={handleFileInput}
          disabled={disabled}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
        />


        {!hasFile && (
          <Button
            type="button"
            variant="outline"
            className="border-[#4162e7] text-[#4162e7] hover:bg-[#4162e7] hover:text-white pointer-events-none transition-colors"
            disabled={disabled}
          >
            {t("browse")}
          </Button>
        )}
      </div>

      {/* Error message */}
      {error && (
        <p className="text-sm text-red-500">{error}</p>
      )}
    </div>
  );
}
