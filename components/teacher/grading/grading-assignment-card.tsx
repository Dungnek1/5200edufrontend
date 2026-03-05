import { Badge } from "@/components/ui/badge";
import type { GradingAssignment } from "@/hooks/use-grading-assignment";

interface GradingAssignmentCardProps {
  assignment: GradingAssignment;
}

export function GradingAssignmentCard({ assignment }: GradingAssignmentCardProps) {
  return (
    <div className="bg-white border border-[#f4f4f7] rounded-[8px] p-[8px] mb-[28px] flex gap-[12px] items-start">
      <div className="w-[288px] h-[288px] bg-[#dbdde5] rounded-[6px] shrink-0">
        <img
          src={assignment.thumbnail}
          alt={assignment.title}
          width={288}
          height={288}
          className="object-cover w-full h-full rounded-[6px]"

        />
      </div>
      <div className="flex-1 flex flex-col justify-between">
        <div className="px-[12px] py-0">
          <div className="flex flex-col gap-[4px]">
            <Badge className="bg-[#eceffd] text-[#2e46a4] border-0 px-[12px] py-[2px] rounded-[8px] text-[14px] leading-[20px] w-fit">
              {assignment.module}
            </Badge>
            <h2
              className="text-[20px] font-medium leading-[30px] text-[#0f172a] max-h-[60px] overflow-hidden"
              style={{ fontFamily: "Roboto, sans-serif", fontWeight: 500 }}
            >
              {assignment.title}
            </h2>
          </div>
        </div>
      </div>
    </div>
  );
}
