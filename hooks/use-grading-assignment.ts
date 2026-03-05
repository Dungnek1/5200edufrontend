import { useState } from "react";
import { useRouter } from "next/navigation";
import { logger } from '@/lib/logger';

export interface GradingAssignment {
  id: string;
  title: string;
  module: string;
  courseTitle: string;
  pendingCount: number;
  thumbnail: string;
}

export interface GradingStudent {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
}

export interface QuizOption {
  id: string;
  text: string;
  isCorrect: boolean;
  isSelected: boolean;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: QuizOption[];
}

export interface UseGradingAssignmentProps {
  assignmentId: string;
  locale: string;
}

export interface UseGradingAssignmentReturn {
  activeTab: "practice" | "theory";
  theoryScore: number;
  practiceScore: number;
  comment: string;
  attachedFiles: File[];
  showNextModal: boolean;
  showCompleteModal: boolean;
  dontShowAgain: boolean;
  isSaving: boolean;
  hasMoreAssignments: boolean;

  assignment: GradingAssignment;
  student: GradingStudent;
  submittedFiles: { id: string; name: string; size: string }[];
  studentNotes: string;
  theoryQuestions: string[];
  quizQuestions: QuizQuestion[];

  setActiveTab: (tab: "practice" | "theory") => void;
  setTheoryScore: (score: number) => void;
  setPracticeScore: (score: number) => void;
  setComment: (comment: string) => void;
  setAttachedFiles: (files: File[]) => void;
  setShowNextModal: (show: boolean) => void;
  setShowCompleteModal: (show: boolean) => void;
  setDontShowAgain: (dont: boolean) => void;

  handlePracticeScoreChange: (delta: number) => void;
  handleFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleRemoveFile: (index: number) => void;
  handleSaveDraft: () => Promise<void>;
  handleSubmit: () => void;
  handleNextAssignment: () => void;
  handleReview: () => void;
  handleGoToList: () => void;
  handleRequestResubmission: () => void;
}

export function useGradingAssignment({
  assignmentId,
  locale,
}: UseGradingAssignmentProps): UseGradingAssignmentReturn {
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<"practice" | "theory">("theory");
  const [theoryScore, setTheoryScore] = useState(15);
  const [practiceScore, setPracticeScore] = useState(0);
  const [comment, setComment] = useState("");
  const [attachedFiles, setAttachedFiles] = useState<File[]>([]);
  const [showNextModal, setShowNextModal] = useState(false);
  const [showCompleteModal, setShowCompleteModal] = useState(false);
  const [dontShowAgain, setDontShowAgain] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const hasMoreAssignments = true;

  const assignment: GradingAssignment = {
    id: assignmentId,
    title: "Phân tích khẩu vị ẩm thực Việt Nam theo vùng miền bằng AI",
    module: "Module 1",
    courseTitle: "Ứng dụng AI trong Quản lý Nhà hàng & Chuỗi F&B",
    pendingCount: 123,
    thumbnail: "/images/courses/course-1.jpg",
  };

  const student: GradingStudent = {
    id: "1",
    name: "Phạm Thị Mai",
    email: "james.wilson@university.edu",
    phone: "0967891234",
    avatar: "/images/avatars/Ellipse 29.png",
  };

  const submittedFiles = [
    { id: "1", name: "filename.n8n", size: "2.5 MB" },
    { id: "2", name: "filename.n8n", size: "1.8 MB" },
  ];

  const studentNotes = `Lorem ipsum dolor sit amet consectetur...`;

  const theoryQuestions: string[] = [];

  const quizQuestions: QuizQuestion[] = [
    {
      id: "1",
      question: "Lorem ipsum dolor sit amet consectetur. Cursus dolor porttitor nisi in.",
      options: [
        {
          id: "1-1",
          text: "Lorem ipsum dolor sit amet consectetur. Porttitor ridiculus in ullamcorper odio in sodales integer vitae.",
          isCorrect: true,
          isSelected: true,
        },
        {
          id: "1-2",
          text: "Lorem ipsum dolor sit amet consectetur. Porttitor ridiculus in ullamcorper odio in sodales integer vitae.",
          isCorrect: false,
          isSelected: true,
        },
        {
          id: "1-3",
          text: "Lorem ipsum dolor sit amet consectetur. Tempus mauris fusce sit magnis vel sed elit amet.",
          isCorrect: false,
          isSelected: false,
        },
        {
          id: "1-4",
          text: "Lorem ipsum dolor sit amet consectetur. Tempus mauris fusce sit magnis vel sed elit amet.",
          isCorrect: false,
          isSelected: false,
        },
      ],
    },
    {
      id: "2",
      question: "Lorem ipsum dolor sit amet consectetur. Cursus dolor porttitor nisi in.",
      options: [
        {
          id: "2-1",
          text: "Lorem ipsum dolor sit amet consectetur. Porttitor ridiculus in ullamcorper odio in sodales integer vitae.",
          isCorrect: true,
          isSelected: true,
        },
        {
          id: "2-2",
          text: "Lorem ipsum dolor sit amet consectetur. Tempus mauris fusce sit magnis vel sed elit amet.",
          isCorrect: false,
          isSelected: false,
        },
        {
          id: "2-3",
          text: "Lorem ipsum dolor sit amet consectetur. Tempus mauris fusce sit magnis vel sed elit amet.",
          isCorrect: false,
          isSelected: false,
        },
        {
          id: "2-4",
          text: "Lorem ipsum dolor sit amet consectetur. Tempus mauris fusce sit magnis vel sed elit amet.",
          isCorrect: false,
          isSelected: false,
        },
      ],
    },
    {
      id: "3",
      question: "Lorem ipsum dolor sit amet consectetur. Cursus dolor porttitor nisi in.",
      options: [
        {
          id: "3-1",
          text: "Lorem ipsum dolor sit amet consectetur. Porttitor ridiculus in ullamcorper odio in sodales integer vitae.",
          isCorrect: true,
          isSelected: true,
        },
        {
          id: "3-2",
          text: "Lorem ipsum dolor sit amet consectetur. Tempus mauris fusce sit magnis vel sed elit amet.",
          isCorrect: false,
          isSelected: false,
        },
        {
          id: "3-3",
          text: "Lorem ipsum dolor sit amet consectetur. Tempus mauris fusce sit magnis vel sed elit amet.",
          isCorrect: false,
          isSelected: false,
        },
        {
          id: "3-4",
          text: "Lorem ipsum dolor sit amet consectetur. Tempus mauris fusce sit magnis vel sed elit amet.",
          isCorrect: false,
          isSelected: false,
        },
      ],
    },
  ];

  const handlePracticeScoreChange = (delta: number) => {
    setPracticeScore((prev) => Math.max(0, Math.min(10, prev + delta)));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setAttachedFiles((prev) => [...prev, ...files]);
  };

  const handleRemoveFile = (index: number) => {
    setAttachedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSaveDraft = async () => {
    setIsSaving(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      logger.info("Save draft", {
        theoryScore,
        practiceScore,
        comment,
        attachedFiles,
      });
    } catch (error) {
      logger.error("Error saving draft:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleSubmit = () => {
    logger.info("Submit grading", {
      theoryScore,
      practiceScore,
      comment,
      attachedFiles,
    });

    if (hasMoreAssignments) {
      setShowNextModal(true);
    } else {
      setShowCompleteModal(true);
    }
  };

  const handleNextAssignment = () => {
    if (dontShowAgain) {
      localStorage.setItem("dontShowNextAssignmentModal", "true");
    }
    setShowNextModal(false);
    logger.info("Navigate to next assignment");
  };

  const handleReview = () => {
    setShowNextModal(false);
    setShowCompleteModal(false);
  };

  const handleGoToList = () => {
    setShowCompleteModal(false);
    router.push(`/${locale}/teacher/students`);
  };

  const handleRequestResubmission = () => {
    logger.info("Request resubmission");
    router.push(`/${locale}/teacher/students`);
  };

  return {
    activeTab,
    theoryScore,
    practiceScore,
    comment,
    attachedFiles,
    showNextModal,
    showCompleteModal,
    dontShowAgain,
    isSaving,
    hasMoreAssignments,

    assignment,
    student,
    submittedFiles,
    studentNotes,
    theoryQuestions,
    quizQuestions,

    setActiveTab,
    setTheoryScore,
    setPracticeScore,
    setComment,
    setAttachedFiles,
    setShowNextModal,
    setShowCompleteModal,
    setDontShowAgain,

    handlePracticeScoreChange,
    handleFileUpload,
    handleRemoveFile,
    handleSaveDraft,
    handleSubmit,
    handleNextAssignment,
    handleReview,
    handleGoToList,
    handleRequestResubmission,
  };
}
