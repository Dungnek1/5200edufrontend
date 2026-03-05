"use client";

import { CheckCircle, Star } from 'lucide-react';
import { useTranslations } from 'next-intl';

interface CourseDetailDescriptionProps {
  description: string;
  title: string;
  learningPoints: string[];
  requirements?: string[];
}

export function CourseDetailDescription({
  description,
  title,
  learningPoints,
  requirements = [],
}: CourseDetailDescriptionProps) {
  const t = useTranslations('CourseDetail');
  const midPoint = Math.ceil(learningPoints.length / 2);
  const leftColumn = learningPoints.slice(0, midPoint);
  const rightColumn = learningPoints.slice(midPoint);

  return (
    <section className=" pt-0 sm:pt-0 lg:pt-0 pb-4 sm:pb-5 lg:pb-8">
      <div className="flex flex-col gap-3 sm:gap-3 lg:gap-[10px]">

        <h2
          className="text-xl sm:text-2xl lg:text-2xl font-medium text-[#3b3d48] leading-tight sm:leading-8 lg:leading-8"
          style={{ fontFamily: 'Roboto, sans-serif' }}
        >
          {t('description')}
        </h2>

        <p
          className="text-base sm:text-lg lg:text-lg font-normal text-[#3b3d48] leading-6 sm:leading-7 lg:leading-7 whitespace-pre-wrap"
          style={{ fontFamily: 'Roboto, sans-serif' }}
        >
          {description}
        </p>


        <div className="border border-[#8c92ac] border-solid flex flex-col gap-3 sm:gap-4 lg:gap-[10px] p-[12px]">
          <p
            className="text-lg sm:text-xl lg:text-lg font-medium text-[#3b3d48] leading-6 sm:leading-7 lg:leading-7 whitespace-pre-wrap"
            style={{ fontFamily: 'Roboto, sans-serif' }}
          >
            {t('learningPoints')}
          </p>


          <div className="flex flex-col lg:flex-row gap-3 lg:gap-5 w-full">

            <div className="flex-1 flex flex-col gap-3">
              {leftColumn.map((point, index) => (
                <div key={index} className="flex gap-2 items-start">
                  <div className="w-5 h-[23px] lg:h-[23px] flex items-center justify-center flex-shrink-0">
                    <svg width="20" height="23" viewBox="0 0 20 23" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="9.99984" cy="12.9993" r="8.33333" stroke="#0A0BD9" />
                      <path d="M7.0835 13.416L8.75016 15.0827L12.9168 10.916" stroke="#0A0BD9" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>

                  </div>
                  <p
                    className="flex-1 text-sm sm:text-base lg:text-lg font-normal text-[#3b3d48] leading-5 sm:leading-6 lg:leading-7 whitespace-pre-wrap"
                    style={{ fontFamily: 'Roboto, sans-serif' }}
                  >
                    {point}
                  </p>
                </div>
              ))}
            </div>


            {rightColumn.length > 0 && (
              <div className="flex-1 flex flex-col gap-3">
                {rightColumn.map((point, index) => (
                  <div key={index} className="flex gap-2 items-start">
                    <div className="w-5 h-[23px] lg:h-[23px] flex items-center justify-center flex-shrink-0">
                      <svg width="20" height="23" viewBox="0 0 20 23" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="9.99984" cy="12.9993" r="8.33333" stroke="#0A0BD9" />
                        <path d="M7.0835 13.416L8.75016 15.0827L12.9168 10.916" stroke="#0A0BD9" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>

                    </div>
                    <p
                      className="flex-1 text-sm sm:text-base lg:text-lg font-normal text-[#3b3d48] leading-5 sm:leading-6 lg:leading-7 whitespace-pre-wrap"
                      style={{ fontFamily: 'Roboto, sans-serif' }}
                    >
                      {point}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>


        {requirements.length > 0 && (
          <div className="flex flex-col gap-3 sm:gap-4">
            <h3
              className="text-lg sm:text-xl font-medium text-[#3b3d48] leading-6 sm:leading-7"
              style={{ fontFamily: 'Roboto, sans-serif' }}
            >
              Yêu cầu
            </h3>

            <div className="flex flex-col gap-3">
              {requirements.map((requirement, index) => (
                <div key={index} className="flex gap-2 items-start">
                  <div className="w-5 h-5 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Star className="w-4 h-4 sm:w-5 sm:h-5 text-[#4162e7] fill-[#4162e7]" />
                  </div>
                  <p
                    className="flex-1 text-sm sm:text-base font-normal text-[#3b3d48] leading-5 sm:leading-6"
                    style={{ fontFamily: 'Roboto, sans-serif' }}
                  >
                    {requirement}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
