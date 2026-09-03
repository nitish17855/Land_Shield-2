import React from 'react';

export default function ContactFooter({ onContactClick }) {
  return (
    <section className="relative py-32 px-6 lg:px-24 flex items-center min-h-[60vh] overflow-hidden">
      <div className="absolute inset-0 z-0 bg-landgreen-900">
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
        <img 
          src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=2832&auto=format&fit=crop" 
          alt="Estate at sunset" 
          className="w-full h-full object-cover object-bottom opacity-50 sepia-[.3] hue-rotate-[-30deg]"
        />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto text-center w-full">
        <div className="w-16 h-16 mx-auto mb-8 border border-white/20 rounded-full flex items-center justify-center glass-panel">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
        </div>
        
        <h2 className="text-5xl md:text-6xl font-serif text-white mb-6 drop-shadow-lg">
          Contact us today
        </h2>
        
        <p className="text-xl text-white/90 font-light mb-12 max-w-2xl mx-auto">
          Our team is dedicated to assisting you with transparency and confidence.
        </p>
        
        <button 
          onClick={onContactClick}
          className="px-10 py-4 bg-white text-landgreen-900 rounded-full font-medium hover:bg-gray-100 transition shadow-2xl flex items-center gap-2 mx-auto group"
        >
          Send us a message
          <span className="group-hover:translate-x-1 transition-transform">→</span>
        </button>
      </div>
      
      {/* Footer bottom bar style matching the image */}
      <div className="absolute bottom-8 left-6 right-6 lg:left-24 lg:right-24 glass-panel bg-black/40 border-white/10 rounded-2xl p-6 flex flex-wrap gap-8 justify-between z-10 text-white/80">
        <div className="flex items-center gap-3 text-sm">
          <div className="p-2 border border-white/20 rounded-lg">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
          </div>
          <div>
            <p className="font-semibold text-white">Trusted Security</p>
            <p className="text-white/60 text-xs">Data verified & protected</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3 text-sm">
          <div className="p-2 border border-white/20 rounded-lg">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z"></path></svg>
          </div>
          <div>
            <p className="font-semibold text-white">Expert Support</p>
            <p className="text-white/60 text-xs">Assistance when you need it</p>
          </div>
        </div>
      </div>
    </section>
  );
}
