import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import OrderCard from './OrderCard';
import MapboxMap from './MapboxMap';
import { Phone, Mail, User, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

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
  driver?: {
    name: string;
    phone: string;
    email: string;
    currentLocation?: string;
    coordinates?: { lat: number; lng: number };
  };
};

interface OrderTrackingProps {
  activeOrders: Order[];
  trackingOrderId: string | null;
  onTrackOrder: (orderId: string) => void;
}

const OrderTracking = ({ activeOrders, trackingOrderId, onTrackOrder }: OrderTrackingProps) => {
  const [searchId, setSearchId] = useState('');
  const selectedOrder = activeOrders.find(order => order.id === trackingOrderId);

  const getDriverCoordinates = (order: Order | null) => {
    if (!order || order.status !== 'in-transit' || !order.driver) return null;
    
    if (order.driver.coordinates) {
      return order.driver.coordinates;
    }
    
    return { lat: 21.1702 + (Math.random() * 0.03), lng: 72.8311 + (Math.random() * 0.03) };
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchId.trim()) {
      onTrackOrder(searchId.trim());
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Track Your Order</CardTitle>
      </CardHeader>
      <CardContent>
        {!trackingOrderId ? (
          <div className="space-y-6">
            <div className="text-center py-8">
              <p className="text-gray-500 mb-4">Enter your order ID to track your order</p>
              <form onSubmit={handleSearch} className="flex gap-2 max-w-md mx-auto">
                <Input
                  type="text"
                  placeholder="Enter Order ID"
                  value={searchId}
                  onChange={(e) => setSearchId(e.target.value)}
                  className="flex-1"
                />
                <Button type="submit" className="flex items-center gap-2">
                  <Search className="h-4 w-4" />
                  Track
                </Button>
              </form>
            </div>
          </div>
        ) : !selectedOrder ? (
          <div className="text-center py-8">
            <p className="text-gray-500 mb-4">Order not found</p>
            <Button variant="outline" onClick={() => onTrackOrder('')}>Try Another Order</Button>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="bg-fuel-lightGray p-4 rounded-lg mb-4">
              <div className="grid gap-2 md:grid-cols-2">
                <div className="space-y-1">
                  <p className="text-sm text-gray-500">Order ID</p>
                  <p className="font-medium">{selectedOrder.id}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-gray-500">Status</p>
                  <Badge className={
                    selectedOrder.status === 'pending' ? 'bg-amber-100 text-amber-800' :
                    selectedOrder.status === 'confirmed' ? 'bg-blue-100 text-blue-800' :
                    selectedOrder.status === 'in-transit' ? 'bg-indigo-100 text-indigo-800' :
                    'bg-green-100 text-green-800'
                  }>
                    {selectedOrder.status.replace('-', ' ')}
                  </Badge>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-gray-500">Order Date</p>
                  <p className="font-medium">{selectedOrder.timestamp.toLocaleDateString()}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-gray-500">Estimated Delivery</p>
                  <p className="font-medium">
                    {selectedOrder.estimatedDelivery 
                      ? selectedOrder.estimatedDelivery.toLocaleTimeString() 
                      : 'Awaiting confirmation'}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-gray-500">Total Amount</p>
                  <p className="font-medium">₹{selectedOrder.price.toFixed(2)}</p>
                </div>
                {selectedOrder.paymentMethod && (
                  <div className="space-y-1">
                    <p className="text-sm text-gray-500">Payment Method</p>
                    <p className="font-medium">{selectedOrder.paymentMethod}</p>
                  </div>
                )}
              </div>
            </div>

            {selectedOrder.status === 'in-transit' && selectedOrder.driver && (
              <div className="bg-blue-50 p-4 rounded-lg mb-4 border border-blue-100">
                <h4 className="font-medium mb-2 flex items-center text-blue-800">
                  <User className="h-5 w-5 mr-1 text-blue-500" />
                  Delivery Agent Details
                </h4>
                <div className="grid gap-2 md:grid-cols-2">
                  <div className="space-y-1">
                    <p className="text-sm text-gray-500">Name</p>
                    <p className="font-medium text-gray-900">{selectedOrder.driver.name}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-gray-500">Current Location</p>
                    <p className="font-medium text-gray-900">{selectedOrder.driver.currentLocation || 'In transit'}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-gray-500">Phone</p>
                    <p className="font-medium text-gray-900">{selectedOrder.driver.phone}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="font-medium text-gray-900">{selectedOrder.driver.email}</p>
                  </div>
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  <Button size="sm" variant="outline" className="flex items-center">
                    <Phone className="h-4 w-4 mr-1" /> Call Driver
                  </Button>
                  <Button size="sm" variant="outline" className="flex items-center">
                    <Mail className="h-4 w-4 mr-1" /> Email Driver
                  </Button>
                </div>
              </div>
            )}

            <h3 className="text-lg font-medium mb-3">Delivery Tracking</h3>
            <div className="h-64 rounded-lg overflow-hidden border">
              <MapboxMap 
                address={selectedOrder.deliveryAddress} 
                driverLocation={getDriverCoordinates(selectedOrder)}
              />
            </div>

            <div className="mt-4 flex gap-2">
              {selectedOrder.driver && (
                <Button className="w-full">Contact Driver</Button>
              )}
              <Button variant="outline" className="w-full">Customer Support</Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default OrderTracking;
