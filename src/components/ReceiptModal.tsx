import React from 'react';
import { Order } from '../types';
import { Printer, X, CheckCircle, Utensils } from 'lucide-react';

interface ReceiptModalProps {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ReceiptModal: React.FC<ReceiptModalProps> = ({ order, isOpen, onClose }) => {
  if (!isOpen || !order) return null;

  const handlePrint = () => {
    window.print();
  };

  const formattedDate = new Date(order.createdAt).toLocaleString('en-IN', {
    dateStyle: 'medium',
    timeStyle: 'short',
  });

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Header Actions (Hidden in Print) */}
        <div className="bg-slate-50 px-6 py-3 border-b border-slate-200 flex items-center justify-between print:hidden">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Official Tax Receipt</span>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              Print Receipt
            </button>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-200/60 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Receipt Body */}
        <div id="printable-receipt" className="p-6 text-slate-800 font-mono text-sm">
          {/* Restaurant Header */}
          <div className="text-center pb-4 border-b border-dashed border-slate-300">
            <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-blue-50 text-blue-600 mb-2">
              <Utensils className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-bold font-sans tracking-tight text-slate-900">RESTAURANT MANAGEMENT SYSTEM</h2>
            <p className="text-xs text-slate-500 font-sans">College DevOps Capstone Demo Project</p>
            <p className="text-xs text-slate-500 font-sans">104 Tech Boulevard, Campus Food Hub</p>
            <p className="text-xs text-slate-500 font-sans">GSTIN: 29AABCU9603R1ZX</p>
          </div>

          {/* Order Details Metadata */}
          <div className="py-3 border-b border-dashed border-slate-300 text-xs space-y-1">
            <div className="flex justify-between">
              <span className="text-slate-500 font-sans">Receipt / Order:</span>
              <span className="font-bold text-slate-900">{order.id}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500 font-sans">Table Number:</span>
              <span className="font-bold text-slate-900">Table #{order.tableNumber}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500 font-sans">Date & Time:</span>
              <span>{formattedDate}</span>
            </div>
            {order.customerName && (
              <div className="flex justify-between">
                <span className="text-slate-500 font-sans">Customer:</span>
                <span>{order.customerName}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-slate-500 font-sans">Status:</span>
              <span className={`font-semibold ${order.status === 'Paid' ? 'text-emerald-700' : 'text-blue-700'}`}>
                {order.status.toUpperCase()}
              </span>
            </div>
            {order.paymentMethod && (
              <div className="flex justify-between">
                <span className="text-slate-500 font-sans">Payment Method:</span>
                <span className="font-bold text-slate-900">{order.paymentMethod}</span>
              </div>
            )}
          </div>

          {/* Line Items */}
          <div className="py-3 border-b border-dashed border-slate-300">
            <div className="flex justify-between text-xs font-semibold text-slate-500 uppercase pb-2">
              <span>Item & Qty</span>
              <span>Amount (₹)</span>
            </div>
            <div className="space-y-2">
              {order.items.map((item, idx) => (
                <div key={idx} className="flex justify-between text-xs">
                  <div className="pr-2">
                    <div className="font-medium text-slate-900 font-sans">{item.name}</div>
                    <div className="text-slate-500">
                      {item.quantity} x ₹{item.price.toFixed(2)}
                    </div>
                  </div>
                  <span className="font-semibold text-slate-800">
                    ₹{(item.quantity * item.price).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Totals Calculation */}
          <div className="py-3 border-b border-dashed border-slate-300 space-y-1.5 text-xs">
            <div className="flex justify-between text-slate-600">
              <span>Subtotal:</span>
              <span>₹{order.subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Tax (GST @ 10%):</span>
              <span>₹{order.tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm font-bold text-slate-900 pt-1 border-t border-slate-200">
              <span className="font-sans">Grand Total:</span>
              <span className="text-base text-blue-700">₹{order.total.toLocaleString('en-IN')}.00</span>
            </div>
          </div>

          {/* Footer Note */}
          <div className="pt-4 text-center text-xs text-slate-500 space-y-1">
            <div className="flex items-center justify-center gap-1 text-emerald-600 font-medium">
              <CheckCircle className="w-3.5 h-3.5" />
              <span>Thank You For Dining With Us!</span>
            </div>
            <p className="text-[11px] font-sans">Please visit again. Have a delightful day!</p>
          </div>
        </div>

        {/* Modal Bottom Actions */}
        <div className="bg-slate-50 px-6 py-3 border-t border-slate-200 flex justify-end gap-2 print:hidden">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-200/70 rounded-xl transition-colors"
          >
            Close
          </button>
          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xs transition-colors"
          >
            <Printer className="w-4 h-4" />
            Print Bill
          </button>
        </div>
      </div>
    </div>
  );
};
