import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Shield, Sparkles, HelpCircle, FileText, ChevronRight, 
  MapPin, CheckCircle2, LogOut, Search, Compass, Zap
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { identifyParcel } from '../services/cadastralApi';
import KarnatakaMap from '../components/KarnatakaMap';
import ParcelResult from '../components/ParcelResult';
import TestInputPanel from '../components/TestInputPanel';

export default function Demo() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const [clickedPoint, setClickedPoint] = useState({ lat: 13.2450, lng: 77.7125 });
  const [resultPayload, setResultPayload] = useState(null);
  const [selectedParcel, setSelectedParcel] = useState(null);
  const [ownerData, setOwnerData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Check auth - if not logged in, redirect to sign in
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/signin?redirect=/demo');
    } else {
      // Auto-load initial demo coordinate
      handleQueryParcel({ lat: 13.2450, lng: 77.7125 });
    }
  }, [isAuthenticated]);

  const handleQueryParcel = async (coords) => {
    setClickedPoint(coords);
    setIsLoading(true);
    setResultPayload(null);
    setSelectedParcel(null);
    setOwnerData(null);

    const data = await identifyParcel(coords.lat, coords.lng);

    setIsLoading(false);
    setResultPayload(data);

    if (data && data.success && data.count > 0) {
      setSelectedParcel(data.primaryParcel || data.candidates[0]);
    }
  };

  const useCases = [
    'Check Location',
    'Check Ownership',
    'Market Value Assessment',
    'Apply for Documents',
    'Litigation Search',
    'Encroachment Detection'
  ];

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex flex-col font-sans text-gray-900">
      
      {/* SaaS Top Navigation Bar */}
      <header className="h-16 bg-white border-b border-gray-200 px-6 flex items-center justify-between sticky top-0 z-40 shadow-xs">
        <div className="flex items-center gap-6">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="bg-landgreen-900 p-2 rounded-xl text-white shadow-md shadow-landgreen-900/20 group-hover:scale-105 transition">
              <Shield size={20} />
            </div>
            <span className="font-serif font-bold text-2xl text-landgreen-900 tracking-tight">LandShield</span>
          </Link>

          {/* Breadcrumbs */}
          <div className="hidden md:flex items-center gap-2 text-xs text-gray-500 font-medium">
            <Link to="/" className="hover:text-landgreen-900">Home</Link>
            <ChevronRight size={14} className="text-gray-400" />
            <span className="text-gray-700">Karnataka</span>
            <ChevronRight size={14} className="text-gray-400" />
            <span className="text-landgreen-900 font-semibold">Find My Survey Number</span>
          </div>
        </div>

        <div className="flex items-center gap-3 sm:gap-5">
          <button className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-gold-500/15 text-landgreen-900 border border-gold-500/30 text-xs font-semibold hover:bg-gold-500/25 transition">
            <Sparkles size={14} className="text-gold-600" />
            <span>Ask LandShield AI</span>
          </button>

          <div className="hidden sm:flex items-center gap-4 text-xs font-medium text-gray-600">
            <a href="#orders" className="hover:text-landgreen-900">Orders</a>
            <a href="#support" className="hover:text-landgreen-900">Get Support</a>
          </div>

          <div className="flex items-center gap-2 pl-3 border-l border-gray-200">
            <div className="w-8 h-8 rounded-full bg-landgreen-900 text-white flex items-center justify-center font-bold text-xs shadow-sm">
              {user?.name ? user.name.charAt(0) : 'N'}
            </div>
            <div className="hidden md:block text-left text-xs">
              <div className="font-semibold text-gray-900 leading-tight">{user?.name || 'Nitish Tripathi'}</div>
              <div className="text-[10px] text-gray-400">Verified Buyer</div>
            </div>
            <button
              onClick={logout}
              title="Sign Out"
              className="p-1.5 text-gray-400 hover:text-red-600 rounded-lg transition ml-1"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </header>

      {/* Main SaaS Body with Left-Hand Sidebar (Only 1 Option) + Content Canvas */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        
        {/* Left Sidebar - STRICTLY ONLY ONE OPTION: Find by Survey Number */}
        <aside className="w-full md:w-64 bg-white border-r border-gray-200 p-5 flex flex-col justify-between flex-shrink-0">
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-3 px-3">
              Karnataka (KA) Services
            </div>

            {/* The single requested option */}
            <div className="space-y-1">
              <button
                className="w-full flex items-center justify-between px-4 py-3 rounded-2xl bg-landgreen-900 text-white text-xs font-semibold shadow-md shadow-landgreen-900/20 text-left"
              >
                <div className="flex items-center gap-2.5">
                  <Zap size={16} className="text-gold-400" />
                  <span>Find My Survey No.</span>
                </div>
                <span className="w-2 h-2 rounded-full bg-gold-400 animate-pulse"></span>
              </button>
            </div>
          </div>

          <div className="pt-6 border-t border-gray-100 hidden md:block">
            <div className="bg-landgreen-50 p-4 rounded-2xl border border-landgreen-100">
              <div className="flex items-center gap-2 text-xs font-bold text-landgreen-900 mb-1">
                <Shield size={16} className="text-landgreen-700" />
                <span>LandShield Live</span>
              </div>
              <p className="text-[11px] text-gray-600 leading-relaxed">
                Connected to official Karnataka KGIS Cadastral Layer 5 & Bhoomi record systems.
              </p>
            </div>
          </div>
        </aside>

        {/* Center & Right Split Content Area */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-y-auto p-4 lg:p-8 gap-8">
          
          {/* Left Column: Information, Use Cases, Presets, and Identified Results (7 Cols) */}
          <div className="lg:col-span-6 space-y-6">
            
            {/* Main Header Banner */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <h1 className="text-3xl lg:text-4xl font-serif font-bold text-landgreen-900 leading-tight">
                  Find My Survey Number
                </h1>
                <span className="text-[10px] text-gray-400 bg-gray-100 px-2.5 py-1 rounded-full font-medium">
                  Live KGIS Layer 5
                </span>
              </div>
              <p className="text-sm font-medium text-gray-500">
                Locate Land Records in Karnataka Instantly
              </p>
            </div>

            {/* Overview Card */}
            <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-xl space-y-4">
              <h2 className="font-serif font-bold text-gray-900 text-base">Overview</h2>
              <p className="text-xs text-gray-600 font-light leading-relaxed">
                <strong>Find My Survey Number</strong> is an efficient tool provided by LandShield to simplify the process of finding land records in Karnataka. By entering an address, coordinates, or clicking directly on the map, you can instantly retrieve the survey number, along with detailed information such as the village, hobli, taluk, and district associated with the property.
              </p>

              {/* Use Cases Tags */}
              <div className="pt-2">
                <div className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2.5">
                  Use Cases
                </div>
                <div className="flex flex-wrap gap-2">
                  {useCases.map((uc, i) => (
                    <span 
                      key={i} 
                      className="px-3 py-1.5 bg-gray-50 hover:bg-landgreen-50 text-gray-700 hover:text-landgreen-900 text-xs font-medium rounded-xl border border-gray-200/80 transition"
                    >
                      {uc}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Why LandShield Trust Card */}
            <div className="bg-gradient-to-br from-landgreen-900 to-[#0e3b20] text-white rounded-3xl p-6 shadow-xl space-y-3 relative overflow-hidden">
              <div className="absolute right-0 bottom-0 translate-x-4 translate-y-4 opacity-10">
                <Shield size={160} />
              </div>
              <h3 className="font-serif font-bold text-lg text-gold-400 flex items-center gap-2">
                <Sparkles size={18} />
                <span>WHY LANDSHIELD?</span>
              </h3>
              <ul className="space-y-2 text-xs text-gray-200">
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-gold-400 flex-shrink-0" />
                  <span>Instant spatial query against Karnataka KGIS Cadastral Layer 5</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-gold-400 flex-shrink-0" />
                  <span>Bhoomi Land Records and RTC owner verification integration</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-gold-400 flex-shrink-0" />
                  <span>High precision polygon boundary visualization & GeoJSON export</span>
                </li>
              </ul>
            </div>

            {/* Test Input Coordinates / Quick Location Presets */}
            <TestInputPanel 
              onIdentify={handleQueryParcel} 
              isLoading={isLoading} 
            />

            {/* Parcel Result Card & Bhoomi Owner Lookup */}
            <ParcelResult 
              resultPayload={resultPayload}
              selectedParcel={selectedParcel}
              onSelectCandidate={setSelectedParcel}
              clickedPoint={clickedPoint}
              onOwnerDetailsRetrieved={setOwnerData}
            />

          </div>

          {/* Right Column: High Precision Interactive Map (6 Cols) */}
          <div className="lg:col-span-6 flex flex-col h-[560px] lg:h-[calc(100vh-6.5rem)] sticky top-20">
            <KarnatakaMap
              onMapClick={handleQueryParcel}
              clickedPoint={clickedPoint}
              selectedParcel={selectedParcel}
              isLoading={isLoading}
            />
          </div>

        </div>
      </div>
    </div>
  );
}
