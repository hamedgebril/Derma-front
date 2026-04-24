import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaArrowRight, FaCheckCircle, FaUpload, FaBrain, FaFileAlt } from 'react-icons/fa';
import AOS from 'aos';
import { useTranslation } from '../hooks/useTranslation';

const STEPS = [
  { icon: <FaUpload />, title: 'Upload Photo', desc: 'Take or upload a clear photo of the affected skin area' },
  { icon: <FaBrain />, title: 'AI Analysis', desc: 'Our AI model analyzes your image in seconds' },
  { icon: <FaFileAlt />, title: 'Get Report', desc: 'Receive a detailed diagnosis report with recommendations' },
];

const Hero = () => {
  const { t } = useTranslation();
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    AOS.refresh();
    const interval = setInterval(() => {
      setActiveStep(prev => (prev + 1) % STEPS.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative overflow-hidden">

      {/* ===== Full-screen Hero Image Section ===== */}
      <div className="relative min-h-screen flex items-center">

        {/* Background Image - تملى الشاشة */}
        <div className="absolute inset-0 z-0">
          <img
            src="/images/hero-skin-ai.png"
            alt="DermaVision AI Skin Analysis"
            className="w-full h-full object-cover object-center"
          />
          {/* Dark overlay للنص يبقى واضح */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-black/20 dark:from-black/90 dark:via-black/60 dark:to-black/30"></div>
          {/* Bottom fade */}
          <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-white dark:from-gray-900 to-transparent"></div>
        </div>

        {/* ===== Content over image ===== */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 w-full">
          <div className="max-w-2xl" data-aos="fade-right">

            {/* Badge */}
            <div className="inline-flex items-center space-x-2 px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full mb-8">
              <span className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></span>
              <span className="text-white font-semibold text-sm tracking-wide">AI-Powered Dermatology Platform</span>
            </div>

            {/* Headline */}
            <h1 className="text-5xl lg:text-6xl xl:text-7xl font-black text-white leading-[1.1] mb-6 drop-shadow-2xl">
              {t.hero.title}
              <span className="block bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent mt-2">
                {t.hero.titleHighlight}
              </span>
            </h1>

            <p className="text-lg text-white/80 leading-relaxed mb-10 max-w-xl">
              {t.hero.description}
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <Link
                to="/upload"
                className="group px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold text-lg rounded-2xl hover:shadow-2xl hover:shadow-cyan-500/40 hover:scale-105 transition-all flex items-center justify-center space-x-3"
              >
                <FaUpload className="text-base" />
                <span>{t.hero.getStarted}</span>
                <FaArrowRight className="group-hover:translate-x-1 transition-transform text-base" />
              </Link>

              <Link
                to="/chat"
                className="px-8 py-4 bg-white/10 backdrop-blur-sm text-white border-2 border-white/30 font-bold text-lg rounded-2xl hover:bg-white/20 hover:border-white/50 transition-all flex items-center justify-center space-x-2"
              >
                <span>💬</span>
                <span>{t.hero.tryAIChat}</span>
              </Link>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap gap-5 text-sm">
              {[
                { label: t.hero.hipaa, color: 'text-green-400' },
                { label: t.hero.accuracy, color: 'text-cyan-400' },
                { label: t.hero.users, color: 'text-purple-400' },
              ].map((item, i) => (
                <div key={i} className="flex items-center space-x-2">
                  <FaCheckCircle className={`text-lg ${item.color}`} />
                  <span className="font-semibold text-white/90">{item.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* ===== Floating Stats - يمين الصورة ===== */}
          <div className="absolute right-8 top-1/2 -translate-y-1/2 hidden xl:flex flex-col gap-4" data-aos="fade-left" data-aos-delay="400">

            {/* Skin Health Score */}
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-5 text-center min-w-[130px]">
              <div className="relative w-16 h-16 mx-auto mb-3">
                <svg viewBox="0 0 36 36" className="w-16 h-16 -rotate-90">
                  <circle cx="18" cy="18" r="15.9" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="2.5"/>
                  <circle cx="18" cy="18" r="15.9" fill="none" stroke="url(#scoreGrad)" strokeWidth="2.5"
                    strokeDasharray="92 100" strokeLinecap="round"/>
                  <defs>
                    <linearGradient id="scoreGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#22d3ee"/>
                      <stop offset="100%" stopColor="#818cf8"/>
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-white font-black text-sm">92%</span>
                </div>
              </div>
              <p className="text-white/60 text-xs font-medium tracking-wider uppercase">Skin Health</p>
            </div>

            {/* Accuracy */}
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-5 text-center">
              <div className="text-3xl font-black text-cyan-400 mb-1">98%</div>
              <p className="text-white/60 text-xs font-medium tracking-wider uppercase">{t.hero.accuracyStat}</p>
            </div>

            {/* Users */}
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-5 text-center">
              <div className="text-3xl font-black text-purple-400 mb-1">1M+</div>
              <p className="text-white/60 text-xs font-medium tracking-wider uppercase">{t.hero.usersStat}</p>
            </div>

            {/* Live indicator */}
            <div className="bg-green-500/20 backdrop-blur-md border border-green-400/30 rounded-2xl p-4 flex items-center space-x-3">
              <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse flex-shrink-0"></div>
              <div>
                <p className="text-green-400 font-bold text-sm">AI Active</p>
                <p className="text-white/50 text-xs">Ready to scan</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ===== How It Works Steps ===== */}
      <div className="relative z-10 bg-white dark:bg-gray-900 py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8" data-aos="fade-up">
            <p className="text-gray-500 dark:text-gray-400 font-semibold text-sm uppercase tracking-widest">
              How It Works
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6" data-aos="fade-up" data-aos-delay="100">
            {STEPS.map((step, index) => (
              <div
                key={index}
                className={`relative flex items-center space-x-4 p-5 rounded-2xl border-2 transition-all duration-500 ${
                  activeStep === index
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 shadow-lg shadow-blue-500/20'
                    : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800'
                }`}
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-black text-lg flex-shrink-0 transition-all duration-500 ${
                  activeStep === index
                    ? 'bg-gradient-to-br from-blue-600 to-purple-600 text-white shadow-lg'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
                }`}>
                  {index + 1}
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 dark:text-white text-sm">{step.title}</h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{step.desc}</p>
                </div>
                {index < STEPS.length - 1 && (
                  <div className="hidden md:block absolute -right-4 top-1/2 -translate-y-1/2 z-10 text-gray-300 dark:text-gray-600 text-xl">
                    →
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
};

export default Hero;