
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Star, MapPin, Clock } from 'lucide-react';

export type FuelPump = {
  id: string;
  name: string;
  brand: string;
  address: string;
  distance: number; // in km
  rating: number;
  reviewCount: number;
  imageUrl: string;
  operatingHours: string;
};

interface FuelPumpCardProps {
  fuelPump: FuelPump;
}

const FuelPumpCard = ({ fuelPump }: FuelPumpCardProps) => {
  // Use real petrol pump images based on brand
  const getPetrolPumpImage = (brand: string) => {
    switch(brand.toLowerCase()) {
      case 'indian oil':
        return 'https://images.unsplash.com/photo-1545459720-a653aa370104?q=80&w=1000&auto=format&fit=crop';
      case 'hp':
      case 'hindustan petroleum':
        return 'https://images.unsplash.com/photo-1562113530-57ba467cea38?q=80&w=1000&auto=format&fit=crop';
      case 'bp':
      case 'bp petroleum':
        return 'https://images.unsplash.com/photo-1611237879374-c47529971540?q=80&w=1000&auto=format&fit=crop';
      case 'shell':
        return 'https://images.unsplash.com/photo-1603097982156-2870fb896854?q=80&w=1000&auto=format&fit=crop';
      case 'reliance':
        return 'https://images.unsplash.com/photo-1527018601619-a508a2be00cd?q=80&w=1000&auto=format&fit=crop';
      default:
        return 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?q=80&w=1000&auto=format&fit=crop';
    }
  };

  return (
    <Card className="border border-slate-700 bg-slate-800 text-white overflow-hidden transition-shadow hover:shadow-md">
      <div className="h-40 overflow-hidden relative">
        <img 
          src={getPetrolPumpImage(fuelPump.brand)} 
          alt={fuelPump.name} 
          className="object-cover w-full h-full"
        />
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-2">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span className="font-medium text-white">{fuelPump.rating.toFixed(1)}</span>
              <span className="text-xs text-gray-300">({fuelPump.reviewCount} reviews)</span>
            </div>
            <div className="bg-orange-500 text-white px-2 py-1 rounded-full text-xs font-medium">
              {fuelPump.distance.toFixed(1)} km away
            </div>
          </div>
        </div>
      </div>
      <CardContent className="pt-3 pb-4">
        <h3 className="font-bold text-lg mb-1 text-white">{fuelPump.name}</h3>
        <div className="flex flex-col gap-1 mt-2 text-sm">
          <div className="flex items-center gap-1 text-gray-300">
            <MapPin className="h-4 w-4" />
            <span>{fuelPump.address}</span>
          </div>
          <div className="flex items-center gap-1 text-gray-300">
            <Clock className="h-4 w-4" />
            <span>{fuelPump.operatingHours}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FuelPumpCard;
