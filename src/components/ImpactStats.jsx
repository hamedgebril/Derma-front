import React, { useState, useEffect, useRef } from 'react';
import { FaUsers, FaFileAlt, FaStar } from 'react-icons/fa';
import { useTranslation } from '../hooks/useTranslation';

const ImpactStats = () => {
  const { t } = useTranslation();

  const statsData = [
    { icon: <FaUsers className="text-4xl" />, value: 1000000, suffix: '+', gradient: 'from-blue-500 to-cyan-500', decimal: false },
    { icon: <FaFileAlt className="text-4xl" />, value: 1022, suffix: '', gradient: 'from-purple-500 to-pink-500', decimal: false },
    { icon: <FaStar className="text-4xl" />, value: 4.9, suffix: '', gradient: 'from-yellow-500 to-orange-500', decimal: true },
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

  return (
    <div className="py-20 bg-gradient-to-br from-blue-600 to-purple-600" ref={sectionRef}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Header */}
        <div className="text-center mb-16" data-aos="fade-up">
          <h2 className="text-4xl font-bold text-white mb-4">
            {t.impactStats.title}
          </h2>
          <p className="text-xl text-blue-100">
            {t.impactStats.subtitle}
          </p>
          <p className="text-lg text-blue-100 mt-2">
            {t.impactStats.description}
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {statsData.map((stat, index) => (
            <div
              key={index}
              data-aos="fade-up"
              data-aos-delay={index * 100}
              className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 text-center hover:bg-white/20 transition-all duration-300 border border-white/20"
            >
              <div className={`inline-flex p-4 rounded-xl bg-gradient-to-br ${stat.gradient} text-white mb-4`}>
                {stat.icon}
              </div>
              <div className="text-5xl font-bold text-white mb-2">
                {formatNumber(counters[index], stat.decimal)}{stat.suffix}
              </div>
              <div className="text-xl font-semibold text-white mb-2">
                {t.impactStats.stats[index].label}
              </div>
              <p className="text-blue-100">
                {t.impactStats.stats[index].description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ImpactStats;