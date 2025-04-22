
import React from 'react';
import Header from '@/components/Header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Share2, HelpCircle, Info, Bell, CreditCard, Shield, Globe, Smartphone } from 'lucide-react';
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";

const Settings = () => {
  return (
    <div className="min-h-screen bg-slate-950">
      <Header />
      <main className="container px-4 py-6 md:py-8 max-w-5xl">
        <h1 className="text-2xl md:text-3xl font-bold text-white mb-6">Settings</h1>
        
        <div className="grid gap-6">
          <Card className="bg-slate-900 border-slate-800 text-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5 text-orange-400" />
                Notifications
              </CardTitle>
              <CardDescription className="text-gray-400">Manage your notification preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="order-updates" className="flex-1">Order status updates</Label>
                <Switch id="order-updates" defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="delivery-updates" className="flex-1">Delivery notifications</Label>
                <Switch id="delivery-updates" defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="promotions" className="flex-1">Promotions and offers</Label>
                <Switch id="promotions" />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="email-notifications" className="flex-1">Email notifications</Label>
                <Switch id="email-notifications" defaultChecked />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-slate-900 border-slate-800 text-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-orange-400" />
                Payment Methods
              </CardTitle>
              <CardDescription className="text-gray-400">Manage your payment options</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-3 rounded-md border border-slate-800 bg-slate-800 flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="bg-blue-600 w-10 h-6 rounded flex items-center justify-center text-white text-xs font-bold">VISA</div>
                  <div>
                    <p className="text-white">•••• •••• •••• 4242</p>
                    <p className="text-xs text-gray-400">Expires 12/25</p>
                  </div>
                </div>
                <Button variant="ghost" size="sm" className="text-red-400 hover:text-red-300 hover:bg-slate-700">Remove</Button>
              </div>
              
              <Button variant="outline" className="w-full bg-slate-800 border-slate-700 text-white hover:bg-slate-700">
                Add New Payment Method
              </Button>
            </CardContent>
          </Card>
          
          <Card className="bg-slate-900 border-slate-800 text-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Share2 className="h-5 w-5 text-orange-400" />
                Refer a Friend
              </CardTitle>
              <CardDescription className="text-gray-400">Share FuelMate with friends and family</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-gray-300">Share your referral code and both you and your friend will get ₹100 off on your next order!</p>
              
              <div className="flex gap-2">
                <Input value="FUELMATE100" readOnly className="bg-slate-800 border-slate-700 text-white" />
                <Button className="bg-orange-500 hover:bg-orange-600">Copy</Button>
              </div>
              
              <div className="flex gap-2 mt-4">
                <Button variant="outline" className="flex-1 bg-slate-800 border-slate-700 text-white hover:bg-slate-700">
                  <Smartphone className="h-4 w-4 mr-2" />
                  SMS
                </Button>
                <Button variant="outline" className="flex-1 bg-slate-800 border-slate-700 text-white hover:bg-slate-700">
                  <Globe className="h-4 w-4 mr-2" />
                  Email
                </Button>
                <Button variant="outline" className="flex-1 bg-slate-800 border-slate-700 text-white hover:bg-slate-700">
                  <Share2 className="h-4 w-4 mr-2" />
                  Share
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-slate-900 border-slate-800 text-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Info className="h-5 w-5 text-orange-400" />
                About & Support
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="about" className="border-slate-800">
                  <AccordionTrigger className="text-white hover:text-white">About FuelMate</AccordionTrigger>
                  <AccordionContent className="text-gray-300">
                    <p>FuelMate is a revolutionary service that delivers fuel right to your doorstep. Our mission is to make fuel delivery convenient, safe, and affordable for everyone.</p>
                    <p className="mt-2">Version 1.2.0</p>
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="faq" className="border-slate-800">
                  <AccordionTrigger className="text-white hover:text-white">Frequently Asked Questions</AccordionTrigger>
                  <AccordionContent className="text-gray-300 space-y-3">
                    <div>
                      <h4 className="font-medium text-white">How does fuel delivery work?</h4>
                      <p className="text-sm">We deliver fuel directly to your location using specialized vehicles that are safe and compliant with all regulations.</p>
                    </div>
                    <div>
                      <h4 className="font-medium text-white">Is there a minimum order quantity?</h4>
                      <p className="text-sm">Yes, the minimum order is 5 liters of fuel.</p>
                    </div>
                    <div>
                      <h4 className="font-medium text-white">How long does delivery take?</h4>
                      <p className="text-sm">Delivery times typically range from 30 minutes to 2 hours depending on your location and current demand.</p>
                    </div>
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="contact" className="border-slate-800">
                  <AccordionTrigger className="text-white hover:text-white">Contact Support</AccordionTrigger>
                  <AccordionContent className="text-gray-300">
                    <p>Email: support@fuelmate.com</p>
                    <p>Phone: +91 1800 123 4567</p>
                    <p className="mt-2">Available 24/7 for your support needs.</p>
                    <Button className="mt-3 bg-orange-500 hover:bg-orange-600">
                      <HelpCircle className="h-4 w-4 mr-2" />
                      Contact Support
                    </Button>
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="terms" className="border-slate-800">
                  <AccordionTrigger className="text-white hover:text-white">Terms & Privacy</AccordionTrigger>
                  <AccordionContent className="text-gray-300">
                    <Button variant="link" className="text-blue-400 p-0 h-auto">Terms of Service</Button>
                    <Separator className="my-2 bg-slate-800" />
                    <Button variant="link" className="text-blue-400 p-0 h-auto">Privacy Policy</Button>
                    <Separator className="my-2 bg-slate-800" />
                    <Button variant="link" className="text-blue-400 p-0 h-auto">Data Usage Policy</Button>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>
          
          <Card className="bg-slate-900 border-slate-800 text-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-orange-400" />
                Account Security
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button variant="outline" className="w-full bg-slate-800 border-slate-700 text-white hover:bg-slate-700">Change Password</Button>
              <Button variant="outline" className="w-full bg-slate-800 border-slate-700 text-white hover:bg-slate-700">Enable Two-Factor Authentication</Button>
              <Button variant="destructive" className="w-full">Sign Out from All Devices</Button>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Settings;
