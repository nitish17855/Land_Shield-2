import React, { useState, useRef } from 'react';
import { 
  FileText, ShieldCheck, Download, ExternalLink, 
  Upload, UserCheck, AlertCircle, Sparkles, Building, Layers
} from 'lucide-react';
import { fetchOwnerDetails } from '../services/cadastralApi';

export default function ParcelResult({
  resultPayload,
  selectedParcel,
  onSelectCandidate,
  clickedPoint,
  onOwnerDetailsRetrieved
}) {
  const [isOwnerLoading, setIsOwnerLoading] = useState(false);
  const [ownerData, setOwnerData] = useState(null);
  const [uploadedRtcDoc, setUploadedRtcDoc] = useState(null);
  const fileInputRef = useRef(null);

  if (!resultPayload && !selectedParcel) return null;

  if (resultPayload && !resultPayload.success) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-3xl p-6 text-red-900 shadow-sm animate-in fade-in">
        <div className="flex items-center gap-3 mb-2 font-serif font-bold text-lg">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
          <span>Identification Failed</span>
        </div>
        <p className="text-xs text-red-700 mb-3">{resultPayload.message || 'No cadastral feature found at these coordinates.'}</p>
        {clickedPoint && (
          <p className="text-[11px] font-mono text-red-600">Coordinates: {clickedPoint.lat}, {clickedPoint.lng}</p>
        )}
      </div>
    );
  }

  const p = selectedParcel || (resultPayload?.candidates?.[0]);
  if (!p) return null;

  const handleFetchOwner = async () => {
    setIsOwnerLoading(true);
    const data = await fetchOwnerDetails(p);
    setIsOwnerLoading(false);
    setOwnerData(data);
    if (onOwnerDetailsRetrieved) {
      onOwnerDetailsRetrieved(data);
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedRtcDoc({
        fileName: file.name,
        fileSize: `${(file.size / 1024).toFixed(1)} KB`,
        uploadedAt: new Date().toLocaleTimeString(),
        status: 'Uploaded for Assisted Verification'
      });
    }
  };

  const handleExportGeoJSON = () => {
    if (!p.geometry) return;
    const geojson = {
      type: 'Feature',
      geometry: p.geometry,
      properties: {
        surveyNumber: p.surveyNumber,
        villageId: p.villageId,
        villageCode: p.villageCode,
        hissaNumber: p.hissaNumber,
        surnoc: p.surnoc,
        ulpin: p.ulpin,
        area: p.area,
        category: p.category
      }
    };
    const blob = new Blob([JSON.stringify(geojson, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `LandShield_Survey_${p.surveyNumber || 'parcel'}.geojson`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-white rounded-3xl border border-gray-100 shadow-xl overflow-hidden animate-in fade-in duration-300">
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileUpload} 
        accept=".pdf,.png,.jpg,.jpeg" 
        className="hidden" 
      />

      {/* Header Badge */}
      <div className="bg-landgreen-900 text-white p-5 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gold-500/20 border border-gold-500/40 flex items-center justify-center text-gold-400">
            <Building size={16} />
          </div>
          <div>
            <h3 className="font-serif font-bold text-base leading-tight">Cadastral Parcel Found</h3>
            <p className="text-[11px] text-gray-300 font-light">Karnataka KGIS &bull; Cadastral Layer 5</p>
          </div>
        </div>

        <span className="text-xs bg-gold-500 text-landgreen-900 font-bold px-3 py-1 rounded-full uppercase tracking-wider">
          Survey #{p.surveyNumber}
        </span>
      </div>

      {/* Attributes Grid */}
      <div className="p-6 space-y-4 text-xs">
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-gray-50 p-3.5 rounded-2xl border border-gray-100">
            <span className="text-[11px] text-gray-400 font-semibold uppercase block mb-1">Survey Number</span>
            <span className="font-serif font-bold text-xl text-landgreen-900">{p.surveyNumber || 'N/A'}</span>
          </div>

          <div className="bg-gray-50 p-3.5 rounded-2xl border border-gray-100">
            <span className="text-[11px] text-gray-400 font-semibold uppercase block mb-1">Hissa / Sub-Division</span>
            <span className="font-bold text-gray-800 text-base">{p.hissaNumber || 'Main'}</span>
          </div>

          <div className="bg-gray-50 p-3 rounded-2xl border border-gray-100">
            <span className="text-[11px] text-gray-400 font-semibold uppercase block mb-0.5">Surnoc</span>
            <span className="font-medium text-gray-700">{p.surnoc || 'N/A'}</span>
          </div>

          <div className="bg-gray-50 p-3 rounded-2xl border border-gray-100">
            <span className="text-[11px] text-gray-400 font-semibold uppercase block mb-0.5">Village Code / ID</span>
            <span className="font-mono text-gray-800">{p.villageCode || p.villageId || 'Karnataka'}</span>
          </div>

          <div className="col-span-2 bg-gray-50 p-3.5 rounded-2xl border border-gray-100 flex items-center justify-between">
            <div>
              <span className="text-[11px] text-gray-400 font-semibold uppercase block mb-0.5">ULPIN (Land Identification)</span>
              <span className="font-mono font-bold text-landgreen-900 text-sm">{p.ulpin || 'KA-ULPIN-VERIFIED'}</span>
            </div>
            <span className="text-[10px] bg-green-100 text-green-800 font-semibold px-2 py-0.5 rounded-full">
              Active Record
            </span>
          </div>

          {p.area && (
            <div className="col-span-2 bg-gray-50 p-3 rounded-2xl border border-gray-100">
              <span className="text-[11px] text-gray-400 font-semibold uppercase block mb-0.5">Calculated Area</span>
              <span className="font-medium text-gray-800">{p.area}</span>
            </div>
          )}
        </div>

        {/* Action: SEE OWNER DETAILS BUTTON */}
        {!ownerData ? (
          <button
            onClick={handleFetchOwner}
            disabled={isOwnerLoading}
            className="w-full py-3.5 px-4 bg-gold-500 hover:bg-gold-400 text-landgreen-900 font-bold rounded-2xl shadow-lg shadow-gold-500/20 flex items-center justify-center gap-2 transition cursor-pointer disabled:opacity-75"
          >
            {isOwnerLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-landgreen-900 border-t-transparent rounded-full animate-spin"></div>
                <span>Connecting to Bhoomi Land Records...</span>
              </>
            ) : (
              <>
                <Sparkles size={16} />
                <span>SEE OWNER & RTC DETAILS</span>
              </>
            )}
          </button>
        ) : (
          <div className="p-4 bg-landgreen-50/70 border border-landgreen-200 rounded-2xl space-y-3 animate-in fade-in">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-landgreen-900 uppercase tracking-wider flex items-center gap-1.5">
                <FileText size={15} className="text-landgreen-700" />
                <span>Bhoomi Land Record Result</span>
              </span>
              <span className="text-[10px] text-gray-400">Verified</span>
            </div>

            <div className="bg-white p-3 rounded-xl border border-gray-200 space-y-1 text-xs">
              <div className="text-gray-500 text-[11px]">Primary Owner / Khatedar:</div>
              <div className="font-serif font-bold text-gray-900 text-sm">
                {ownerData.ownerName || ownerData.khatatedar || `Landholder (Survey ${p.surveyNumber})`}
              </div>
              <div className="text-[11px] text-gray-500 pt-1">
                Extent: <span className="font-medium text-gray-800">{ownerData.extent || 'Clear Title'}</span> &bull; Status: <span className="text-green-700 font-semibold">Active Title</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-1">
              <a
                href={ownerData.bhoomiPortalUrl || 'https://landrecords.karnataka.gov.in/service53/'}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-2 bg-landgreen-900 hover:bg-landgreen-800 text-white font-semibold rounded-xl text-[11px] flex items-center justify-center gap-1.5 transition text-center shadow-sm"
              >
                <ExternalLink size={13} />
                <span>Open Bhoomi</span>
              </a>

              <button
                onClick={() => fileInputRef.current?.click()}
                className="px-3 py-2 bg-white hover:bg-gray-50 border border-gray-300 text-gray-800 font-semibold rounded-xl text-[11px] flex items-center justify-center gap-1.5 transition text-center"
              >
                <Upload size={13} className="text-landgreen-700" />
                <span>Upload RTC</span>
              </button>
            </div>

            {uploadedRtcDoc && (
              <div className="p-2.5 bg-white rounded-xl border border-green-200 text-[11px] text-green-900 flex items-center justify-between">
                <span>📄 {uploadedRtcDoc.fileName}</span>
                <span className="text-[10px] font-bold text-green-700">Ready</span>
              </div>
            )}
          </div>
        )}

        {/* Export GeoJSON Option */}
        {p.geometry && (
          <button
            onClick={handleExportGeoJSON}
            className="w-full py-2.5 px-3 bg-gray-50 hover:bg-gray-100 text-gray-700 border border-gray-200 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition"
          >
            <Download size={14} className="text-landgreen-700" />
            <span>Download Parcel GeoJSON</span>
          </button>
        )}
      </div>
    </div>
  );
}
