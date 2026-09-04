import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Hero() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const handleDemoClick = () => {
    if (isAuthenticated) {
      navigate('/karnataka/survey-documents');
    } else {
      navigate('/signin?redirect=/karnataka/survey-documents');
    }
  };

  return (
    <section className="relative pt-16 pb-32 px-6 lg:px-24 flex items-center min-h-[80vh] overflow-hidden">
      {/* Background with a premium gradient overlay and nature image feeling */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-r from-[#f4f7f6] via-[#f4f7f6]/90 to-transparent z-10" />
        <img 
          src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=2832&auto=format&fit=crop" 
          alt="Lush green land" 
          className="w-full h-full object-cover object-center"
        />
      </div>

      <div className="relative z-10 max-w-3xl">
        <div className="flex gap-4 text-xs font-semibold tracking-widest text-gray-500 uppercase mb-6">
          <span>Verify</span>
          <span>/</span>
          <span>Analyze</span>
          <span>/</span>
          <span>Buy with confidence</span>
        </div>

        <h1 className="text-5xl md:text-7xl font-serif text-landgreen-900 leading-[1.1] mb-6">
          Know what you're <br />
          buying — before <br />
          you buy it.
        </h1>

        <p className="text-lg text-gray-700 max-w-xl mb-10 leading-relaxed font-light">
          Verify land ownership, documents, and property records before you make a decision. 
          LandShield brings the evidence together so you can see what's verified, what's missing, 
          and what needs attention.
        </p>

        <div className="flex flex-wrap items-center gap-4">
          <button 
            onClick={handleDemoClick}
            className="px-8 py-3.5 bg-landgreen-900 text-white rounded-xl font-medium hover:bg-landgreen-700 transition shadow-xl shadow-landgreen-900/20 flex items-center gap-2 cursor-pointer"
          >
            Demo <span className="text-xl leading-none">→</span>
          </button>
        </div>

        <div className="mt-10 flex items-center gap-3 text-sm font-medium text-gray-600">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
          Built for buyers, investors, lenders, and property professionals.
        </div>
      </div>
    </section>
  );
}
