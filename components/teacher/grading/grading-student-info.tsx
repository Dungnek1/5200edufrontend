import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import type { GradingStudent } from "@/hooks/use-grading-assignment";

interface GradingStudentInfoProps {
  student: GradingStudent;
  onNextAssignment: () => void;
}

export function GradingStudentInfo({ student, onNextAssignment }: GradingStudentInfoProps) {
  return (
    <div className="bg-white border border-[#f4f4f7] rounded-[8px] p-[12px] flex gap-[12px] items-center shadow-sm">
      <div className="border-2 border-[#a8b7f4] rounded-full p-[4px] shrink-0">
        <div className="w-[60px] h-[60px] rounded-full overflow-hidden bg-[#a95353]">
          <img
            src={student.avatar}
            alt={student.name}
            width={60}
            height={60}
            className="object-cover w-full h-full"

          />
        </div>
      </div>
      <div className="flex-1 flex flex-col gap-[4px] px-[4px] py-[4px]">
        <h3
          className="text-[20px] font-medium leading-[30px] text-[#3b3d48]"
          style={{ fontFamily: "Roboto, sans-serif", fontWeight: 500 }}
        >
          {student.name}
        </h3>
        <div className="flex gap-[4px] items-center">
          <span
            className="text-[14px] leading-[20px] text-[#63687a]"
            style={{ fontFamily: "Roboto, sans-serif", fontWeight: 400 }}
          >
            {student.email}
          </span>
          <span className="text-[10px] leading-[14px] text-[#7f859d]">•</span>
          <span
            className="text-[14px] leading-[20px] text-[#63687a]"
            style={{ fontFamily: "Roboto, sans-serif", fontWeight: 400 }}
          >
            {student.phone}
          </span>
        </div>
      </div>
      <Button
        onClick={onNextAssignment}
        className="bg-[#4162e7] hover:bg-[#4162e7]/90 h-[32px] px-[16px] py-[8px] rounded-[6px]"
      >
        <div className="flex gap-[4px] items-center">
          <span
            className="text-[14px] font-medium leading-[20px] text-white"
            style={{ fontFamily: "Roboto, sans-serif", fontWeight: 500 }}
          >
            Chấm bài tiếp theo
          </span>
          <ArrowRight className="h-4 w-4 text-white" />
        </div>
      </Button>
    </div>
  );
}
