"use client";

type LessonOption = {
  id: string;
  text: string;
  isCorrect: boolean;
  isUserAnswer: boolean;
};

export type LessonQuestion = {
  id: number;
  label: string;
  title: string;
  options: LessonOption[];
};

type LessonAssignmentsProps = {
  questions: LessonQuestion[];
};

export function LessonAssignments({ questions }: LessonAssignmentsProps) {
  return (
    <div className="flex flex-col gap-5">
      {questions.map((q) => (
        <div
          key={q.id}
          className="rounded-xl border border-[#f4f4f7] bg-white p-5"
        >
          <div className="mb-5 space-y-2">
            <span className="inline-flex rounded bg-[#4162e7] px-2 py-0.5 text-sm font-medium text-white">
              {q.label}
            </span>
            <h3
              className="text-base font-medium leading-6 text-[#3b3d48]"
              style={{ fontFamily: "Roboto, sans-serif" }}
            >
              {q.title}
            </h3>
          </div>

          <div className="space-y-3 pl-4">
            {q.options.map((opt) => {
              const isCorrect = opt.isCorrect;
              const isWrongChoice = opt.isUserAnswer && !opt.isCorrect;

              const radioBase =
                "flex h-4 w-4 items-center justify-center rounded-full border";
              const radioClass = isCorrect
                ? `${radioBase} border-transparent bg-[#16a34a]`
                : isWrongChoice
                ? `${radioBase} border-transparent bg-[#dc2626]`
                : `${radioBase} border-[#dbdde5] bg-white`;

              const boxBase = "rounded border px-3 py-2 text-sm leading-5";
              const boxClass = isCorrect
                ? `${boxBase} border-[#b7e2c7] bg-[#e8f6ed]`
                : isWrongChoice
                ? `${boxBase} border-[#f4bcbc] bg-[#fce9e9]`
                : `${boxBase} border-[#dbdde5] bg-white`;

              return (
                <div key={opt.id} className="flex items-start gap-3">
                  <div className="mt-2">
                    <span className={radioClass}>
                      {(isCorrect || isWrongChoice) && (
                        <span className="h-2 w-2 rounded-full bg-white" />
                      )}
                    </span>
                  </div>
                  <div className="flex-1">
                    <div
                      className={boxClass}
                      style={{ fontFamily: "Roboto, sans-serif" }}
                    >
                      {opt.text}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}

      <button
        type="button"
        className="flex h-11 items-center justify-center gap-2 rounded-md bg-[#4162e7] px-4 text-sm font-medium text-[#fafafa] shadow-sm"
      >
        <span className="inline-block h-5 w-5 rounded bg-white/0" />
        Nộp bài
      </button>
    </div>
  );
}


