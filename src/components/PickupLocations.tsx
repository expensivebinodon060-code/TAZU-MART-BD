import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  MapPin, 
  ChevronLeft, 
  Search, 
  Clock, 
  Navigation, 
  CheckCircle2,
  Map as MapIcon,
  List as ListIcon,
  Phone
} from 'lucide-react';

interface PickupPoint {
  id: string;
  name: string;
  address: string;
  hours: string;
  lat: number;
  lng: number;
  phone?: string;
}

export default function PickupLocations({ onBack, onSelect }: { onBack: () => void, onSelect?: (point: PickupPoint) => void }) {
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  const [searchQuery, setSearchQuery] = useState('');
  const [pickupPoints, setPickupPoints] = useState<PickupPoint[]>([]);
  const [selectedPoint, setSelectedPoint] = useState<PickupPoint | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    fetch('/api/pickup-points')
      .then(res => res.json())
      .then(setPickupPoints);
  }, []);

  const filteredPoints = pickupPoints.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    p.address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelect = (point: PickupPoint) => {
    setSelectedPoint(point);
    setShowSuccess(true);
    if (onSelect) onSelect(point);
  };

  return (
    <div className="min-h-screen bg-bg p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-4">
            <button onClick={onBack} className="p-2 hover:bg-white/5 rounded-full transition-colors">
              <ChevronLeft size={24} />
            </button>
            <div>
              <h1 className="text-2xl font-black tracking-tight text-active flex items-center gap-2">
                <MapPin className="text-active" />
                Pickup Locations
              </h1>
              <p className="text-secondary text-sm">Select a nearby point to collect your order.</p>
            </div>
          </div>

          <div className="flex bg-white/5 p-1 rounded-xl">
            <button 
              onClick={() => setViewMode('list')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                viewMode === 'list' ? 'bg-active text-white' : 'text-secondary'
              }`}
            >
              <ListIcon size={16} />
              List
            </button>
            <button 
              onClick={() => setViewMode('map')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                viewMode === 'map' ? 'bg-active text-white' : 'text-secondary'
              }`}
            >
              <MapIcon size={16} />
              Map
            </button>
          </div>
        </header>

        {/* Search Bar */}
        <div className="relative mb-8">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary" size={20} />
          <input 
            type="text"
            placeholder="Search by area or point name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 focus:border-active outline-none transition-all font-medium"
          />
        </div>

        {viewMode === 'list' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredPoints.map((point) => (
              <motion.div
                key={point.id}
                whileHover={{ y: -2 }}
                className={`bg-white/5 border-2 rounded-3xl p-6 transition-all ${
                  selectedPoint?.id === point.id ? 'border-active bg-active/5' : 'border-white/5'
                }`}
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="w-12 h-12 bg-active/10 rounded-2xl flex items-center justify-center">
                    <MapPin className="text-active" />
                  </div>
                  <button className="p-2 text-secondary hover:text-active transition-colors">
                    <Navigation size={20} />
                  </button>
                </div>
                
                <h3 className="text-lg font-black mb-1">{point.name}</h3>
                <p className="text-secondary text-sm mb-4">{point.address}</p>
                
                <div className="space-y-2 mb-6">
                  <div className="flex items-center gap-2 text-xs text-secondary font-bold">
                    <Clock size={14} className="text-active" />
                    OPEN: {point.hours}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-secondary font-bold">
                    <Phone size={14} className="text-active" />
                    {point.phone || '01834800916'}
                  </div>
                </div>

                <button 
                  onClick={() => handleSelect(point)}
                  className={`w-full py-3 rounded-xl font-black text-sm transition-all ${
                    selectedPoint?.id === point.id 
                      ? 'bg-active text-white' 
                      : 'bg-white/10 text-primary hover:bg-white/20'
                  }`}
                >
                  {selectedPoint?.id === point.id ? 'SELECTED' : 'SELECT THIS POINT'}
                </button>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="bg-white/5 border border-white/10 rounded-[40px] h-[500px] flex items-center justify-center relative overflow-hidden">
            {/* Simulated Map */}
            <div className="absolute inset-0 opacity-20 grayscale">
              <img 
                src="https://picsum.photos/seed/map/1200/800" 
                alt="Map Placeholder" 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            
            <div className="relative z-10 text-center p-8">
              <div className="w-20 h-20 bg-active/20 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
                <MapPin size={40} className="text-active" />
              </div>
              <h3 className="text-2xl font-black mb-2">Interactive Map View</h3>
              <p className="text-secondary max-w-sm mx-auto">In a production environment, this would integrate with Google Maps or Mapbox to show real-time locations.</p>
              
              <div className="mt-8 flex flex-wrap justify-center gap-3">
                {filteredPoints.map(p => (
                  <button 
                    key={p.id}
                    onClick={() => handleSelect(p)}
                    className="px-4 py-2 bg-white/10 hover:bg-active hover:text-white rounded-full text-xs font-bold transition-all flex items-center gap-2"
                  >
                    <MapPin size={14} />
                    {p.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Success Popup */}
        <AnimatePresence>
          {showSuccess && selectedPoint && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            >
              <motion.div
                initial={{ scale: 0.5, y: 50 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.5, y: 50 }}
                className="bg-white text-[#0B1120] w-full max-w-sm rounded-[40px] p-8 text-center relative overflow-hidden"
              >
                <div className="absolute top-0 left-0 right-0 h-2 bg-active" />
                <div className="w-20 h-20 bg-active/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle2 size={40} className="text-active" />
                </div>
                <h2 className="text-2xl font-black mb-2 tracking-tighter uppercase">Pickup Location Selected</h2>
                <div className="mb-6">
                  <p className="text-active font-black text-lg">{selectedPoint.name}</p>
                  <p className="text-gray-500 text-sm">{selectedPoint.address}</p>
                </div>
                
                <p className="text-gray-400 text-xs mb-8 leading-relaxed">
                  You can collect your order from this point once it's ready. We'll notify you via SMS.
                </p>

                <button 
                  onClick={() => setShowSuccess(false)}
                  className="w-full py-4 bg-[#0B1120] text-white rounded-2xl font-black hover:bg-gray-800 transition-all"
                >
                  GOT IT
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
