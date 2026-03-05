"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Upload, FileText, X, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";
import { getMinIOUrl } from "@/config/minio.config";

interface EssayPrompt {
    rubric?: string;
    minWords?: number;
    maxWords?: number;
}

interface EssaySubmission {
    content: string;
    attachmentUrl?: string;
    wordCount?: number;
    submittedAt?: string;
    feedbackText?: string;
    score?: number;
}

interface LessonEssayProps {
    essayPrompt: EssayPrompt;
    onSubmit: (content: string, attachmentUrl?: string) => Promise<void>;
    submitted: boolean;
    submission?: EssaySubmission | null;
    onFileUpload?: (file: File) => Promise<string>; // Returns MinIO objectKey
}

export function LessonEssay({
    essayPrompt,
    onSubmit,
    submitted,
    submission,
    onFileUpload,
}: LessonEssayProps) {
    const t = useTranslations();
    const [content, setContent] = useState(submission?.content || "");
    const [attachmentUrl, setAttachmentUrl] = useState(submission?.attachmentUrl || "");
    const [attachmentFile, setAttachmentFile] = useState<File | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const minWords = essayPrompt.minWords || 100;
    const maxWords = essayPrompt.maxWords || 500;

    // Count words in content
    const wordCount = content
        .trim()
        .split(/\s+/)
        .filter((word) => word.length > 0).length;

    const isValidWordCount = wordCount >= minWords && wordCount <= maxWords;

    const validateFile = (file: File): { valid: boolean; error?: string } => {
        // Validate file extension
        const allowedExtensions = [
            '.pdf', '.doc', '.docx', '.txt',
            '.xlsx', '.csv',
            '.mp4', '.mov'
        ];
        const fileExtension = file.name.toLowerCase().match(/\.[^.]+$/)?.[0] || '';

        if (!allowedExtensions.includes(fileExtension)) {
            return {
                valid: false,
                error: t('quiz.fileTypeError')
            };
        }

        // Validate MIME type
        const allowedMimeTypes = [
            // Documents
            "application/pdf",
            "application/msword",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            "text/plain",
            // Spreadsheets
            "application/vnd.ms-excel",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            "text/csv",
            // Videos
            "video/mp4",
            "video/quicktime",
        ];

        if (!allowedMimeTypes.includes(file.type)) {
            return {
                valid: false,
                error: t('quiz.fileTypeError')
            };
        }

        // Validate file size (max 50MB)
        if (file.size > 50 * 1024 * 1024) {
            return {
                valid: false,
                error: t('quiz.fileSizeError')
            };
        }

        return { valid: true };
    };

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate file
        const validation = validateFile(file);
        if (!validation.valid) {
            toast.error(validation.error || t('quiz.essayFileUploadError'));
            e.target.value = ''; // Reset file input
            return;
        }

        setAttachmentFile(file);

        // Upload file if handler provided
        if (onFileUpload) {
            try {
                setIsUploading(true);
                const objectKey = await onFileUpload(file);
                setAttachmentUrl(objectKey);
                toast.success(t('quiz.essayFileUploaded'));
            } catch (error: any) {
                console.error('File upload error:', error);
                const errorMessage = error?.response?.data?.message || error?.message || t('quiz.essayFileUploadError');
                toast.error(errorMessage);
                setAttachmentFile(null);
                e.target.value = ''; // Reset file input
            } finally {
                setIsUploading(false);
            }
        }
    };

    const handleRemoveAttachment = () => {
        setAttachmentFile(null);
        setAttachmentUrl("");
    };

    const handleSubmit = async () => {
        if (!isValidWordCount) {
            toast.error(`Vui lòng viết từ ${minWords} đến ${maxWords} từ`);
            return;
        }

        try {
            setIsSubmitting(true);
            await onSubmit(content, attachmentUrl);
            toast.success("Nộp bài thành công!");
        } catch (error) {
            toast.error("Không thể nộp bài. Vui lòng thử lại");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="flex flex-col gap-5">
            {/* Result Card - Shown after submission */}
            {submitted && submission && (
                <div className="rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 p-4 sm:p-6 text-white">
                    <div className="flex items-start gap-3">
                        <CheckCircle2 className="h-6 w-6 flex-shrink-0 mt-1" />
                        <div className="flex-1">
                            <p className="text-base sm:text-lg font-semibold mb-2">
                                Bài tự luận đã được nộp
                            </p>
                            <p className="text-sm opacity-90">
                                Nộp lúc: {submission.submittedAt ? new Date(submission.submittedAt).toLocaleString("vi-VN") : "N/A"}
                            </p>
                            {submission.score !== undefined && (
                                <p className="text-sm opacity-90 mt-1">
                                    Điểm: {submission.score}
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Essay Prompt Card */}
            <div className="rounded-xl border border-[#f4f4f7] bg-white p-5">
                <div className="mb-4">
                    <div className="flex items-center gap-2 mb-3">
                        <span className="inline-flex rounded bg-[#4162e7] px-2 py-0.5 text-sm font-medium text-white">
                            Câu hỏi tự luận
                        </span>
                    </div>

                    {essayPrompt.rubric && (
                        <div className="mb-4">
                            <h3
                                className="text-base font-medium text-[#3b3d48] leading-6 mb-2"
                                style={{ fontFamily: "Roboto, sans-serif" }}
                            >
                                Tiêu chí chấm điểm:
                            </h3>
                            <p
                                className="text-sm text-[#7f859d] leading-6 whitespace-pre-wrap"
                                style={{ fontFamily: "Roboto, sans-serif" }}
                            >
                                {essayPrompt.rubric}
                            </p>
                        </div>
                    )}

                    <div className="flex items-center gap-3 text-sm text-[#7f859d]">
                        <span>Yêu cầu: {minWords} - {maxWords} từ</span>
                    </div>
                </div>

                {/* Essay Content */}
                {!submitted && (
                    <>
                        <div className="mb-4">
                            <Label className="text-sm font-medium text-[#3b3d48] mb-2 block">
                                Nội dung bài làm
                            </Label>
                            <div className="relative">
                                <Textarea
                                    value={content}
                                    onChange={(e) => setContent(e.target.value)}
                                    placeholder="Viết câu trả lời của bạn..."
                                    className={cn(
                                        "min-h-[200px] rounded-[8px] border text-sm resize-y px-3 py-3",
                                        !isValidWordCount && wordCount > 0
                                            ? "border-red-300 bg-red-50"
                                            : "border-[#f4f4f7] bg-[#fafafa]"
                                    )}
                                    style={{ fontFamily: "Roboto, sans-serif" }}
                                    disabled={submitted}
                                />
                                <div className="absolute bottom-3 right-3 flex items-center gap-2">
                                    <span
                                        className={cn(
                                            "text-xs",
                                            !isValidWordCount && wordCount > 0
                                                ? "text-red-600 font-medium"
                                                : "text-[#8c92ac]"
                                        )}
                                    >
                                        {wordCount} từ
                                    </span>
                                </div>
                            </div>
                            {wordCount > 0 && !isValidWordCount && (
                                <p className="text-xs text-red-600 mt-1">
                                    {wordCount < minWords
                                        ? `Cần thêm ${minWords - wordCount} từ nữa`
                                        : `Vượt quá ${wordCount - maxWords} từ`}
                                </p>
                            )}
                        </div>

                        {/* File Attachment */}
                        <div className="mb-4">
                            <Label className="text-sm font-medium text-[#3b3d48] mb-2 block">
                                File đính kèm (tùy chọn)
                            </Label>

                            {!attachmentFile && !attachmentUrl && (
                                <div
                                    onClick={() => !submitted && !isUploading && fileInputRef.current?.click()}
                                    className={`bg-white border border-dashed rounded-[12px] flex flex-col gap-[24px] items-center px-[32px] py-[20px] transition-colors ${submitted || isUploading
                                        ? "border-gray-300 cursor-not-allowed opacity-50"
                                        : "border-[#dbdde5] cursor-pointer hover:border-[#4162e7]"
                                        }`}
                                >
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept=".pdf,.doc,.docx,.txt,.xlsx,.csv,.mp4,.mov"
                                        className="hidden"
                                        disabled={submitted || isUploading}
                                        onChange={handleFileSelect}
                                    />
                                    <div className="flex flex-col items-center gap-[6.85px] text-center">
                                        <p
                                            className="text-base font-medium text-[#3b3d48] leading-[24px]"
                                            style={{
                                                fontFamily: "Manrope, sans-serif",
                                                fontWeight: 500,
                                            }}
                                        >
                                            Chọn file hoặc kéo thả vào đây
                                        </p>
                                        <p
                                            className="text-xs font-normal text-[#b1b1b1] leading-[18px]"
                                            style={{
                                                fontFamily: "Manrope, sans-serif",
                                                fontWeight: 400,
                                            }}
                                        >
                                            PDF, DOC, DOCX, TXT, XLSX, CSV, MP4, MOV up to 50MB
                                        </p>
                                    </div>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        disabled={submitted || isUploading}
                                        className="h-[44px] px-[16px] py-[8px] border border-[#4162e7] text-[#4162e7] hover:bg-[#4162e7] hover:text-white rounded-[6px] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            if (!submitted && !isUploading) {
                                                fileInputRef.current?.click();
                                            }
                                        }}
                                    >
                                        <span
                                            className="text-sm font-medium leading-[20px]"
                                            style={{
                                                fontFamily: "Roboto, sans-serif",
                                                fontWeight: 500,
                                            }}
                                        >
                                            Browse File
                                        </span>
                                    </Button>
                                </div>
                            )}

                            {(attachmentFile || attachmentUrl) && (
                                <div className="flex items-center gap-3 p-3 border border-[#f4f4f7] rounded-lg bg-[#fafafa]">
                                    <FileText className="h-5 w-5 text-[#4162e7] flex-shrink-0" />
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm text-[#3b3d48] truncate">
                                            {attachmentFile?.name || "File đã tải lên"}
                                        </p>
                                        {attachmentFile && (
                                            <p className="text-xs text-[#7f859d]">
                                                {(attachmentFile.size / 1024 / 1024).toFixed(2)} MB
                                            </p>
                                        )}
                                    </div>
                                    {!submitted && (
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={handleRemoveAttachment}
                                            className="h-6 w-6 text-[#e35151] hover:text-red-600 hover:bg-red-50"
                                        >
                                            <X className="h-4 w-4" />
                                        </Button>
                                    )}
                                </div>
                            )}

                            {isUploading && (
                                <p className="text-xs text-[#4162e7] mt-1">Đang tải file lên...</p>
                            )}
                        </div>

                        {/* Submit Button */}
                        <Button
                            onClick={handleSubmit}
                            disabled={!isValidWordCount || isSubmitting || isUploading}
                            className="w-full bg-[#4162e7] hover:bg-[#3652d3] text-white py-3 text-base font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                            style={{ fontFamily: "Roboto, sans-serif" }}
                        >
                            {isSubmitting ? "Đang nộp bài..." : "Nộp bài tự luận"}
                        </Button>
                    </>
                )}

                {/* Submitted Content View */}
                {submitted && submission && (
                    <>
                        <div className="mb-4">
                            <Label className="text-sm font-medium text-[#3b3d48] mb-2 block">
                                Nội dung đã nộp
                            </Label>
                            <div className="p-4 rounded-lg border border-[#f4f4f7] bg-[#fafafa]">
                                <p
                                    className="text-sm text-[#3b3d48] leading-6 whitespace-pre-wrap"
                                    style={{ fontFamily: "Roboto, sans-serif" }}
                                >
                                    {submission.content}
                                </p>
                                <div className="mt-2 text-xs text-[#8c92ac]">
                                    {submission.wordCount || wordCount} từ
                                </div>
                            </div>
                        </div>

                        {submission.attachmentUrl && (
                            <div className="mb-4">
                                <Label className="text-sm font-medium text-[#3b3d48] mb-2 block">
                                    File đính kèm
                                </Label>
                                <div className="flex items-center gap-3 p-3 border border-[#f4f4f7] rounded-lg bg-[#fafafa]">
                                    <FileText className="h-5 w-5 text-[#4162e7] flex-shrink-0" />
                                    <a
                                        href={getMinIOUrl(submission.attachmentUrl)}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex-1 text-sm text-[#4162e7] hover:underline truncate"
                                    >
                                        Xem file đính kèm
                                    </a>
                                </div>
                            </div>
                        )}

                        {submission.feedbackText && (
                            <div className="mt-4 p-4 rounded-lg bg-amber-50 border border-amber-200">
                                <h4 className="text-sm font-medium text-amber-900 mb-2">
                                    Nhận xét từ giáo viên:
                                </h4>
                                <p
                                    className="text-sm text-amber-800 leading-6 whitespace-pre-wrap"
                                    style={{ fontFamily: "Roboto, sans-serif" }}
                                >
                                    {submission.feedbackText}
                                </p>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
