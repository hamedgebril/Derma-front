import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaBrain, FaBars, FaTimes, FaUser, FaSignOutAlt, FaHistory, FaCog } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import ThemeToggle from './ThemeToggle';
import LanguageSwitcher from './LanguageSwitcher'; // ✅ جديد
import { useTranslation } from '../hooks/useTranslation'; // ✅ جديد

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const { currentUser, userData, logout } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation(); // ✅ جديد

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <nav className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md shadow-lg sticky top-0 z-50 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 rtl:space-x-reverse group">
            <FaBrain className="text-3xl text-blue-600 dark:text-blue-400 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors" />
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
              DERMAVISION
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8 rtl:space-x-reverse">
            <Link to="/" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition">
              {t.navbar.home}
            </Link>
            <a href="/#pricing" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition">
              {t.navbar.pricing}
            </a>
            {currentUser && (
              <>
                <Link to="/upload" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition">
                  {t.navbar.diagnose}
                </Link>
                <Link to="/chat" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition">
                  {t.navbar.aiChat}
                </Link>
              </>
            )}
          </div>

          {/* User Section */}
          <div className="hidden md:flex items-center space-x-3 rtl:space-x-reverse">
            {/* ✅ Language Switcher */}
            <LanguageSwitcher />
            
            {/* Theme Toggle */}
            <ThemeToggle />

            {currentUser ? (
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center space-x-3 rtl:space-x-reverse px-4 py-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                >
                  {userData?.photoURL ? (
                    <img 
                      src={userData.photoURL} 
                      alt={userData.name}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-sm">
                        {userData?.name?.charAt(0).toUpperCase() || 'U'}
                      </span>
                    </div>
                  )}
                  <span className="font-semibold text-gray-700 dark:text-gray-300">
                    {userData?.name?.split(' ')[0] || 'User'}
                  </span>
                </button>

                {/* Dropdown Menu */}
                {showUserMenu && (
                  <div className="absolute right-0 rtl:right-auto rtl:left-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-xl shadow-xl py-2 border border-gray-200 dark:border-gray-700">
                    <Link
                      to="/dashboard"
                      className="flex items-center space-x-3 rtl:space-x-reverse px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 transition text-gray-700 dark:text-gray-300"
                      onClick={() => setShowUserMenu(false)}
                    >
                      <FaUser className="text-gray-600 dark:text-gray-400" />
                      <span>{t.navbar.dashboard}</span>
                    </Link>
                    <Link
                      to="/history"
                      className="flex items-center space-x-3 rtl:space-x-reverse px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 transition text-gray-700 dark:text-gray-300"
                      onClick={() => setShowUserMenu(false)}
                    >
                      <FaHistory className="text-gray-600 dark:text-gray-400" />
                      <span>{t.navbar.history}</span>
                    </Link>
                    <Link
                      to="/profile"
                      className="flex items-center space-x-3 rtl:space-x-reverse px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 transition text-gray-700 dark:text-gray-300"
                      onClick={() => setShowUserMenu(false)}
                    >
                      <FaCog className="text-gray-600 dark:text-gray-400" />
                      <span>{t.navbar.settings}</span>
                    </Link>
                    <hr className="my-2 border-gray-200 dark:border-gray-700" />
                    <button
                      onClick={handleLogout}
                      className="flex items-center space-x-3 rtl:space-x-reverse px-4 py-2 hover:bg-red-50 dark:hover:bg-red-900/20 transition w-full text-left rtl:text-right"
                    >
                      <FaSignOutAlt className="text-red-600" />
                      <span className="text-red-600">{t.navbar.logout}</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link 
                  to="/signin" 
                  className="px-6 py-2 text-blue-600 dark:text-blue-400 font-semibold hover:text-blue-700 dark:hover:text-blue-300 transition"
                >
                  {t.navbar.signIn}
                </Link>
                <Link 
                  to="/signup" 
                  className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full font-semibold hover:shadow-xl hover:scale-105 transition-all"
                >
                  {t.navbar.getStarted}
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-2 rtl:space-x-reverse">
            {/* ✅ Language Switcher Mobile */}
            <LanguageSwitcher />
            <ThemeToggle />
            <button 
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-700 dark:text-gray-300 text-2xl"
            >
              {isOpen ? <FaTimes /> : <FaBars />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white dark:bg-gray-900 border-t dark:border-gray-800">
          <Link to="/" className="block px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-gray-800">
            {t.navbar.home}
          </Link>
          <a href="/#pricing" className="block px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-gray-800">
            {t.navbar.pricing}
          </a>
          {currentUser ? (
            <>
              <Link to="/upload" className="block px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-gray-800">
                {t.navbar.diagnose}
              </Link>
              <Link to="/chat" className="block px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-gray-800">
                {t.navbar.aiChat}
              </Link>
              <Link to="/dashboard" className="block px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-gray-800">
                {t.navbar.dashboard}
              </Link>
              <Link to="/history" className="block px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-gray-800">
                {t.navbar.history}
              </Link>
              <button 
                onClick={handleLogout}
                className="block w-full text-left rtl:text-right px-4 py-3 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
              >
                {t.navbar.logout}
              </button>
            </>
          ) : (
            <>
              <Link to="/signin" className="block px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-gray-800">
                {t.navbar.signIn}
              </Link>
              <Link to="/signup" className="block px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-gray-800">
                {t.navbar.getStarted}
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;