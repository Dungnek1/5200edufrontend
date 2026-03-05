"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, FileText } from "lucide-react";
import { useTranslations } from "next-intl";

interface PartnerTeacherPolicyProps {
  onBack?: () => void;
}

export default function PartnerTeacherPolicy({ onBack }: PartnerTeacherPolicyProps) {
  const t = useTranslations("partnerTeacherPolicy");

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-indigo-50 mb-4">
          <FileText className="w-8 h-8 text-indigo-600" />
        </div>
        <h1
          className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight"
          style={{ fontFamily: "Roboto, sans-serif" }}
        >
          {t("title")}
        </h1>
        <p className="mt-2 text-sm font-medium text-gray-700">
          {t("subtitle")}
        </p>
        <p className="mt-1 text-sm text-gray-500">
          {t("lastUpdated")}
        </p>
      </div>

      {/* Content */}
      <div className="space-y-8">
        {/* I. Overview */}
        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            {t("overview.title")}
          </h2>
          <p className="text-gray-600 leading-relaxed">
            {t("overview.body")}
          </p>
        </section>

        <hr className="border-gray-100" />

        {/* II. Deposit Policy */}
        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            {t("part2.title")}
          </h2>
          <div className="space-y-4">
            <div>
              <h3 className="text-base font-medium text-gray-900 mb-2">
                {t("part2.deposit.title")}
              </h3>
              <ul className="space-y-2 pl-1">
                <li className="flex items-start gap-3 text-gray-600 leading-relaxed">
                  <span className="mt-2 w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0" />
                  {t("part2.deposit.amount")}
                </li>
                <li className="flex items-start gap-3 text-gray-600 leading-relaxed">
                  <span className="mt-2 w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0" />
                  {t("part2.deposit.purpose")}
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-base font-medium text-gray-900 mb-2">
                {t("part2.refund.title")}
              </h3>
              <p className="text-gray-600 mb-3">{t("part2.refund.intro")}</p>
              <ul className="space-y-2 pl-1">
                <li className="flex items-start gap-3 text-gray-600 leading-relaxed">
                  <span className="mt-2 w-1.5 h-1.5 rounded-full bg-green-500 shrink-0" />
                  {t("part2.refund.item1")}
                </li>
                <li className="flex items-start gap-3 text-gray-600 leading-relaxed">
                  <span className="mt-2 w-1.5 h-1.5 rounded-full bg-green-500 shrink-0" />
                  {t("part2.refund.item2")}
                </li>
                <li className="flex items-start gap-3 text-gray-600 leading-relaxed">
                  <span className="mt-2 w-1.5 h-1.5 rounded-full bg-green-500 shrink-0" />
                  {t("part2.refund.item3")}
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-base font-medium text-gray-900 mb-2">
                {t("part2.forfeiture.title")}
              </h3>
              <p className="text-gray-600 mb-3">{t("part2.forfeiture.intro")}</p>
              <ul className="space-y-2 pl-1">
                <li className="flex items-start gap-3 text-gray-600 leading-relaxed">
                  <span className="mt-2 w-1.5 h-1.5 rounded-full bg-red-400 shrink-0" />
                  {t("part2.forfeiture.item1")}
                </li>
                <li className="flex items-start gap-3 text-gray-600 leading-relaxed">
                  <span className="mt-2 w-1.5 h-1.5 rounded-full bg-red-400 shrink-0" />
                  {t("part2.forfeiture.item2")}
                </li>
              </ul>
            </div>
          </div>
        </section>

        <hr className="border-gray-100" />

        {/* III. IP Policy */}
        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            {t("part3.title")}
          </h2>
          <div className="space-y-4">
            <div>
              <h3 className="text-base font-medium text-gray-900 mb-2">
                {t("part3.ip5200.title")}
              </h3>
              <ul className="space-y-2 pl-1">
                <li className="flex items-start gap-3 text-gray-600 leading-relaxed">
                  <span className="mt-2 w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0" />
                  {t("part3.ip5200.definition")}
                </li>
                <li className="flex items-start gap-3 text-gray-600 leading-relaxed">
                  <span className="mt-2 w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0" />
                  {t("part3.ip5200.usage")}
                </li>
                <li className="flex items-start gap-3 text-gray-600 leading-relaxed">
                  <span className="mt-2 w-1.5 h-1.5 rounded-full bg-red-400 shrink-0" />
                  {t("part3.ip5200.prohibited")}
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-base font-medium text-gray-900 mb-2">
                {t("part3.ipTeacher.title")}
              </h3>
              <ul className="space-y-2 pl-1">
                <li className="flex items-start gap-3 text-gray-600 leading-relaxed">
                  <span className="mt-2 w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0" />
                  {t("part3.ipTeacher.rights")}
                </li>
                <li className="flex items-start gap-3 text-gray-600 leading-relaxed">
                  <span className="mt-2 w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0" />
                  {t("part3.ipTeacher.responsibility")}
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-base font-medium text-gray-900 mb-2">
                {t("part3.distribution.title")}
              </h3>
              <ul className="space-y-2 pl-1">
                <li className="flex items-start gap-3 text-gray-600 leading-relaxed">
                  <span className="mt-2 w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0" />
                  {t("part3.distribution.grant")}
                </li>
                <li className="flex items-start gap-3 text-gray-600 leading-relaxed">
                  <span className="mt-2 w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0" />
                  {t("part3.distribution.exclusivity")}
                </li>
              </ul>
            </div>
          </div>
        </section>

        <hr className="border-gray-100" />

        {/* IV. Revenue & Quality */}
        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            {t("part4.title")}
          </h2>
          <ul className="space-y-3 pl-1">
            <li className="flex items-start gap-3 text-gray-600 leading-relaxed">
              <span className="mt-2 w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0" />
              {t("part4.item1")}
            </li>
            <li className="flex items-start gap-3 text-gray-600 leading-relaxed">
              <span className="mt-2 w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0" />
              {t("part4.item2")}
            </li>
            <li className="flex items-start gap-3 text-gray-600 leading-relaxed">
              <span className="mt-2 w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0" />
              {t("part4.item3")}
            </li>
          </ul>
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
