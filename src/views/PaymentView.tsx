import React, { useState } from 'react';
import { useRestaurant } from '../context/RestaurantContext';
import { PaymentMethod } from '../types';
import {
  CreditCard,
  QrCode,
  Banknote,
  ShieldCheck,
  CheckCircle2,
  ArrowLeft,
  Sparkles,
  Lock,
  Copy,
  Check
} from 'lucide-react';

export const PaymentView: React.FC = () => {
  const {
    billingOrder,
    orders,
    processPayment,
    navigateTo,
  } = useRestaurant();

  // If no order currently set in billing, pick the latest active one
  const currentOrder =
    billingOrder ||
    orders.find((o) => o.status !== 'Paid' && o.status !== 'Cancelled') ||
    orders[0];

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('UPI');
  const [isProcessing, setIsProcessing] = useState(false);

  // Cash method helper state
  const [cashTendered, setCashTendered] = useState<number>(() => currentOrder ? Math.ceil(currentOrder.total / 100) * 100 : 500);

  // Card method mock fields
  const [cardNumber, setCardNumber] = useState('4532 •••• •••• 8821');
  const [cardExpiry, setCardExpiry] = useState('08/28');
  const [cardCvv, setCardCvv] = useState('742');

  // UPI helper state
  const [upiId, setUpiId] = useState('restaurantpos@upi');
  const [copiedUpi, setCopiedUpi] = useState(false);

  if (!currentOrder) {
    return (
      <div className="max-w-md mx-auto py-12 text-center">
        <p className="text-slate-500 mb-4">No order available for payment.</p>
        <button
          onClick={() => navigateTo('dashboard')}
          className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-semibold"
        >
          Return to Dashboard
        </button>
      </div>
    );
  }

  const handleCopyUpi = () => {
    navigator.clipboard?.writeText?.(upiId);
    setCopiedUpi(true);
    setTimeout(() => setCopiedUpi(false), 2000);
  };

  const handlePayNow = () => {
    setIsProcessing(true);

    // Simulate authentic checkout transaction delay for college demo
    setTimeout(() => {
      setIsProcessing(false);
      processPayment(currentOrder.id, paymentMethod);
    }, 900);
  };

  const cashChange = Math.max(0, cashTendered - currentOrder.total);

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-12">
      {/* Back button */}
      <button
        onClick={() => navigateTo('billing')}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Back to Billing</span>
      </button>

      {/* Main Payment Container */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        {/* Payment Header & Total Amount display */}
        <div className="p-6 bg-gradient-to-r from-blue-900 to-blue-700 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-blue-200">
              Payment Gateway
            </span>
            <div className="flex items-center gap-3 mt-1">
              <h2 className="text-2xl font-bold tracking-tight">Order #{currentOrder.id}</h2>
              <span className="bg-blue-800/80 px-2.5 py-0.5 rounded-md text-xs font-medium text-blue-100">
                Table {currentOrder.tableNumber}
              </span>
            </div>
            <p className="text-xs text-blue-200 mt-1">
              {currentOrder.items.length} items ordered
            </p>
          </div>

          <div className="sm:text-right">
            <span className="text-xs font-semibold text-blue-200 uppercase tracking-wider">
              Total Payable Amount
            </span>
            <div className="text-3xl sm:text-4xl font-black text-white mt-0.5 font-mono">
              ₹{currentOrder.total.toLocaleString('en-IN')}.00
            </div>
          </div>
        </div>

        {/* Payment Method Selector Tabs */}
        <div className="p-6">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
            Select Payment Method
          </h3>

          <div className="grid grid-cols-3 gap-3 mb-6">
            {/* 1. UPI */}
            <button
              type="button"
              onClick={() => setPaymentMethod('UPI')}
              className={`p-4 rounded-xl border text-center transition-all flex flex-col items-center justify-center gap-2 ${
                paymentMethod === 'UPI'
                  ? 'border-blue-600 bg-blue-50/70 text-blue-700 shadow-xs ring-2 ring-blue-500/20'
                  : 'border-slate-200 hover:border-slate-300 text-slate-700 bg-slate-50/50'
              }`}
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${paymentMethod === 'UPI' ? 'bg-blue-600 text-white' : 'bg-white text-slate-600 border border-slate-200'}`}>
                <QrCode className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold">UPI / QR Code</span>
            </button>

            {/* 2. Card */}
            <button
              type="button"
              onClick={() => setPaymentMethod('Card')}
              className={`p-4 rounded-xl border text-center transition-all flex flex-col items-center justify-center gap-2 ${
                paymentMethod === 'Card'
                  ? 'border-blue-600 bg-blue-50/70 text-blue-700 shadow-xs ring-2 ring-blue-500/20'
                  : 'border-slate-200 hover:border-slate-300 text-slate-700 bg-slate-50/50'
              }`}
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${paymentMethod === 'Card' ? 'bg-blue-600 text-white' : 'bg-white text-slate-600 border border-slate-200'}`}>
                <CreditCard className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold">Credit / Debit Card</span>
            </button>

            {/* 3. Cash */}
            <button
              type="button"
              onClick={() => setPaymentMethod('Cash')}
              className={`p-4 rounded-xl border text-center transition-all flex flex-col items-center justify-center gap-2 ${
                paymentMethod === 'Cash'
                  ? 'border-blue-600 bg-blue-50/70 text-blue-700 shadow-xs ring-2 ring-blue-500/20'
                  : 'border-slate-200 hover:border-slate-300 text-slate-700 bg-slate-50/50'
              }`}
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${paymentMethod === 'Cash' ? 'bg-blue-600 text-white' : 'bg-white text-slate-600 border border-slate-200'}`}>
                <Banknote className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold">Cash at Counter</span>
            </button>
          </div>

          {/* Payment Method Details Body */}
          <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200">
            {paymentMethod === 'UPI' && (
              <div className="space-y-4 text-center">
                <div className="inline-block p-3 bg-white rounded-2xl border border-slate-200 shadow-xs">
                  {/* Clean SVG QR Code Representation */}
                  <svg className="w-44 h-44 mx-auto text-slate-800" viewBox="0 0 100 100" fill="currentColor">
                    <path d="M10 10h30v30h-30z M15 15v20h20v-20h-20z M20 20h10v10h-10z" />
                    <path d="M60 10h30v30h-30z M65 15v20h20v-20h-20z M70 20h10v10h-10z" />
                    <path d="M10 60h30v30h-30z M15 65v20h20v-20h-20z M20 70h10v10h-10z" />
                    <rect x="45" y="15" width="5" height="15" />
                    <rect x="52" y="25" width="4" height="20" />
                    <rect x="15" y="45" width="20" height="5" />
                    <rect x="45" y="45" width="10" height="10" />
                    <rect x="60" y="45" width="12" height="6" />
                    <rect x="75" y="45" width="15" height="15" />
                    <rect x="45" y="60" width="8" height="15" />
                    <rect x="58" y="60" width="12" height="8" />
                    <rect x="72" y="65" width="15" height="6" />
                    <rect x="60" y="75" width="15" height="15" />
                    <rect x="45" y="80" width="10" height="10" />
                  </svg>
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-700">Scan with Google Pay, PhonePe, Paytm, or BHIM</p>
                  <div className="mt-2 inline-flex items-center gap-2 bg-white px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-mono text-slate-800">
                    <span>UPI ID: {upiId}</span>
                    <button
                      onClick={handleCopyUpi}
                      className="text-blue-600 hover:text-blue-800 p-0.5"
                      title="Copy UPI ID"
                    >
                      {copiedUpi ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {paymentMethod === 'Card' && (
              <div className="space-y-4 max-w-sm mx-auto">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Card Number
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-xs font-mono font-medium focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                    />
                    <CreditCard className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                      Expiry Date
                    </label>
                    <input
                      type="text"
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(e.target.value)}
                      placeholder="MM/YY"
                      className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-xs font-mono focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                      CVV
                    </label>
                    <input
                      type="password"
                      maxLength={4}
                      value={cardCvv}
                      onChange={(e) => setCardCvv(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-xs font-mono focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-1.5 text-[11px] text-slate-500 justify-center">
                  <Lock className="w-3.5 h-3.5 text-emerald-600" />
                  <span>256-bit encrypted secure POS tokenization</span>
                </div>
              </div>
            )}

            {paymentMethod === 'Cash' && (
              <div className="space-y-4 max-w-sm mx-auto">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Cash Tendered by Guest (₹)
                  </label>
                  <input
                    type="number"
                    min={currentOrder.total}
                    step={10}
                    value={cashTendered}
                    onChange={(e) => setCashTendered(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-sm font-mono font-bold focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                  />
                </div>

                <div className="p-3.5 bg-white rounded-xl border border-slate-200 space-y-1.5 text-xs">
                  <div className="flex justify-between text-slate-600">
                    <span>Order Bill:</span>
                    <span className="font-mono">₹{currentOrder.total.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Cash Tendered:</span>
                    <span className="font-mono">₹{cashTendered.toFixed(2)}</span>
                  </div>
                  <div className="pt-1.5 border-t border-slate-100 flex justify-between font-bold text-slate-900 text-sm">
                    <span>Change Due:</span>
                    <span className="font-mono text-emerald-600">₹{cashChange.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Pay Now Button */}
        <div className="p-6 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Instant confirmation & automated table clearance</span>
          </div>

          <button
            onClick={handlePayNow}
            disabled={isProcessing}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold text-sm rounded-xl shadow-md hover:shadow-lg transition-all active:scale-[0.99]"
          >
            {isProcessing ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Processing Payment...</span>
              </>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4" />
                <span>Pay Now (₹{currentOrder.total.toLocaleString('en-IN')})</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
