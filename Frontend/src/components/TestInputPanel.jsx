import React, { useState } from 'react';
import { MapPin, Search, Sparkles } from 'lucide-react';

const PRESETS = [
  { name: 'Devanahalli (Airport)', lat: 13.2450, lng: 77.7125, desc: 'KIADB Aerospace & IT' },
  { name: 'Whitefield', lat: 12.9698, lng: 77.7499, desc: 'ITPL Commercial Zone' },
  { name: 'Electronic City', lat: 12.8452, lng: 77.6602, desc: 'Phase 1 Tech Corridor' },
  { name: 'Yelahanka', lat: 13.1007, lng: 77.5963, desc: 'North Bangalore Hub' }
];

export default function TestInputPanel({ onIdentify, isLoading }) {
  const [lat, setLat] = useState('13.2450');
  const [lng, setLng] = useState('77.7125');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!lat || !lng) return;
    onIdentify({ lat: parseFloat(lat), lng: parseFloat(lng) });
  };

  const handleSelectPreset = (preset) => {
    setLat(preset.lat.toString());
    setLng(preset.lng.toString());
    onIdentify({ lat: preset.lat, lng: preset.lng });
  };

  return (
    <div className="bg-white rounded-3xl border border-gray-100 shadow-xl p-6 space-y-5">
      <div className="flex items-center justify-between">
        <h3 className="font-serif font-bold text-gray-900 text-base flex items-center gap-2">
          <MapPin size={18} className="text-landgreen-700" />
          <span>Coordinates / Location Query</span>
        </h3>
        <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest bg-gray-50 px-2.5 py-1 rounded-full border border-gray-100">
          KGIS Live
        </span>
      </div>

      {/* Quick Location Chips */}
      <div>
        <label className="block text-[11px] font-semibold uppercase text-gray-500 mb-2">
          Popular Growth Hubs
        </label>
        <div className="grid grid-cols-2 gap-2">
          {PRESETS.map((p, i) => (
            <button
              key={i}
              type="button"
              onClick={() => handleSelectPreset(p)}
              className="text-left p-2.5 rounded-2xl bg-gray-50 hover:bg-landgreen-50 border border-gray-100 hover:border-landgreen-200 transition group"
            >
              <div className="font-semibold text-xs text-gray-900 group-hover:text-landgreen-900 leading-tight">
                {p.name}
              </div>
              <div className="text-[10px] text-gray-500 truncate">{p.desc}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Manual Coordinates Form */}
      <form onSubmit={handleSubmit} className="space-y-3 pt-2 border-t border-gray-100">
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block text-[11px] font-semibold text-gray-500 mb-1">Latitude</label>
            <input
              type="number"
              step="any"
              value={lat}
              onChange={(e) => setLat(e.target.value)}
              placeholder="e.g. 13.2450"
              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-mono text-gray-900 focus:outline-none focus:ring-2 focus:ring-landgreen-700"
            />
          </div>
          <div>
            <label className="block text-[11px] font-semibold text-gray-500 mb-1">Longitude</label>
            <input
              type="number"
              step="any"
              value={lng}
              onChange={(e) => setLng(e.target.value)}
              placeholder="e.g. 77.7125"
              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-mono text-gray-900 focus:outline-none focus:ring-2 focus:ring-landgreen-700"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3 bg-landgreen-900 hover:bg-landgreen-800 text-white text-xs font-semibold rounded-xl shadow-lg shadow-landgreen-900/20 flex items-center justify-center gap-2 transition disabled:opacity-75 cursor-pointer"
        >
          {isLoading ? (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <>
              <Search size={14} />
              <span>Locate Survey Parcel</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
}
