import React from 'react';
import { useRestaurant } from '../context/RestaurantContext';
import {
  ShoppingCart,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  UtensilsCrossed,
  Receipt,
  Grid
} from 'lucide-react';

export const CartSummaryView: React.FC = () => {
  const {
    cart,
    tables,
    updateCartQty,
    removeFromCart,
    setCartTableNumber,
    clearCart,
    submitCartToOrder,
    startBillingForOrder,
    navigateTo,
  } = useRestaurant();

  const subtotal = cart.items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const tax = Math.round(subtotal * 0.1); // 10% Tax
  const grandTotal = subtotal + tax;

  const handleProceedToBilling = () => {
    // 1. Submit cart into an active order
    const createdOrder = submitCartToOrder();
    if (createdOrder) {
      // 2. Direct immediately to Billing module with this order
      startBillingForOrder(createdOrder);
    }
  };

  const handleConfirmOrderOnly = () => {
    const createdOrder = submitCartToOrder();
    if (createdOrder) {
      navigateTo('orders');
    }
  };

  if (cart.items.length === 0) {
    return (
      <div className="max-w-3xl mx-auto py-12 px-4 sm:px-6">
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center shadow-xs">
          <div className="w-16 h-16 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-4">
            <ShoppingCart className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 mb-2">Your Order Cart is Empty</h2>
          <p className="text-sm text-slate-500 max-w-md mx-auto mb-6">
            Select dishes and beverages from our menu or assign tables to start building a guest dining order.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-3">
            <button
              onClick={() => navigateTo('menu')}
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xs transition-colors"
            >
              <UtensilsCrossed className="w-4 h-4" />
              <span>Browse Restaurant Menu</span>
            </button>
            <button
              onClick={() => navigateTo('tables')}
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
            >
              <Grid className="w-4 h-4" />
              <span>Select Dining Table</span>
            </button>
          </div>
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
            <ShoppingCart className="w-4 h-4" />
            <span>Order Ticket Stage</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight mt-1">
            Cart & Order Summary
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Review ordered food items, assign table numbers, and calculate taxes before dispatching.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => navigateTo('menu')}
            className="px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
          >
            + Add More Items
          </button>
          <button
            onClick={clearCart}
            className="px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 rounded-xl transition-colors"
          >
            Clear Cart
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Items List (2 cols) */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          {/* Table assignment selector bar */}
          <div className="p-4 bg-blue-50/50 border-b border-blue-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <label className="text-xs font-bold uppercase tracking-wider text-blue-900 flex items-center gap-2">
              <Grid className="w-4 h-4 text-blue-600" />
              <span>Assigned Table Number:</span>
            </label>
            <select
              value={cart.tableNumber || 1}
              onChange={(e) => setCartTableNumber(Number(e.target.value))}
              className="bg-white text-xs font-bold text-slate-800 border border-blue-200 rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
            >
              {tables.map((t) => (
                <option key={t.id} value={t.tableNumber}>
                  Table #{t.tableNumber} ({t.capacity} Guests) - {t.status}
                </option>
              ))}
            </select>
          </div>

          <div className="p-6">
            <div className="divide-y divide-slate-100">
              {cart.items.map((item) => (
                <div key={item.menuItemId} className="py-4 first:pt-0 last:pb-0 flex items-center justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <h4 className="text-sm font-bold text-slate-900">{item.name}</h4>
                    <p className="text-xs text-slate-500 font-mono mt-0.5">
                      ₹{item.price.toFixed(2)} per item
                    </p>
                  </div>

                  {/* Quantity Controls */}
                  <div className="flex items-center gap-2.5">
                    <div className="flex items-center border border-slate-200 rounded-xl bg-slate-50 overflow-hidden">
                      <button
                        onClick={() => updateCartQty(item.menuItemId, -1)}
                        className="w-8 h-8 flex items-center justify-center text-slate-600 hover:bg-slate-200 transition-colors"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="w-9 text-center text-xs font-bold text-slate-900 font-mono">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateCartQty(item.menuItemId, 1)}
                        className="w-8 h-8 flex items-center justify-center text-slate-600 hover:bg-slate-200 transition-colors"
                        aria-label="Increase quantity"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="text-right w-20">
                      <span className="text-sm font-bold text-slate-900">
                        ₹{(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>

                    <button
                      onClick={() => removeFromCart(item.menuItemId)}
                      className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Remove Item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Cart Calculation Card (1 col) */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 pb-3 border-b border-slate-100 mb-4">
              Cost Summary
            </h3>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between text-slate-600">
                <span>Selected Table:</span>
                <span className="font-bold text-slate-900">Table #{cart.tableNumber || 1}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Items Count:</span>
                <span className="font-mono">{cart.items.reduce((s, i) => s + i.quantity, 0)} units</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Subtotal:</span>
                <span className="font-mono font-medium">₹{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Tax (GST @ 10%):</span>
                <span className="font-mono font-medium">₹{tax.toFixed(2)}</span>
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-between items-baseline">
                <span className="text-base font-bold text-slate-900">Grand Total:</span>
                <span className="text-2xl font-extrabold text-blue-600">
                  ₹{grandTotal.toLocaleString('en-IN')}.00
                </span>
              </div>
            </div>
          </div>

          <div className="pt-6 space-y-3">
            {/* Primary Action: Proceed to Billing */}
            <button
              onClick={handleProceedToBilling}
              className="w-full py-3.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 group active:scale-[0.99]"
            >
              <span>Proceed to Billing</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>

            {/* Secondary Action: Save Order to Kitchen */}
            <button
              onClick={handleConfirmOrderOnly}
              className="w-full py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl transition-colors flex items-center justify-center gap-1.5"
            >
              <UtensilsCrossed className="w-3.5 h-3.5" />
              <span>Send to Kitchen & Continue</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
