import React from 'react';
import { Link } from 'react-router-dom';
import { 
  FaFacebook, 
  FaTwitter, 
  FaInstagram, 
  FaLinkedin, 
  FaYoutube,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt
} from 'react-icons/fa';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-br from-[#0a0e27] via-[#0d1235] to-[#0a0e27] text-gray-300 pt-16 pb-8 border-t border-slate-700/30">
      <div className="container mx-auto px-6 lg:px-12 max-w-7xl">
        
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          
          {/* Brand Section - Column 1 */}
          <div className="space-y-6">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30">
                <svg className="w-7 h-7 text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20Z" fill="currentColor"/>
                  <path d="M12 6C8.69 6 6 8.69 6 12C6 15.31 8.69 18 12 18C15.31 18 18 15.31 18 12C18 8.69 15.31 6 12 6ZM12 16C9.79 16 8 14.21 8 12C8 9.79 9.79 8 12 8C14.21 8 16 9.79 16 12C16 14.21 14.21 16 12 16Z" fill="currentColor"/>
                </svg>
              </div>
              <span className="text-2xl font-bold text-white tracking-tight">DERMAVISION</span>
            </div>

            {/* Description */}
            <p className="text-gray-400 leading-relaxed text-sm pr-4">
              AI-powered platform for advanced skin disease detection and analysis. 
              Professional dermatological screening at your fingertips.
            </p>

            {/* Social Media Icons */}
            <div className="flex space-x-3">
              <a 
                href="https://facebook.com" 
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-slate-700/40 hover:bg-blue-600 rounded-lg flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-blue-500/30 group"
                aria-label="Facebook"
              >
                <FaFacebook className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
              </a>
              <a 
                href="https://twitter.com" 
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-slate-700/40 hover:bg-blue-400 rounded-lg flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-blue-400/30 group"
                aria-label="Twitter"
              >
                <FaTwitter className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
              </a>
              <a 
                href="https://instagram.com" 
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-slate-700/40 hover:bg-pink-600 rounded-lg flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-pink-500/30 group"
                aria-label="Instagram"
              >
                <FaInstagram className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
              </a>
              <a 
                href="https://linkedin.com" 
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-slate-700/40 hover:bg-blue-700 rounded-lg flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-blue-700/30 group"
                aria-label="LinkedIn"
              >
                <FaLinkedin className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
              </a>
              <a 
                href="https://youtube.com" 
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-slate-700/40 hover:bg-red-600 rounded-lg flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-red-500/30 group"
                aria-label="YouTube"
              >
                <FaYoutube className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
              </a>
            </div>
          </div>

          {/* Quick Links - Column 2 */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-6">
              Quick Links
            </h3>
            <ul className="space-y-3.5">
              <li>
                <Link 
                  to="/" 
                  className="text-gray-400 hover:text-blue-400 transition-colors duration-200 text-sm hover:translate-x-1 inline-block"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link 
                  to="/about" 
                  className="text-gray-400 hover:text-blue-400 transition-colors duration-200 text-sm hover:translate-x-1 inline-block"
                >
                  About
                </Link>
              </li>
              <li>
                <Link 
                  to="/upload" 
                  className="text-gray-400 hover:text-blue-400 transition-colors duration-200 text-sm hover:translate-x-1 inline-block"
                >
                  Features
                </Link>
              </li>
              <li>
                <Link 
                  to="/dashboard" 
                  className="text-gray-400 hover:text-blue-400 transition-colors duration-200 text-sm hover:translate-x-1 inline-block"
                >
                  Disease Type
                </Link>
              </li>
              <li>
                <Link 
                  to="/history" 
                  className="text-gray-400 hover:text-blue-400 transition-colors duration-200 text-sm hover:translate-x-1 inline-block"
                >
                  FAQs
                </Link>
              </li>
              <li>
                <Link 
                  to="/pricing" 
                  className="text-gray-400 hover:text-blue-400 transition-colors duration-200 text-sm hover:translate-x-1 inline-block"
                >
                  Pricing
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources - Column 3 */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-6">
              Resources
            </h3>
            <ul className="space-y-3.5">
              <li>
                <Link 
                  to="/docs" 
                  className="text-gray-400 hover:text-blue-400 transition-colors duration-200 text-sm hover:translate-x-1 inline-block"
                >
                  Documentation
                </Link>
              </li>
              <li>
                <Link 
                  to="/api" 
                  className="text-gray-400 hover:text-blue-400 transition-colors duration-200 text-sm hover:translate-x-1 inline-block"
                >
                  API Reference
                </Link>
              </li>
              <li>
                <Link 
                  to="/privacy" 
                  className="text-gray-400 hover:text-blue-400 transition-colors duration-200 text-sm hover:translate-x-1 inline-block"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link 
                  to="/terms" 
                  className="text-gray-400 hover:text-blue-400 transition-colors duration-200 text-sm hover:translate-x-1 inline-block"
                >
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link 
                  to="/cookies" 
                  className="text-gray-400 hover:text-blue-400 transition-colors duration-200 text-sm hover:translate-x-1 inline-block"
                >
                  Cookie Policy
                </Link>
              </li>
              <li>
                <Link 
                  to="/support" 
                  className="text-gray-400 hover:text-blue-400 transition-colors duration-200 text-sm hover:translate-x-1 inline-block"
                >
                  Support Center
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Us - Column 4 */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-6">
              Contact Us
            </h3>
            <ul className="space-y-4">
              {/* Email */}
              <li className="flex items-start space-x-3 group">
                <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-blue-500/20 transition-colors">
                  <FaEnvelope className="w-4 h-4 text-blue-400" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-0.5">Email</p>
                  <a 
                    href="mailto:support@skindetect.ai" 
                    className="text-gray-300 hover:text-blue-400 transition-colors text-sm"
                  >
                    support@skindetect.ai
                  </a>
                </div>
              </li>

              {/* Phone */}
              <li className="flex items-start space-x-3 group">
                <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-blue-500/20 transition-colors">
                  <FaPhone className="w-4 h-4 text-blue-400" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-0.5">Phone</p>
                  <a 
                    href="tel:+1234567890" 
                    className="text-gray-300 hover:text-blue-400 transition-colors text-sm"
                  >
                    +1 (234) 567-890
                  </a>
                </div>
              </li>

              {/* Address */}
              <li className="flex items-start space-x-3 group">
                <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-blue-500/20 transition-colors">
                  <FaMapMarkerAlt className="w-4 h-4 text-blue-400" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-0.5">Address</p>
                  <p className="text-gray-300 text-sm leading-relaxed">
                    123 Medical Tech Plaza<br />
                    San Francisco, CA 94105
                  </p>
                </div>
              </li>
            </ul>
          </div>

        </div>

        {/* Medical Disclaimer Section */}
        <div className="border-t border-b border-slate-700/30 py-6 mb-6">
          <div className="bg-gradient-to-r from-red-900/20 via-red-800/30 to-red-900/20 border border-red-500/30 rounded-xl p-5">
            <h4 className="text-red-400 font-semibold mb-3 flex items-center text-base">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              Medical Disclaimer
            </h4>
            <p className="text-gray-400 text-sm leading-relaxed">
              SkinDetect AI is designed for informational and educational purposes only. This platform does not provide medical advice, diagnosis, or treatment. The AI-generated reports and recommendations are not a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition. Never disregard professional medical advice or delay in seeking it because of information provided by this platform. If you think you may have a medical emergency, call your doctor or emergency services immediately.
            </p>
          </div>
        </div>

        {/* Bottom Bar - Copyright & Links */}
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0 pt-6">
          <p className="text-gray-500 text-sm">
            © {currentYear} DERMAVISION. All rights reserved.
          </p>
          
          <div className="flex flex-wrap justify-center gap-6 text-sm">
            <Link 
              to="/privacy" 
              className="text-gray-500 hover:text-blue-400 transition-colors"
            >
              Privacy Policy
            </Link>
            <Link 
              to="/terms" 
              className="text-gray-500 hover:text-blue-400 transition-colors"
            >
              Terms of Service
            </Link>
            <Link 
              to="/hipaa" 
              className="text-gray-500 hover:text-blue-400 transition-colors"
            >
              HIPAA Compliance
            </Link>
            <Link 
              to="/accessibility" 
              className="text-gray-500 hover:text-blue-400 transition-colors"
            >
              Accessibility
            </Link>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;