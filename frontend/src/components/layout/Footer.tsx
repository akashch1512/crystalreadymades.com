import React from 'react';
import { Link } from 'react-router-dom';
import {
  Facebook,
  Instagram,
  Twitter,
  Mail,
  Phone,
  MapPin,
  Github,
  Linkedin
} from 'lucide-react';

// Custom WhatsApp Icon Component
const WhatsAppIcon = ({ size = 20, className = "" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M3 21l1.65-3.8a9 9 0 1 1 3.4 2.9L3 21" />
  </svg>
);

const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-950 text-white py-12 border-t border-gray-900 relative overflow-hidden">

      {/* Background glow effect */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-1 bg-gradient-to-r from-transparent via-pink-900/50 to-transparent"></div>

      <div className="container mx-auto px-4">

        {/* --- Main Grid Section --- */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 mb-12">

          {/* 1. Brand, Socials & Developer Card */}
          {/* UPDATED: Added 'items-center text-center' for mobile centering, reset with 'lg:items-start lg:text-left' for desktop */}
          <div className="col-span-2 lg:col-span-1 flex flex-col space-y-6 items-center text-center lg:items-start lg:text-left">

            {/* Logo */}
            <div>
              <h3 className="text-2xl font-bold">
                <span className="text-pink-500">Logo</span>
                <span className="text-white">Here</span>
              </h3>
            </div>

            {/* Social Icons */}
            <div className="flex space-x-4">
              <a href="#" className="text-gray-500 hover:text-pink-500 transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-gray-500 hover:text-pink-500 transition-colors">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-gray-500 hover:text-pink-500 transition-colors">
                <Twitter size={20} />
              </a>
            </div>

            {/* --- DEVELOPER CARD --- */}
            <div className="pt-2">
              <div className="group relative bg-gray-900/50 backdrop-blur-sm border border-gray-800 hover:border-pink-500/50 rounded-xl px-4 py-3 flex flex-row items-center gap-3 transition-all duration-300 shadow-lg hover:shadow-pink-900/20 w-fit sm:w-max">

                {/* Developer Text */}
                <div className="flex flex-col text-left">
                  <p className="text-[10px] uppercase tracking-widest text-gray-500 font-medium leading-tight">Developed By</p>
                  <p className="text-white font-bold text-sm tracking-wide">Akash Chaudhari</p>
                </div>

                {/* Vertical Divider */}
                <div className="w-px h-8 bg-gray-800 mx-1 group-hover:bg-gray-700 transition-colors"></div>

                {/* Dev Social Links */}
                <div className="flex items-center space-x-2">
                  <a href="https://github.com/yourusername" target="_blank" rel="noreferrer" className="text-gray-500 hover:text-white hover:scale-110 transition-all">
                    <Github size={16} />
                  </a>
                  <a href="https://linkedin.com/in/yourusername" target="_blank" rel="noreferrer" className="text-gray-500 hover:text-blue-400 hover:scale-110 transition-all">
                    <Linkedin size={16} />
                  </a>
                  <a href="https://wa.me/919999999999" target="_blank" rel="noreferrer" className="text-gray-500 hover:text-green-400 hover:scale-110 transition-all">
                    <WhatsAppIcon size={16} />
                  </a>
                </div>
              </div>
            </div>

          </div>

          {/* 2. Terms */}
          <div className="col-span-1">
            <h4 className="text-lg font-semibold mb-4 text-gray-100">Terms</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <Link to="/terms#privacy" className="hover:text-pink-400 transition-colors">Privacy Policy</Link>
              </li>
              <li>
                <Link to="/terms#terms" className="hover:text-pink-400 transition-colors">Terms of Service</Link>
              </li>
              <li>
                <Link to="/terms#refund" className="hover:text-pink-400 transition-colors">Refund Policy</Link>
              </li>
            </ul>
          </div>

          {/* 3. Support */}
          <div className="col-span-1">
            <h4 className="text-lg font-semibold mb-4 text-gray-100">Support</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link to="/aboutus#contact" className="hover:text-pink-400 transition-colors">Contact Us</Link></li>
              <li><Link to="/faq" className="hover:text-pink-400 transition-colors">FAQ</Link></li>
            </ul>
          </div>

          {/* 4. Newsletter */}
          <div className="col-span-2 lg:col-span-1">
            <h4 className="text-lg font-semibold mb-4 text-gray-100">Stay Updated</h4>
            <form className="flex flex-col space-y-3">
              <input
                type="email"
                placeholder="Email address"
                className="w-full px-4 py-2 rounded bg-gray-900 border border-gray-800 text-sm text-gray-300 focus:outline-none focus:border-pink-500 transition-colors"
              />
              <button
                type="submit"
                className="w-full bg-pink-600 hover:bg-pink-700 text-white font-medium py-2 rounded transition-colors text-sm"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* --- Bottom Divider & Copyright --- */}
        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center text-gray-600 text-xs">

            {/* Contact Info Row */}
            <div className="flex flex-col sm:flex-row sm:space-x-6 space-y-3 sm:space-y-0 mb-4 md:mb-0 text-center sm:text-left w-full sm:w-auto">
              <div className="flex items-center justify-center sm:justify-start hover:text-gray-400 transition-colors">
                <Mail size={14} className="mr-2" />
                <span>support@crystalreadymade.com</span>
              </div>

              <div className="flex items-center justify-center sm:justify-start hover:text-gray-400 transition-colors">
                <Phone size={14} className="mr-2" />
                <span>+1 (555) 123-4567</span>
              </div>

              <a
                href="https://maps.app.goo.gl/wUsoxoV9gkfz56gC9"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center sm:justify-start hover:text-gray-400 transition-colors mx-auto sm:mx-0"
              >
                <MapPin size={14} className="mr-2 flex-shrink-0" />
                <span className="truncate max-w-[200px] sm:max-w-none sm:whitespace-normal text-left">
                  Aurangapura Rd, Gulmandi, Chhatrapati Sambhajinagar
                </span>
              </a>
            </div>

            <p className="mt-4 md:mt-0">© {new Date().getFullYear()} CrystalReadymade</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;