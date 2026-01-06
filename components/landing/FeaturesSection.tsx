'use client';

import { useTranslation } from '@/lib/i18n';
import { GraduationCap, TrendingUp, Target } from 'lucide-react';

export default function FeaturesSection() {
  const { t } = useTranslation();

  const features = [
    {
      icon: GraduationCap,
      title: t('feature1Title'),
      description: t('feature1Desc'),
    },
    {
      icon: TrendingUp,
      title: t('feature2Title'),
      description: t('feature2Desc'),
    },
    {
      icon: Target,
      title: t('feature3Title'),
      description: t('feature3Desc'),
    },
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-orange-50 via-white to-orange-50">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            ทำไมต้องเลือก{' '}
            <span className="text-orange-600 underline decoration-orange-500 decoration-2">
              ResiLearn
            </span>
          </h2>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow border border-gray-100"
              >
                <div className="w-16 h-16 bg-orange-100 rounded-xl flex items-center justify-center mb-6">
                  <Icon className="w-8 h-8 text-orange-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

