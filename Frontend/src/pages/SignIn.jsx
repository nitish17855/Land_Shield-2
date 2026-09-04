import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Shield, Lock, Mail, User, AlertCircle, CheckCircle2 } from 'lucide-react';
import { GoogleLogin } from '@react-oauth/google';
import { useAuth } from '../context/AuthContext';

export default function SignIn() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { login, register, googleLogin } = useAuth();

  const [isSignUp, setIsSignUp] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const redirectPath = searchParams.get('redirect') || '/karnataka/survey-documents';

  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');
    setIsLoading(true);

    try {
      if (isSignUp) {
        if (!name.trim()) {
          setErrorMessage('Please enter your full name.');
          setIsLoading(false);
          return;
        }
        if (password.length < 6) {
          setErrorMessage('Password must be at least 6 characters.');
          setIsLoading(false);
          return;
        }

        const res = await register(name, email, password);
        if (res.success) {
          setSuccessMessage('Account created successfully! Redirecting...');
          setTimeout(() => {
            navigate(redirectPath);
          }, 800);
        } else {
          setErrorMessage(res.error || 'Failed to create account.');
        }
      } else {
        const res = await login(email, password);
        if (res.success) {
          setSuccessMessage('Signed in successfully! Redirecting...');
          setTimeout(() => {
            navigate(redirectPath);
          }, 800);
        } else {
          setErrorMessage(res.error || 'Invalid email or password.');
        }
      }
    } catch (err) {
      setErrorMessage(err.message || 'An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    setErrorMessage('');
    setSuccessMessage('');
    setIsLoading(true);

    try {
      const res = await googleLogin(credentialResponse.credential);
      if (res.success) {
        setSuccessMessage('Google authentication successful! Redirecting...');
        setTimeout(() => {
          navigate(redirectPath);
        }, 800);
      } else {
        setErrorMessage(res.error || 'Google login failed.');
      }
    } catch (err) {
      setErrorMessage(err.message || 'Failed to authenticate with Google.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleError = () => {
    setErrorMessage('Google Sign-In was cancelled or failed. Please try again.');
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
            onClick={() => {
              setIsSignUp(!isSignUp);
              setErrorMessage('');
              setSuccessMessage('');
            }}
            className="font-semibold text-landgreen-700 hover:text-landgreen-900 underline underline-offset-4 ml-1"
          >
            {isSignUp ? 'Sign In instead' : 'Create an account'}
          </button>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 sm:px-10 shadow-xl rounded-3xl border border-gray-100">

          {/* Feedback Alert Messages */}
          {errorMessage && (
            <div className="mb-5 p-3.5 bg-red-50 border border-red-200 rounded-xl flex items-start gap-2.5 text-xs text-red-700">
              <AlertCircle size={16} className="shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="mb-5 p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl flex items-start gap-2.5 text-xs text-emerald-800">
              <CheckCircle2 size={16} className="shrink-0 mt-0.5" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* Email & Password Form */}
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

          {/* Social OAuth Divider */}
          <div className="mt-6">
            <div className="relative flex items-center justify-center">
              <div className="w-full border-t border-gray-200" />
              <span className="px-3 bg-white text-xs text-gray-400 uppercase tracking-widest font-medium absolute">
                Or continue with Google
              </span>
            </div>

            {/* Real Google OAuth Button */}
            <div className="mt-6 flex justify-center">
              <div className="w-full flex justify-center">
                <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onError={handleGoogleError}
                  useOneTap={false}
                  theme="outline"
                  size="large"
                  shape="rectangular"
                  text={isSignUp ? 'signup_with' : 'signin_with'}
                  width="100%"
                />
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
