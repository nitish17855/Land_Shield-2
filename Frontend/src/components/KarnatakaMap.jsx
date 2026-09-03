import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { Layers, Map as MapIcon, Globe, Satellite, Navigation, Search } from 'lucide-react';

const KARNATAKA_CENTER = [15.3173, 75.7139];
const INITIAL_ZOOM = 7;

const BASEMAP_CONFIGS = {
  streets: {
    name: 'Standard Map',
    icon: MapIcon,
    url: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
    subdomains: ['a', 'b', 'c'],
    attribution: '&copy; OpenStreetMap contributors'
  },
  googleRoad: {
    name: 'Roadmap',
    icon: Globe,
    url: 'https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}',
    attribution: '&copy; Google Maps'
  },
  satellite: {
    name: 'Satellite Hybrid',
    icon: Satellite,
    url: 'https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}',
    attribution: '&copy; Google Satellite / Esri'
  },
  esriSat: {
    name: 'Esri Satellite',
    icon: Layers,
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    attribution: 'Tiles &copy; Esri World Imagery'
  }
};

const PRESET_LOCATIONS = [
  { name: 'Bangalore Airport (Devanahalli)', lat: 13.2450, lng: 77.7125 },
  { name: 'Whitefield IT Hub', lat: 12.9698, lng: 77.7499 },
  { name: 'Electronic City Phase 1', lat: 12.8452, lng: 77.6602 },
  { name: 'Yelahanka Hobli', lat: 13.1007, lng: 77.5963 },
  { name: 'Mysore Road Kengeri', lat: 12.9121, lng: 77.5123 }
];

export default function KarnatakaMap({
  onMapClick,
  clickedPoint,
  selectedParcel,
  isLoading
}) {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const tileLayerRef = useRef(null);
  const markerRef = useRef(null);
  const geojsonLayerRef = useRef(null);
  const [activeBasemap, setActiveBasemap] = useState('streets');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  // Initialize Leaflet map
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: [12.9716, 77.5946], // Center near Bangalore/Karnataka
      zoom: 10,
      zoomControl: false
    });

    L.control.zoom({ position: 'bottomright' }).addTo(map);
    L.control.scale({ imperial: false, position: 'bottomleft' }).addTo(map);

    const config = BASEMAP_CONFIGS[activeBasemap];
    const tileLayer = L.tileLayer(config.url, {
      attribution: config.attribution,
      maxZoom: 19,
      subdomains: config.subdomains || ['a', 'b', 'c']
    }).addTo(map);

    tileLayerRef.current = tileLayer;
    mapRef.current = map;

    map.on('click', (e) => {
      const lat = parseFloat(e.latlng.lat.toFixed(6));
      const lng = parseFloat(e.latlng.lng.toFixed(6));
      onMapClick({ lat, lng });
    });

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // Handle Basemap Switch
  const handleBasemapChange = (styleKey) => {
    if (styleKey === activeBasemap || !mapRef.current) return;
    setActiveBasemap(styleKey);

    const map = mapRef.current;
    if (tileLayerRef.current) {
      map.removeLayer(tileLayerRef.current);
    }

    const config = BASEMAP_CONFIGS[styleKey];
    const newTileLayer = L.tileLayer(config.url, {
      attribution: config.attribution,
      maxZoom: 19,
      subdomains: config.subdomains || ['a', 'b', 'c']
    }).addTo(map);

    tileLayerRef.current = newTileLayer;
  };

  // Update Click Marker
  useEffect(() => {
    if (!mapRef.current) return;
    const map = mapRef.current;

    if (clickedPoint && clickedPoint.lat && clickedPoint.lng) {
      if (markerRef.current) {
        markerRef.current.setLatLng([clickedPoint.lat, clickedPoint.lng]);
      } else {
        const customIcon = L.divIcon({
          className: 'custom-leaflet-marker',
          html: `<div style="
            width: 22px;
            height: 22px;
            background-color: #14532d;
            border: 3.5px solid #eab308;
            border-radius: 50%;
            box-shadow: 0 0 16px rgba(20, 83, 45, 0.9);
          "></div>`,
          iconSize: [22, 22],
          iconAnchor: [11, 11]
        });

        markerRef.current = L.marker([clickedPoint.lat, clickedPoint.lng], { icon: customIcon }).addTo(map);
      }
    }
  }, [clickedPoint]);

  // Update GeoJSON Cadastral Polygon
  useEffect(() => {
    if (!mapRef.current) return;
    const map = mapRef.current;

    if (geojsonLayerRef.current) {
      map.removeLayer(geojsonLayerRef.current);
      geojsonLayerRef.current = null;
    }

    if (selectedParcel && selectedParcel.geometry) {
      const geojsonFeature = {
        type: 'Feature',
        geometry: selectedParcel.geometry,
        properties: {
          surveyNumber: selectedParcel.surveyNumber,
          category: selectedParcel.category
        }
      };

      const layer = L.geoJSON(geojsonFeature, {
        style: {
          color: '#ca8a04',       // Gold border
          weight: 3.5,
          fillColor: '#22c55e',   // Emerald fill
          fillOpacity: 0.35
        },
        onEachFeature: (feature, layer) => {
          if (feature.properties && feature.properties.surveyNumber) {
            layer.bindTooltip(`Survey #${feature.properties.surveyNumber}`, {
              permanent: true,
              direction: 'center',
              className: 'px-2 py-1 bg-landgreen-900 text-gold-400 font-bold text-xs rounded-md shadow-md border border-gold-500/30'
            });
          }
        }
      }).addTo(map);

      geojsonLayerRef.current = layer;

      const bounds = layer.getBounds();
      if (bounds.isValid()) {
        map.fitBounds(bounds, { padding: [60, 60], maxZoom: 18, animate: true });
      }
    }
  }, [selectedParcel]);

  // Handle Search in Map
  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    const matched = PRESET_LOCATIONS.filter(l => 
      l.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (matched.length > 0) {
      const loc = matched[0];
      if (mapRef.current) {
        mapRef.current.flyTo([loc.lat, loc.lng], 15, { animate: true, duration: 1.2 });
      }
      onMapClick({ lat: loc.lat, lng: loc.lng });
      setSearchQuery('');
    } else {
      // Fallback: search via Nominatim
      setIsSearching(true);
      fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery + ', Karnataka, India')}`)
        .then(res => res.json())
        .then(data => {
          setIsSearching(false);
          if (data && data.length > 0) {
            const lat = parseFloat(data[0].lat);
            const lon = parseFloat(data[0].lon);
            if (mapRef.current) {
              mapRef.current.flyTo([lat, lon], 15, { animate: true, duration: 1.2 });
            }
            onMapClick({ lat, lng: lon });
            setSearchQuery('');
          }
        })
        .catch(() => setIsSearching(false));
    }
  };

  return (
    <div className="relative w-full h-full min-h-[500px] rounded-3xl overflow-hidden shadow-2xl border border-gray-200">
      <div ref={mapContainerRef} className="w-full h-full z-10" />

      {/* Floating Top Search Bar */}
      <div className="absolute top-4 left-4 right-4 z-20 max-w-md mx-auto">
        <form onSubmit={handleSearch} className="relative shadow-xl">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
            <Search size={16} />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="e.g. Bangalore Airport, Devanahalli, Whitefield..."
            className="w-full pl-10 pr-24 py-3 bg-white/95 backdrop-blur-md text-xs sm:text-sm text-gray-900 rounded-full border border-gray-200 shadow-lg focus:outline-none focus:ring-2 focus:ring-landgreen-700"
          />
          <button
            type="submit"
            className="absolute right-1.5 top-1.5 bottom-1.5 px-4 bg-landgreen-900 hover:bg-landgreen-800 text-white text-xs font-semibold rounded-full transition"
          >
            {isSearching ? '...' : 'Search'}
          </button>
        </form>
      </div>

      {/* Basemap Switcher Toolbar */}
      <div className="absolute bottom-6 right-6 z-20 flex bg-white/90 backdrop-blur-md border border-gray-200 rounded-xl overflow-hidden shadow-xl p-1 gap-1 text-xs">
        {Object.entries(BASEMAP_CONFIGS).map(([key, config]) => {
          const IconComponent = config.icon;
          const isActive = activeBasemap === key;
          return (
            <button
              key={key}
              onClick={() => handleBasemapChange(key)}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg font-medium transition ${
                isActive
                  ? 'bg-landgreen-900 text-white shadow'
                  : 'text-gray-700 hover:text-landgreen-900 hover:bg-gray-100'
              }`}
            >
              <IconComponent size={14} />
              <span className="hidden sm:inline">{config.name}</span>
            </button>
          );
        })}
      </div>

      {/* Live KGIS query banner */}
      {isLoading && (
        <div className="absolute top-20 left-4 z-20 bg-landgreen-900/95 text-white backdrop-blur border border-gold-400/40 px-4 py-2.5 rounded-2xl shadow-xl flex items-center gap-3 text-xs font-medium animate-pulse">
          <div className="w-4 h-4 border-2 border-gold-400 border-t-transparent rounded-full animate-spin"></div>
          <span>Querying Karnataka KGIS Cadastral Layer 5...</span>
        </div>
      )}

      {/* Click instruction banner */}
      {!clickedPoint && !isLoading && (
        <div className="absolute bottom-6 left-6 z-20 bg-white/95 backdrop-blur-md border border-gray-200 text-gray-800 px-4 py-2 rounded-full text-xs font-medium shadow-xl flex items-center gap-2 pointer-events-none">
          <span className="w-2.5 h-2.5 rounded-full bg-landgreen-500 animate-ping"></span>
          <span>Click anywhere on Karnataka map to locate Survey parcel</span>
        </div>
      )}
    </div>
  );
}
