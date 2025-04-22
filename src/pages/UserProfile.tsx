import React, { useState, useEffect } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import Header from '@/components/Header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit, Download } from 'lucide-react';
import MapView from '@/components/MapView';

type UserInfo = {
  name: string;
  email: string;
  phone: string;
  address: string;
  joinDate: Date;
  orderCount: number;
};

type OrderHistory = {
  id: string;
  date: Date;
  fuelType: string;
  quantity: number;
  brand: string;
  price: number;
  status: string;
  paymentMethod: string;
  paymentStatus: string;
};

const UserProfile = () => {
  const isMobile = useIsMobile();
  
  // Mock user data
  const [userInfo, setUserInfo] = useState<UserInfo>({
    name: "Vishwas Tiwari",
    email: "vishwas.tiwari@example.com",
    phone: "+91 98765 43210",
    address: "123 Citylight Road, Surat, Gujarat, 395007",
    joinDate: new Date(2023, 5, 15),
    orderCount: 0
  });

  const [orderHistory, setOrderHistory] = useState<OrderHistory[]>([]);

  useEffect(() => {
    const updateOrderHistory = () => {
      if (window.orderSystem) {
        // Convert system orders to order history format
        const history = window.orderSystem.orderHistory.map(order => ({
          id: order.id,
          date: order.timestamp,
          fuelType: order.fuelType,
          quantity: order.quantity,
          brand: order.brand,
          price: order.price,
          status: order.status,
          paymentMethod: order.paymentMethod || 'Unknown',
          paymentStatus: 'Paid'
        }));

        setOrderHistory(history);
        setUserInfo(prev => ({
          ...prev,
          orderCount: history.length
        }));
      }
    };

    // Initial update
    updateOrderHistory();

    // Subscribe to updates
    if (window.orderSystem) {
      window.orderSystem.subscribeToUpdates(updateOrderHistory);
    }

    return () => {
      // Cleanup subscription
      if (window.orderSystem) {
        window.orderSystem.listeners = window.orderSystem.listeners.filter(
          listener => listener !== updateOrderHistory
        );
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-slate-950">
      <Header />
      <main className="container px-4 py-4 md:py-8 max-w-7xl">
        {isMobile ? (
          // Mobile layout
          <div className="space-y-4">
            {/* Profile Card - Mobile */}
            <Card className="bg-slate-900 border-slate-800 text-white">
              <CardHeader className="pb-2 flex flex-row items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src="https://github.com/shadcn.png" />
                    <AvatarFallback className="bg-slate-700 text-xl">VT</AvatarFallback>
                  </Avatar>
                  <div>
                    <h2 className="text-lg font-bold">{userInfo.name}</h2>
                    <p className="text-xs text-gray-400">{userInfo.email}</p>
                  </div>
                </div>
                <Badge className="bg-orange-600 hover:bg-orange-700">Premium</Badge>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="grid grid-cols-2 gap-1 text-xs mt-2">
                  <span className="text-gray-400">Phone:</span>
                  <span className="text-white">{userInfo.phone}</span>
                  <span className="text-gray-400">Member since:</span>
                  <span className="text-white">{userInfo.joinDate.toLocaleDateString()}</span>
                  <span className="text-gray-400">Orders:</span>
                  <span className="text-white">{userInfo.orderCount}</span>
                </div>
                
                <div className="mt-3 pt-2 border-t border-slate-800">
                  <p className="text-xs text-gray-400 mb-1">Delivery Address:</p>
                  <p className="text-sm">{userInfo.address}</p>
                  <div className="h-20 mt-2 rounded overflow-hidden">
                    <MapView address={userInfo.address} />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Order History - Mobile */}
            <Card className="bg-slate-900 border-slate-800 text-white">
              <CardHeader className="py-3">
                <CardTitle className="text-base">Recent Orders</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-3">
                  {orderHistory.slice(0, 3).map((order) => (
                    <div key={order.id} className="p-3 border border-slate-800 rounded-lg bg-slate-800 text-xs">
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="font-medium text-white">{order.id}</span>
                          <p className="text-gray-400 text-xs">{order.date.toLocaleDateString()}</p>
                        </div>
                        <Badge variant="outline" className="text-2xs border-green-500 text-green-400">
                          {order.status}
                        </Badge>
                      </div>
                      
                      <div className="flex justify-between mt-2 text-xs">
                        <span>{order.fuelType} • {order.quantity}L</span>
                        <span className="text-orange-400">₹{order.price.toFixed(2)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          // Desktop layout
          <div className="grid gap-6 md:grid-cols-12">
            <div className="md:col-span-4">
              <Card className="bg-slate-900 border-slate-800 text-white">
                <CardHeader className="pb-4">
                  <div className="flex justify-between items-start">
                    <CardTitle>Profile</CardTitle>
                    <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                      <Edit className="h-4 w-4 mr-1" /> Edit
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col items-center text-center mb-6">
                    <Avatar className="h-24 w-24 mb-4">
                      <AvatarImage src="https://github.com/shadcn.png" />
                      <AvatarFallback className="bg-slate-700 text-xl">VT</AvatarFallback>
                    </Avatar>
                    <h2 className="text-xl font-bold">{userInfo.name}</h2>
                    <p className="text-gray-400">{userInfo.email}</p>
                    <Badge className="mt-2 bg-orange-600 hover:bg-orange-700">Premium Member</Badge>
                  </div>
                  
                  <div className="space-y-3 text-sm">
                    <div className="grid grid-cols-3 gap-1">
                      <span className="text-gray-400">Phone:</span>
                      <span className="col-span-2 text-white">{userInfo.phone}</span>
                    </div>
                    <div className="grid grid-cols-3 gap-1">
                      <span className="text-gray-400">Address:</span>
                      <span className="col-span-2 text-white">{userInfo.address}</span>
                    </div>
                    <div className="grid grid-cols-3 gap-1">
                      <span className="text-gray-400">Member since:</span>
                      <span className="col-span-2 text-white">{userInfo.joinDate.toLocaleDateString()}</span>
                    </div>
                    <div className="grid grid-cols-3 gap-1">
                      <span className="text-gray-400">Total orders:</span>
                      <span className="col-span-2 text-white">{userInfo.orderCount}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="md:col-span-8">
              <Card className="bg-slate-900 border-slate-800 text-white">
                <CardHeader>
                  <CardTitle>Order History</CardTitle>
                  <CardDescription className="text-gray-400">View and manage your past orders</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {orderHistory.map((order) => (
                      <div key={order.id} className="p-4 border border-slate-800 rounded-lg bg-slate-800">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-semibold text-white flex items-center gap-2">
                              {order.id}
                              <Badge variant="outline" className="text-xs ml-2 border-green-500 text-green-400">
                                {order.status}
                              </Badge>
                            </h3>
                            <p className="text-sm text-gray-400">{order.date.toLocaleDateString()}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-orange-400">₹{order.price.toFixed(2)}</p>
                            <p className="text-xs text-gray-400">{order.paymentMethod} • {order.paymentStatus}</p>
                          </div>
                        </div>
                        
                        <div className="mt-3 pt-3 border-t border-slate-700 grid grid-cols-2 gap-2 text-sm">
                          <div>
                            <span className="text-gray-400">Fuel Type: </span>
                            <span className="text-white">{order.fuelType}</span>
                          </div>
                          <div>
                            <span className="text-gray-400">Brand: </span>
                            <span className="text-white">{order.brand}</span>
                          </div>
                          <div>
                            <span className="text-gray-400">Quantity: </span>
                            <span className="text-white">{order.quantity} liters</span>
                          </div>
                          <div className="flex justify-end">
                            <Button variant="ghost" size="sm" className="text-blue-400 hover:text-blue-300 hover:bg-slate-700">
                              <Download className="h-4 w-4 mr-1" /> Invoice
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default UserProfile;
