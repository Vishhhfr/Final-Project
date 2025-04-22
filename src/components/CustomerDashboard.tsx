import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import FuelOrderForm from './FuelOrderForm';
import OrderTracking from './OrderTracking';
import { useToast } from "@/components/ui/use-toast";

// Define a CustomerOrder type that's compatible with the station Order type
// but specific to customer dashboard needs
type CustomerOrder = {
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
  };
};

// For type compatibility when interacting with the station dashboard
type StationOrder = {
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
  driver?: {
    name: string;
    phone: string;
    email: string;
    currentLocation?: string;
  };
};

const CustomerDashboard = () => {
  const { toast } = useToast();
  const [activeOrders, setActiveOrders] = useState<CustomerOrder[]>([]);
  const [pastOrders, setPastOrders] = useState<CustomerOrder[]>([]);
  const [trackingOrderId, setTrackingOrderId] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchOrders = () => {
      if (window.orderSystem) {
        // Filter orders for the current user and within the last 24 hours
        const now = new Date();
        const systemOrders = window.orderSystem.orders.filter(order => {
          const orderAge = now.getTime() - order.timestamp.getTime();
          return orderAge < 24 * 60 * 60 * 1000; // 24 hours in milliseconds
        });
        
        // Convert the station orders to customer orders with proper typing
        const customerOrders = systemOrders.map(order => ({
          id: order.id,
          status: order.status as 'pending' | 'confirmed' | 'in-transit' | 'delivered' | 'cancelled',
          fuelType: order.fuelType,
          quantity: order.quantity,
          brand: order.brand,
          price: order.price,
          deliveryAddress: order.deliveryAddress,
          timestamp: order.timestamp,
          estimatedDelivery: order.estimatedDelivery,
          paymentMethod: order.paymentMethod,
          driver: order.driver
        }));
        
        // Only show active orders in the recent orders section
        setActiveOrders(customerOrders.filter(order => 
          order.status === 'pending' || 
          order.status === 'confirmed' || 
          order.status === 'in-transit'
        ));
        
        // Only show delivered orders in the past orders section
        setPastOrders(customerOrders.filter(order => 
          order.status === 'delivered'
        ));
      }
    };
    
    // Initial fetch
    fetchOrders();
    
    // Subscribe to updates
    if (window.orderSystem) {
      window.orderSystem.subscribeToUpdates(fetchOrders);
    }
    
    return () => {
      // Cleanup subscription
      if (window.orderSystem) {
        window.orderSystem.listeners = window.orderSystem.listeners.filter(
          listener => listener !== fetchOrders
        );
      }
    };
  }, []);

  const handleOrderSubmit = (orderData: Omit<CustomerOrder, 'id' | 'status' | 'timestamp'>) => {
    let newOrderId = '';
    
    if (window.orderSystem) {
      const stationOrderData = {
        ...orderData,
        customer: "Current User"
      };
      
      newOrderId = window.orderSystem.addOrder(stationOrderData);
      
      const newSystemOrder = window.orderSystem.orders.find(o => o.id === newOrderId);
      
      if (newSystemOrder) {
        const newCustomerOrder: CustomerOrder = {
          id: newSystemOrder.id,
          status: newSystemOrder.status as 'pending',
          fuelType: newSystemOrder.fuelType,
          quantity: newSystemOrder.quantity,
          brand: newSystemOrder.brand,
          price: newSystemOrder.price,
          deliveryAddress: newSystemOrder.deliveryAddress,
          timestamp: newSystemOrder.timestamp,
          paymentMethod: newSystemOrder.paymentMethod
        };
        
        setActiveOrders(prev => [...prev, newCustomerOrder]);
        
        toast({
          title: "Order Placed Successfully!",
          description: `Your order #${newOrderId} has been placed and is waiting for confirmation.`,
        });
      }
    }
  };

  // Listen for status changes that should trigger notifications
  useEffect(() => {
    const handleOrderStatusChange = () => {
      if (!window.orderSystem) return;
      
      const systemOrders = window.orderSystem.orders;
      
      const customerOrdersFromSystem = systemOrders.map(order => ({
        id: order.id,
        status: order.status as 'pending' | 'confirmed' | 'in-transit' | 'delivered' | 'cancelled',
        fuelType: order.fuelType,
        quantity: order.quantity,
        brand: order.brand,
        price: order.price,
        deliveryAddress: order.deliveryAddress,
        timestamp: order.timestamp,
        estimatedDelivery: order.estimatedDelivery,
        driver: order.driver,
        paymentMethod: order.paymentMethod
      }));
      
      // Check for newly confirmed orders
      const newlyConfirmed = customerOrdersFromSystem.filter(order => 
        order.status === 'confirmed' && 
        !activeOrders.some(o => o.id === order.id && o.status === 'confirmed')
      );
      
      // Check for newly started deliveries
      const newlyInTransit = customerOrdersFromSystem.filter(order => 
        order.status === 'in-transit' && 
        !activeOrders.some(o => o.id === order.id && o.status === 'in-transit')
      );
      
      // Check for newly delivered orders
      const newlyDelivered = customerOrdersFromSystem.filter(order => 
        order.status === 'delivered' && 
        !pastOrders.some(o => o.id === order.id)
      );
      
      // Show notifications for status changes
      newlyConfirmed.forEach(order => {
        toast({
          title: "Order Confirmed!",
          description: `Your order #${order.id} has been confirmed and will be delivered soon.`,
        });
      });
      
      newlyInTransit.forEach(order => {
        toast({
          title: "Delivery Started!",
          description: `Your order #${order.id} is on the way with ${order.driver?.name || 'our delivery agent'}.`,
        });
      });
      
      newlyDelivered.forEach(order => {
        toast({
          title: "Order Delivered!",
          description: `Your order #${order.id} has been delivered successfully.`,
        });
      });
    };
    
    handleOrderStatusChange();
  }, [activeOrders, pastOrders, toast]);

  return (
    <div className="container px-4 py-6 md:py-8 max-w-7xl">
      <h1 className="text-2xl md:text-3xl font-bold text-white mb-6">Welcome to FuelMate</h1>
      <div className="grid gap-6 md:grid-cols-12">
        <div className="md:col-span-7 lg:col-span-8">
          <Tabs defaultValue="order" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-slate-800">
              <TabsTrigger value="order" className="data-[state=active]:bg-orange-500 data-[state=active]:text-white">Order Fuel</TabsTrigger>
              <TabsTrigger value="track" className="data-[state=active]:bg-orange-500 data-[state=active]:text-white">Track Order</TabsTrigger>
            </TabsList>
            <TabsContent value="order" className="mt-4">
              <FuelOrderForm onSubmit={handleOrderSubmit} />
            </TabsContent>
            <TabsContent value="track" className="mt-4">
              <OrderTracking 
                activeOrders={activeOrders} 
                trackingOrderId={trackingOrderId}
                onTrackOrder={(orderId) => setTrackingOrderId(orderId)}
              />
            </TabsContent>
          </Tabs>
        </div>
        <div className="md:col-span-5 lg:col-span-4">
          <div className="bg-slate-900 rounded-lg border border-slate-800 shadow-sm p-4">
            <h2 className="text-lg font-semibold text-white mb-4">Quick Info</h2>
            <div className="space-y-4">
              <div className="p-3 border rounded-md bg-slate-800 border-slate-700">
                <h3 className="font-medium text-white mb-2">How to Order</h3>
                <ol className="text-sm text-gray-400 space-y-2 list-decimal list-inside">
                  <li>Select your fuel type and quantity</li>
                  <li>Choose your preferred brand</li>
                  <li>Enter your delivery address</li>
                  <li>Select payment method</li>
                  <li>Place your order</li>
                </ol>
              </div>
              <div className="p-3 border rounded-md bg-slate-800 border-slate-700">
                <h3 className="font-medium text-white mb-2">Order Status</h3>
                <div className="text-sm text-gray-400 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-amber-500"></span>
                    <span>Pending - Waiting for confirmation</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-blue-500"></span>
                    <span>Confirmed - Order accepted</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-indigo-500"></span>
                    <span>In Transit - On the way</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerDashboard;
