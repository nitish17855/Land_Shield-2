import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Shield, User, LogOut, Compass } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Header({ onContactClick }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();

  const handleDemoClick = () => {
    if (isAuthenticated) {
      navigate('/demo');
    } else {
      navigate('/signin?redirect=/demo');
    }
  };

  return (
    <header className="fixed w-full z-50 glass-panel border-b border-white/20 px-6 py-4 flex justify-between items-center top-0 transition-all duration-300">
      <Link to="/" className="flex items-center gap-2">
        <div className="bg-landgreen-900 p-1.5 rounded-lg text-white shadow-md">
          <Shield size={24} />
        </div>
        <span className="font-serif font-bold text-2xl text-landgreen-900 tracking-tight">LandShield</span>
      </Link>

      <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600">
        <a href="#product" className="hover:text-landgreen-700 transition">Product <span className="text-xs">▼</span></a>
        <a href="#how-it-works" className="hover:text-landgreen-700 transition">How it Works</a>
        <button
          onClick={handleDemoClick}
          className="hover:text-landgreen-700 transition font-semibold text-landgreen-900 flex items-center gap-1.5"
        >
          <Compass size={16} />
          <span>Cadastral Demo</span>
        </button>
      </nav>

      <div className="flex items-center gap-3">
        {isAuthenticated ? (
          <div className="flex items-center gap-3">
            <Link
              to="/demo"
              className="px-4 py-2 text-xs font-semibold text-landgreen-900 bg-landgreen-50 border border-landgreen-200 rounded-full hover:bg-landgreen-100 transition flex items-center gap-1.5"
            >
              <Compass size={14} />
              <span>Launch App</span>
            </Link>
            <div className="flex items-center gap-2 pl-2 border-l border-gray-200">
              <div className="w-8 h-8 rounded-full bg-landgreen-900 text-white flex items-center justify-center font-bold text-xs">
                {user?.name ? user.name.charAt(0) : 'U'}
              </div>
              <button
                onClick={logout}
                title="Sign out"
                className="p-1.5 text-gray-400 hover:text-red-600 rounded-full transition"
              >
                <LogOut size={16} />
              </button>
            </div>
          </div>
        ) : (
          <>
            {location.pathname !== '/signin' && (
              <Link to="/signin" className="px-5 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-full hover:bg-gray-50 transition shadow-sm">
                Sign In
              </Link>
            )}
            <button
              onClick={handleDemoClick}
              className="px-6 py-2 text-sm font-medium text-white bg-landgreen-900 rounded-full hover:bg-landgreen-700 transition shadow-lg shadow-landgreen-900/30 flex items-center gap-1"
            >
              <span>Demo</span> <span className="ml-1">→</span>
            </button>
          </>
        )}
      </div>
    </header>
  );
}
