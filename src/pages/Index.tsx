
import React from 'react';
import Header from '@/components/Header';
import CustomerDashboard from '@/components/CustomerDashboard';

const Index = () => {
  return (
    <div className="min-h-screen bg-slate-950">
      <Header />
      <main className="pt-4 pb-16">
        <CustomerDashboard />
      </main>
    </div>
  );
};

export default Index;
