import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import {
  FaTimes, FaCheckCircle, FaExclamationTriangle,
  FaSun, FaEye, FaBan, FaCalendarAlt, FaCrown, FaFilePdf,
  FaChevronDown, FaChevronUp
} from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from '../hooks/useTranslation';
import { getDiseaseData } from '../data/diseases';
import toast from 'react-hot-toast';

// ===================== Animated Counter =====================
const AnimatedCounter = ({ target, duration = 1500, suffix = '' }) => {
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting && !started) setStarted(true); },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [started]);

  useEffect(() => {
    if (!started) return;
    let startTime = null;
    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      setCount(Math.round(eased * target));
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [started, target, duration]);

  return <span ref={ref}>{count}{suffix}</span>;
};

// ===================== Animated Progress Bar =====================
const AnimatedBar = ({ value, color, delay = 0 }) => {
  const [width, setWidth] = useState(0);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setWidth(value), delay);
        }
      },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [value, delay]);

  return (
    <div ref={ref} className="w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden" style={{ height: 10 }}>
      <div
        className={`h-full rounded-full bg-gradient-to-r ${color} transition-all duration-1000 ease-out`}
        style={{ width: `${width}%` }}
      />
    </div>
  );
};

// ===================== Fade-in Section =====================
const FadeSection = ({ children, delay = 0 }) => {
  const [visible, setVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(24px)',
        transition: `opacity 0.6s ease ${delay}ms, transform 0.6s ease ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
};

// ===================== Collapsible Section =====================
const CollapsibleSection = ({ title, icon, children, defaultOpen = true, badge }) => {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden mb-6">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-8 py-5 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
      >
        <div className="flex items-center space-x-3">
          <span className="text-xl">{icon}</span>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">{title}</h2>
          {badge && (
            <span className="px-2.5 py-1 bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 text-xs font-bold rounded-full">
              {badge}
            </span>
          )}
        </div>
        <div className={`text-gray-400 transition-transform duration-300 ${open ? 'rotate-180' : 'rotate-0'}`}>
          <FaChevronDown />
        </div>
      </button>
      <div className={`transition-all duration-400 overflow-hidden ${open ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="px-8 pb-8 border-t border-gray-100 dark:border-gray-700 pt-6">
          {children}
        </div>
      </div>
    </div>
  );
};

const getIcon = (iconName) => {
  const icons = { sun: <FaSun />, eye: <FaEye />, ban: <FaBan />, calendar: <FaCalendarAlt /> };
  return icons[iconName] || <FaCheckCircle />;
};

// ===================== Main Result Component =====================
const Result = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { userData } = useAuth();
  const [showPaywall, setShowPaywall] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const { t } = useTranslation();

  const analysisResult = location.state?.analysisResult;
  const imageUrl = location.state?.imageUrl;
  const description = location.state?.description;

  if (!analysisResult) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-900">
        <div className="text-center bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-12">
          <FaExclamationTriangle className="text-5xl text-yellow-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">No Analysis Found</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">Please upload an image first to get your diagnosis report.</p>
          <Link to="/upload" className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-xl hover:shadow-xl transition-all">
            Go to Upload
          </Link>
        </div>
      </div>
    );
  }

  const diseaseType = analysisResult.disease || 'healty';
  const diseaseData = getDiseaseData(diseaseType);
  const confidence = analysisResult.probability || 0;

  const report = {
    reportId: `SD-${analysisResult.analysisId || Math.floor(Math.random() * 999999).toString().padStart(6, '0')}`,
    date: new Date().toLocaleString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
    disease: diseaseData.displayName,
    confidence,
    imageQuality: analysisResult.imageQuality || 0,
    imageQualityLabel: analysisResult.imageQualityLabel || 'Unknown',
    secondaryProbabilities: analysisResult.secondaryDiseases || [],
    about: diseaseData.about,
    commonSigns: diseaseData.commonSigns,
    recommendations: diseaseData.recommendations,
    instructions: diseaseData.instructions,
    medicines: diseaseData.medicines,
  };

  const getConfidenceColor = (c) => c >= 80 ? 'text-green-600 dark:text-green-400' : c >= 50 ? 'text-yellow-600 dark:text-yellow-400' : 'text-red-600 dark:text-red-400';
  const getBarColor = (c) => c >= 80 ? 'from-green-500 to-emerald-500' : c >= 50 ? 'from-yellow-500 to-amber-500' : 'from-red-500 to-rose-500';
  const getConfidenceLabel = (c) => c >= 80 ? 'High Confidence' : c >= 50 ? 'Medium Confidence' : 'Low Confidence';
  const getConfidenceBg = (c) => c >= 80
    ? 'from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-green-200 dark:border-green-700'
    : c >= 50
      ? 'from-yellow-50 to-amber-50 dark:from-yellow-900/20 dark:to-amber-900/20 border-yellow-200 dark:border-yellow-700'
      : 'from-red-50 to-rose-50 dark:from-red-900/20 dark:to-rose-900/20 border-red-200 dark:border-red-700';

  const handleDownload = () => {
    if (userData?.subscription === 'free') { setShowPaywall(true); return; }
    handlePrintPDF();
  };

  const handlePrintPDF = () => {
    setIsDownloading(true);
    toast.loading('Preparing PDF report...', { id: 'pdf' });

    const printContent = `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>DermaVision Report - ${report.disease}</title>
    <style>* { margin: 0; padding: 0; box-sizing: border-box; } body { font-family: 'Segoe UI', Arial, sans-serif; color: #1f2937; background: white; font-size: 13px; }
    .header { background: linear-gradient(135deg, #2563eb, #7c3aed); color: white; padding: 24px 32px; }
    .header h1 { font-size: 22px; font-weight: 700; margin-bottom: 6px; }
    .header .meta { font-size: 12px; opacity: 0.85; display: flex; gap: 24px; flex-wrap: wrap; margin-top: 4px; }
    .content { padding: 24px 32px; }
    .section { margin-bottom: 24px; border: 1px solid #e5e7eb; border-radius: 10px; overflow: hidden; }
    .section-title { background: #f8fafc; padding: 12px 16px; font-size: 14px; font-weight: 700; color: #1e40af; border-bottom: 1px solid #e5e7eb; }
    .section-body { padding: 16px; }
    .confidence-box { display: flex; align-items: center; justify-content: space-between; padding: 16px; background: linear-gradient(135deg, #f0fdf4, #dcfce7); border-radius: 8px; margin-bottom: 12px; }
    .confidence-num { font-size: 36px; font-weight: 800; color: ${confidence >= 80 ? '#16a34a' : confidence >= 50 ? '#d97706' : '#dc2626'}; }
    .disease-name { font-size: 20px; font-weight: 700; color: #111827; }
    .progress-bar { width: 100%; height: 10px; background: #e5e7eb; border-radius: 5px; margin: 8px 0; overflow: hidden; }
    .progress-fill { height: 100%; background: linear-gradient(90deg, #16a34a, #22c55e); border-radius: 5px; width: ${confidence}%; }
    .quality-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 12px; }
    .quality-card { background: #eff6ff; border-radius: 8px; padding: 12px; }
    .quality-card .label { font-size: 11px; color: #6b7280; margin-bottom: 4px; }
    .quality-card .value { font-size: 18px; font-weight: 700; color: #2563eb; }
    .quality-card .sub { font-size: 11px; color: #9ca3af; }
    .signs-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
    .sign-item { display: flex; align-items: flex-start; gap: 8px; background: #eff6ff; border-radius: 6px; padding: 8px 10px; }
    .sign-dot { width: 8px; height: 8px; border-radius: 50%; background: #2563eb; margin-top: 4px; flex-shrink: 0; }
    .rec-item { display: flex; gap: 10px; align-items: flex-start; padding: 10px; background: #faf5ff; border-radius: 6px; margin-bottom: 8px; }
    .rec-num { width: 24px; height: 24px; border-radius: 50%; background: linear-gradient(135deg, #7c3aed, #2563eb); color: white; font-size: 12px; font-weight: 700; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
    .med-card { background: linear-gradient(135deg, #f0fdf4, #dcfce7); border-left: 4px solid #16a34a; border-radius: 8px; padding: 14px; margin-bottom: 12px; }
    .med-name { font-size: 14px; font-weight: 700; color: #111827; margin-bottom: 2px; }
    .med-type { font-size: 11px; color: #16a34a; font-weight: 600; margin-bottom: 8px; }
    .med-grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 8px; }
    .med-item .med-label { font-size: 10px; font-weight: 700; color: #374151; }
    .med-item .med-value { font-size: 11px; color: #6b7280; }
    .disclaimer { background: #fef2f2; border: 2px solid #fecaca; border-radius: 8px; padding: 14px; margin-top: 8px; }
    .disclaimer p { color: #991b1b; font-size: 12px; line-height: 1.6; }
    .warning-box { background: #fffbeb; border: 1px solid #fcd34d; border-radius: 8px; padding: 10px 14px; margin-top: 12px; }
    .warning-box p { color: #92400e; font-size: 11px; }
    .footer { text-align: center; padding: 16px; background: #f8fafc; border-top: 1px solid #e5e7eb; color: #6b7280; font-size: 11px; margin-top: 16px; }
    @media print { body { print-color-adjust: exact; -webkit-print-color-adjust: exact; } }
    </style></head><body>
    <div class="header"><h1>🔬 ${report.disease} — Diagnosis Report</h1>
    <div class="meta"><span>📋 Report ID: ${report.reportId}</span><span>📅 Date: ${report.date}</span><span>🤖 Powered by DermaVision AI</span></div></div>
    <div class="content">
    <div class="section"><div class="section-title">🎯 AI Diagnosis Result</div><div class="section-body">
    <div class="confidence-box"><div><div class="disease-name">${report.disease}</div><div class="progress-bar"><div class="progress-fill"></div></div></div><div class="confidence-num">${confidence}%</div></div>
    <div class="quality-grid"><div class="quality-card"><div class="label">Image Quality</div><div class="value">${report.imageQuality}</div><div class="sub">${report.imageQualityLabel}</div></div>
    <div class="quality-card"><div class="label">Analysis ID</div><div class="value" style="font-size:14px">${report.reportId}</div><div class="sub">${report.date}</div></div></div>
    ${report.secondaryProbabilities?.length > 0 ? `<div style="background:#f9fafb;border-radius:8px;padding:12px"><div style="font-weight:700;margin-bottom:8px;font-size:12px">Secondary Probabilities:</div>${report.secondaryProbabilities.map(i => `<div style="display:flex;justify-content:space-between;padding:6px 0;border-bottom:1px solid #e5e7eb"><span>${i.name}</span><span style="font-weight:700;color:#2563eb">${i.probability}%</span></div>`).join('')}</div>` : ''}
    </div></div>
    ${imageUrl ? `<div class="section"><div class="section-title">📷 Analyzed Image</div><div class="section-body" style="text-align:center"><img src="${imageUrl}" style="max-height:200px;border-radius:8px;border:2px solid #e5e7eb" />${description ? `<p style="margin-top:8px;color:#6b7280;font-size:12px"><strong>Patient Description:</strong> ${description}</p>` : ''}</div></div>` : ''}
    <div class="section"><div class="section-title">ℹ️ About ${report.disease}</div><div class="section-body"><p style="line-height:1.7;color:#374151">${report.about}</p></div></div>
    <div class="section"><div class="section-title">🔍 Common Signs</div><div class="section-body"><div class="signs-grid">${report.commonSigns.map(s => `<div class="sign-item"><div class="sign-dot"></div><span style="color:#374151">${s}</span></div>`).join('')}</div></div></div>
    <div class="section"><div class="section-title">✅ Recommendations</div><div class="section-body">${report.recommendations.map((r, i) => `<div class="rec-item"><div class="rec-num">${i + 1}</div><p style="color:#374151;line-height:1.6">${r}</p></div>`).join('')}</div></div>
    <div class="section"><div class="section-title">💊 Recommended Medicines</div><div class="section-body">${report.medicines.map(m => `<div class="med-card"><div class="med-name">${m.name}</div><div class="med-type">${m.type}</div><div class="med-grid"><div class="med-item"><div class="med-label">When:</div><div class="med-value">${m.when}</div></div><div class="med-item"><div class="med-label">Frequency:</div><div class="med-value">${m.frequency}</div></div><div class="med-item"><div class="med-label">Usage:</div><div class="med-value">${m.usage}</div></div></div></div>`).join('')}
    <div class="warning-box"><p><strong>⚠️ Important:</strong> General recommendations only. Consult a dermatologist before any treatment.</p></div></div></div>
    <div class="disclaimer"><p><strong>⚠️ Medical Disclaimer:</strong> This AI analysis is for informational purposes only. Please consult a licensed dermatologist.</p></div>
    </div><div class="footer">Generated by DermaVision AI • ${report.date} • Report ID: ${report.reportId}</div></body></html>`;

    const printWindow = window.open('', '_blank', 'width=900,height=700');
    printWindow.document.write(printContent);
    printWindow.document.close();
    printWindow.onload = () => {
      setTimeout(() => {
        printWindow.print();
        printWindow.onafterprint = () => { printWindow.close(); setIsDownloading(false); toast.success('Report downloaded! ✅', { id: 'pdf' }); };
        setTimeout(() => { setIsDownloading(false); toast.dismiss('pdf'); }, 3000);
      }, 500);
    };
  };

  return (
    <div className="min-h-screen py-12 bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-900">

      {/* Paywall Modal */}
      {showPaywall && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl max-w-md w-full p-8 relative">
            <button onClick={() => setShowPaywall(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition text-xl font-bold">✕</button>
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <FaCrown className="text-white text-4xl" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Upgrade to Pro</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">Download full PDF reports with a Pro subscription.</p>
              <div className="space-y-3">
                <button onClick={() => navigate('/pricing')} className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold text-lg rounded-xl hover:shadow-xl transition-all">Upgrade Now</button>
                <button onClick={() => setShowPaywall(false)} className="w-full py-4 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 border-2 border-gray-300 dark:border-gray-600 font-bold text-lg rounded-xl hover:border-blue-500 transition-all">Already Paid</button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ===== Header Card ===== */}
        <FadeSection delay={0}>
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden mb-6">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
                <div>
                  <div className="flex items-center space-x-3 mb-2 flex-wrap gap-2">
                    <h1 className="text-2xl md:text-3xl font-bold text-white">{report.disease} Diagnosis Report</h1>
                    <span className="px-3 py-1 bg-white/20 backdrop-blur text-white text-xs font-bold rounded-full">Powered by AI</span>
                  </div>
                  <div className="flex flex-col md:flex-row md:items-center md:space-x-6 text-white/90 text-sm space-y-1 md:space-y-0">
                    <span>Report ID: <strong>{report.reportId}</strong></span>
                    <span>Date: <strong>{report.date}</strong></span>
                  </div>
                </div>
                <button onClick={handleDownload} disabled={isDownloading}
                  className="flex items-center space-x-2 px-6 py-3 bg-white text-blue-600 font-bold rounded-xl hover:shadow-xl hover:scale-[1.02] transition-all disabled:opacity-70">
                  <FaFilePdf />
                  <span>{isDownloading ? 'Preparing...' : 'Download PDF'}</span>
                </button>
              </div>
            </div>

            {/* ✅ Animated Confidence Score */}
            <div className="p-8">
              <div className={`p-6 bg-gradient-to-br ${getConfidenceBg(confidence)} rounded-2xl border-2 mb-6`}>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-3xl font-black text-gray-900 dark:text-white">{report.disease}</h2>
                    <span className={`text-sm font-semibold ${getConfidenceColor(confidence)} mt-1 inline-block`}>
                      {getConfidenceLabel(confidence)}
                    </span>
                  </div>
                  {/* ✅ Animated circular score */}
                  <div className="relative w-24 h-24 flex-shrink-0">
                    <svg className="w-24 h-24 -rotate-90" viewBox="0 0 36 36">
                      <circle cx="18" cy="18" r="15.9" fill="none" stroke="rgba(0,0,0,0.08)" strokeWidth="2.5" />
                      <circle cx="18" cy="18" r="15.9" fill="none"
                        stroke={confidence >= 80 ? '#16a34a' : confidence >= 50 ? '#d97706' : '#dc2626'}
                        strokeWidth="2.5"
                        strokeDasharray={`${confidence} 100`}
                        strokeLinecap="round"
                        style={{ transition: 'stroke-dasharray 1.5s ease' }}
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className={`text-2xl font-black ${getConfidenceColor(confidence)}`}>
                        <AnimatedCounter target={confidence} suffix="%" />
                      </span>
                    </div>
                  </div>
                </div>

                {/* ✅ Animated bar */}
                <AnimatedBar value={confidence} color={getBarColor(confidence)} />
              </div>

              {/* Quality + ID cards */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-100 dark:border-blue-800">
                  <p className="text-xs text-gray-500 dark:text-gray-400 font-medium mb-1">Image Quality</p>
                  <p className="text-2xl font-black text-blue-600 dark:text-blue-400">
                    <AnimatedCounter target={report.imageQuality} />
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">{report.imageQualityLabel}</p>
                </div>
                <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl border border-purple-100 dark:border-purple-800">
                  <p className="text-xs text-gray-500 dark:text-gray-400 font-medium mb-1">Analysis ID</p>
                  <p className="text-base font-black text-purple-600 dark:text-purple-400 truncate">{report.reportId}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{report.date}</p>
                </div>
              </div>

              {/* ✅ Secondary Probabilities with animated bars */}
              {report.secondaryProbabilities?.length > 0 && (
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-5">
                  <h3 className="font-bold text-gray-900 dark:text-white mb-4 text-sm uppercase tracking-wide">Secondary Probabilities</h3>
                  <div className="space-y-3">
                    {report.secondaryProbabilities.map((item, i) => (
                      <div key={i}>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm text-gray-700 dark:text-gray-300 font-medium capitalize">{item.name}</span>
                          <span className="text-sm font-bold text-blue-600 dark:text-blue-400">{item.probability}%</span>
                        </div>
                        <AnimatedBar value={item.probability} color="from-blue-400 to-purple-500" delay={i * 150} />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </FadeSection>

        {/* ===== Analyzed Image ===== */}
        {imageUrl && (
          <FadeSection delay={100}>
            <CollapsibleSection title="Analyzed Image" icon="📷" badge="Skin Photo">
              <img src={imageUrl} alt="Analyzed skin" className="max-h-64 mx-auto rounded-xl shadow-lg object-contain" />
              {description && (
                <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                  <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">Patient Description</p>
                  <p className="text-gray-700 dark:text-gray-300 text-sm">{description}</p>
                </div>
              )}
            </CollapsibleSection>
          </FadeSection>
        )}

        {/* ===== About ===== */}
        <FadeSection delay={150}>
          <CollapsibleSection title={`About ${report.disease}`} icon="ℹ️">
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{report.about}</p>
          </CollapsibleSection>
        </FadeSection>

        {/* ===== Common Signs ===== */}
        <FadeSection delay={200}>
          <CollapsibleSection title="Common Signs" icon="🔍" badge={`${report.commonSigns.length} signs`}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {report.commonSigns.map((sign, i) => (
                <div key={i}
                  className="flex items-start space-x-3 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-100 dark:border-blue-800 hover:border-blue-400 transition-colors"
                  style={{ animationDelay: `${i * 80}ms` }}
                >
                  <FaCheckCircle className="text-blue-500 text-lg mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700 dark:text-gray-300 text-sm">{sign}</span>
                </div>
              ))}
            </div>
          </CollapsibleSection>
        </FadeSection>

        {/* ===== Recommendations ===== */}
        <FadeSection delay={250}>
          <CollapsibleSection title="Recommendations" icon="✅" badge={`${report.recommendations.length} steps`}>
            <div className="space-y-3">
              {report.recommendations.map((rec, i) => (
                <div key={i} className="flex items-start space-x-4 p-4 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-xl border border-purple-100 dark:border-purple-800 hover:shadow-md transition-shadow">
                  <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm">
                    <span className="text-white font-bold text-sm">{i + 1}</span>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-sm">{rec}</p>
                </div>
              ))}
            </div>
          </CollapsibleSection>
        </FadeSection>

        {/* ===== Instructions ===== */}
        <FadeSection delay={300}>
          <CollapsibleSection title="Care Instructions" icon="📋">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {report.instructions.map((inst, i) => (
                <div key={i} className="p-5 border-2 border-gray-100 dark:border-gray-700 rounded-xl hover:border-blue-400 hover:shadow-md transition-all group">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="text-xl text-blue-600 group-hover:scale-110 transition-transform">{getIcon(inst.icon)}</div>
                    <h3 className="font-bold text-gray-900 dark:text-white text-sm">{inst.title}</h3>
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">{inst.desc}</p>
                </div>
              ))}
            </div>
          </CollapsibleSection>
        </FadeSection>

        {/* ===== Medicines ===== */}
        <FadeSection delay={350}>
          <CollapsibleSection title="Recommended Medicines" icon="💊" badge={`${report.medicines.length} medicines`}>
            <div className="space-y-4">
              {report.medicines.map((med, i) => (
                <div key={i} className="p-5 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl border-l-4 border-green-500 hover:shadow-md transition-shadow">
                  <h3 className="text-base font-bold text-gray-900 dark:text-white mb-1">{med.name}</h3>
                  <p className="text-xs text-green-700 dark:text-green-400 font-semibold mb-3">{med.type}</p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {[
                      { label: 'When', value: med.when },
                      { label: 'Frequency', value: med.frequency },
                      { label: 'Usage', value: med.usage },
                    ].map((item, j) => (
                      <div key={j} className="bg-white/60 dark:bg-gray-800/60 rounded-lg p-3">
                        <p className="text-xs font-bold text-gray-600 dark:text-gray-400 mb-1">{item.label}</p>
                        <p className="text-xs text-gray-700 dark:text-gray-300">{item.value}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 p-4 bg-yellow-50 dark:bg-yellow-900/20 border-2 border-yellow-300 dark:border-yellow-600 rounded-xl">
              <p className="text-xs text-yellow-800 dark:text-yellow-300">
                <strong>⚠️ Important:</strong> General recommendations only. Always consult a qualified dermatologist before starting any treatment.
              </p>
            </div>
          </CollapsibleSection>
        </FadeSection>

        {/* ===== Disclaimer ===== */}
        <FadeSection delay={400}>
          <div className="bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 rounded-2xl shadow-xl p-6 border-2 border-red-200 dark:border-red-700 mb-6">
            <div className="flex items-start space-x-4">
              <FaExclamationTriangle className="text-red-500 text-2xl flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-lg font-bold text-red-900 dark:text-red-400 mb-2">Medical Disclaimer</h3>
                <p className="text-red-800 dark:text-red-300 leading-relaxed text-sm">
                  This AI analysis is for informational purposes only and does not replace professional medical advice. Please consult a licensed dermatologist for proper diagnosis and treatment.
                </p>
              </div>
            </div>
          </div>
        </FadeSection>

        {/* ===== Action Buttons ===== */}
        <FadeSection delay={450}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button onClick={handleDownload} disabled={isDownloading}
              className="py-4 px-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold text-lg rounded-xl hover:shadow-xl hover:scale-[1.02] transition-all flex items-center justify-center space-x-2 disabled:opacity-70">
              <FaFilePdf />
              <span>{isDownloading ? 'Preparing PDF...' : 'Download PDF Report'}</span>
            </button>
            <Link to="/upload"
              className="py-4 px-6 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-2 border-gray-300 dark:border-gray-600 font-bold text-lg rounded-xl hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-gray-700 transition-all flex items-center justify-center space-x-2">
              <FaTimes />
              <span>New Analysis</span>
            </Link>
          </div>
        </FadeSection>

      </div>
    </div>
  );
};

export default Result;
