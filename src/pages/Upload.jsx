import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaCloudUploadAlt, FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { collection, addDoc } from 'firebase/firestore';
import { storage, db } from '../config/firebase';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';
import { useTranslation } from '../hooks/useTranslation'; // ✅ جديد
import toast from 'react-hot-toast';

const Upload = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [description, setDescription] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisComplete, setAnalysisComplete] = useState(false);
  const [noSkinDetected, setNoSkinDetected] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation(); // ✅ جديد

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/heic'];
      if (!validTypes.includes(file.type)) {
        toast.error(t.upload.invalidFormat);
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        toast.error(t.upload.fileTooLarge);
        return;
      }
      setSelectedFile(file);
      setNoSkinDetected(false);
      setAnalysisComplete(false);
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyze = async () => {
    if (!selectedFile) {
      toast.error(t.upload.uploadFirst);
      return;
    }
    setIsAnalyzing(true);
    setNoSkinDetected(false);
    try {
      const storageRef = ref(storage, `users/${currentUser.uid}/analyses/${Date.now()}_${selectedFile.name}`);
      await uploadBytes(storageRef, selectedFile);
      const imageUrl = await getDownloadURL(storageRef);

      await new Promise(resolve => setTimeout(resolve, 3000));

      const mockResult = {
        imageQuality: 85,
        affectedArea: 'Hand',
        disease: 'Vitiligo',
        probability: 97,
        secondaryDiseases: [
          { name: 'Post-inflammatory Hypopigmentation', probability: 2 },
          { name: 'Tinea Versicolor', probability: 1 }
        ]
      };

      const skinDetected = Math.random() > 0.2;
      if (!skinDetected) {
        setNoSkinDetected(true);
        setIsAnalyzing(false);
        return;
      }

      const analysisDoc = await addDoc(collection(db, 'analyses'), {
        userId: currentUser.uid,
        imageUrl: imageUrl,
        imageQuality: mockResult.imageQuality,
        affectedArea: mockResult.affectedArea,
        disease: mockResult.disease,
        probability: mockResult.probability,
        description: description,
        createdAt: new Date().toISOString(),
        timestamp: new Date()
      });

      setAnalysisResult({ ...mockResult, analysisId: analysisDoc.id });
      setAnalysisComplete(true);
      toast.success(t.upload.analysisComplete);
    } catch (error) {
      console.error('Analysis error:', error);
      toast.error(t.upload.analysisFailed);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleViewReport = () => {
    navigate('/result', { state: { analysisResult } });
  };

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            {t.upload.title}
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            {t.upload.subtitle}
          </p>
          <p className="text-lg text-gray-500 dark:text-gray-500">
            {t.upload.description}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Upload Section */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              {t.upload.uploadSection}
            </h2>

            {/* Upload Area */}
            <div className="mb-6 relative">
              <div className="relative border-4 border-dashed border-blue-300 rounded-xl p-8 text-center hover:border-blue-500 transition-all bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 min-h-[300px] flex flex-col items-center justify-center">
                <input
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/heic"
                  onChange={handleFileChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  disabled={isAnalyzing}
                />
                
                {preview ? (
                  <div className="space-y-4 w-full">
                    <img 
                      src={preview} 
                      alt="Preview" 
                      className="max-h-64 mx-auto rounded-lg shadow-lg object-contain"
                    />
                    <div className="flex items-center justify-center space-x-2 rtl:space-x-reverse text-green-600">
                      <FaCheckCircle className="text-xl" />
                      <span className="font-semibold">{t.upload.imageUploaded}</span>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <FaCloudUploadAlt className="text-6xl text-blue-500 mx-auto" />
                    <p className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                      {t.upload.clickToUpload}
                    </p>
                    <button className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all">
                      {t.upload.selectImage}
                    </button>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {t.upload.supportedFormats}
                    </p>
                  </div>
                )}
              </div>

              {/* Loading Overlay */}
              {isAnalyzing && (
                <div className="absolute inset-0 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm flex items-center justify-center rounded-xl">
                  <div className="text-center">
                    <LoadingSpinner size="lg" text="" />
                    <div className="mt-4">
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                        {t.upload.analyzing}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400">
                        {t.upload.aiProcessing}
                      </p>
                      <div className="mt-4 flex items-center justify-center space-x-2">
                        <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* No Skin Detected Error */}
              {noSkinDetected && (
                <div className="mt-4 p-4 bg-red-50 border-2 border-red-200 rounded-xl flex items-start space-x-3 rtl:space-x-reverse">
                  <FaExclamationTriangle className="text-red-600 text-xl mt-1" />
                  <div>
                    <p className="font-semibold text-red-900">{t.upload.noSkinTitle}</p>
                    <p className="text-sm text-red-700">{t.upload.noSkinDesc}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Analyze Button */}
            {preview && !analysisComplete && (
              <button
                onClick={handleAnalyze}
                disabled={isAnalyzing}
                className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-lg font-bold rounded-xl hover:shadow-xl hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {isAnalyzing ? t.upload.analyzingBtn : t.upload.analyzeBtn}
              </button>
            )}
          </div>

          {/* Results Section */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
            {!analysisComplete ? (
              <div className="flex flex-col items-center justify-center h-full text-center py-12">
                <div className="w-24 h-24 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full flex items-center justify-center mb-6">
                  <FaCloudUploadAlt className="text-4xl text-gray-500" />
                </div>
                <h3 className="text-xl font-bold text-gray-700 dark:text-gray-300 mb-2">
                  {isAnalyzing ? t.upload.aiAnalyzing : t.upload.uploadToStart}
                </h3>
                <p className="text-gray-500 dark:text-gray-400">
                  {isAnalyzing ? t.upload.takingSeconds : t.upload.resultsAppear}
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                  {t.upload.resultsTitle}
                </h2>

                {/* Image Quality */}
                <div className="flex items-center justify-between p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                  <span className="font-semibold text-gray-700 dark:text-gray-300">{t.upload.imageQuality}</span>
                  <span className="text-2xl font-bold text-blue-600">{analysisResult.imageQuality}</span>
                </div>

                {/* Affected Area */}
                <div className="flex items-center justify-between p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl">
                  <span className="font-semibold text-gray-700 dark:text-gray-300">{t.upload.affectedArea}</span>
                  <span className="text-xl font-bold text-purple-600">{analysisResult.affectedArea}</span>
                </div>

                {/* Disease Type */}
                <div className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl border-2 border-green-200 dark:border-green-700">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm font-semibold text-gray-600 dark:text-gray-400">{t.upload.diseaseType}</span>
                    <span className="px-3 py-1 bg-green-600 text-white text-xs font-bold rounded-full">#1</span>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{analysisResult.disease}</h3>
                  <div className="flex items-center space-x-2 rtl:space-x-reverse">
                    <span className="text-sm font-semibold text-gray-600 dark:text-gray-400">{t.upload.probability}</span>
                    <span className="text-3xl font-bold text-green-600">{analysisResult.probability}%</span>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-3">
                    {t.upload.descLabel}
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows="5"
                    placeholder={t.upload.descPlaceholder}
                    className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none text-sm"
                  ></textarea>
                  {!description && (
                    <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                      {t.upload.descHint}
                    </p>
                  )}
                </div>

                {/* View Report Button */}
                <button
                  onClick={handleViewReport}
                  className="w-full py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white text-lg font-bold rounded-xl hover:shadow-xl hover:scale-[1.02] transition-all"
                >
                  {t.upload.viewReport}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Tips Section */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border-l-4 rtl:border-l-0 rtl:border-r-4 border-blue-500">
            <h3 className="font-bold text-gray-900 dark:text-white mb-2">{t.upload.tips.lighting}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">{t.upload.tips.lightingDesc}</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border-l-4 rtl:border-l-0 rtl:border-r-4 border-purple-500">
            <h3 className="font-bold text-gray-900 dark:text-white mb-2">{t.upload.tips.focus}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">{t.upload.tips.focusDesc}</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border-l-4 rtl:border-l-0 rtl:border-r-4 border-green-500">
            <h3 className="font-bold text-gray-900 dark:text-white mb-2">{t.upload.tips.closeup}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">{t.upload.tips.closeupDesc}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Upload;