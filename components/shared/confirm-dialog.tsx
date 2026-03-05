"use client";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

interface ConfirmDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    title: string;
    description: string;
    confirmText?: string;
    cancelText?: string;
    onConfirm: () => void | Promise<void>;
    loading?: boolean;
    variant?: "default" | "destructive";
}

/**
 * Confirm Dialog Component
 * Reusable confirmation modal for delete/destructive actions
 */
export function ConfirmDialog({
    open,
    onOpenChange,
    title,
    description,
    confirmText = "Xác nhận",
    cancelText = "Hủy",
    onConfirm,
    loading = false,
    variant = "destructive",
}: ConfirmDialogProps) {
    const handleConfirm = async () => {
        await onConfirm();
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-[400px] rounded-[12px] p-6">
                <DialogHeader>
                    <div className="flex items-start gap-3 mb-2">
                        {variant === "destructive" && (
                            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-red-50 flex items-center justify-center">
                                <AlertTriangle className="h-5 w-5 text-red-600" />
                            </div>
                        )}
                        <div className="flex-1">
                            <DialogTitle
                                className="text-lg font-medium text-[#0f172a] leading-[28px]"
                                style={{ fontFamily: "Roboto, sans-serif", fontWeight: 500 }}
                            >
                                {title}
                            </DialogTitle>
                        </div>
                    </div>
                    <DialogDescription
                        className="text-sm font-normal text-[#64748b] leading-[20px]"
                        style={{ fontFamily: "Roboto, sans-serif", fontWeight: 400 }}
                    >
                        {description}
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter className="flex flex-col sm:flex-row gap-2 mt-4">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                        disabled={loading}
                        className="h-[44px] px-[16px] py-[8px] border border-[#e2e8f0] text-[#64748b] hover:bg-[#f8fafc] rounded-[6px] w-full sm:w-auto"
                    >
                        <span
                            className="text-sm font-medium leading-[20px]"
                            style={{ fontFamily: "Roboto, sans-serif", fontWeight: 500 }}
                        >
                            {cancelText}
                        </span>
                    </Button>
                    <Button
                        type="button"
                        onClick={handleConfirm}
                        disabled={loading}
                        className={`h-[44px] px-[16px] py-[8px] rounded-[6px] w-full sm:w-auto ${variant === "destructive"
                                ? "bg-[#ef4444] text-white hover:bg-[#dc2626]"
                                : "bg-[#4162e7] text-white hover:bg-[#3554d4]"
                            }`}
                    >
                        <span
                            className="text-sm font-medium leading-[20px]"
                            style={{ fontFamily: "Roboto, sans-serif", fontWeight: 500 }}
                        >
                            {loading ? "Đang xử lý..." : confirmText}
                        </span>
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
