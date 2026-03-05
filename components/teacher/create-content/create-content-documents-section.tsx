import { Button } from "@/components/ui/button";
import { Plus, Trash2, Upload } from "lucide-react";
import { formatFileSize } from "@/utils/formatFileSize";

interface CreateContentDocumentsSectionProps {
  materials: any[];
  canUpload: boolean;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  onUploadDocument: (file: File) => void;
  onDeleteDocument: (documentId: string) => void;
}



export function CreateContentDocumentsSection({
  materials,
  canUpload,
  fileInputRef,
  onUploadDocument,
  onDeleteDocument,
}: CreateContentDocumentsSectionProps) {
  return (
    <div className="w-full flex flex-col items-start rounded-[12px]">
      <div className="bg-white border border-[#f4f4f7] rounded-[12px] flex h-[77px] items-center justify-between px-[25px] py-[25px] w-full">
        <h3
          className="text-[20px] font-bold text-[#3b3d48] leading-[28px] not-italic"
          style={{
            fontFamily: "Inter, sans-serif",
            fontWeight: 700,
          }}
        >
          Tài liệu học tập
        </h3>
      </div>
      <div className="bg-white border border-[#f4f4f7] border-t-0 rounded-bl-[12px] rounded-br-[12px] w-full p-[12px]">
        {!canUpload && (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-3 flex items-start gap-2">
            <div className="text-amber-600 text-sm flex-shrink-0 mt-0.5">⚠️</div>
            <p
              className="text-sm text-amber-800"
              style={{ fontFamily: "Roboto, sans-serif" }}
            >
              Vui lòng tạo module thành công trước khi upload tài liệu.
            </p>
          </div>
        )}
        {materials.length === 0 ? (
          <div
            onClick={() => canUpload && fileInputRef.current?.click()}
            className={`bg-white border border-dashed rounded-[12px] flex flex-col gap-[24px] items-center px-[32px] py-[20px] transition-colors ${!canUpload
              ? "border-gray-300 cursor-not-allowed opacity-50"
              : "border-[#dbdde5] cursor-pointer hover:border-[#4162e7]"
              }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".xlsx,.csv,.pdf"
              className="hidden"
              disabled={!canUpload}
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) onUploadDocument(file);
              }}
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
                XLSX, CSV, PDF up to 50MB
              </p>
            </div>
            <Button
              type="button"
              variant="outline"
              disabled={!canUpload}
              className="h-[44px] px-[16px] py-[8px] border border-[#4162e7] text-[#4162e7] hover:bg-[#4162e7] hover:text-white rounded-[6px] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                if (canUpload) {
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
        ) : (
          <div className="flex flex-col gap-2 ">
            {materials.map((file) => {
              const fileName =
                file.originalName || file.name || file.fileName || "";
              const fileSize = file.size || file.fileSize || "";
              const key = file.id || file.documentId || Math.random().toString();

              return (
                <div
                  key={key}
                  className="bg-white border-[0.5px] border-[#f4f4f7] rounded-[12px] flex h-[68px] items-center p-[12px]"
                >
                  <div className="flex flex-1 gap-1.5 items-center">
                    <div className="flex flex-1 gap-3 items-center">
                      <div className="aspect-square w-[44px] h-[44px] rounded-[10px] bg-[#fafafa] border border-[#f4f4f7] flex items-center justify-center flex-shrink-0">
                        <Upload className="h-6 w-6 text-[#4162e7]" />
                      </div>
                      <div className="flex flex-1 flex-col gap-1 min-w-0 py-[8px]">
                        <p className="text-base font-normal text-[#3b3d48] leading-[24px] truncate">
                          {fileName}
                        </p>
                        <div className="flex items-center gap-1 text-xs text-[#7f859d]">
                          <span className="leading-[16px]">
                            {formatFileSize(fileSize)}
                          </span>
                        </div>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-5 w-5 text-[#e35151] hover:text-red-600 hover:bg-red-50 flex-shrink-0"
                      onClick={() => onDeleteDocument(file.id)}
                    >
                      <Trash2 className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
              );
            })}

            <div className="flex items-center justify-center pt-3">
              <Button
                type="button"
                variant="outline"
                disabled={!canUpload}
                onClick={() => canUpload && fileInputRef.current?.click()}
                className="h-[44px] px-4 border border-[#4162e7] text-[#4162e7] hover:bg-[#4162e7] hover:text-white flex items-center gap-1 rounded-[6px] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Plus className="h-5 w-5" />
                <span className="text-sm font-medium leading-[20px]">
                  Thêm file
                </span>
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                accept=".xlsx,.csv,.pdf"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) onUploadDocument(file);
                }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
