import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import { Check, X, Clock, Truck, Phone, Mail, User } from 'lucide-react';
import MapView from './MapView';

type Driver = {
  name: string;
  phone: string;
  email: string;
  currentLocation?: string;
};

type Order = {
  id: string;
  status: string;
  customer: string;
  fuelType: string;
  quantity: number;
  brand: string;
  price: number;
  deliveryAddress: string;
  timestamp: Date;
  estimatedDelivery?: Date;
  paymentMethod?: string;
  driverName?: string;
  driver?: Driver;
};

const availableDrivers: Driver[] = [
  {
    name: "Amit Verma",
    phone: "+91 98765 43210",
    email: "amit.verma@fuelmate.com",
    currentLocation: "Adajan, Surat"
  },
  {
    name: "Rajesh Kumar",
    phone: "+91 87654 32109",
    email: "rajesh.kumar@fuelmate.com",
    currentLocation: "City Light, Surat"
  },
  {
    name: "Priya Patel",
    phone: "+91 76543 21098",
    email: "priya.patel@fuelmate.com",
    currentLocation: "Vesu, Surat"
  }
];

declare global {
  interface Window { 
    orderSystem: {
      orders: Order[];
      addOrder: (order: Omit<Order, 'id' | 'status' | 'timestamp'>) => string;
      updateOrderStatus: (id: string, status: string, driver?: Driver) => void;
      getOrder: (id: string) => Order | undefined;
      subscribeToUpdates: (callback: () => void) => void;
      listeners: Array<() => void>;
      orderHistory: Order[];
      addToOrderHistory: (order: Order) => void;
    }; 
  }
}

if (typeof window !== 'undefined') {
  window.orderSystem = window.orderSystem || {
    orders: [],
    orderHistory: [],
    listeners: [],

    addOrder: (order) => {
      const newOrder: Order = {
        ...order,
        id: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
        status: 'pending',
        timestamp: new Date()
      };
      window.orderSystem.orders.push(newOrder);
      window.orderSystem.listeners.forEach(callback => callback());
      return newOrder.id;
    },

    updateOrderStatus: (id, status, driver) => {
      const orderIndex = window.orderSystem.orders.findIndex(o => o.id === id);
      if (orderIndex !== -1) {
        const updatedOrder = {
          ...window.orderSystem.orders[orderIndex],
          status,
          ...(status === 'confirmed' ? { 
            estimatedDelivery: new Date(Date.now() + 1000 * 60 * 45) 
          } : {}),
          ...(status === 'in-transit' && driver ? {
            driverName: driver.name,
            driver
          } : {})
        };
        
        window.orderSystem.orders[orderIndex] = updatedOrder;
        
        // If order is delivered, add it to order history
        if (status === 'delivered') {
          window.orderSystem.addToOrderHistory(updatedOrder);
        }
        
        window.orderSystem.listeners.forEach(callback => callback());
      }
    },

    getOrder: (id) => {
      return window.orderSystem.orders.find(o => o.id === id);
    },

    subscribeToUpdates: (callback) => {
      window.orderSystem.listeners.push(callback);
    },

    addToOrderHistory: (order) => {
      window.orderSystem.orderHistory.push(order);
      // Keep only the last 10 orders in history
      if (window.orderSystem.orderHistory.length > 10) {
        window.orderSystem.orderHistory.shift();
      }
      window.orderSystem.listeners.forEach(callback => callback());
    }
  };
}

const FuelStationDashboard = () => {
  const [orders, setOrders] = useState<Order[]>(window.orderSystem ? window.orderSystem.orders : []);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const updateOrdersState = () => {
      if (window.orderSystem) {
        // Filter out orders older than 24 hours
        const now = new Date();
        const filteredOrders = window.orderSystem.orders.filter(order => {
          const orderAge = now.getTime() - order.timestamp.getTime();
          return orderAge < 24 * 60 * 60 * 1000; // 24 hours in milliseconds
        });
        
        setOrders(filteredOrders);
        if (selectedOrder) {
          const updatedOrder = filteredOrders.find(o => o.id === selectedOrder.id);
          if (updatedOrder) {
            setSelectedOrder(updatedOrder);
          }
        }
      }
    };

    if (window.orderSystem) {
      window.orderSystem.subscribeToUpdates(updateOrdersState);
    }

    return () => {
      // Cleanup subscription
      if (window.orderSystem) {
        window.orderSystem.listeners = window.orderSystem.listeners.filter(
          listener => listener !== updateOrdersState
        );
      }
    };
  }, [selectedOrder]);

  const updateOrderStatus = (orderId: string, newStatus: string) => {
    let driver: Driver | undefined;
    
    if (newStatus === 'in-transit') {
      driver = selectedDriver || availableDrivers[Math.floor(Math.random() * availableDrivers.length)];
    }

    if (window.orderSystem) {
      window.orderSystem.updateOrderStatus(orderId, newStatus, driver);
      
      // Show appropriate toast message based on status
      let toastMessage = "";
      switch (newStatus) {
        case 'confirmed':
          toastMessage = `Order ${orderId} has been confirmed and will be delivered soon.`;
          break;
        case 'in-transit':
          toastMessage = `Order ${orderId} is now in transit with ${driver?.name}.`;
          break;
        case 'delivered':
          toastMessage = `Order ${orderId} has been delivered successfully.`;
          break;
        default:
          toastMessage = `Order ${orderId} status changed to ${newStatus}`;
      }
      
      toast({
        title: "Order Updated",
        description: toastMessage,
      });
    }
  };

  // Filter orders by status
  const pendingOrders = orders.filter(order => order.status === 'pending');
  const activeOrders = orders.filter(order => 
    order.status === 'confirmed' || order.status === 'in-transit'
  );
  const deliveredOrders = orders.filter(order => order.status === 'delivered');
  
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="h-5 w-5" />;
      case 'confirmed': return <Check className="h-5 w-5" />;
      case 'in-transit': return <Truck className="h-5 w-5" />;
      case 'delivered': return <Check className="h-5 w-5" />;
      default: return null;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="bg-amber-100 text-amber-800 hover:bg-amber-100">Pending</Badge>;
      case 'confirmed':
        return <Badge variant="outline" className="bg-blue-100 text-blue-800 hover:bg-blue-100">Confirmed</Badge>;
      case 'in-transit':
        return <Badge variant="outline" className="bg-indigo-100 text-indigo-800 hover:bg-indigo-100">In Transit</Badge>;
      case 'delivered':
        return <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-100">Delivered</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  return (
    <div className="container px-4 py-6 md:py-8">
      <h1 className="text-2xl md:text-3xl font-bold text-white mb-6">Fuel Station Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Pending Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{pendingOrders.length}</div>
            <p className="text-sm text-gray-500">Awaiting confirmation</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Active Deliveries</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{activeOrders.length}</div>
            <p className="text-sm text-gray-500">Currently in progress</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Total Fuel Today</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {orders.reduce((sum, order) => sum + order.quantity, 0)}L
            </div>
            <p className="text-sm text-gray-500">Across all orders</p>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid gap-6 md:grid-cols-12">
        <div className="md:col-span-5 lg:col-span-4 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Order Queue</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="pending">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="pending">Pending</TabsTrigger>
                  <TabsTrigger value="active">Active</TabsTrigger>
                  <TabsTrigger value="all">All</TabsTrigger>
                </TabsList>
                
                <TabsContent value="pending" className="space-y-4 mt-4">
                  {pendingOrders.length === 0 ? (
                    <p className="text-center py-6 text-gray-500">No pending orders</p>
                  ) : (
                    pendingOrders.map(order => (
                      <div 
                        key={order.id}
                        className={`p-3 border rounded-md cursor-pointer hover:border-fuel-blue transition-colors ${
                          selectedOrder?.id === order.id ? 'bg-blue-50 border-blue-200' : ''
                        }`}
                        onClick={() => setSelectedOrder(order)}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-medium">{order.id}</h3>
                            <p className="text-sm text-gray-600">{order.customer}</p>
                          </div>
                          {getStatusBadge(order.status)}
                        </div>
                        <div className="mt-2 text-sm">
                          <p>{order.fuelType} - {order.quantity}L</p>
                          <p className="text-gray-500">{new Date(order.timestamp).toLocaleTimeString()}</p>
                        </div>
                      </div>
                    ))
                  )}
                </TabsContent>
                
                <TabsContent value="active" className="space-y-4 mt-4">
                  {activeOrders.length === 0 ? (
                    <p className="text-center py-6 text-gray-500">No active orders</p>
                  ) : (
                    activeOrders.map(order => (
                      <div 
                        key={order.id}
                        className={`p-3 border rounded-md cursor-pointer hover:border-fuel-blue transition-colors ${
                          selectedOrder?.id === order.id ? 'bg-blue-50 border-blue-200' : ''
                        }`}
                        onClick={() => setSelectedOrder(order)}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-medium">{order.id}</h3>
                            <p className="text-sm text-gray-600">{order.customer}</p>
                          </div>
                          {getStatusBadge(order.status)}
                        </div>
                        <div className="mt-2 text-sm">
                          <p>{order.fuelType} - {order.quantity}L</p>
                          <p className="text-gray-700 font-medium">
                            {order.status === 'in-transit' && order.driverName 
                              ? `Driver: ${order.driverName}` 
                              : new Date(order.timestamp).toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                </TabsContent>
                
                <TabsContent value="all" className="space-y-4 mt-4">
                  {orders.length === 0 ? (
                    <p className="text-center py-6 text-gray-500">No orders</p>
                  ) : (
                    orders.map(order => (
                      <div 
                        key={order.id}
                        className={`p-3 border rounded-md cursor-pointer hover:border-fuel-blue transition-colors ${
                          selectedOrder?.id === order.id ? 'bg-blue-50 border-blue-200' : ''
                        }`}
                        onClick={() => setSelectedOrder(order)}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-medium">{order.id}</h3>
                            <p className="text-sm text-gray-600">{order.customer}</p>
                          </div>
                          {getStatusBadge(order.status)}
                        </div>
                        <div className="mt-2 text-sm">
                          <p>{order.fuelType} - {order.quantity}L</p>
                          <p className="text-gray-500">{new Date(order.timestamp).toLocaleTimeString()}</p>
                        </div>
                      </div>
                    ))
                  )}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
        
        <div className="md:col-span-7 lg:col-span-8">
          <Card>
            <CardHeader>
              <CardTitle>Order Details</CardTitle>
            </CardHeader>
            <CardContent>
              {selectedOrder ? (
                <div>
                  <div className="grid gap-6 md:grid-cols-2 mb-6">
                    <div>
                      <h3 className="text-lg font-medium mb-4">Customer Information</h3>
                      <div className="space-y-3">
                        <div>
                          <p className="text-sm text-gray-500">Customer Name</p>
                          <p className="font-medium">{selectedOrder.customer}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Delivery Address</p>
                          <p className="font-medium">{selectedOrder.deliveryAddress}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Order Time</p>
                          <p className="font-medium">{new Date(selectedOrder.timestamp).toLocaleString()}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-medium mb-4">Order Information</h3>
                      <div className="space-y-3">
                        <div>
                          <p className="text-sm text-gray-500">Fuel Type</p>
                          <p className="font-medium">{selectedOrder.fuelType}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Quantity</p>
                          <p className="font-medium">{selectedOrder.quantity} liters</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Total Amount</p>
                          <p className="font-medium">₹{selectedOrder.price.toFixed(2)}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Status</p>
                          <div className="flex items-center gap-1 mt-1">
                            {getStatusIcon(selectedOrder.status)}
                            {getStatusBadge(selectedOrder.status)}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {selectedOrder.status === 'pending' && (
                    <div className="mb-6">
                      <h3 className="text-lg font-medium mb-3">Assign Driver</h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        {availableDrivers.map((driver) => (
                          <div 
                            key={driver.name}
                            className={`p-3 border rounded-md cursor-pointer hover:border-green-500 transition-colors ${
                              selectedDriver?.name === driver.name ? 'bg-green-50 border-green-500' : ''
                            }`}
                            onClick={() => setSelectedDriver(driver)}
                          >
                            <div className="flex items-center gap-2">
                              <User className="h-5 w-5 text-gray-500" />
                              <p className="font-medium">{driver.name}</p>
                            </div>
                            <div className="mt-2 text-xs text-gray-500">
                              <p className="flex items-center gap-1"><Phone className="h-3 w-3" /> {driver.phone}</p>
                              <p className="flex items-center gap-1"><Truck className="h-3 w-3" /> {driver.currentLocation}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {selectedOrder.driver && (
                    <div className="mb-6 p-4 border rounded-md bg-blue-50">
                      <h3 className="text-lg font-medium mb-2 text-gray-900">Delivery Driver</h3>
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                        <div className="flex items-center gap-3 mb-3 md:mb-0">
                          <User className="h-10 w-10 p-2 bg-blue-100 text-blue-600 rounded-full" />
                          <div>
                            <p className="font-medium text-gray-800">{selectedOrder.driver.name}</p>
                            <p className="text-sm text-gray-600">{selectedOrder.driver.currentLocation}</p>
                          </div>
                        </div>
                        <div className="flex flex-col gap-2">
                          <Button variant="outline" size="sm" className="flex items-center gap-1 text-gray-800">
                            <Phone className="h-4 w-4" /> {selectedOrder.driver.phone}
                          </Button>
                          <Button variant="outline" size="sm" className="flex items-center gap-1 text-gray-800">
                            <Mail className="h-4 w-4" /> Contact via Email
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <div className="mb-6">
                    <h3 className="text-lg font-medium mb-3">Delivery Location</h3>
                    <div className="h-64 rounded-lg overflow-hidden border">
                      <MapView address={selectedOrder.deliveryAddress} />
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-3">
                    {selectedOrder.status === 'pending' && (
                      <>
                        <Button 
                          onClick={() => updateOrderStatus(selectedOrder.id, 'confirmed')}
                          className="bg-green-600 hover:bg-green-700"
                          disabled={!selectedDriver}
                        >
                          <Check className="mr-2 h-4 w-4" /> Confirm Order
                        </Button>
                        <Button variant="destructive" onClick={() => updateOrderStatus(selectedOrder.id, 'cancelled')}>
                          <X className="mr-2 h-4 w-4" /> Reject Order
                        </Button>
                      </>
                    )}
                    
                    {selectedOrder.status === 'confirmed' && (
                      <Button onClick={() => updateOrderStatus(selectedOrder.id, 'in-transit')}>
                        <Truck className="mr-2 h-4 w-4" /> Start Delivery
                      </Button>
                    )}
                    
                    {selectedOrder.status === 'in-transit' && (
                      <Button onClick={() => updateOrderStatus(selectedOrder.id, 'delivered')}>
                        <Check className="mr-2 h-4 w-4" /> Mark as Delivered
                      </Button>
                    )}
                    
                    <Button variant="outline">Contact Customer</Button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-500">Select an order to view details</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default FuelStationDashboard;
