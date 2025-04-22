
import React from 'react';
import { MapPin, Navigation } from 'lucide-react';

interface MapViewProps {
  address: string;
}

const MapView = ({ address }: MapViewProps) => {
  // In a real application, this would integrate with a map service like Google Maps or Mapbox
  return (
    <div className="w-full h-full bg-gray-100 flex items-center justify-center relative overflow-hidden rounded-md">
      {/* Enhanced map visualization for Surat, Gujarat, India */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-300">
        {/* Major highways */}
        <div className="absolute h-3 w-full top-1/4 left-0 bg-yellow-400/60 transform -rotate-2"></div>
        <div className="absolute h-2 w-full top-1/3 left-0 bg-yellow-400/40"></div>
        <div className="absolute w-3 h-full top-0 left-1/4 bg-yellow-400/60 transform rotate-6"></div>
        <div className="absolute w-2 h-full top-0 right-1/3 bg-yellow-400/40"></div>
        
        {/* Tapi River */}
        <div className="absolute top-1/3 w-full h-8 bg-blue-400/60 transform -rotate-3 z-0">
          <div className="h-full w-full bg-blue-500/30 animate-pulse"></div>
        </div>
        
        {/* City areas */}
        <div className="absolute top-[10%] left-[10%] w-[15%] h-[15%] bg-gray-400/30 rounded-lg">
          {/* Industrial area */}
          <div className="absolute inset-0 flex flex-wrap gap-1 p-1">
            <div className="w-2 h-2 bg-gray-500/40"></div>
            <div className="w-3 h-3 bg-gray-500/40"></div>
            <div className="w-2 h-2 bg-gray-500/40"></div>
          </div>
        </div>
        
        <div className="absolute top-[60%] left-[40%] w-[20%] h-[15%] bg-orange-100/40 rounded-lg">
          {/* Citylight area */}
          <div className="absolute inset-0 flex flex-wrap gap-[2px] p-[2px]">
            {[...Array(20)].map((_, i) => (
              <div key={i} className="w-1 h-1 bg-orange-300/40"></div>
            ))}
          </div>
        </div>
        
        <div className="absolute top-[40%] right-[15%] w-[20%] h-[20%] bg-green-100/30 rounded-lg">
          {/* Vesu area */}
          <div className="absolute inset-0 flex flex-wrap gap-[2px] p-[2px]">
            {[...Array(24)].map((_, i) => (
              <div key={i} className="w-1 h-1 bg-green-300/40"></div>
            ))}
          </div>
        </div>
        
        <div className="absolute top-[20%] left-[40%] w-[15%] h-[15%] bg-blue-100/30 rounded-lg">
          {/* Adajan area */}
          <div className="absolute inset-0 flex flex-wrap gap-[2px] p-[2px]">
            {[...Array(16)].map((_, i) => (
              <div key={i} className="w-1 h-1 bg-blue-300/40"></div>
            ))}
          </div>
        </div>
        
        {/* City center */}
        <div className="absolute top-[45%] left-[45%] right-[35%] bottom-[25%] bg-gray-400/20 rounded-lg">
          <div className="absolute inset-0 flex flex-wrap gap-[1px] p-[1px]">
            {[...Array(30)].map((_, i) => (
              <div key={i} className="w-[2px] h-[2px] bg-gray-600/40"></div>
            ))}
          </div>
        </div>
        
        {/* Roads network */}
        <div className="absolute top-[40%] left-0 right-0 h-[1px] bg-gray-600/70 z-10"></div>
        <div className="absolute top-[50%] left-0 right-0 h-[1px] bg-gray-600/70 z-10"></div>
        <div className="absolute top-[60%] left-0 right-0 h-[1px] bg-gray-600/70 z-10"></div>
        <div className="absolute top-0 bottom-0 left-[30%] w-[1px] bg-gray-600/70 z-10"></div>
        <div className="absolute top-0 bottom-0 left-[50%] w-[1px] bg-gray-600/70 z-10"></div>
        <div className="absolute top-0 bottom-0 right-[20%] w-[1px] bg-gray-600/70 z-10"></div>
        
        {/* Smaller roads */}
        {[...Array(8)].map((_, i) => (
          <React.Fragment key={i}>
            <div className="absolute h-[0.5px] w-1/3 bg-gray-500/40 z-10"
              style={{
                top: `${20 + i * 8}%`,
                left: `${i % 2 === 0 ? 0 : 'auto'}`,
                right: `${i % 2 === 1 ? 0 : 'auto'}`,
              }}
            ></div>
            <div className="absolute w-[0.5px] h-1/3 bg-gray-500/40 z-10"
              style={{
                left: `${20 + i * 8}%`,
                top: `${i % 2 === 0 ? 0 : 'auto'}`,
                bottom: `${i % 2 === 1 ? 0 : 'auto'}`,
              }}
            ></div>
          </React.Fragment>
        ))}
      </div>
      
      {/* Pin location with animation */}
      <div className="absolute top-[65%] left-[50%] transform -translate-x-1/2 -translate-y-1/2 z-20">
        <div className="relative">
          <div className="animate-ping h-8 w-8 rounded-full bg-orange-500/20 absolute -top-4 -left-4"></div>
          <div className="animate-pulse h-5 w-5 rounded-full bg-orange-500/40 absolute -top-2.5 -left-2.5"></div>
          <MapPin size={20} className="text-orange-500 relative z-30" />
        </div>
      </div>
      
      {/* For orders with drivers in transit, show a moving truck icon */}
      {address.includes('in-transit') && (
        <div className="absolute top-[40%] left-[30%] transform -translate-x-1/2 -translate-y-1/2 z-20 animate-pulse">
          <div className="relative">
            <div className="h-6 w-6 rounded-full bg-blue-500/30 absolute -top-3 -left-3"></div>
            <Navigation size={16} className="text-blue-600 relative z-30" />
          </div>
        </div>
      )}
      
      {/* Address label - shown on desktop, hidden on very small screens */}
      <div className="absolute bottom-1 right-1 bg-white/90 backdrop-blur-sm px-2 py-0.5 rounded text-[10px] max-w-[90%] truncate">
        {address.length > 30 ? address.substring(0, 30) + '...' : address}
      </div>
    </div>
  );
};

export default MapView;
