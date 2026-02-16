import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaFileAlt, FaDownload, FaEye, FaCalendar, FaFilter } from 'react-icons/fa';
import { collection, query, where, orderBy, getDocs } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useAuth } from '../context/AuthContext';

const History = () => {
  const { currentUser } = useAuth();
  const [analyses, setAnalyses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, recent, old

  useEffect(() => {
    const fetchAnalyses = async () => {
      if (!currentUser) return;

      try {
        const analysesRef = collection(db, 'analyses');
        const q = query(
          analysesRef,
          where('userId', '==', currentUser.uid),
          orderBy('timestamp', 'desc')
        );

        const querySnapshot = await getDocs(q);
        const analysesData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        setAnalyses(analysesData);
      } catch (error) {
        console.error('Error fetching analyses:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalyses();
  }, [currentUser]);

  const filteredAnalyses = analyses.filter(analysis => {
    if (filter === 'all') return true;
    
    const analysisDate = new Date(analysis.createdAt);
    const now = new Date();
    const daysDiff = Math.floor((now - analysisDate) / (1000 * 60 * 60 * 24));
    
    if (filter === 'recent') return daysDiff <= 7;
    if (filter === 'old') return daysDiff > 30;
    
    return true;
  });

  return (
    <div className="min-h-screen py-12 bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Analysis History</h1>
          <p className="text-xl text-gray-600">
            View all your past skin disease analyses and reports
          </p>
        </div>

        {/* Filter Bar */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
            <div className="flex items-center space-x-2">
              <FaFilter className="text-gray-600" />
              <span className="font-semibold text-gray-700">Filter:</span>
            </div>
            
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => setFilter('all')}
                className={`px-6 py-2 rounded-full font-semibold transition-all ${
                  filter === 'all'
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                All ({analyses.length})
              </button>
              <button
                onClick={() => setFilter('recent')}
                className={`px-6 py-2 rounded-full font-semibold transition-all ${
                  filter === 'recent'
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Recent (Last 7 days)
              </button>
              <button
                onClick={() => setFilter('old')}
                className={`px-6 py-2 rounded-full font-semibold transition-all ${
                  filter === 'old'
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Older (30+ days)
              </button>
            </div>
          </div>
        </div>

        {/* Analyses Grid */}
        {loading ? (
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600 text-lg">Loading your history...</p>
          </div>
        ) : filteredAnalyses.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
            <FaFileAlt className="text-6xl text-gray-300 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No Analyses Found</h3>
            <p className="text-gray-600 mb-6">
              {filter === 'all' 
                ? "You haven't performed any analyses yet"
                : `No analyses found for "${filter}" filter`
              }
            </p>
            <Link
              to="/upload"
              className="inline-block px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold text-lg rounded-xl hover:shadow-xl hover:scale-105 transition-all"
            >
              Start Your First Analysis
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAnalyses.map((analysis) => (
              <div
                key={analysis.id}
                className="bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
              >
                {/* Image */}
                {analysis.imageUrl && (
                  <div className="h-48 bg-gradient-to-br from-blue-100 to-purple-100 overflow-hidden">
                    <img
                      src={analysis.imageUrl}
                      alt="Analysis"
                      className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                )}

                {/* Content */}
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold text-gray-900">
                      {analysis.disease || 'Unknown'}
                    </h3>
                    <span className="text-2xl font-bold text-green-600">
                      {analysis.probability || 0}%
                    </span>
                  </div>

                  <div className="space-y-2 mb-6">
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <FaCalendar />
                      <span>{new Date(analysis.createdAt).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">
                        {analysis.affectedArea || 'N/A'}
                      </span>
                      <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-semibold">
                        Quality: {analysis.imageQuality || 'N/A'}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex space-x-2">
                    <Link
                      to="/result"
                      state={{ analysisResult: analysis }}
                      className="flex-1 flex items-center justify-center space-x-2 px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:shadow-lg transition-all font-semibold"
                    >
                      <FaEye />
                      <span>View</span>
                    </Link>
                    <button className="flex items-center justify-center px-4 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all">
                      <FaDownload />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Stats Footer */}
        {filteredAnalyses.length > 0 && (
          <div className="mt-12 bg-white rounded-2xl shadow-xl p-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div>
                <div className="text-4xl font-bold text-blue-600 mb-2">
                  {analyses.length}
                </div>
                <p className="text-gray-600">Total Analyses</p>
              </div>
              <div>
                <div className="text-4xl font-bold text-purple-600 mb-2">
                  {new Set(analyses.map(a => a.disease)).size}
                </div>
                <p className="text-gray-600">Unique Conditions</p>
              </div>
              <div>
                <div className="text-4xl font-bold text-green-600 mb-2">
                  {Math.round(
                    analyses.reduce((sum, a) => sum + (a.probability || 0), 0) / analyses.length
                  )}%
                </div>
                <p className="text-gray-600">Avg. Confidence</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default History;