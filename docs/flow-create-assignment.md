# Luồng tạo bài tập (Assignment/Quiz) – 5200edu-fe

## Tổng quan

Trong dự án, **bài tập** được gọi là **Quiz** (type `QUIZ`) hoặc **Assignment** ở API. Luồng tạo/chỉnh sửa nằm ở trang **Tạo nội dung khóa học** (create-content), gắn với từng **module** (section).

---

## Luồng hiện tại

### 1. Vào màn tạo bài tập

- **Route:** `/[locale]/teacher/courses/[id]/create-content`
- **File:** `app/[locale]/teacher/courses/[id]/create-content/page.tsx`
- **Vào từ:** Tạo khóa mới (sau khi tạo xong) hoặc từ trang Review khóa học → "Chỉnh sửa".

### 2. Chọn module

- Sidebar trái: danh sách module (sections). Click một module → `loadModuleData(module)`.
- `loadModuleData` hiện chỉ:
  - Load **tài liệu** (documents) của module qua `uploadService.getModuleDocuments`.
  - **Không** gọi API load danh sách bài tập (assignments) của module.

### 3. Tạo bài tập mới

- Trong form module bên phải có block **"Bài tập"** (`QuizSummaryCard`).
- Nút **"Tạo bài tập"** → `handleOpenQuizModal()` → mở `QuizCreationModal`.
- Điều kiện: phải có `currentModuleId` (đã chọn module), không thì toast "Tạo module trước".
- Trong modal: nhập title, hướng dẫn, thời gian (phút), điểm đạt, và các câu hỏi (prompt, options, đáp án đúng, điểm).
- **Lưu** → `handleCreateQuiz(quizData)`:
  - Gọi `quizService.createAssignment(courseId, { type: 'QUIZ', title, instructions, timeLimitSeconds, passScore, questions, sectionId: currentModuleId })`.
  - API: `POST /packs/{courseId}/assignments`.
  - Sau khi tạo thành công:
    - Cập nhật `quizCount` của module trong sidebar (+1).
    - **Không** thêm bài tập vừa tạo vào state `quizzes` → danh sách bài tập trong module vẫn trống (UX lỗi).

### 4. Chỉnh sửa / Xóa bài tập

- **Sửa:** `handleEditQuiz(quiz)` → set `editingQuiz` và mở `QuizCreationModal` với `editingQuiz`. Modal cần `questions` để hiển thị câu hỏi; hiện tại `quizzes` trong state không được load từ API nên thường không có dữ liệu chi tiết (questions).
- **Xóa:** `handleDeleteQuiz(quizId)` → `quizService.deleteAssignment(courseId, quizId)`, sau đó giảm `quizCount` của module. Không cập nhật `quizzes` (xóa phần tử tương ứng).

### 5. API & service

- **File:** `services/apis/quiz.service.ts`
- **Tạo:** `createAssignment(courseId, params)` → POST `/packs/{courseId}/assignments`, params có `sectionId` (id module).
- **Sửa:** `updateAssignment(courseId, assignmentId, params)` → PUT `/packs/{courseId}/assignments/{assignmentId}`.
- **Xóa:** `deleteAssignment(courseId, assignmentId)` → DELETE `/packs/{courseId}/assignments/{assignmentId}`.
- **Danh sách:** `listAssignments(courseId)` → GET `/packs/{courseId}/assignments` (toàn khóa, không filter theo module).
- **Chi tiết:** `getAssignment(courseId, assignmentId)` → GET `/packs/{courseId}/assignments/{assignmentId}` (có questions).

---

## Các vấn đề đã sửa ✅

### 1. Load danh sách bài tập khi chọn module

- **Đã sửa:** `loadModuleData(module)` gọi `fetchAssignments(module.id)` → `quizService.listAssignments(courseId)` + filter theo `sectionId` hoặc `section.id`.
- **Hỗ trợ:** Cả QUIZ và ESSAY; fallback `section?.id` nếu backend trả nested.

### 2. Sau khi tạo bài tập, danh sách cập nhật

- **Đã sửa:** Sau `createAssignment` gọi `fetchAssignments(currentModuleId)` để refresh list.

### 3. Chỉnh sửa bài tập có đủ câu hỏi

- **Đã sửa:** `handleEditQuiz(quiz)` gọi `quizService.getAssignment(courseId, quiz.id)` lấy chi tiết, transform qua `transformToQuiz`, rồi mới mở modal.
- **Bổ sung:** `normalizeQuestion` map backend format (`question`→`prompt`, `optionText`→`text`) cho modal.

### 4. Sau khi xóa bài tập, danh sách cập nhật

- **Đã sửa:** Sau `deleteAssignment` gọi `fetchAssignments(currentModuleId)` để refresh list.

---

## Tóm tắt luồng chuẩn (sau khi sửa)

1. Vào **create-content** → chọn **module** → load cả **tài liệu** và **danh sách bài tập** (listAssignments + filter sectionId).
2. **Tạo bài tập:** Mở modal → điền form → Lưu → gọi API → thêm assignment trả về vào `quizzes` và tăng `quizCount`.
3. **Sửa bài tập:** Bấm Sửa → gọi getAssignment lấy chi tiết (có questions) → mở modal với dữ liệu đầy đủ → Lưu → updateAssignment → cập nhật phần tử tương ứng trong `quizzes`.
4. **Xóa bài tập:** Xóa → deleteAssignment → xóa khỏi `quizzes` và giảm `quizCount`.

---

## File liên quan

| File | Vai trò |
|------|--------|
| `app/[locale]/teacher/courses/[id]/create-content/page.tsx` | Trang create-content, state modules/quizzes, handleCreateQuiz, handleEditQuiz, handleDeleteQuiz, loadModuleData |
| `components/quiz/quiz-creation-modal.tsx` | Modal tạo/sửa: form title, instructions, timeLimit, passScore, questions |
| `components/quiz/quiz-summary-card.tsx` | Block "Bài tập", list quiz, nút Tạo / Sửa / Xóa |
| `services/apis/quiz.service.ts` | createAssignment, updateAssignment, deleteAssignment, listAssignments, getAssignment |
| `lib/validations/quiz-schemas.ts` | createQuizSchema, updateQuizSchema (validation) |

---

*Tài liệu kiểm tra luồng tạo bài tập – 5200edu-fe.*
