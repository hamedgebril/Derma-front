import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { LanguageProvider } from './context/LanguageContext'; // ✅ جديد
import ProtectedRoute from './components/ProtectedRoute';
import ErrorBoundary from './components/ErrorBoundary';

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Pages - Auth
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import ForgotPassword from './pages/ForgotPassword';

// Pages - Main
import Home from './pages/Home';
import Pricing from './pages/Pricing';
import Dashboard from './pages/Dashboard';
import History from './pages/History';
import Profile from './pages/Profile';
import Chat from './pages/Chat';
import Upload from './pages/Upload';
import Result from './pages/Result';
import FollowUp from './pages/FollowUp';
import NotFound from './pages/NotFound';

function App() {
  return (
    <ErrorBoundary>
      <LanguageProvider> {/* ✅ جديد - يلف كل شيء */}
        <ThemeProvider>
          <AuthProvider>
            <Router>
              <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
                {/* Toast Notifications */}
                <Toaster 
                  position="top-center"
                  toastOptions={{
                    duration: 3000,
                    className: 'dark:bg-gray-800 dark:text-white',
                    style: {
                      background: '#fff',
                      color: '#363636',
                      padding: '16px',
                      borderRadius: '12px',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                    },
                    success: {
                      iconTheme: {
                        primary: '#10b981',
                        secondary: '#fff',
                      },
                    },
                    error: {
                      iconTheme: {
                        primary: '#ef4444',
                        secondary: '#fff',
                      },
                    },
                  }}
                />
                
                <Routes>
                  {/* ==================== Public Routes - Auth (No Navbar) ==================== */}
                  <Route path="/signin" element={<SignIn />} />
                  <Route path="/signup" element={<SignUp />} />
                  <Route path="/forgot-password" element={<ForgotPassword />} />

                  {/* ==================== Public Routes - With Navbar ==================== */}
                  <Route path="/" element={
                    <>
                      <Navbar />
                      <Home />
                      <Footer />
                    </>
                  } />

                  <Route path="/pricing" element={
                    <>
                      <Navbar />
                      <Pricing />
                      <Footer />
                    </>
                  } />

                  {/* ==================== Protected Routes ==================== */}
                  <Route path="/dashboard" element={
                    <ProtectedRoute>
                      <Navbar />
                      <Dashboard />
                      <Footer />
                    </ProtectedRoute>
                  } />

                  <Route path="/history" element={
                    <ProtectedRoute>
                      <Navbar />
                      <History />
                      <Footer />
                    </ProtectedRoute>
                  } />

                  <Route path="/profile" element={
                    <ProtectedRoute>
                      <Navbar />
                      <Profile />
                      <Footer />
                    </ProtectedRoute>
                  } />

                  <Route path="/upload" element={
                    <ProtectedRoute>
                      <Navbar />
                      <Upload />
                      <Footer />
                    </ProtectedRoute>
                  } />

                  <Route path="/chat" element={
                    <ProtectedRoute>
                      <Navbar />
                      <Chat />
                      <Footer />
                    </ProtectedRoute>
                  } />

                  <Route path="/result" element={
                    <ProtectedRoute>
                      <Navbar />
                      <Result />
                      <Footer />
                    </ProtectedRoute>
                  } />

                  <Route path="/followup" element={
                    <ProtectedRoute>
                      <Navbar />
                      <FollowUp />
                      <Footer />
                    </ProtectedRoute>
                  } />

                  {/* ==================== 404 Not Found ==================== */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </div>
            </Router>
          </AuthProvider>
        </ThemeProvider>
      </LanguageProvider> {/* ✅ إغلاق */}
    </ErrorBoundary>
  );
}

export default App;