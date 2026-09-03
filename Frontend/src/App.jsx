import React, { useState } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/Home';
import SignIn from './pages/SignIn';
import Demo from './pages/Demo';
import PricingPage from './pages/PricingPage';
import ContactModal from './components/ContactModal';
import { AuthProvider } from './context/AuthContext';

function AppContent() {
  const [isContactOpen, setIsContactOpen] = useState(false);
  const location = useLocation();

  const isSaaSPage = location.pathname.startsWith('/demo');

  return (
    <div className="min-h-screen font-sans bg-[#FAFAFA] text-gray-900 overflow-x-hidden">
      {!isSaaSPage && <Header onContactClick={() => setIsContactOpen(true)} />}
      
      <main>
        <Routes>
          <Route path="/" element={<Home onContactClick={() => setIsContactOpen(true)} />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/demo" element={<Demo />} />
          <Route path="/pricing" element={<PricingPage />} />
        </Routes>
      </main>

      {/* Contact Form Modal */}
      {isContactOpen && (
        <ContactModal onClose={() => setIsContactOpen(false)} />
      )}
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
