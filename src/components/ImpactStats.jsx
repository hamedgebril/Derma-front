import React, { useState, useEffect, useRef } from 'react';
import { FaUsers, FaFileAlt, FaStar, FaShieldAlt } from 'react-icons/fa';
import { useTranslation } from '../hooks/useTranslation';

const ImpactStats = () => {
  const { t } = useTranslation();

  const statsData = [
    { icon: <FaUsers className="text-3xl" />, value: 1000000, suffix: '+', gradient: 'from-blue-500 to-cyan-500', decimal: false, bg: 'bg-blue-500/10', border: 'border-blue-500/20' },
    { icon: <FaFileAlt className="text-3xl" />, value: 1022, suffix: '+', gradient: 'from-purple-500 to-pink-500', decimal: false, bg: 'bg-purple-500/10', border: 'border-purple-500/20' },
    { icon: <FaStar className="text-3xl" />, value: 4.9, suffix: '/5', gradient: 'from-yellow-500 to-orange-500', decimal: true, bg: 'bg-yellow-500/10', border: 'border-yellow-500/20' },
    { icon: <FaShieldAlt className="text-3xl" />, value: 98, suffix: '%', gradient: 'from-green-500 to-emerald-500', decimal: false, bg: 'bg-green-500/10', border: 'border-green-500/20' },
  ];

  const [counters, setCounters] = useState(statsData.map(() => 0));
  const [hasAnimated, setHasAnimated] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          animateCounters();
        }
      },
      { threshold: 0.3 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, [hasAnimated]);

  const animateCounters = () => {
    statsData.forEach((stat, index) => {
      let startValue = 0;
      const endValue = stat.value;
      const duration = 2000;
      const increment = endValue / (duration / 16);
      const timer = setInterval(() => {
        startValue += increment;
        if (startValue >= endValue) {
          setCounters(prev => { const n = [...prev]; n[index] = endValue; return n; });
          clearInterval(timer);
        } else {
          setCounters(prev => { const n = [...prev]; n[index] = startValue; return n; });
        }
      }, 16);
    });
  };

  const formatNumber = (num, decimal) => {
    if (decimal) return num.toFixed(1);
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    return Math.floor(num).toLocaleString();
  };

  const labels = [
    { label: 'Active Users', desc: 'Worldwide patients trust DermaVision' },
    { label: 'Analyses Done', desc: 'Successful skin diagnoses completed' },
    { label: 'User Rating', desc: 'Average rating from verified users' },
    { label: 'AI Accuracy', desc: 'Clinically validated detection rate' },
  ];

  return (
    <div className="py-24 bg-gray-950 dark:bg-gray-950 relative overflow-hidden" ref={sectionRef}>

      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="text-center mb-16" data-aos="fade-up">
          <span className="inline-block px-4 py-2 bg-white/10 text-white text-sm font-bold rounded-full mb-4 border border-white/20">
            Our Impact in Numbers
          </span>
          <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
            {t.impactStats.title}
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            {t.impactStats.subtitle}
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {statsData.map((stat, index) => (
            <div
              key={index}
              data-aos="fade-up"
              data-aos-delay={index * 100}
              className={`group relative ${stat.bg} border ${stat.border} backdrop-blur-lg rounded-3xl p-8 text-center hover:scale-105 transition-all duration-300`}
            >
              {/* Icon */}
              <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-br ${stat.gradient} text-white mb-5 shadow-lg`}>
                {stat.icon}
              </div>

              {/* Number */}
              <div className={`text-4xl lg:text-5xl font-black bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent mb-2`}>
                {formatNumber(counters[index], stat.decimal)}{stat.suffix}
              </div>

              {/* Label */}
              <div className="text-white font-bold text-lg mb-1">
                {labels[index].label}
              </div>
              <p className="text-gray-400 text-sm leading-relaxed">
                {labels[index].desc}
              </p>
            </div>
          ))}
        </div>

        {/* Testimonial */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6" data-aos="fade-up" data-aos-delay="200">
          {[
            { name: 'Sarah M.', role: 'Patient', text: 'DermaVision detected my psoriasis early. The AI was incredibly accurate and the report was very detailed.', stars: 5 },
            { name: 'Dr. Ahmed K.', role: 'Dermatologist', text: 'I recommend DermaVision to my patients for initial screening. It saves time and provides excellent preliminary reports.', stars: 5 },
            { name: 'Maria L.', role: 'Patient', text: 'Got my diagnosis in seconds! The report explained everything clearly. Highly recommended for anyone with skin concerns.', stars: 5 },
          ].map((review, i) => (
            <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-6">
              <div className="flex items-center space-x-1 mb-4">
                {[...Array(review.stars)].map((_, s) => (
                  <FaStar key={s} className="text-yellow-400 text-sm" />
                ))}
              </div>
              <p className="text-gray-300 text-sm leading-relaxed mb-4">"{review.text}"</p>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                  {review.name[0]}
                </div>
                <div>
                  <div className="text-white font-bold text-sm">{review.name}</div>
                  <div className="text-gray-500 text-xs">{review.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default ImpactStats;