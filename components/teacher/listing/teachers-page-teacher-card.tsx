import { Teacher } from "@/types/teacher";
import { getAvatarUrl } from "@/utils/media";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";

interface TeachersPageTeacherCardProps {
  teacher: Teacher | undefined;
  locale: string;
  viewProfileLabel: string;
  noTeachersLabel: string;
}

export function TeachersPageTeacherCard({
  teacher,
  locale,
  viewProfileLabel,
  noTeachersLabel,
}: TeachersPageTeacherCardProps) {

  const router = useRouter();
  const tListing = useTranslations("teacher.listing");

  if (!teacher) {
    return (
      <div className="bg-[#f9f9fb] rounded-2xl p-8 text-center">
        <p className="text-[#8c92ac]">{noTeachersLabel}</p>
      </div>
    );
  }


  return (
    <div className="bg-white rounded-xl p-3 flex flex-col gap-[16px]
      cursor-pointer
        "
      onClick={() => {
        console.log("Selected Teacher ID:", teacher.id);
        router.push(`/teachers/${teacher.id}`)
      }}
    >

      <div className="relative w-full aspect-[3/2] overflow-hidden flex-shrink-0 rounded-[8px]">
        <img
          src={getAvatarUrl(teacher.avatar)}
          alt={teacher.name || ""}
          className="w-full h-full object-cover object-top rounded-[8px]"
          sizes="360px"
          style={{ objectPosition: "center top" }}
          onError={(e) => {
            e.currentTarget.src = "/images/default-avatar.png";
          }}
        />
      </div>

      <div className="flex-1 overflow-hidden pt-4 justify-between">

        <div className="flex items-center gap-2 ">
          <a className="text-[16px] font-semibold text-[#3B3D48] truncate cursor-pointer"
            href={`${locale}/teachers/${teacher.id}`}
          >
            {teacher.name}
          </a>
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
        {teacher.headline && (
          <p className="text-[14px] text-[#3B3D48] line-clamp-1">
            {teacher.headline}
          </p>
        )}

      </div>


      <div className="flex flex-col gap-4">
        <p className="text-[#3B3D48] text-lg font-medium">
          {tListing("educationAndCertificates")}
        </p>
        <div className="flex flex-col gap-4">
          {teacher.education?.map((edu: any, index: number) => (
            <div key={index} className="flex flex-col">
              <span className="text-[#3B3D48] text-[16px]">
                {[edu.degree, edu.department].filter(Boolean).join(" – ")}
              </span>
              <span className="text-[#8C92AC] text-[14px]">{edu.school}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <p className="text-[#2E46A4] text-lg font-medium">
          {tListing("trainingCertificates")}
        </p>
        <div className="flex flex-col gap-3">
          {teacher?.certificates?.map((cert: any, index: number) => (
            <span key={index} className="text-[#8C92AC] text-[14px]">
              {cert.name}
            </span>
          ))}
        </div>
      </div>
    </div >
  );
}
