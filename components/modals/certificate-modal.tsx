"use client";

import { Dialog, DialogContent } from "@/components/ui/dialog";

import { X } from "lucide-react";

interface CertificateModalProps {
  open: boolean;
  onClose: () => void;
  certificateTitle: string;
  certificateImage?: string | null;
}

export function CertificateModal({
  open,
  onClose,
  certificateTitle,
  certificateImage = null,
}: CertificateModalProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-[90vw] sm:max-w-[800px] lg:max-w-[900px] p-0 bg-white rounded-xl overflow-hidden [&>button]:hidden">
        <div className="relative flex flex-col w-full">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute right-4 top-4 sm:right-6 sm:top-6 w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center hover:opacity-70 transition-opacity z-20 bg-white/90 rounded-full shadow-md"
          >
            <X className="w-5 h-5 sm:w-6 sm:h-6 text-[#3b3d48]" />
          </button>

          {/* Title */}
          <div className="px-6 pt-6 pb-4 border-b border-gray-200">
            <h3
              className="text-xl sm:text-2xl font-semibold text-[#3b3d48] leading-7 pr-12"
              style={{ fontFamily: "Roboto, sans-serif" }}
            >
              {certificateTitle}
            </h3>
          </div>

          {/* Certificate Image - Full width, scrollable */}
          <div className="relative w-full max-h-[70vh] overflow-auto bg-gray-50 p-4 sm:p-6">
            <div className="relative w-full min-h-[400px] flex items-center justify-center">
              <img
                src={`${process.env.NEXT_PUBLIC_MINIO}/${certificateImage}`}
                alt={certificateTitle}
                width={800}
                height={600}
                className="object-contain rounded-lg shadow-lg w-full h-auto"
                sizes="(max-width: 768px) 100vw, 800px"

              />
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

