import React, { useState } from 'react';

export default function ContactModal({ onClose }) {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: '' });
  const [status, setStatus] = useState('idle');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');
    
    try {
      const rawBase = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/+$/, '');
      const endpoint = rawBase ? `${rawBase}/api/contact` : '/api/contact';
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      if (res.ok) {
        setStatus('success');
        setTimeout(() => onClose(), 2000);
      } else {
        setStatus('error');
      }
    } catch (err) {
      setStatus('error');
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="bg-landgreen-900 p-6 text-white text-center">
          <h2 className="text-2xl font-serif mb-1">Get in Touch</h2>
          <p className="text-white/80 text-sm font-light">We'll get back to you as soon as possible.</p>
        </div>
        
        <form onSubmit={handleSubmit} className="p-8">
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <input 
                type="text" 
                required
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-landgreen-500 focus:border-landgreen-500 outline-none transition"
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
              <input 
                type="email" 
                required
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-landgreen-500 focus:border-landgreen-500 outline-none transition"
                value={formData.email}
                onChange={e => setFormData({...formData, email: e.target.value})}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone (Optional)</label>
              <input 
                type="tel" 
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-landgreen-500 focus:border-landgreen-500 outline-none transition"
                value={formData.phone}
                onChange={e => setFormData({...formData, phone: e.target.value})}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
              <textarea 
                rows={4}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-landgreen-500 focus:border-landgreen-500 outline-none transition resize-none"
                value={formData.message}
                onChange={e => setFormData({...formData, message: e.target.value})}
              />
            </div>
          </div>
          
          <div className="mt-8">
            <button 
              type="submit" 
              disabled={status === 'loading' || status === 'success'}
              className="w-full py-4 bg-landgreen-900 text-white rounded-xl font-medium hover:bg-landgreen-700 transition disabled:opacity-70"
            >
              {status === 'loading' ? 'Sending...' : status === 'success' ? 'Sent Successfully!' : 'Send Message'}
            </button>
          </div>
        </form>
        
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-white/70 hover:text-white transition p-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
        </button>
      </div>
    </div>
  );
}
