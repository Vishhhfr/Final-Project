
import React, { useState } from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { 
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle 
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue 
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import MapView from './MapView';
import { MapPin, CreditCard, Wallet, BanknoteIcon } from 'lucide-react';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import FuelPumpCard, { FuelPump } from './FuelPumpCard';

const formSchema = z.object({
  fuelType: z.string().min(1, "Please select a fuel type"),
  quantity: z.number().min(1, "Minimum order is 1 liter").max(20, "Maximum order is 20 liters"),
  brand: z.string().min(1, "Please select a fuel brand"),
  deliveryAddress: z.string().min(5, "Please enter a valid address"),
  paymentMethod: z.string().min(1, "Please select a payment method"),
});

type FormValues = z.infer<typeof formSchema>;

type FuelBrand = {
  id: string;
  name: string;
  price: {
    petrol: number;
    diesel: number;
  };
};

// Mock fuel brand data with Indian pricing (₹ per liter)
const fuelBrands: FuelBrand[] = [
  { id: "indianoil", name: "Indian Oil", price: { petrol: 95.41, diesel: 86.67 } },
  { id: "hp", name: "HP", price: { petrol: 95.50, diesel: 86.70 } },
  { id: "bp", name: "BP", price: { petrol: 95.30, diesel: 86.55 } },
  { id: "reliance", name: "Reliance", price: { petrol: 94.80, diesel: 85.90 } },
];

// Mock fuel pump data
const fuelPumps: Record<string, FuelPump[]> = {
  "indianoil": [
    {
      id: "io-1",
      name: "Indian Oil COCO",
      brand: "Indian Oil",
      address: "Citylight Road, Surat, Gujarat",
      distance: 1.2,
      rating: 4.7,
      reviewCount: 128,
      imageUrl: "https://images.unsplash.com/photo-1487958449943-2429e8be8625?auto=format&fit=crop&q=80",
      operatingHours: "Open 24 hours"
    },
    {
      id: "io-2",
      name: "Indian Oil Dumas",
      brand: "Indian Oil",
      address: "Dumas Road, Surat, Gujarat",
      distance: 3.5,
      rating: 4.5,
      reviewCount: 97,
      imageUrl: "https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&q=80",
      operatingHours: "6:00 AM - 11:00 PM"
    }
  ],
  "hp": [
    {
      id: "hp-1",
      name: "HP Petrol Pump",
      brand: "HP",
      address: "Adajan, Surat, Gujarat",
      distance: 0.8,
      rating: 4.6,
      reviewCount: 103,
      imageUrl: "https://images.unsplash.com/photo-1494891848038-7bd202a2afeb?auto=format&fit=crop&q=80",
      operatingHours: "Open 24 hours"
    }
  ],
  "bp": [
    {
      id: "bp-1",
      name: "BP Service Station",
      brand: "BP",
      address: "Vesu, Surat, Gujarat",
      distance: 2.1,
      rating: 4.4,
      reviewCount: 86,
      imageUrl: "https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&q=80",
      operatingHours: "5:00 AM - 12:00 AM"
    }
  ],
  "reliance": [
    {
      id: "rel-1",
      name: "Reliance Petroleum",
      brand: "Reliance",
      address: "Udhna, Surat, Gujarat",
      distance: 2.8,
      rating: 4.3,
      reviewCount: 76,
      imageUrl: "https://images.unsplash.com/photo-1494891848038-7bd202a2afeb?auto=format&fit=crop&q=80",
      operatingHours: "Open 24 hours"
    }
  ]
};

const paymentOptions = [
  { id: "upi", name: "UPI", icon: "wallet" },
  { id: "card", name: "Credit/Debit Card", icon: "credit-card" },
  { id: "cod", name: "Cash on Delivery", icon: "banknote" },
  { id: "wallet", name: "FuelMate Wallet", icon: "wallet" },
];

interface FuelOrderFormProps {
  onSubmit: (data: any) => void;
}

const FuelOrderForm = ({ onSubmit }: FuelOrderFormProps) => {
  const [selectedBrand, setSelectedBrand] = useState<FuelBrand | null>(null);
  const [selectedFuelType, setSelectedFuelType] = useState<'petrol' | 'diesel' | ''>('');
  const [quantity, setQuantity] = useState<number>(5);
  const [nearestPumps, setNearestPumps] = useState<FuelPump[]>([]);
  
  const calculatePrice = () => {
    if (!selectedBrand || !selectedFuelType) return 0;
    return selectedBrand.price[selectedFuelType] * quantity;
  };

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fuelType: "",
      quantity: 5,
      brand: "",
      deliveryAddress: "",
      paymentMethod: "",
    },
  });

  const handleSubmitForm = (values: FormValues) => {
    const totalPrice = calculatePrice();
    onSubmit({
      ...values,
      price: totalPrice
    });
    form.reset();
    setSelectedBrand(null);
    setSelectedFuelType('');
    setQuantity(5);
    setNearestPumps([]);
  };

  return (
    <Card className="bg-slate-900 border-slate-800 text-white">
      <CardHeader>
        <CardTitle>Order Fuel Delivery</CardTitle>
        <CardDescription className="text-gray-400">
          Fill in the details below to place your fuel delivery order
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmitForm)} className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="fuelType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">Fuel Type</FormLabel>
                    <Select 
                      onValueChange={(value) => {
                        field.onChange(value);
                        setSelectedFuelType(value as 'petrol' | 'diesel');
                      }} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="bg-slate-800 text-white border-slate-700">
                          <SelectValue placeholder="Select fuel type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-slate-800 border-slate-700 text-white">
                        <SelectItem value="petrol" className="focus:bg-slate-700 focus:text-white">Petrol</SelectItem>
                        <SelectItem value="diesel" className="focus:bg-slate-700 focus:text-white">Diesel</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="brand"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">Fuel Brand</FormLabel>
                    <Select 
                      onValueChange={(value) => {
                        field.onChange(value);
                        const brand = fuelBrands.find(b => b.id === value) || null;
                        setSelectedBrand(brand);
                        // Set the nearest pumps based on selected brand
                        if (value in fuelPumps) {
                          setNearestPumps(fuelPumps[value]);
                        } else {
                          setNearestPumps([]);
                        }
                      }} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="bg-slate-800 text-white border-slate-700">
                          <SelectValue placeholder="Select a brand" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-slate-800 border-slate-700 text-white">
                        {fuelBrands.map((brand) => (
                          <SelectItem key={brand.id} value={brand.id} className="focus:bg-slate-700 focus:text-white">
                            {brand.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="quantity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white">Quantity (Liters): {quantity}</FormLabel>
                  <FormControl>
                    <Slider
                      defaultValue={[field.value]}
                      min={1}
                      max={20}
                      step={1}
                      onValueChange={(vals) => {
                        const value = vals[0];
                        field.onChange(value);
                        setQuantity(value);
                      }}
                      className="py-2"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {selectedBrand && nearestPumps.length > 0 && (
              <div>
                <h3 className="text-lg font-medium mb-3 text-white">Nearest Fuel Pumps</h3>
                <div className="grid gap-4 md:grid-cols-2">
                  {nearestPumps.map(pump => (
                    <FuelPumpCard key={pump.id} fuelPump={pump} />
                  ))}
                </div>
              </div>
            )}

            <FormField
              control={form.control}
              name="deliveryAddress"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white">Delivery Address</FormLabel>
                  <FormControl>
                    <div className="flex">
                      <Input 
                        {...field} 
                        placeholder="Enter your delivery address" 
                        className="bg-slate-800 border-slate-700 text-white"
                      />
                      <Button 
                        type="button" 
                        variant="outline" 
                        size="icon" 
                        className="ml-2 bg-slate-800 border-slate-700 text-white hover:bg-slate-700"
                        onClick={() => {
                          // This would normally use geolocation
                          field.onChange("123 Current Location St");
                        }}
                      >
                        <MapPin className="h-4 w-4" />
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="h-40 rounded-md overflow-hidden border border-slate-700">
              <MapView address="Surat, Gujarat, India" />
            </div>

            <FormField
              control={form.control}
              name="paymentMethod"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel className="text-white">Payment Method</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="grid grid-cols-2 gap-4"
                    >
                      <div className="flex items-center space-x-2 rounded-md border border-slate-700 p-3 bg-slate-800">
                        <RadioGroupItem value="upi" id="upi" className="border-slate-700" />
                        <Label htmlFor="upi" className="flex items-center gap-2">
                          <Wallet className="h-4 w-4 text-green-400" />
                          <span>UPI</span>
                        </Label>
                      </div>
                      
                      <div className="flex items-center space-x-2 rounded-md border border-slate-700 p-3 bg-slate-800">
                        <RadioGroupItem value="card" id="card" className="border-slate-700" />
                        <Label htmlFor="card" className="flex items-center gap-2">
                          <CreditCard className="h-4 w-4 text-blue-400" />
                          <span>Card</span>
                        </Label>
                      </div>
                      
                      <div className="flex items-center space-x-2 rounded-md border border-slate-700 p-3 bg-slate-800">
                        <RadioGroupItem value="cod" id="cod" className="border-slate-700" />
                        <Label htmlFor="cod" className="flex items-center gap-2">
                          <BanknoteIcon className="h-4 w-4 text-yellow-400" />
                          <span>Cash on Delivery</span>
                        </Label>
                      </div>
                      
                      <div className="flex items-center space-x-2 rounded-md border border-slate-700 p-3 bg-slate-800">
                        <RadioGroupItem value="wallet" id="wallet" className="border-slate-700" />
                        <Label htmlFor="wallet" className="flex items-center gap-2">
                          <Wallet className="h-4 w-4 text-orange-400" />
                          <span>FuelMate Wallet</span>
                        </Label>
                      </div>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {selectedBrand && selectedFuelType && (
              <div className="bg-slate-800 p-4 rounded-md border border-slate-700">
                <h3 className="font-medium text-lg text-white">Order Summary</h3>
                <div className="mt-2 space-y-1">
                  <div className="flex justify-between">
                    <span className="text-gray-300">Fuel Type:</span>
                    <span className="font-medium text-white">{selectedFuelType.charAt(0).toUpperCase() + selectedFuelType.slice(1)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Brand:</span>
                    <span className="font-medium text-white">{selectedBrand.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Quantity:</span>
                    <span className="font-medium text-white">{quantity} liters</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Price per liter:</span>
                    <span className="font-medium text-white">₹{selectedBrand.price[selectedFuelType].toFixed(2)}</span>
                  </div>
                  <div className="border-t border-slate-700 pt-2 mt-2 flex justify-between">
                    <span className="font-bold text-white">Total Price:</span>
                    <span className="font-bold text-orange-400">₹{calculatePrice().toFixed(2)}</span>
                  </div>
                </div>
              </div>
            )}

            <Button 
              type="submit" 
              className="w-full bg-orange-500 hover:bg-orange-600"
            >
              Place Order
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default FuelOrderForm;
