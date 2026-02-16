import React from 'react';
import { useTranslation } from '../hooks/useTranslation';

const diseaseIcons = [
  // Urticaria - طفح جلدي
  { bg: 'from-rose-400 to-rose-600', icon: (
    <svg viewBox="0 0 24 24" fill="none" className="w-8 h-8" stroke="currentColor" strokeWidth="1.5">
      <path d="M12 3C7 3 3 7 3 12s4 9 9 9 9-4 9-9-4-9-9-9z" strokeLinecap="round"/>
      <path d="M8 10c0-1 .5-2 1.5-2.5M12 8v1M16 10c0-1-.5-2-1.5-2.5M9 14c.5 1 1.5 1.5 3 1.5s2.5-.5 3-1.5" strokeLinecap="round"/>
      <circle cx="8" cy="7" r="1" fill="currentColor"/>
      <circle cx="16" cy="7" r="1" fill="currentColor"/>
      <circle cx="12" cy="18" r="1" fill="currentColor"/>
    </svg>
  )},
  // Tinea - فطريات
  { bg: 'from-green-400 to-green-600', icon: (
    <svg viewBox="0 0 24 24" fill="none" className="w-8 h-8" stroke="currentColor" strokeWidth="1.5">
      <circle cx="12" cy="12" r="4"/>
      <circle cx="12" cy="12" r="8" strokeDasharray="3 2"/>
      <path d="M12 4V2M12 22v-2M4 12H2M22 12h-2" strokeLinecap="round"/>
      <path d="M7 7l-1-1M18 18l-1-1M17 7l1-1M6 18l1-1" strokeLinecap="round"/>
    </svg>
  )},
  // Lichen Planus
  { bg: 'from-purple-400 to-purple-600', icon: (
    <svg viewBox="0 0 24 24" fill="none" className="w-8 h-8" stroke="currentColor" strokeWidth="1.5">
      <rect x="3" y="8" width="18" height="10" rx="2"/>
      <path d="M7 8V6a2 2 0 014 0v2M13 8V6a2 2 0 014 0v2" strokeLinecap="round"/>
      <path d="M7 13h2M11 13h2M15 13h2" strokeLinecap="round"/>
      <path d="M7 16h4M13 16h4" strokeLinecap="round"/>
    </svg>
  )},
  // Psoriasis
  { bg: 'from-orange-400 to-orange-600', icon: (
    <svg viewBox="0 0 24 24" fill="none" className="w-8 h-8" stroke="currentColor" strokeWidth="1.5">
      <path d="M12 2C8 2 5 5 5 9c0 5 7 13 7 13s7-8 7-13c0-4-3-7-7-7z"/>
      <path d="M9 9h2v2H9zM13 9h2v2h-2zM9 13h2v2H9zM13 13h2v2h-2z" fill="currentColor" stroke="none"/>
    </svg>
  )},
  // Mycosis Fungoides
  { bg: 'from-teal-400 to-teal-600', icon: (
    <svg viewBox="0 0 24 24" fill="none" className="w-8 h-8" stroke="currentColor" strokeWidth="1.5">
      <path d="M12 21C7 21 3 17 3 12S7 3 12 3s9 4 9 9-4 9-9 9z"/>
      <path d="M12 8c-2 0-4 1.5-4 4 0 1 .5 2 1 2.5" strokeLinecap="round"/>
      <path d="M12 8c2 0 4 1.5 4 4 0 1-.5 2-1 2.5" strokeLinecap="round"/>
      <circle cx="12" cy="14" r="2" fill="currentColor" stroke="none"/>
      <path d="M12 16v2" strokeLinecap="round"/>
    </svg>
  )},
  // Pityriasis Rosea
  { bg: 'from-pink-400 to-pink-600', icon: (
    <svg viewBox="0 0 24 24" fill="none" className="w-8 h-8" stroke="currentColor" strokeWidth="1.5">
      <ellipse cx="12" cy="12" rx="9" ry="5"/>
      <ellipse cx="12" cy="12" rx="5" ry="9"/>
      <circle cx="12" cy="12" r="2" fill="currentColor" stroke="none"/>
    </svg>
  )},
  // Drug Eruption
  { bg: 'from-red-400 to-red-600', icon: (
    <svg viewBox="0 0 24 24" fill="none" className="w-8 h-8" stroke="currentColor" strokeWidth="1.5">
      <path d="M9 3h6l1 4H8L9 3z"/>
      <rect x="6" y="7" width="12" height="14" rx="2"/>
      <path d="M12 11v6M9 14h6" strokeLinecap="round"/>
    </svg>
  )},
  // Bullous Pemphigoid
  { bg: 'from-yellow-400 to-yellow-600', icon: (
    <svg viewBox="0 0 24 24" fill="none" className="w-8 h-8" stroke="currentColor" strokeWidth="1.5">
      <circle cx="8" cy="14" r="4"/>
      <circle cx="16" cy="10" r="3"/>
      <circle cx="13" cy="17" r="2.5"/>
      <path d="M8 10c0-2 1-4 3-4" strokeLinecap="round"/>
    </svg>
  )},
  // Seborrheic Dermatitis
  { bg: 'from-amber-400 to-amber-600', icon: (
    <svg viewBox="0 0 24 24" fill="none" className="w-8 h-8" stroke="currentColor" strokeWidth="1.5">
      <path d="M12 2a7 7 0 017 7c0 4-3 7-7 9-4-2-7-5-7-9a7 7 0 017-7z"/>
      <path d="M9 9c1-2 5-2 6 0" strokeLinecap="round"/>
      <path d="M10 13c.5.5 1 .7 2 .7s1.5-.2 2-.7" strokeLinecap="round"/>
      <path d="M8 11h.5M15.5 11H16" strokeLinecap="round"/>
    </svg>
  )},
];

const DetectableDiseases = () => {
  const { t } = useTranslation();

  return (
    <div className="py-24 bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Header */}
        <div className="text-center mb-16" data-aos="fade-up">
          <div className="inline-flex items-center space-x-2 rtl:space-x-reverse px-5 py-2 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 rounded-full mb-6">
            <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
            <span className="text-blue-700 dark:text-blue-300 font-semibold text-sm">
              {t.detectableDiseases.badge}
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            {t.detectableDiseases.title}
          </h2>
          <p className="text-xl text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
            {t.detectableDiseases.subtitle}
          </p>
        </div>

        {/* Diseases Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
          {t.detectableDiseases.diseases.map((disease, index) => {
            const iconData = diseaseIcons[index] || diseaseIcons[0];
            return (
              <div
                key={index}
                data-aos="fade-up"
                data-aos-delay={index * 40}
                className="group relative bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700 hover:border-transparent hover:-translate-y-2 cursor-pointer overflow-hidden"
              >
                {/* Background Glow */}
                <div className={`absolute inset-0 bg-gradient-to-br ${iconData.bg} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>

                {/* Icon */}
                <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br ${iconData.bg} flex items-center justify-center text-white group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg`}>
                  {iconData.icon}
                </div>

                {/* Disease Name */}
                <h3 className="text-center font-bold text-gray-900 dark:text-white text-sm leading-snug">
                  {disease.en}
                </h3>

                {/* Arabic Name */}
                <p className="text-center text-xs text-gray-400 dark:text-gray-500 mt-1 font-medium">
                  {disease.ar}
                </p>

                {/* Bottom accent */}
                <div className={`absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r ${iconData.bg} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
              </div>
            );
          })}
        </div>

        {/* CTA */}
        <div className="mt-16 text-center" data-aos="fade-up" data-aos-delay="200">
          <p className="text-gray-500 dark:text-gray-400 text-lg">
            {t.detectableDiseases.ctaText}
          </p>
        </div>

      </div>
    </div>
  );
};

export default DetectableDiseases;