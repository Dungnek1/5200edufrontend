import { CreateContentHeader } from "./create-content-header";
import { CreateContentStepper } from "./create-content-stepper";
import { CreateContentModuleForm } from "./create-content-module-form";
import { CreateContentDocumentsSection } from "./create-content-documents-section";
import { CreateContentSidebar } from "./create-content-sidebar";
import { CreateContentActionButtons } from "./create-content-action-buttons";
import { QuizSummaryCard } from "@/components/quiz/quiz-summary-card";
import { QuizCreationModal } from "@/components/quiz/quiz-creation-modal";
import type { UseCreateCourseContentReturn } from "@/hooks/use-create-course-content";

interface CreateContentMainProps extends UseCreateCourseContentReturn {
  locale: string;
}

export function CreateContentMain({
  locale,
  loading,
  course,
  modules,
  currentModuleId,
  materials,
  quizzes,
  moduleVideos,
  modulesWithUnsavedEdits,
  canUpload,
  moduleData,
  fileInputRef,
  currentModule,
  totalModules,
  totalQuizzes,
  totalDocuments,
  quizModalOpen,
  editingQuiz,
  setQuizModalOpen,
  setEditingQuiz,
  setModuleData,
  onCreateModule,
  handleUploadDocument,
  handleDeleteDocument,
  handleNext,
  handleCreateNewModule,
  handleDeleteModule,
  handleOpenQuizModal,
  handleEditQuiz,
  handleCreateQuiz,
  handleDeleteQuiz,
  handleReset,
  loadModuleData,
  fetchCourse,
  setCurrentModuleId,
  setModuleVideos,
  setQuizzes,
}: CreateContentMainProps) {
  return (
    <>
      <main className="min-h-screen bg-white">
        <div className="bg-white mx-auto max-w-[1990px] w-full px-4 sm:px-6 md:px-8 lg:px-[64px] py-4 sm:py-5 md:py-[20px] pb-6 sm:pb-8 md:pb-[40px] flex flex-col gap-3 sm:gap-4 lg:gap-[16px]">
          {/* Header */}
          <CreateContentHeader locale={locale} />

          {/* Stepper */}
          <CreateContentStepper />

          {/* Main Content */}
          <div className="w-full flex flex-col items-start overflow-x-hidden">
            <div className="w-full flex flex-col lg:flex-row items-start gap-[20px]">
              {/* Form Section */}
              <div className="flex-1 flex items-start justify-center w-full">
                <div className="w-full max-w-[780px] flex flex-col gap-[16px] sm:gap-[20px] items-end justify-end px-4 sm:px-0">
                  <CreateContentModuleForm
                    moduleData={moduleData}
                    setModuleData={setModuleData}
                    courseId={course?.id?.toString() || ""}
                    currentModuleId={currentModuleId}
                    canUpload={canUpload}
                    moduleVideos={moduleVideos}
                    onCreateModule={onCreateModule}
                    fetchCourse={fetchCourse}
                    setCurrentModuleId={setCurrentModuleId}
                  />

                  <CreateContentDocumentsSection
                    materials={materials}
                    canUpload={canUpload}
                    fileInputRef={fileInputRef}
                    onUploadDocument={handleUploadDocument}
                    onDeleteDocument={handleDeleteDocument}
                  />

                  {/* Quiz Summary Section */}
                  <QuizSummaryCard
                    quizzes={quizzes}
                    onEdit={handleEditQuiz}
                    onDelete={handleDeleteQuiz}
                    onCreate={handleOpenQuizModal}
                  />

                  {/* Action Buttons */}
                  <CreateContentActionButtons
                    loading={loading}
                    uploading={loading}
                    moduleData={moduleData}
                    handleNext={handleNext}
                    handleReset={handleReset}
                  />
                </div>
              </div>

              {/* Sidebar */}
              <CreateContentSidebar
                modules={modules}
                currentModuleId={currentModuleId}
                modulesWithUnsavedEdits={modulesWithUnsavedEdits}
                loadModuleData={loadModuleData}
                handleDeleteModule={handleDeleteModule}
                handleCreateNewModule={handleCreateNewModule}
                totalModules={totalModules}
                totalQuizzes={totalQuizzes}
              />
            </div>
          </div>
        </div>
      </main>

      {/* Quiz Creation Modal */}
      <QuizCreationModal
        open={quizModalOpen}
        onClose={() => {
          setQuizModalOpen(false);
          setEditingQuiz(null);
        }}
        onCreate={handleCreateQuiz}
        moduleId={currentModuleId || undefined}
        moduleInfo={
          currentModule
            ? {
                id: currentModule.id,
                title: currentModule.title,
                description: currentModule.description,
                sortOrder: currentModule.sortOrder,
              }
            : null
        }
        editingQuiz={editingQuiz}
      />
    </>
  );
}
