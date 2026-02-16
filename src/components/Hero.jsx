import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaArrowRight, FaCheckCircle } from 'react-icons/fa';
import AOS from 'aos';
import { useTranslation } from '../hooks/useTranslation';

const Hero = () => {
  const { t } = useTranslation();

  useEffect(() => {
    AOS.refresh();
  }, []);

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-400 dark:bg-blue-600 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-xl opacity-20 dark:opacity-10 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-400 dark:bg-purple-600 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-xl opacity-20 dark:opacity-10 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-pink-400 dark:bg-pink-600 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-xl opacity-20 dark:opacity-10 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="text-center lg:text-left rtl:lg:text-right" data-aos="fade-right">
            <h1 className="text-5xl lg:text-6xl font-extrabold text-gray-900 dark:text-white mb-6 leading-tight">
              {t.hero.title}
              <span className="block bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent mt-2">
                {t.hero.titleHighlight}
              </span>
            </h1>

            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed"
              data-aos="fade-right" data-aos-delay="100">
              {t.hero.description}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start rtl:lg:justify-end mb-8"
              data-aos="fade-right" data-aos-delay="200">
              <Link
                to="/upload"
                className="group px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold text-lg rounded-xl hover:shadow-2xl hover:scale-105 transition-all flex items-center justify-center space-x-2 rtl:space-x-reverse"
              >
                <span>{t.hero.getStarted}</span>
                <FaArrowRight className="group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform" />
              </Link>

              <Link
                to="/chat"
                className="px-8 py-4 bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 border-2 border-blue-600 dark:border-blue-400 font-bold text-lg rounded-xl hover:bg-blue-50 dark:hover:bg-gray-700 transition-all flex items-center justify-center"
              >
                <span>{t.hero.tryAIChat}</span>
              </Link>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap gap-6 justify-center lg:justify-start rtl:lg:justify-end text-sm text-gray-600 dark:text-gray-400"
              data-aos="fade-right" data-aos-delay="300">
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <FaCheckCircle className="text-green-600 dark:text-green-400 text-lg" />
                <span className="font-semibold">{t.hero.hipaa}</span>
              </div>
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <FaCheckCircle className="text-green-600 dark:text-green-400 text-lg" />
                <span className="font-semibold">{t.hero.accuracy}</span>
              </div>
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <FaCheckCircle className="text-green-600 dark:text-green-400 text-lg" />
                <span className="font-semibold">{t.hero.users}</span>
              </div>
            </div>
          </div>

          {/* Right Image */}
          <div className="relative" data-aos="fade-left" data-aos-delay="200">
            <div className="relative">
              {/* Main Image */}
              <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                <img
                  src="/images/hero-doctor.png"
                  alt="AI-Powered Dermatology Assistant"
                  className="w-full h-auto object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-blue-600/20 dark:from-blue-900/40 to-transparent"></div>
              </div>

              {/* Floating Elements */}
              <div className="absolute -top-4 -right-4 rtl:-right-auto rtl:-left-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-3 rounded-2xl shadow-xl font-bold text-sm animate-bounce"
                data-aos="zoom-in" data-aos-delay="400">
                {t.hero.fastAccurate}
              </div>

              <div className="absolute -bottom-4 -left-4 rtl:-left-auto rtl:-right-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-2xl shadow-xl font-bold text-sm"
                data-aos="zoom-in" data-aos-delay="600">
                {t.hero.private}
              </div>

              {/* Stats Cards */}
              <div className="absolute top-1/2 -left-8 rtl:-left-auto rtl:-right-8 transform -translate-y-1/2 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-4 hidden lg:block"
                data-aos="fade-right" data-aos-delay="800">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">98%</div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">{t.hero.accuracyStat}</div>
                </div>
              </div>

              <div className="absolute bottom-8 -right-8 rtl:-right-auto rtl:-left-8 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-4 hidden lg:block"
                data-aos="fade-left" data-aos-delay="1000">
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">1M+</div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">{t.hero.usersStat}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;