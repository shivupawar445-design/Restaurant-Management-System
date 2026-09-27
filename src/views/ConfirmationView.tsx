import React, { useState } from 'react';
import { useRestaurant } from '../context/RestaurantContext';
import {
  CheckCircle,
  FileText,
  LayoutDashboard,
  UtensilsCrossed,
  Printer,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { ReceiptModal } from '../components/ReceiptModal';

export const ConfirmationView: React.FC = () => {
  const {
    latestPaidOrder,
    orders,
    navigateTo,
    setCartTableNumber,
  } = useRestaurant();

  const [showReceiptModal, setShowReceiptModal] = useState(false);

  // Fallback to most recent paid order if needed
  const confirmedOrder =
    latestPaidOrder ||
    orders.find((o) => o.status === 'Paid') ||
    orders[0];

  const handleStartNewOrder = () => {
    setCartTableNumber(1);
    navigateTo('menu');
  };

  return (
    <div className="max-w-2xl mx-auto py-8 px-4 sm:px-6 space-y-6 pb-16">
      {/* Confirmation Success Card */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xl shadow-slate-200/50 p-8 text-center relative overflow-hidden">
        {/* Decorative background accent */}
        <div className="absolute -right-16 -top-16 w-48 h-48 bg-emerald-50 rounded-full pointer-events-none -z-0 opacity-80" />
        <div className="absolute -left-16 -bottom-16 w-48 h-48 bg-blue-50 rounded-full pointer-events-none -z-0 opacity-80" />

        <div className="relative z-10">
          {/* Success Check Icon */}
          <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-5 shadow-lg shadow-emerald-500/20 ring-8 ring-emerald-50 animate-in zoom-in-75 duration-300">
            <CheckCircle className="w-10 h-10" />
          </div>

          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100/70 border border-emerald-200 mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            Order Confirmed
          </span>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Payment Successful!
          </h2>
          <p className="text-sm text-slate-500 mt-1 max-w-md mx-auto">
            The transaction has settled and Table #{confirmedOrder?.tableNumber} has been updated to Available.
          </p>

          {/* Transaction Metadata Card */}
          {confirmedOrder && (
            <div className="mt-8 p-5 bg-slate-50/80 rounded-2xl border border-slate-200/90 text-left space-y-3 max-w-md mx-auto">
              <div className="flex justify-between items-center text-xs pb-2 border-b border-slate-200">
                <span className="text-slate-500 font-semibold uppercase tracking-wider">Order ID</span>
                <span className="font-mono font-bold text-slate-900 text-sm">{confirmedOrder.id}</span>
              </div>

              <div className="flex justify-between items-center text-xs pb-2 border-b border-slate-200">
                <span className="text-slate-500 font-semibold uppercase tracking-wider">Dining Table</span>
                <span className="font-semibold text-slate-800">Table #{confirmedOrder.tableNumber}</span>
              </div>

              <div className="flex justify-between items-center text-xs pb-2 border-b border-slate-200">
                <span className="text-slate-500 font-semibold uppercase tracking-wider">Payment Method</span>
                <span className="font-semibold text-slate-800">{confirmedOrder.paymentMethod || 'UPI'}</span>
              </div>

              <div className="flex justify-between items-center text-xs pb-2 border-b border-slate-200">
                <span className="text-slate-500 font-semibold uppercase tracking-wider">Time</span>
                <span className="text-slate-700 font-mono">
                  {new Date(confirmedOrder.paymentTime || confirmedOrder.createdAt).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit'
                  })}
                </span>
              </div>

              <div className="flex justify-between items-baseline pt-1">
                <span className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">Total Paid</span>
                <span className="text-2xl font-black text-emerald-600 font-mono">
                  ₹{confirmedOrder.total.toLocaleString('en-IN')}.00
                </span>
              </div>
            </div>
          )}

          {/* Action Buttons as requested */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            {/* View Receipt Button */}
            <button
              onClick={() => setShowReceiptModal(true)}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-white hover:bg-slate-50 text-slate-800 font-bold text-xs rounded-xl border border-slate-300 shadow-xs transition-colors"
            >
              <FileText className="w-4 h-4 text-blue-600" />
              <span>View Receipt</span>
            </button>

            {/* Back to Dashboard Button */}
            <button
              onClick={() => navigateTo('dashboard')}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md hover:shadow-lg transition-all"
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Back to Dashboard</span>
            </button>

            {/* Start New Order */}
            <button
              onClick={handleStartNewOrder}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl transition-colors"
            >
              <UtensilsCrossed className="w-4 h-4" />
              <span>Take New Order</span>
            </button>
          </div>
        </div>
      </div>

      {/* Official Receipt Modal */}
      <ReceiptModal
        order={confirmedOrder}
        isOpen={showReceiptModal}
        onClose={() => setShowReceiptModal(false)}
      />
    </div>
  );
};
