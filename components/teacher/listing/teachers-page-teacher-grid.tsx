import { CheckCircle2 } from "lucide-react";

import { Teacher } from "@/types/teacher";
import { getAvatarUrl } from "@/utils/media";

interface TeachersPageTeacherGridProps {
  teachers: Teacher[];
  selectedTeacherId: string | null;
  onTeacherSelect: (teacherId: string) => void;
  onModalOpen: (teacher: Teacher) => void;
}

export function TeachersPageTeacherGrid({
  teachers,
  selectedTeacherId,
  onTeacherSelect,
  onModalOpen,
}: TeachersPageTeacherGridProps) {
  return (
    <>

      <div className="md:hidden grid grid-cols-1 gap-3">
        {teachers.map((teacher) => (
          <button
            key={teacher.id}
            type="button"
            onClick={() => onModalOpen(teacher)}
            className="
              flex flex-col gap-3 p-3 w-full
              rounded-xl bg-white border-2 border-[#f4f4f7]
              shadow-[0px_0px_10px_0px_rgba(0,0,0,0.05)]
              transition-all hover:border-[#4162e7]
              overflow-hidden
            "
          >

            <div className="relative w-full aspect-[3/2] rounded-[8px] overflow-hidden bg-gray-100 flex-shrink-0">
              <img
                src={getAvatarUrl(teacher.avatar)}
                alt={teacher.name || ""}
                className="block w-full h-full object-cover object-top"
              />
            </div>


            <div className="flex flex-col min-w-0 pt-4">
              <div>
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium text-[#3b3d48] truncate text-left">
                    {teacher.name}
                  </p>
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <mask id="path-1-inside-1_3051_119849" fill="white">
                      <path d="M0 10C0 4.47715 4.47715 0 10 0C15.5228 0 20 4.47715 20 10C20 15.5228 15.5228 20 10 20C4.47715 20 0 15.5228 0 10Z" />
                    </mask>
                    <path d="M0 10C0 4.47715 4.47715 0 10 0C15.5228 0 20 4.47715 20 10C20 15.5228 15.5228 20 10 20C4.47715 20 0 15.5228 0 10Z" fill="url(#paint0_linear_3051_119849)" />
                    <path d="M0 10M20 10M20 10M0 10M10 0M20 10M10 20M0 10M10 20V18C5.58172 18 2 14.4183 2 10H0H-2C-2 16.6274 3.37258 22 10 22V20ZM20 10H18C18 14.4183 14.4183 18 10 18V20V22C16.6274 22 22 16.6274 22 10H20ZM10 0V2C14.4183 2 18 5.58172 18 10H20H22C22 3.37258 16.6274 -2 10 -2V0ZM10 0V-2C3.37258 -2 -2 3.37258 -2 10H0H2C2 5.58172 5.58172 2 10 2V0Z" fill="white" mask="url(#path-1-inside-1_3051_119849)" />
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M14.0215 7.17579C14.134 7.28831 14.1972 7.4409 14.1972 7.59999C14.1972 7.75909 14.134 7.91168 14.0215 8.02419L9.22151 12.8242C9.109 12.9367 8.95641 12.9999 8.79731 12.9999C8.63822 12.9999 8.48563 12.9367 8.37311 12.8242L5.97311 10.4242C5.86382 10.311 5.80334 10.1595 5.80471 10.0022C5.80608 9.84484 5.86918 9.69435 5.98042 9.5831C6.09167 9.47186 6.24216 9.40876 6.39947 9.40739C6.55679 9.40602 6.70835 9.4665 6.82151 9.57579L8.79731 11.5516L13.1731 7.17579C13.2856 7.06331 13.4382 7.00012 13.5973 7.00012C13.7564 7.00012 13.909 7.06331 14.0215 7.17579Z" fill="white" />
                    <defs>
                      <linearGradient id="paint0_linear_3051_119849" x1="0" y1="0" x2="20" y2="20" gradientUnits="userSpaceOnUse">
                        <stop stop-color="#4162E7" />
                        <stop offset="1" stop-color="#AD46FF" />
                      </linearGradient>
                    </defs>
                  </svg>

                </div>

                <p className="mt-1 text-xs text-[#8c92ac] leading-4 line-clamp-3 text-left">
                  {teacher.title || teacher.bio || ""}
                </p>
              </div>
            </div>
          </button>
        ))}
      </div>


      <div className="hidden md:grid grid-cols-3 gap-5 w-full mx-auto">
        {teachers.map((teacher) => {
          const isSelected = selectedTeacherId === teacher.id;

          return (
            <div
              key={teacher.id}
              onClick={() => { teacher.id && onTeacherSelect(teacher.id) }}
              className={`
                group cursor-pointer
                w-full
                bg-white rounded-xl overflow-hidden
                border transition-all duration-300
                flex flex-col p-3
                ${isSelected
                  ? "border-[#4162e7] ring-1 ring-[#4162e7] shadow-md"
                  : "border-[#f4f4f7] hover:border-[#4162e7] hover:shadow-md"}
              `}
            >

              <div className="relative w-full aspect-[3/2] bg-gray-100 overflow-hidden rounded-[8px]">
                <img
                  src={getAvatarUrl(teacher.avatar)}
                  alt={teacher.name || ""}
                  className="block w-full h-full object-cover object-top"
                />
              </div>


              <div className="flex-1 pt-4 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-[#3b3d48] truncate text-base text-left">
                      {teacher.name}
                    </p>
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <mask id="path-1-inside-1_1899_79557" fill="white">
                        <path d="M0 10C0 4.47715 4.47715 0 10 0C15.5228 0 20 4.47715 20 10C20 15.5228 15.5228 20 10 20C4.47715 20 0 15.5228 0 10Z" />
                      </mask>
                      <path d="M0 10C0 4.47715 4.47715 0 10 0C15.5228 0 20 4.47715 20 10C20 15.5228 15.5228 20 10 20C4.47715 20 0 15.5228 0 10Z" fill="url(#paint0_linear_1899_79557)" />
                      <path d="M10 20V18C5.58172 18 2 14.4183 2 10H0H-2C-2 16.6274 3.37258 22 10 22V20ZM20 10H18C18 14.4183 14.4183 18 10 18V20V22C16.6274 22 22 16.6274 22 10H20ZM10 0V2C14.4183 2 18 5.58172 18 10H20H22C22 3.37258 16.6274 -2 10 -2V0ZM10 0V-2C3.37258 -2 -2 3.37258 -2 10H0H2C2 5.58172 5.58172 2 10 2V0Z" fill="white" mask="url(#path-1-inside-1_1899_79557)" />
                      <path fillRule="evenodd" clipRule="evenodd" d="M14.024 7.17567C14.1364 7.28819 14.1996 7.44077 14.1996 7.59987C14.1996 7.75897 14.1364 7.91156 14.024 8.02407L9.22396 12.8241C9.11144 12.9366 8.95885 12.9997 8.79976 12.9997C8.64066 12.9997 8.48807 12.9366 8.37556 12.8241L5.97556 10.4241C5.86626 10.3109 5.80578 10.1593 5.80715 10.002C5.80852 9.84471 5.87162 9.69423 5.98286 9.58298C6.09411 9.47174 6.2446 9.40863 6.40192 9.40727C6.55923 9.4059 6.71079 9.46638 6.82396 9.57567L8.79976 11.5515L13.1756 7.17567C13.2881 7.06319 13.4407 7 13.5998 7C13.7589 7 13.9114 7.06319 14.024 7.17567Z" fill="white" />
                      <defs>
                        <linearGradient id="paint0_linear_1899_79557" x1="0" y1="0" x2="20" y2="20" gradientUnits="userSpaceOnUse">
                          <stop stopColor="#4162E7" />
                          <stop offset="1" stopColor="#AD46FF" />
                        </linearGradient>
                      </defs>
                    </svg>

                  </div>

                  <p className="mt-1 text-sm text-[#8c92ac] line-clamp-2 text-left">
                    {teacher.headline ? teacher.headline : teacher.roleTitle}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
