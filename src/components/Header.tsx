
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Fuel, Settings, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useIsMobile } from '@/hooks/use-mobile';

const Header = () => {
  const location = useLocation();
  const isStationDashboard = location.pathname === '/station';
  const isProfile = location.pathname === '/profile';
  const isMobile = useIsMobile();

  return (
    <header className="sticky top-0 z-50 w-full bg-slate-950 border-b border-slate-800 shadow-md">
      <div className="container flex items-center justify-between h-16 px-4 md:px-6">
        <div className="flex items-center gap-4">
          <Link to="/" className="flex items-center gap-2">
            <Fuel size={24} className="text-orange-500" />
            <span className="text-xl font-bold text-white">FuelMate</span>
          </Link>
          
          {isMobile ? (
            <div>
              {isStationDashboard ? (
                <Link to="/">
                  <Button variant="outline" size="sm" className="bg-slate-800 text-white border-slate-700 hover:bg-slate-700">Customer View</Button>
                </Link>
              ) : (
                <Link to="/station">
                  <Button variant="outline" size="sm" className="bg-slate-800 text-white border-slate-700 hover:bg-slate-700">Station View</Button>
                </Link>
              )}
            </div>
          ) : (
            isStationDashboard ? (
              <Link to="/">
                <Button variant="outline" className="bg-slate-800 text-white border-slate-700 hover:bg-slate-700">Switch to Customer View</Button>
              </Link>
            ) : (
              <Link to="/station">
                <Button variant="outline" className="bg-slate-800 text-white border-slate-700 hover:bg-slate-700">Station Dashboard</Button>
              </Link>
            )
          )}
        </div>
        
        <nav className="flex items-center gap-2 md:gap-4">
          <Link to="/settings">
            <Button variant="ghost" size="icon" className="text-white hover:bg-slate-800">
              <Settings className="w-5 h-5" />
              <span className="sr-only">Settings</span>
            </Button>
          </Link>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full overflow-hidden hover:bg-slate-800">
                <Avatar>
                  <AvatarImage src="https://github.com/shadcn.png" />
                  <AvatarFallback className="bg-slate-700 text-white">VT</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 bg-slate-900 text-white border-slate-800">
              <Link to="/profile" className="w-full">
                <DropdownMenuItem className="hover:bg-slate-800">Profile</DropdownMenuItem>
              </Link>
              <DropdownMenuItem className="hover:bg-slate-800">Order History</DropdownMenuItem>
              <DropdownMenuItem className="hover:bg-slate-800">Payment Methods</DropdownMenuItem>
              <DropdownMenuSeparator className="bg-slate-800" />
              <DropdownMenuItem className="hover:bg-slate-800 text-red-400">Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </nav>
      </div>
    </header>
  );
};

export default Header;
