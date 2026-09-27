import React from 'react';
import { RestaurantProvider, useRestaurant } from './context/RestaurantContext';
import { ToastContainer } from './components/ToastContainer';
import { Navigation } from './components/Navigation';
import { LoginView } from './views/LoginView';
import { RegisterView } from './views/RegisterView';
import { DashboardView } from './views/DashboardView';
import { TableManagementView } from './views/TableManagementView';
import { MenuManagementView } from './views/MenuManagementView';
import { OrderManagementView } from './views/OrderManagementView';
import { CartSummaryView } from './views/CartSummaryView';
import { BillingView } from './views/BillingView';
import { PaymentView } from './views/PaymentView';
import { ConfirmationView } from './views/ConfirmationView';
import { ReportsView } from './views/ReportsView';

const AppContent: React.FC = () => {
  const { activeView, currentUser } = useRestaurant();

  // If user is on login or register, render full-page auth
  if (activeView === 'login') {
    return (
      <main className="min-h-screen bg-slate-50">
        <LoginView />
        <ToastContainer />
      </main>
    );
  }

  if (activeView === 'register') {
    return (
      <main className="min-h-screen bg-slate-50">
        <RegisterView />
        <ToastContainer />
      </main>
    );
  }

  // If somehow not logged in and accessing protected view, render login
  if (!currentUser) {
    return (
      <main className="min-h-screen bg-slate-50">
        <LoginView />
        <ToastContainer />
      </main>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-800">
      {/* Top Navbar & Sidebar Navigation */}
      <Navigation />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8">
        {activeView === 'dashboard' && <DashboardView />}
        {activeView === 'tables' && <TableManagementView />}
        {activeView === 'menu' && <MenuManagementView />}
        {activeView === 'orders' && <OrderManagementView />}
        {activeView === 'cart' && <CartSummaryView />}
        {activeView === 'billing' && <BillingView />}
        {activeView === 'payment' && <PaymentView />}
        {activeView === 'confirmation' && <ConfirmationView />}
        {activeView === 'reports' && <ReportsView />}
      </main>

      {/* Toast Notifications */}
      <ToastContainer />

      {/* Simple Footer for DevOps Capstone Demo */}
      <footer className="border-t border-slate-200 bg-white py-4 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-2">
          <div>
            <span className="font-semibold text-slate-700">Restaurant Management System</span> — College DevOps Project Demo
          </div>
          <div className="flex items-center gap-4">
            <span>Client: React 19 + TypeScript + Tailwind CSS</span>
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span>Storage: HTML5 LocalStorage</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default function App() {
  return (
    <RestaurantProvider>
      <AppContent />
    </RestaurantProvider>
  );
}
