import type { QuizQuestion } from "@/hooks/use-grading-assignment";

interface GradingSubmissionViewProps {
  activeTab: "practice" | "theory";
  setActiveTab: (tab: "practice" | "theory") => void;
  theoryQuestions: string[];
  quizQuestions: QuizQuestion[];
}

export function GradingSubmissionView({
  activeTab,
  setActiveTab,
  theoryQuestions,
  quizQuestions,
}: GradingSubmissionViewProps) {
  return (
    <>
      <h3
        className="text-[24px] font-medium leading-[32px] text-[#0f172a]"
        style={{ fontFamily: "Roboto, sans-serif", fontWeight: 500 }}
      >
        Bài nộp
      </h3>

      {/* Tabs */}
      <div className="border-b-2 border-[#dbdde5]">
        <div className="flex">
          <button
            onClick={() => setActiveTab("practice")}
            className={`min-w-[100px] px-[8px] py-[10px] border-b-2 transition-colors ${
              activeTab === "practice"
                ? "border-[#4162e7] text-[#1b2961]"
                : "border-transparent text-[#3b3d48]"
            }`}
            style={{ fontFamily: "Roboto, sans-serif", fontWeight: 400 }}
          >
            <span className="text-[14px] leading-[20px]">Thực hành</span>
          </button>
          <button
            onClick={() => setActiveTab("theory")}
            className={`min-w-[100px] px-[8px] py-[10px] border-b-2 transition-colors ${
              activeTab === "theory"
                ? "border-[#4162e7] text-[#1b2961]"
                : "border-transparent text-[#3b3d48]"
            }`}
            style={{ fontFamily: "Roboto, sans-serif", fontWeight: 400 }}
          >
            <span className="text-[14px] leading-[20px]">Lý thuyết</span>
          </button>
        </div>
      </div>

      {/* Content based on active tab */}
      {activeTab === "theory" ? (
        theoryQuestions.length > 0 ? (
          <div className="bg-white rounded-[12px] shadow-[0px_0px_10px_0px_rgba(0,0,0,0.05)] flex flex-col gap-[16px] p-[16px]">
            {theoryQuestions.map((question, index) => (
              <div key={index} className="flex flex-col gap-[8px]">
                <p
                  className="text-[16px] font-medium leading-[24px] text-[#3b3d48]"
                  style={{ fontFamily: "Roboto, sans-serif", fontWeight: 500 }}
                >
                  Câu {index + 1}: {question}
                </p>
                <div className="bg-white p-[12px] rounded-[8px]">
                  <p
                    className="text-[14px] leading-[22px] text-[#3b3d48] whitespace-pre-wrap"
                    style={{ fontFamily: "Roboto, sans-serif", fontWeight: 400 }}
                  >
                    {/* Student's answer would go here */}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-[12px] shadow-[0px_0px_10px_0px_rgba(0,0,0,0.05)] flex items-center justify-center p-[40px] min-h-[200px]">
            <p
              className="text-[14px] leading-[20px] text-[#7f859d]"
              style={{ fontFamily: "Roboto, sans-serif", fontWeight: 400 }}
            >
              Không có câu hỏi lý thuyết
            </p>
          </div>
        )
      ) : (
        <QuizQuestionsView questions={quizQuestions} />
      )}
    </>
  );
}

function QuizQuestionsView({ questions }: { questions: QuizQuestion[] }) {
  return (
    <div className="flex flex-col gap-[8px]">
      {questions.map((question) => (
        <div
          key={question.id}
          className="bg-white border-[0.5px] border-[#f4f4f7] rounded-[12px] p-[16px] flex flex-col gap-[16px] shadow-sm"
        >
          <div className="flex items-center">
            <div className="flex flex-[1_0_0] flex-col gap-[8px]">
              <span className="bg-[#4162e7] text-white border-0 px-[8px] py-[2px] rounded-[4px] text-[14px] leading-[20px] w-fit">
                Câu {question.id}
              </span>
              <p
                className="text-[16px] font-medium leading-[24px] text-[#3b3d48]"
                style={{ fontFamily: "Roboto, sans-serif", fontWeight: 500 }}
              >
                {question.question}
              </p>
            </div>
          </div>
          <div className="flex flex-col gap-[8px] pl-[16px]">
            {question.options.map((option) => {
              const isCorrect = option.isCorrect;
              const isSelected = option.isSelected;
              const isWrong = isSelected && !isCorrect;

              return (
                <div key={option.id} className="flex gap-[12px] items-center">
                  <div className="flex items-center justify-center shrink-0">
                    <div
                      className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                        isCorrect && isSelected
                          ? "bg-[#16a34a] border-[#16a34a]"
                          : isWrong
                            ? "bg-[#dc2626] border-[#dc2626]"
                            : "bg-white border-[#dbdde5]"
                      }`}
                    >
                      {(isCorrect && isSelected) || isWrong ? (
                        <div className="w-2 h-2 rounded-full bg-white" />
                      ) : null}
                    </div>
                  </div>
                  <div className="flex flex-[1_0_0]">
                    <div
                      className={`flex flex-col items-start overflow-clip px-[12.5px] py-[11px] rounded-[4px] w-full ${
                        isCorrect && isSelected
                          ? "bg-[#e8f6ed] border-[0.5px] border-[#b7e2c7]"
                          : isWrong
                            ? "bg-[#fce9e9] border-[0.5px] border-[#f4bcbc]"
                            : "bg-white"
                      }`}
                    >
                      <p
                        className="text-[14px] leading-[20px] text-[#3b3d48] whitespace-pre-wrap"
                        style={{ fontFamily: "Roboto, sans-serif", fontWeight: 400 }}
                      >
                        {option.text}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
