import React, { useState } from 'react';
import { useRestaurant } from '../context/RestaurantContext';
import { Order } from '../types';
import {
  Receipt,
  Printer,
  CreditCard,
  CheckCircle,
  Clock,
  ArrowRight,
  FileText,
  UtensilsCrossed,
  Sparkles
} from 'lucide-react';
import { ReceiptModal } from '../components/ReceiptModal';

export const BillingView: React.FC = () => {
  const {
    orders,
    billingOrder,
    setBillingOrder,
    navigateTo,
  } = useRestaurant();

  const [showReceiptModal, setShowReceiptModal] = useState(false);

  // Active or pending orders available to be billed
  const billableOrders = orders.filter(
    (o) => o.status !== 'Cancelled'
  );

  // If no specific billing order is currently selected, pick the first unpaid or recent order
  const activeOrderToBill: Order | null =
    billingOrder ||
    billableOrders.find((o) => ['Billed', 'Served', 'Preparing', 'Confirmed'].includes(o.status)) ||
    orders[0] ||
    null;

  const handleSelectOrder = (orderId: string) => {
    const found = orders.find((o) => o.id === orderId);
    if (found) {
      setBillingOrder(found);
    }
  };

  const handleProceedToPayment = () => {
    if (activeOrderToBill) {
      setBillingOrder(activeOrderToBill);
      navigateTo('payment');
    }
  };

  const handleGenerateBill = () => {
    setShowReceiptModal(true);
  };

  if (!activeOrderToBill) {
    return (
      <div className="max-w-2xl mx-auto py-12 px-4">
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center shadow-xs">
          <Receipt className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-900">No Orders Available for Billing</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto mb-6">
            Create an order from the Menu or Tables module to generate a customer invoice.
          </p>
          <button
            onClick={() => navigateTo('menu')}
            className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl"
          >
            Create New Order
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-600">
            <Receipt className="w-4 h-4" />
            <span>Invoice & Checkout</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight mt-1">
            Billing & Invoicing
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Review tax calculations, generate official guest slips, and accept settlements.
          </p>
        </div>

        {/* Order Selector Dropdown */}
        <div className="flex items-center gap-2">
          <label className="text-xs font-semibold text-slate-600">Select Order:</label>
          <select
            value={activeOrderToBill.id}
            onChange={(e) => handleSelectOrder(e.target.value)}
            className="bg-slate-50 border border-slate-300 text-xs font-bold text-slate-800 rounded-xl px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
          >
            {billableOrders.map((o) => (
              <option key={o.id} value={o.id}>
                {o.id} - Table #{o.tableNumber} (₹{o.total}) [{o.status}]
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Billing Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        {/* Bill Metadata Banner */}
        <div className="p-6 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-4">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Order Reference</span>
            <div className="flex items-center gap-3 mt-1">
              <span className="font-mono text-xl font-extrabold text-slate-900">
                {activeOrderToBill.id}
              </span>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-bold bg-blue-100 text-blue-800">
                Table #{activeOrderToBill.tableNumber}
              </span>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border bg-white text-slate-700">
                Status: {activeOrderToBill.status}
              </span>
            </div>
          </div>

          <div className="text-right">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Created At</span>
            <p className="text-xs font-medium text-slate-700 mt-1">
              {new Date(activeOrderToBill.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </p>
          </div>
        </div>

        {/* Itemized Table */}
        <div className="p-6">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
            Itemized Bill Details
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  <th className="py-2.5">Item</th>
                  <th className="py-2.5 text-center">Price</th>
                  <th className="py-2.5 text-center">Qty</th>
                  <th className="py-2.5 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {activeOrderToBill.items.map((item, index) => (
                  <tr key={index} className="hover:bg-slate-50/50">
                    <td className="py-3 font-medium text-slate-900">{item.name}</td>
                    <td className="py-3 text-center text-xs font-mono text-slate-600">
                      ₹{item.price.toFixed(2)}
                    </td>
                    <td className="py-3 text-center text-xs font-bold text-slate-800">
                      {item.quantity}
                    </td>
                    <td className="py-3 text-right text-xs font-bold font-mono text-slate-900">
                      ₹{(item.price * item.quantity).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Subtotal & Tax Calculation Block */}
          <div className="mt-6 pt-4 border-t border-slate-200 max-w-sm ml-auto space-y-2 text-sm">
            <div className="flex justify-between text-slate-600">
              <span>Subtotal:</span>
              <span className="font-mono font-medium">₹{activeOrderToBill.subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Tax (GST @ 10%):</span>
              <span className="font-mono font-medium">₹{activeOrderToBill.tax.toFixed(2)}</span>
            </div>
            <div className="pt-2 border-t border-slate-200 flex justify-between items-baseline">
              <span className="text-base font-extrabold text-slate-900">Total Payable:</span>
              <span className="text-2xl font-black text-blue-700">
                ₹{activeOrderToBill.total.toLocaleString('en-IN')}.00
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons as requested in prompt */}
        <div className="p-6 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <CheckCircle className="w-4 h-4 text-emerald-600" />
            <span>Ready for cashier settlement & guest dispatch</span>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            {/* 1. Generate Bill Button */}
            <button
              onClick={handleGenerateBill}
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-white hover:bg-slate-100 text-slate-800 font-semibold text-xs rounded-xl border border-slate-300 shadow-2xs transition-colors"
            >
              <Printer className="w-4 h-4 text-slate-600" />
              <span>Generate Bill</span>
            </button>

            {/* 2. Proceed to Payment Button */}
            <button
              onClick={handleProceedToPayment}
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md hover:shadow-lg transition-all"
            >
              <CreditCard className="w-4 h-4" />
              <span>Proceed to Payment</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Tax Receipt Modal */}
      <ReceiptModal
        order={activeOrderToBill}
        isOpen={showReceiptModal}
        onClose={() => setShowReceiptModal(false)}
      />
    </div>
  );
};
