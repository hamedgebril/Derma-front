import React, { useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { FaDownload, FaTimes, FaCheckCircle, FaExclamationTriangle, FaSun, FaEye, FaBan, FaCalendarAlt, FaCrown } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from '../hooks/useTranslation'; // ✅ جديد
import toast from 'react-hot-toast';

const Result = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { userData } = useAuth();
  const [showPaywall, setShowPaywall] = useState(false);
  const { t } = useTranslation(); // ✅ جديد

  const analysisResult = location.state?.analysisResult || {
    disease: 'Vitiligo',
    probability: 97,
    imageQuality: 85,
    affectedArea: 'Hand'
  };

  const report = {
    reportId: 'SD-VT-002288',
    date: new Date().toLocaleString('en-US', { 
      month: '2-digit', day: '2-digit', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    }),
    disease: analysisResult.disease,
    confidence: analysisResult.probability,
    secondaryProbabilities: [
      { name: 'Post-inflammatory Hypopigmentation', probability: 2 },
      { name: 'Tinea Versicolor', probability: 1 }
    ],
    about: "Vitiligo is a long-term skin condition characterized by the loss of skin pigmentation, resulting in white or light patches on different areas of the body. It occurs when melanocytes stop producing melanin and is often associated with autoimmune factors. The condition is not contagious and varies in progression from person to person.",
    commonSigns: [
      'Patchy loss of skin color',
      'Premature whitening of hair',
      'Symmetrical pattern often observed',
      'White or light patches on skin',
      'Loss of color in mouth tissues',
      'Can appear at any age'
    ],
    recommendations: [
      "Consult a dermatologist to confirm the diagnosis clinically.",
      "Consider a Wood's lamp examination for further evaluation.",
      "Use sunscreen to protect affected areas from sun exposure.",
      "Follow a treatment plan prescribed by a medical professional if needed."
    ],
    instructions: [
      { titleKey: 'sunProtection', descKey: 'sunProtectionDesc', icon: <FaSun /> },
      { titleKey: 'monitoring',    descKey: 'monitoringDesc',    icon: <FaEye /> },
      { titleKey: 'avoidTrauma',   descKey: 'avoidTraumaDesc',   icon: <FaBan /> },
      { titleKey: 'followUp',      descKey: 'followUpDesc',      icon: <FaCalendarAlt /> },
    ],
    medicines: [
      {
        name: 'Clobetasol Propionate 0.05% Cream',
        type: 'Topical Corticosteroid - First-line treatment',
        when: 'Apply in the evening before bedtime',
        frequency: 'Once daily for 2-3 months',
        usage: 'Apply thin layer to affected areas only'
      },
      {
        name: 'Tacrolimus 0.1% Ointment',
        type: 'Calcineurin Inhibitor - For sensitive areas',
        when: 'Morning and evening',
        frequency: 'Twice daily for 3-6 months',
        usage: 'Suitable for face and neck areas'
      },
      {
        name: 'Calcipotriol 0.005% Cream',
        type: 'Vitamin D Analog - Combination therapy',
        when: 'Apply in the morning',
        frequency: 'Once daily, can combine with corticosteroids',
        usage: 'Use on stable patches, avoid face'
      },
      {
        name: 'Oral Vitamin Supplements',
        type: 'Vitamin B12, Folic Acid, Vitamin D',
        when: 'Take after breakfast',
        frequency: 'Once daily, long term use',
        usage: 'As prescribed by your doctor'
      }
    ]
  };

  const handleDownload = () => {
    if (userData?.subscription === 'free') {
      setShowPaywall(true);
      return;
    }
    toast.success(t.result.downloading);
  };

  const handleUpgrade = () => navigate('/pricing');

  return (
    <div className="min-h-screen py-12 bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-900">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Paywall Modal */}
        {showPaywall && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl max-w-md w-full p-8 relative">
              <button onClick={() => setShowPaywall(false)} className="absolute top-4 right-4 rtl:right-auto rtl:left-4 text-gray-400 hover:text-gray-600 transition">
                <FaTimes className="text-2xl" />
              </button>
              <div className="text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <FaCrown className="text-white text-4xl" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                  {t.result.paywall.title}
                </h2>
                <div className="mb-6">
                  <p className="text-lg text-gray-700 dark:text-gray-300 mb-2">
                    {t.result.paywall.usingFree}{' '}
                    <span className="font-bold text-blue-600">{t.result.paywall.freePlan}</span>
                  </p>
                  <p className="text-gray-600 dark:text-gray-400">{t.result.paywall.upgradeMsg}</p>
                </div>
                <div className="space-y-3">
                  <button onClick={handleUpgrade} className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold text-lg rounded-xl hover:shadow-xl hover:scale-[1.02] transition-all">
                    {t.result.paywall.buyPlan}
                  </button>
                  <button
                    onClick={() => { setShowPaywall(false); toast.info(t.result.paywall.completePayment); }}
                    className="w-full py-4 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 border-2 border-gray-300 dark:border-gray-600 font-bold text-lg rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-all"
                  >
                    {t.result.paywall.alreadyPaid}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden mb-8">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
              <div>
                <div className="flex items-center space-x-3 rtl:space-x-reverse mb-2 flex-wrap">
                  <h1 className="text-2xl md:text-3xl font-bold text-white">
                    {report.disease} {t.result.diagnosisReport}
                  </h1>
                  <span className="px-3 py-1 bg-white/20 backdrop-blur text-white text-xs font-bold rounded-full">
                    {t.result.poweredByAI}
                  </span>
                </div>
                <div className="flex flex-col md:flex-row md:items-center md:space-x-6 rtl:md:space-x-reverse text-white/90 text-sm space-y-1 md:space-y-0">
                  <span>{t.result.reportId} <strong>{report.reportId}</strong></span>
                  <span>{t.result.date} <strong>{report.date}</strong></span>
                </div>
              </div>
              <button onClick={handleDownload} className="px-6 py-3 bg-white text-blue-600 font-bold rounded-xl hover:shadow-lg transition-all flex items-center justify-center space-x-2 rtl:space-x-reverse">
                <FaDownload />
                <span>{t.result.download}</span>
              </button>
            </div>
          </div>

          {/* Main Result */}
          <div className="p-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 space-y-4 md:space-y-0">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">{report.disease}</h2>
                <p className="text-lg text-gray-600 dark:text-gray-400 mt-1">{t.result.highConfidence}</p>
              </div>
              <div className="text-left md:text-right rtl:md:text-left">
                <div className="text-4xl md:text-5xl font-bold text-green-600">{report.confidence}%</div>
                <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">{t.result.probability}</div>
              </div>
            </div>

            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden mb-8">
              <div className="h-full bg-gradient-to-r from-green-500 to-green-600 rounded-full transition-all duration-1000" style={{ width: `${report.confidence}%` }}></div>
            </div>

            {report.secondaryProbabilities?.length > 0 && (
              <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6">
                <h3 className="font-bold text-gray-900 dark:text-white mb-4">{t.result.secondaryProb}</h3>
                <div className="space-y-3">
                  {report.secondaryProbabilities.map((item, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-gray-700 dark:text-gray-300">{item.name}</span>
                      <span className="font-bold text-blue-600">{item.probability}%</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* About Disease */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            {t.result.about} {report.disease}
          </h2>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{report.about}</p>
        </div>

        {/* Common Signs */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">{t.result.commonSigns}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {report.commonSigns.map((sign, index) => (
              <div key={index} className="flex items-start space-x-3 rtl:space-x-reverse p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                <FaCheckCircle className="text-blue-600 text-xl mt-1 flex-shrink-0" />
                <span className="text-gray-700 dark:text-gray-300">{sign}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recommendations */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">{t.result.recommendations}</h2>
          <div className="space-y-4">
            {report.recommendations.map((rec, index) => (
              <div key={index} className="flex items-start space-x-4 rtl:space-x-reverse p-4 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-xl">
                <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-bold text-sm">{index + 1}</span>
                </div>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{rec}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">{t.result.instructions}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {report.instructions.map((instruction, index) => (
              <div key={index} className="p-6 border-2 border-gray-200 dark:border-gray-700 rounded-xl hover:border-blue-400 transition-all">
                <div className="flex items-center space-x-3 rtl:space-x-reverse mb-3">
                  <div className="text-2xl text-blue-600">{instruction.icon}</div>
                  <h3 className="font-bold text-gray-900 dark:text-white">
                    {t.result.instructionsList[instruction.titleKey]}
                  </h3>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {t.result.instructionsList[instruction.descKey]}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Recommended Medicine */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">{t.result.medicines}</h2>
          <div className="space-y-6">
            {report.medicines.map((medicine, index) => (
              <div key={index} className="p-6 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl border-l-4 rtl:border-l-0 rtl:border-r-4 border-green-500">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{medicine.name}</h3>
                <p className="text-sm text-green-700 dark:text-green-400 font-semibold mb-4">{medicine.type}</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="font-semibold text-gray-700 dark:text-gray-300">{t.result.medicineWhen}</span>
                    <p className="text-gray-600 dark:text-gray-400">{medicine.when}</p>
                  </div>
                  <div>
                    <span className="font-semibold text-gray-700 dark:text-gray-300">{t.result.medicineFreq}</span>
                    <p className="text-gray-600 dark:text-gray-400">{medicine.frequency}</p>
                  </div>
                  <div>
                    <span className="font-semibold text-gray-700 dark:text-gray-300">{t.result.medicineUsage}</span>
                    <p className="text-gray-600 dark:text-gray-400">{medicine.usage}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 border-2 border-yellow-300 dark:border-yellow-600 rounded-xl">
            <p className="text-sm text-yellow-800 dark:text-yellow-300">
              <strong>{t.result.medicineImportant}</strong> {t.result.medicineDisclaimer}
            </p>
          </div>
        </div>

        {/* Medical Disclaimer */}
        <div className="bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 rounded-2xl shadow-xl p-8 border-2 border-red-200 dark:border-red-700 mb-8">
          <div className="flex items-start space-x-4 rtl:space-x-reverse">
            <FaExclamationTriangle className="text-red-600 text-3xl flex-shrink-0 mt-1" />
            <div>
              <h3 className="text-xl font-bold text-red-900 dark:text-red-400 mb-2">{t.result.medDisclaimer}</h3>
              <p className="text-red-800 dark:text-red-300 leading-relaxed">{t.result.medDisclaimerText}</p>
            </div>
          </div>
        </div>

        {/* Important Note */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 mb-8">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">{t.result.importantNote}</h3>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-6">{t.result.importantNoteText}</p>
          <p className="text-sm text-gray-600 dark:text-gray-400">{t.result.saveReport}</p>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <button
            onClick={handleDownload}
            className="py-4 px-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold text-lg rounded-xl hover:shadow-xl hover:scale-[1.02] transition-all flex items-center justify-center space-x-2 rtl:space-x-reverse"
          >
            <FaDownload />
            <span>{t.result.downloadReport}</span>
          </button>
          <Link
            to="/upload"
            className="py-4 px-6 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-2 border-gray-300 dark:border-gray-600 font-bold text-lg rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-all flex items-center justify-center space-x-2 rtl:space-x-reverse"
          >
            <FaTimes />
            <span>{t.result.newAnalysis}</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Result;