"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ShieldCheck } from "lucide-react";
import { useTranslations } from "next-intl";

interface LearnerPolicyProps {
  onBack?: () => void;
}

const bulletClass = "flex items-start gap-3 text-gray-600 leading-relaxed";
const dotClass = "mt-2 w-1.5 h-1.5 rounded-full shrink-0";

export default function LearnerPolicy({ onBack }: LearnerPolicyProps) {
  const t = useTranslations("learnerPolicy");

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-indigo-50 mb-4">
          <ShieldCheck className="w-8 h-8 text-indigo-600" />
        </div>
        <h1
          className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight"
          style={{ fontFamily: "Roboto, sans-serif" }}
        >
          {t("title")}
        </h1>
        <p className="mt-2 text-sm text-gray-500">
          {t("lastUpdated")}
        </p>
      </div>

      {/* Content */}
      <div className="space-y-8">
        {/* Section 1 */}
        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            {t("section1.title")}
          </h2>
          <div className="space-y-3 text-gray-600 leading-relaxed">
            <p>{t("section1.p1")}</p>
            <p>{t("section1.p2")}</p>
            <p>{t("section1.p3")}</p>
          </div>
        </section>

        <hr className="border-gray-100" />

        {/* Section 2 */}
        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            {t("section2.title")}
          </h2>
          <p className="text-gray-600 mb-3">{t("section2.intro")}</p>
          <ul className="space-y-3 pl-1">
            <li className={bulletClass}>
              <span className={`${dotClass} bg-green-500`} />
              {t("section2.item1")}
            </li>
            <li className={bulletClass}>
              <span className={`${dotClass} bg-green-500`} />
              {t("section2.item2")}
            </li>
            <li className={bulletClass}>
              <span className={`${dotClass} bg-green-500`} />
              {t("section2.item3")}
            </li>
            <li className={bulletClass}>
              <span className={`${dotClass} bg-green-500`} />
              {t("section2.item4")}
            </li>
          </ul>
          <p className="mt-4 text-gray-600 leading-relaxed">{t("section2.closing")}</p>
        </section>

        <hr className="border-gray-100" />

        {/* Section 3 */}
        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            {t("section3.title")}
          </h2>
          <p className="text-gray-700 font-medium mb-2">{t("section3.responsibilityLabel")}</p>
          <ul className="space-y-2 pl-1 mb-4">
            <li className={bulletClass}>
              <span className={`${dotClass} bg-indigo-500`} />
              {t("section3.resp1")}
            </li>
            <li className={bulletClass}>
              <span className={`${dotClass} bg-indigo-500`} />
              {t("section3.resp2")}
            </li>
            <li className={bulletClass}>
              <span className={`${dotClass} bg-indigo-500`} />
              {t("section3.resp3")}
            </li>
            <li className={bulletClass}>
              <span className={`${dotClass} bg-indigo-500`} />
              {t("section3.resp4")}
            </li>
          </ul>
          <p className="text-gray-700 font-medium mb-2">{t("section3.prohibitedLabel")}</p>
          <ul className="space-y-2 pl-1">
            <li className={bulletClass}>
              <span className={`${dotClass} bg-red-400`} />
              {t("section3.prob1")}
            </li>
            <li className={bulletClass}>
              <span className={`${dotClass} bg-red-400`} />
              {t("section3.prob2")}
            </li>
            <li className={bulletClass}>
              <span className={`${dotClass} bg-red-400`} />
              {t("section3.prob3")}
            </li>
          </ul>
        </section>

        <hr className="border-gray-100" />

        {/* Section 4 */}
        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            {t("section4.title")}
          </h2>
          <p className="text-gray-600 mb-3">{t("section4.intro")}</p>
          <ul className="space-y-2 pl-1 mb-4">
            <li className={bulletClass}>
              <span className={`${dotClass} bg-indigo-500`} />
              {t("section4.bullet1")}
            </li>
            <li className={bulletClass}>
              <span className={`${dotClass} bg-indigo-500`} />
              {t("section4.bullet2")}
            </li>
          </ul>
          <p className="text-gray-700 font-medium mb-2">{t("section4.responsibilityLabel")}</p>
          <ul className="space-y-2 pl-1 mb-4">
            <li className={bulletClass}>
              <span className={`${dotClass} bg-indigo-500`} />
              {t("section4.resp1")}
            </li>
            <li className={bulletClass}>
              <span className={`${dotClass} bg-indigo-500`} />
              {t("section4.resp2")}
            </li>
          </ul>
          <p className="text-gray-600 leading-relaxed">{t("section4.closing")}</p>
        </section>

        <hr className="border-gray-100" />

        {/* Section 5 */}
        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            {t("section5.title")}
          </h2>
          <p className="text-gray-600 mb-3">{t("section5.intro")}</p>
          <ul className="space-y-2 pl-1 mb-4">
            <li className={bulletClass}>
              <span className={`${dotClass} bg-indigo-500`} />
              {t("section5.item1")}
            </li>
            <li className={bulletClass}>
              <span className={`${dotClass} bg-indigo-500`} />
              {t("section5.item2")}
            </li>
            <li className={bulletClass}>
              <span className={`${dotClass} bg-indigo-500`} />
              {t("section5.item3")}
            </li>
          </ul>
          <p className="text-gray-700 font-medium mb-2">{t("section5.processLabel")}</p>
          <ul className="space-y-2 pl-1 mb-4">
            <li className={bulletClass}>
              <span className={`${dotClass} bg-indigo-500`} />
              {t("section5.process1")}
            </li>
            <li className={bulletClass}>
              <span className={`${dotClass} bg-indigo-500`} />
              {t("section5.process2")}
            </li>
            <li className={bulletClass}>
              <span className={`${dotClass} bg-indigo-500`} />
              {t("section5.process3")}
            </li>
          </ul>
          <p className="text-gray-600 mb-4">{t("section5.timeNote")}</p>
          <p className="text-gray-700 font-medium mb-2">{t("section5.resultLabel")}</p>
          <ul className="space-y-2 pl-1">
            <li className={bulletClass}>
              <span className={`${dotClass} bg-indigo-500`} />
              {t("section5.result1")}
            </li>
            <li className={bulletClass}>
              <span className={`${dotClass} bg-indigo-500`} />
              {t("section5.result2")}
            </li>
            <li className={bulletClass}>
              <span className={`${dotClass} bg-indigo-500`} />
              {t("section5.result3")}
            </li>
          </ul>
        </section>

        <hr className="border-gray-100" />

        {/* Section 6 */}
        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            {t("section6.title")}
          </h2>
          <p className="text-gray-600 mb-3">{t("section6.intro")}</p>
          <ul className="space-y-2 pl-1 mb-4">
            <li className={bulletClass}>
              <span className={`${dotClass} bg-indigo-500`} />
              {t("section6.item1")}
            </li>
            <li className={bulletClass}>
              <span className={`${dotClass} bg-indigo-500`} />
              {t("section6.item2")}
            </li>
            <li className={bulletClass}>
              <span className={`${dotClass} bg-indigo-500`} />
              {t("section6.item3")}
            </li>
          </ul>
          <p className="text-gray-600 leading-relaxed">{t("section6.closing")}</p>
        </section>

        <hr className="border-gray-100" />

        {/* Section 7 */}
        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            {t("section7.title")}
          </h2>
          <p className="text-gray-600 mb-3">{t("section7.intro")}</p>
          <ul className="space-y-2 pl-1 mb-4">
            <li className={bulletClass}>
              <span className={`${dotClass} bg-indigo-500`} />
              {t("section7.item1")}
            </li>
            <li className={bulletClass}>
              <span className={`${dotClass} bg-indigo-500`} />
              {t("section7.item2")}
            </li>
            <li className={bulletClass}>
              <span className={`${dotClass} bg-indigo-500`} />
              {t("section7.item3")}
            </li>
          </ul>
          <p className="text-gray-700 font-medium mb-2">{t("section7.consequenceLabel")}</p>
          <ul className="space-y-2 pl-1">
            <li className={bulletClass}>
              <span className={`${dotClass} bg-red-400`} />
              {t("section7.cons1")}
            </li>
            <li className={bulletClass}>
              <span className={`${dotClass} bg-red-400`} />
              {t("section7.cons2")}
            </li>
          </ul>
        </section>

        <hr className="border-gray-100" />

        {/* Section 8 */}
        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            {t("section8.title")}
          </h2>
          <p className="text-gray-600 leading-relaxed">
            {t("section8.body")}
          </p>
        </section>
      </div>

      {/* Footer */}
      {onBack && (
        <div className="mt-10 pb-4">
          <Button
            onClick={onBack}
            className="gap-2 px-6 h-11 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-sm transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            {t("backButton")}
          </Button>
        </div>
      )}
    </div>
  );
}
