import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaFileAlt, FaHistory, FaCrown, FaUser, FaCog } from 'react-icons/fa';
import { collection, query, where, orderBy, getDocs, limit } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useAuth } from '../context/AuthContext';
import { SkeletonTable } from '../components/SkeletonLoader';

const Dashboard = () => {
  const { currentUser, userData } = useAuth();
  const [recentAnalyses, setRecentAnalyses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecentAnalyses = async () => {
      if (!currentUser) return;

      try {
        const analysesRef = collection(db, 'analyses');
        const q = query(
          analysesRef,
          where('userId', '==', currentUser.uid),
          orderBy('timestamp', 'desc'),
          limit(5)
        );

        const querySnapshot = await getDocs(q);
        const analyses = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        setRecentAnalyses(analyses);
      } catch (error) {
        console.error('Error fetching analyses:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecentAnalyses();
  }, [currentUser]);

  return (
    <div className="min-h-screen py-12 bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Welcome back, {userData?.name?.split(' ')[0] || 'User'}! 👋
          </h1>
          <p className="text-xl text-gray-600">
            Here's your dermatology dashboard overview
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Subscription Status */}
          <div className="bg-white rounded-2xl shadow-xl p-6 border-l-4 border-blue-500">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                <FaCrown className="text-white text-xl" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Subscription</p>
                <p className="text-2xl font-bold text-gray-900 capitalize">
                  {userData?.subscription || 'Free'}
                </p>
              </div>
            </div>
          </div>

          {/* Total Analyses */}
          <div className="bg-white rounded-2xl shadow-xl p-6 border-l-4 border-green-500">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
                <FaFileAlt className="text-white text-xl" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Analyses</p>
                <p className="text-2xl font-bold text-gray-900">
                  {userData?.analysesCount || 0}
                </p>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-2xl shadow-xl p-6 border-l-4 border-purple-500">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                <FaHistory className="text-white text-xl" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Recent Reports</p>
                <p className="text-2xl font-bold text-gray-900">
                  {recentAnalyses.length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Recent Analyses */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Recent Analyses</h2>
                <Link 
                  to="/history" 
                  className="text-blue-600 hover:text-blue-700 font-semibold text-sm"
                >
                  View All →
                </Link>
              </div>

              {loading ? (
                <SkeletonTable rows={3} />
              ) : recentAnalyses.length === 0 ? (
                <div className="text-center py-12">
                  <FaFileAlt className="text-6xl text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-600 mb-4">No analyses yet</p>
                  <Link
                    to="/upload"
                    className="inline-block px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all"
                  >
                    Start Your First Analysis
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {recentAnalyses.map((analysis) => (
                    <div
                      key={analysis.id}
                      className="border-2 border-gray-200 rounded-xl p-6 hover:border-blue-300 transition-all cursor-pointer"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-4">
                          {analysis.imageUrl && (
                            <img
                              src={analysis.imageUrl}
                              alt="Analysis"
                              className="w-16 h-16 rounded-lg object-cover"
                            />
                          )}
                          <div>
                            <h3 className="font-bold text-gray-900 text-lg">
                              {analysis.disease || 'Unknown Condition'}
                            </h3>
                            <p className="text-sm text-gray-600">
                              {new Date(analysis.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-green-600">
                            {analysis.probability || 0}%
                          </div>
                          <p className="text-xs text-gray-500">Confidence</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">
                          {analysis.affectedArea || 'N/A'}
                        </span>
                        <Link
                          to="/result"
                          state={{ analysisResult: analysis }}
                          className="text-blue-600 hover:text-blue-700 font-semibold text-sm"
                        >
                          View Report →
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Quick Actions */}
          <div className="space-y-6">
            {/* Profile Card */}
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <div className="text-center mb-6">
                {userData?.photoURL ? (
                  <img
                    src={userData.photoURL}
                    alt={userData.name}
                    className="w-24 h-24 rounded-full mx-auto mb-4 object-cover border-4 border-blue-200"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-full mx-auto mb-4 bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
                    <span className="text-white font-bold text-3xl">
                      {userData?.name?.charAt(0).toUpperCase() || 'U'}
                    </span>
                  </div>
                )}
                <h3 className="text-xl font-bold text-gray-900">{userData?.name || 'User'}</h3>
                <p className="text-gray-600 text-sm">{userData?.email}</p>
              </div>

              <Link
                to="/profile"
                className="flex items-center justify-center space-x-2 w-full py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all font-semibold"
              >
                <FaUser />
                <span>Edit Profile</span>
              </Link>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Quick Actions</h3>
              <div className="space-y-3">
                <Link
                  to="/upload"
                  className="flex items-center justify-between w-full p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl hover:from-blue-100 hover:to-purple-100 transition-all group"
                >
                  <span className="font-semibold text-gray-700">New Analysis</span>
                  <span className="text-blue-600 group-hover:translate-x-1 transition-transform">→</span>
                </Link>

                <Link
                  to="/chat"
                  className="flex items-center justify-between w-full p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl hover:from-green-100 hover:to-emerald-100 transition-all group"
                >
                  <span className="font-semibold text-gray-700">AI Chat</span>
                  <span className="text-green-600 group-hover:translate-x-1 transition-transform">→</span>
                </Link>

                <Link
                  to="/history"
                  className="flex items-center justify-between w-full p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl hover:from-purple-100 hover:to-pink-100 transition-all group"
                >
                  <span className="font-semibold text-gray-700">View History</span>
                  <span className="text-purple-600 group-hover:translate-x-1 transition-transform">→</span>
                </Link>

                <Link
                  to="/settings"
                  className="flex items-center justify-between w-full p-4 bg-gradient-to-r from-gray-50 to-slate-50 rounded-xl hover:from-gray-100 hover:to-slate-100 transition-all group"
                >
                  <span className="font-semibold text-gray-700">Settings</span>
                  <span className="text-gray-600 group-hover:translate-x-1 transition-transform">→</span>
                </Link>
              </div>
            </div>

            {/* Upgrade Card */}
            {userData?.subscription === 'free' && (
              <div className="bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl shadow-xl p-8 text-white">
                <FaCrown className="text-4xl mb-4" />
                <h3 className="text-2xl font-bold mb-2">Upgrade to Premium</h3>
                <p className="text-white/90 mb-6">
                  Unlock unlimited analyses and detailed reports
                </p>
                <Link
                  to="/pricing"
                  className="block w-full py-3 bg-white text-orange-600 text-center font-bold rounded-xl hover:shadow-lg transition-all"
                >
                  View Plans
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;