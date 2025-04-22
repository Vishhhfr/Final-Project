
import React from 'react';
import Header from '@/components/Header';
import FuelStationDashboard from '@/components/FuelStationDashboard';

const StationDashboard = () => {
  return (
    <div className="min-h-screen bg-slate-950">
      <Header />
      <main className="pt-4 pb-16">
        <FuelStationDashboard />
      </main>
    </div>
  );
};

export default StationDashboard;
