"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Mail, Send } from 'lucide-react';
import { useTranslations } from 'next-intl';

export function ContactFormSection() {
  const t = useTranslations('contact');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <section className="py-16 px-16 bg-white">
      <div className="max-w-[1280px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Left - Illustration */}
        <div className="flex justify-center">
          <div className="w-[356px] h-[404px] relative">
            {/* TODO: Add illustration image */}
            <div className="w-full h-full bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl flex items-center justify-center">
              <Mail className="h-24 w-24 text-[#4162e7] opacity-20" />
            </div>
          </div>
        </div>

        {/* Right - Form */}
        <div className="max-w-[536px]">
          <h2 className="text-[32px] font-bold text-[#3b3d48] mb-8" style={{ fontFamily: 'Be Vietnam Pro, sans-serif', lineHeight: '40px' }}>
            {t('title')}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Input
                type="text"
                placeholder={t('fullNamePlaceholder')}
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="h-16 border-gray-200 rounded-lg"
                required
              />
            </div>

            <div>
              <Input
                type="email"
                placeholder={t('emailPlaceholder')}
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="h-16 border-gray-200 rounded-lg"
                required
              />
            </div>

            <div>
              <Input
                type="tel"
                placeholder={t('phonePlaceholder')}
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="h-16 border-gray-200 rounded-lg"
                required
              />
            </div>

            <Button
              type="submit"
              className="w-full h-11 bg-[#4162e7] hover:bg-[#3556d4] text-white font-medium rounded-lg"
              style={{ fontFamily: 'Roboto, sans-serif' }}
            >
              {t('submit')}
              <Send className="ml-2 h-4 w-4" />
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
}
