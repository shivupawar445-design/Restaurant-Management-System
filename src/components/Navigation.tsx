import React, { useState } from 'react';
import { useRestaurant } from '../context/RestaurantContext';
import { AppView } from '../types';
import {
  LayoutDashboard,
  Grid,
  UtensilsCrossed,
  ShoppingBag,
  Receipt,
  BarChart3,
  LogOut,
  Menu as MenuIcon,
  X,
  ShoppingCart,
  RotateCcw,
  Sparkles,
  ChevronRight
} from 'lucide-react';

export const Navigation: React.FC = () => {
  const {
    activeView,
    navigateTo,
    currentUser,
    logout,
    cart,
    resetToDemoDefaults
  } = useRestaurant();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const cartItemCount = cart.items.reduce((sum, item) => sum + item.quantity, 0);

  const navItems: { label: string; view: AppView; icon: React.FC<{ className?: string }> }[] = [
    { label: 'Dashboard', view: 'dashboard', icon: LayoutDashboard },
    { label: 'Tables', view: 'tables', icon: Grid },
    { label: 'Menu', view: 'menu', icon: UtensilsCrossed },
    { label: 'Orders', view: 'orders', icon: ShoppingBag },
    { label: 'Billing', view: 'billing', icon: Receipt },
    { label: 'Reports', view: 'reports', icon: BarChart3 },
  ];

  const handleNavClick = (view: AppView) => {
    navigateTo(view);
    setMobileMenuOpen(false);
  };

  const handleResetData = () => {
    resetToDemoDefaults();
    setShowResetConfirm(false);
    setMobileMenuOpen(false);
  };

  return (
    <>
      {/* Top Navbar for Mobile & Header for Desktop */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo and College DevOps Badge */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => handleNavClick('dashboard')}
                className="flex items-center gap-2.5 text-left group"
              >
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-700 to-blue-500 flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
                  <UtensilsCrossed className="w-5 h-5" />
                </div>
                <div>
                  <h1 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight leading-none group-hover:text-blue-600 transition-colors">
                    Restaurant Management System
                  </h1>
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded mt-0.5">
                    <Sparkles className="w-3 h-3 text-blue-500" />
                    DevOps Project
                  </span>
                </div>
              </button>
            </div>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center gap-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeView === item.view;
                return (
                  <button
                    key={item.view}
                    onClick={() => handleNavClick(item.view)}
                    className={`inline-flex items-center gap-2 px-3.5 py-2 text-sm font-medium rounded-xl transition-all ${
                      isActive
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                    {item.label}
                  </button>
                );
              })}
            </nav>

            {/* Right Side Actions: Cart shortcut, Reset data, User & Logout */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Order Cart Shortcut Button */}
              <button
                onClick={() => handleNavClick('cart')}
                className={`relative inline-flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-xl border transition-all ${
                  activeView === 'cart'
                    ? 'border-blue-600 bg-blue-50 text-blue-700'
                    : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                }`}
                title="Active Order Cart"
              >
                <ShoppingCart className="w-4 h-4 text-blue-600" />
                <span className="hidden sm:inline">Cart</span>
                {cartItemCount > 0 && (
                  <span className="inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold text-white bg-blue-600 rounded-full animate-pulse">
                    {cartItemCount}
                  </span>
                )}
              </button>

              {/* Reset Demo Data Button */}
              <button
                onClick={() => setShowResetConfirm(true)}
                className="hidden lg:inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200/80 rounded-lg transition-colors"
                title="Reset sample data to initial state"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Reset Demo
              </button>

              {/* User Info & Logout (Desktop) */}
              <div className="hidden sm:flex items-center pl-2 border-l border-slate-200 gap-2">
                <div className="text-right">
                  <p className="text-xs font-semibold text-slate-800 leading-tight">
                    {currentUser?.name || 'Staff User'}
                  </p>
                  <p className="text-[10px] text-slate-500 uppercase tracking-wider">
                    {currentUser?.role || 'Staff'}
                  </p>
                </div>
                <button
                  onClick={logout}
                  className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>

              {/* Mobile menu hamburger toggle */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-b border-slate-200 px-4 pt-2 pb-4 space-y-1 shadow-lg animate-in slide-in-from-top-2">
            <div className="py-2 mb-2 border-b border-slate-100 flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-slate-900">{currentUser?.name || 'Staff User'}</p>
                <p className="text-xs text-slate-500">{currentUser?.email || 'Logged in'}</p>
              </div>
              <button
                onClick={() => setShowResetConfirm(true)}
                className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded font-medium"
              >
                Reset Demo
              </button>
            </div>

            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeView === item.view;
              return (
                <button
                  key={item.view}
                  onClick={() => handleNavClick(item.view)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-blue-600 text-white'
                      : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                    <span>{item.label}</span>
                  </div>
                  <ChevronRight className="w-4 h-4 opacity-50" />
                </button>
              );
            })}

            <button
              onClick={() => handleNavClick('cart')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                activeView === 'cart'
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              <div className="flex items-center gap-3">
                <ShoppingCart className="w-5 h-5 text-blue-500" />
                <span>Active Order Cart</span>
              </div>
              {cartItemCount > 0 && (
                <span className="text-xs bg-blue-100 text-blue-700 font-bold px-2 py-0.5 rounded-full">
                  {cartItemCount} items
                </span>
              )}
            </button>

            <div className="pt-2 mt-2 border-t border-slate-100">
              <button
                onClick={() => {
                  logout();
                  setMobileMenuOpen(false);
                }}
                className="w-full flex items-center gap-3 px-3.5 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 rounded-xl transition-colors"
              >
                <LogOut className="w-5 h-5" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Reset Confirmation Dialog */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-sm w-full p-6 border border-slate-200">
            <div className="w-12 h-12 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center mb-4">
              <RotateCcw className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Reset Demo Data?</h3>
            <p className="text-sm text-slate-600 mb-6">
              This will reload the initial 20 tables, menu items, and today&apos;s demo orders (Total Tables: 20, Orders: 45, Revenue: ₹18,500).
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowResetConfirm(false)}
                className="px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={handleResetData}
                className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xs"
              >
                Confirm Reset
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
