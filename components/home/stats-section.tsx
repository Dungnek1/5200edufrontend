"use client";

import { Card, CardContent } from '@/components/ui/card';
import { Users, BookOpen, Award, TrendingUp } from 'lucide-react';

import { useTranslations } from 'next-intl';

export function StatsSection() {
  const t = useTranslations();

  const stats = [
    {
      icon: <Users className="h-8 w-8 text-blue-600" />,
      value: "15,000+",
      label: t("home.stats.label1"),
      description: t("home.stats.desc1")
    },
    {
      icon: <BookOpen className="h-8 w-8 text-green-600" />,
      value: "50+",
      label: t("home.stats.label2"),
      description: t("home.stats.desc2")
    },
    {
      icon: <Award className="h-8 w-8 text-purple-600" />,
      value: "95%",
      label: t("home.stats.label3"),
      description: t("home.stats.desc3")
    },
    {
      icon: <TrendingUp className="h-8 w-8 text-orange-600" />,
      value: "87%",
      label: t("home.stats.label4"),
      description: t("home.stats.desc4")
    }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100">
                {/* Icon */}
                <div className="flex justify-center mb-4">
                  <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center">
                    {stat.icon}
                  </div>
                </div>

                {/* Value */}
                <div 
                  className="text-4xl font-bold text-gray-900 mb-2"
                  style={{ fontFamily: 'Roboto, sans-serif' }}
                >
                  {stat.value}
                </div>

                {/* Label */}
                <div 
                  className="text-lg font-semibold text-gray-700 mb-1"
                  style={{ fontFamily: 'Roboto, sans-serif', fontSize: '16px', fontWeight: 500, lineHeight: '24px' }}
                >
                  {stat.label}
                </div>

                {/* Description */}
                <div 
                  className="text-sm text-gray-500"
                  style={{ fontFamily: 'Roboto, sans-serif' }}
                >
                  {stat.description}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}