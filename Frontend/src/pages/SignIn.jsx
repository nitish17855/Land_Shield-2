import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Shield, CheckCircle, ArrowRight, Lock, Mail, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function SignIn() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { login } = useAuth();

  const [isSignUp, setIsSignUp] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const redirectPath = searchParams.get('redirect') || '/demo';

  const handleAuthSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      login({
        name: name || (isSignUp ? 'New Member' : 'Nitish Tripathi'),
        email: email || 'user@landshield.in',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=120&auto=format&fit=crop'
      });
      setIsLoading(false);
      navigate(redirectPath);
    }, 600);
  };

  const handleOAuthLogin = (provider) => {
    setIsLoading(true);
    setTimeout(() => {
      login({
        name: provider === 'Google' ? 'Google User' : 'LinkedIn Executive',
        email: `${provider.toLowerCase()}user@landshield.in`,
        provider
      });
      setIsLoading(false);
      navigate(redirectPath);
    }, 600);
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex flex-col justify-center py-16 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link to="/" className="inline-flex justify-center items-center gap-2 mb-6 group">
          <div className="bg-landgreen-900 p-2.5 rounded-2xl text-white shadow-lg shadow-landgreen-900/30 group-hover:scale-105 transition">
            <Shield size={28} />
          </div>
          <span className="font-serif font-bold text-3xl text-landgreen-900">LandShield</span>
        </Link>
        <h2 className="text-3xl md:text-4xl font-serif text-landgreen-900 font-bold mb-2">
          {isSignUp ? 'Create your LandShield Account' : 'Welcome back'}
        </h2>
        <p className="text-sm text-gray-600">
          {isSignUp ? 'Already have an account?' : "Don't have an account yet?"}{' '}
          <button
            type="button"
            onClick={() => setIsSignUp(!isSignUp)}
            className="font-semibold text-landgreen-700 hover:text-landgreen-900 underline underline-offset-4 ml-1"
          >
            {isSignUp ? 'Sign In instead' : 'Create an account'}
          </button>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 sm:px-10 shadow-xl rounded-3xl border border-gray-100">
          
          {/* Quick Demo Access banner */}
          <div className="mb-6 p-3.5 bg-landgreen-50 border border-landgreen-100 rounded-2xl flex items-center justify-between">
            <div className="text-xs text-landgreen-900">
              <span className="font-bold block">Instant Demo Access</span>
              <span>Test LandShield Karnataka Cadastral Explorer</span>
            </div>
            <button
              onClick={() => handleOAuthLogin('Demo')}
              className="px-3 py-1.5 bg-landgreen-900 hover:bg-landgreen-800 text-white rounded-xl text-xs font-semibold flex items-center gap-1 transition shadow-sm"
            >
              <span>Quick Login</span>
              <ArrowRight size={13} />
            </button>
          </div>

          <form className="space-y-4" onSubmit={handleAuthSubmit}>
            {isSignUp && (
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 mb-1.5">
                  Full Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                    <User size={18} />
                  </div>
                  <input
                    type="text"
                    required={isSignUp}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Nitish Tripathi"
                    className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl shadow-sm placeholder-gray-400 focus:ring-2 focus:ring-landgreen-700 focus:border-landgreen-700 text-sm outline-none transition"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 mb-1.5">
                Email address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                  <Mail size={18} />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl shadow-sm placeholder-gray-400 focus:ring-2 focus:ring-landgreen-700 focus:border-landgreen-700 text-sm outline-none transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 mb-1.5">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                  <Lock size={18} />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl shadow-sm placeholder-gray-400 focus:ring-2 focus:ring-landgreen-700 focus:border-landgreen-700 text-sm outline-none transition"
                />
              </div>
            </div>

            {!isSignUp && (
              <div className="flex items-center justify-between text-xs pt-1">
                <label className="flex items-center gap-2 cursor-pointer text-gray-600">
                  <input type="checkbox" defaultChecked className="rounded text-landgreen-700 focus:ring-landgreen-700" />
                  <span>Remember me</span>
                </label>
                <a href="#forgot" className="font-semibold text-landgreen-700 hover:text-landgreen-900">
                  Forgot password?
                </a>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 py-3.5 px-4 bg-landgreen-900 hover:bg-landgreen-800 text-white rounded-xl font-semibold shadow-lg shadow-landgreen-900/20 flex items-center justify-center gap-2 transition disabled:opacity-75"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <span>{isSignUp ? 'Create Account' : 'Sign In'}</span>
              )}
            </button>
          </form>

          <div className="mt-6">
            <div className="relative flex items-center justify-center">
              <div className="w-full border-t border-gray-200" />
              <span className="px-3 bg-white text-xs text-gray-400 uppercase tracking-widest font-medium absolute">
                Or continue with
              </span>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => handleOAuthLogin('Google')}
                className="w-full inline-flex justify-center items-center gap-2 py-2.5 px-4 border border-gray-200 rounded-xl shadow-sm bg-white text-xs font-semibold text-gray-700 hover:bg-gray-50 transition"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    fill="#EA4335"
                    d="M12 5c1.54 0 2.94.55 4.04 1.46l3.02-3.02C17.2 1.7 14.77 1 12 1 7.42 1 3.48 3.59 1.54 7.36l3.66 2.84C6.07 7.41 8.78 5 12 5z"
                  />
                  <path
                    fill="#4285F4"
                    d="M23.49 12.28c0-.8-.07-1.57-.2-2.28H12v4.51h6.47c-.29 1.48-1.14 2.73-2.4 3.58l3.71 2.88c2.16-2 3.71-4.94 3.71-8.69z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.2 14.8c-.25-.74-.39-1.54-.39-2.37s.14-1.63.39-2.37L1.54 7.22C.56 9.17 0 11.02 0 12.43s.56 3.26 1.54 5.21l3.66-2.84z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23.86c3.24 0 5.95-1.08 7.93-2.93l-3.71-2.88c-1.08.73-2.46 1.16-4.22 1.16-3.22 0-5.93-2.41-6.8-5.7L1.54 16.35C3.48 20.27 7.42 23.86 12 23.86z"
                  />
                </svg>
                <span>Google</span>
              </button>

              <button
                type="button"
                onClick={() => handleOAuthLogin('LinkedIn')}
                className="w-full inline-flex justify-center items-center gap-2 py-2.5 px-4 border border-gray-200 rounded-xl shadow-sm bg-white text-xs font-semibold text-gray-700 hover:bg-gray-50 transition"
              >
                <svg className="w-4 h-4 text-[#0A66C2]" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 8.76a1.64 1.64 0 1 0 0-3.28 1.64 1.64 0 0 0 0 3.28M7.86 18.5V10.13H5.07V18.5h2.79z" />
                </svg>
                <span>LinkedIn</span>
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
