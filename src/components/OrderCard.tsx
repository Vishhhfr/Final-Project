
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Fuel, Clock, CheckCircle, Truck } from 'lucide-react';

type Order = {
  id: string;
  status: 'pending' | 'confirmed' | 'in-transit' | 'delivered' | 'cancelled';
  fuelType: string;
  quantity: number;
  brand: string;
  price: number;
  deliveryAddress: string;
  timestamp: Date;
  estimatedDelivery?: Date;
  paymentMethod?: string;
};

interface OrderCardProps {
  order: Order;
  isSelected?: boolean;
}

const OrderCard = ({ order, isSelected = false }: OrderCardProps) => {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-5 w-5 text-amber-500" />;
      case 'confirmed':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'in-transit':
        return <Truck className="h-5 w-5 text-blue-500" />;
      case 'delivered':
        return <CheckCircle className="h-5 w-5 text-green-700" />;
      default:
        return <Fuel className="h-5 w-5 text-gray-500" />;
    }
  };

  const getProgressValue = (status: string) => {
    switch (status) {
      case 'pending': return 25;
      case 'confirmed': return 50;
      case 'in-transit': return 75;
      case 'delivered': return 100;
      default: return 0;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-amber-100 text-amber-800';
      case 'confirmed': return 'bg-blue-100 text-blue-800';
      case 'in-transit': return 'bg-indigo-100 text-indigo-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Format price with INR currency symbol
  const formattedPrice = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(order.price);

  return (
    <Card className={`transition-all ${isSelected ? 'shadow-md' : 'shadow-sm'}`}>
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-3">
          <div>
            <p className="text-sm font-medium">{order.fuelType} - {order.quantity}L</p>
            <p className="text-xs text-gray-500">{order.brand}</p>
          </div>
          <div className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
            {order.status}
          </div>
        </div>
        
        <div className="mb-3">
          <p className="text-xs text-gray-500 mb-1">Order Progress</p>
          <Progress value={getProgressValue(order.status)} className="h-1.5" />
        </div>
        
        <div className="flex justify-between items-center text-xs">
          <div className="flex items-center gap-1">
            {getStatusIcon(order.status)}
            <span className="capitalize">{order.status.replace('-', ' ')}</span>
          </div>
          <span className="font-medium">{formattedPrice}</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default OrderCard;
