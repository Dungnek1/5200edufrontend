import { useState } from "react";
import { FeedbackModal } from "@/components/modals/feedback-modal";
import { TeacherDetailModal } from "@/components/modals/teacher-detail-modal";
import { TeachersPageTeacherGrid } from "./teachers-page-teacher-grid";
import { TeachersPagePagination } from "./teachers-page-pagination";
import { TeachersPageSkeleton } from "./teachers-page-skeleton";
import { Teacher } from "@/types/teacher";


interface TeachersPageSharedContentProps {
  teachers: Teacher[];
  loading: boolean;
  selectedTeacherId: string | null;
  currentPage: number;
  totalPages: number;
  noTeachersLabel: string;
  onTeacherSelect: (teacherId: string) => void;
  onPageChange: (page: number) => void;
}

export function TeachersPageSharedContent({
  teachers,
  loading,
  selectedTeacherId,
  currentPage,
  totalPages,
  noTeachersLabel,
  onTeacherSelect,
  onPageChange,
}: TeachersPageSharedContentProps) {
  const [showTeacherModal, setShowTeacherModal] = useState(false);
  const [modalTeacher, setModalTeacher] = useState<Teacher | null>(null);

  const handleModalOpen = (teacher: Teacher) => {
    setModalTeacher(teacher);
    setShowTeacherModal(true);
  };

  const handleModalClose = () => {
    setShowTeacherModal(false);
    setModalTeacher(null);
  };

  return (
    <>
      {loading ? (
        <TeachersPageSkeleton type="grid" />
      ) : teachers.length > 0 ? (
        <div className="flex flex-col gap-[20px]">
          <TeachersPageTeacherGrid
            teachers={teachers}
            selectedTeacherId={selectedTeacherId}
            onTeacherSelect={onTeacherSelect}
            onModalOpen={handleModalOpen}
          />
          <div className="flex justify-center">
            <TeachersPagePagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={onPageChange}
            />
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-center py-12 bg-[#f9f9fb] rounded-xl">
          <p className="text-base text-[#8c92ac]">{noTeachersLabel}</p>
        </div>
      )}

      <TeacherDetailModal
        open={showTeacherModal}
        onClose={handleModalClose}
        teacher={modalTeacher}
      />
    </>
  );
}
