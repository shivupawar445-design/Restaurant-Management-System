import React, { useState } from 'react';
import { useRestaurant } from '../context/RestaurantContext';
import { Order, OrderStatus } from '../types';
import {
  ShoppingBag,
  Plus,
  Search,
  Filter,
  CheckCircle,
  Clock,
  XCircle,
  Receipt,
  FileText,
  UtensilsCrossed,
  ArrowRight,
  AlertCircle,
  Eye,
  Trash2
} from 'lucide-react';
import { ReceiptModal } from '../components/ReceiptModal';

export const OrderManagementView: React.FC = () => {
  const {
    orders,
    tables,
    menuItems,
    createOrder,
    updateOrderStatus,
    cancelOrder,
    startBillingForOrder,
    navigateTo,
  } = useRestaurant();

  const [activeTab, setActiveTab] = useState<'all-orders' | 'new-order'>('all-orders');
  const [filterStatus, setFilterStatus] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [receiptOrder, setReceiptOrder] = useState<Order | null>(null);

  // New Order Form state
  const [selectedTableNumber, setSelectedTableNumber] = useState<number>(1);
  const [customerName, setCustomerName] = useState('Dine-In Customer');
  const [draftItems, setDraftItems] = useState<{ menuItemId: string; name: string; price: number; quantity: number }[]>([]);

  // Filtered orders list
  const filteredOrders = orders.filter((ord) => {
    const matchesStatus = filterStatus === 'All' || ord.status === filterStatus;
    const matchesSearch =
      ord.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      `table ${ord.tableNumber}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (ord.customerName && ord.customerName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      ord.items.some((i) => i.name.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesStatus && matchesSearch;
  });

  // Calculate totals for new order draft
  const draftSubtotal = draftItems.reduce((acc, it) => acc + it.price * it.quantity, 0);
  const draftTax = Math.round(draftSubtotal * 0.1); // 10% tax
  const draftTotal = draftSubtotal + draftTax;

  const handleAddDraftItem = (menuItemId: string) => {
    const item = menuItems.find((m) => m.id === menuItemId);
    if (!item) return;

    setDraftItems((prev) => {
      const existing = prev.find((it) => it.menuItemId === menuItemId);
      if (existing) {
        return prev.map((it) =>
          it.menuItemId === menuItemId ? { ...it, quantity: it.quantity + 1 } : it
        );
      }
      return [...prev, { menuItemId: item.id, name: item.name, price: item.price, quantity: 1 }];
    });
  };

  const handleUpdateDraftQty = (menuItemId: string, delta: number) => {
    setDraftItems((prev) =>
      prev
        .map((it) => {
          if (it.menuItemId === menuItemId) {
            const newQty = it.quantity + delta;
            return newQty > 0 ? { ...it, quantity: newQty } : null;
          }
          return it;
        })
        .filter(Boolean) as typeof draftItems
    );
  };

  const handleRemoveDraftItem = (menuItemId: string) => {
    setDraftItems((prev) => prev.filter((it) => it.menuItemId !== menuItemId));
  };

  const handleCreateOrderSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (draftItems.length === 0) return;

    const newOrder = createOrder(selectedTableNumber, draftItems, customerName);
    setDraftItems([]);
    setActiveTab('all-orders');
    setFilterStatus('All');
  };

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'Paid':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Billed':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Served':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'Preparing':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Confirmed':
        return 'bg-sky-50 text-sky-700 border-sky-200';
      case 'Cancelled':
        return 'bg-red-50 text-red-700 border-red-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Order Management
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Create kitchen tickets, track status progression, and initiate customer billing.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl">
          <button
            onClick={() => setActiveTab('all-orders')}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all ${
              activeTab === 'all-orders'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All Orders ({orders.length})
          </button>
          <button
            onClick={() => setActiveTab('new-order')}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 ${
              activeTab === 'new-order'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Order</span>
          </button>
        </div>
      </div>

      {activeTab === 'all-orders' ? (
        <>
          {/* Filters Bar */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
            {/* Search Input */}
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search Order ID, Table #, Item..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-3.5 py-2 border border-slate-300 rounded-xl text-xs placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Status Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
              {['All', 'Confirmed', 'Preparing', 'Served', 'Billed', 'Paid', 'Cancelled'].map((st) => (
                <button
                  key={st}
                  onClick={() => setFilterStatus(st)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap ${
                    filterStatus === st
                      ? 'bg-blue-600 text-white shadow-2xs'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          {/* Orders Table */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    <th className="py-3 px-4">Order ID</th>
                    <th className="py-3 px-4">Table</th>
                    <th className="py-3 px-4">Items & Qty</th>
                    <th className="py-3 px-4">Subtotal</th>
                    <th className="py-3 px-4">Tax (10%)</th>
                    <th className="py-3 px-4">Total</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredOrders.map((order) => {
                    const itemCount = order.items.reduce((s, it) => s + it.quantity, 0);

                    return (
                      <tr key={order.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-3.5 px-4 font-mono font-bold text-slate-800 text-xs">
                          {order.id}
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-semibold bg-slate-100 text-slate-800">
                            Table {order.tableNumber}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 max-w-[240px]">
                          <div className="space-y-1">
                            {order.items.map((it, idx) => (
                              <div key={idx} className="text-xs text-slate-700 flex justify-between gap-2">
                                <span className="font-medium truncate">{it.name}</span>
                                <span className="text-slate-400 font-mono shrink-0">
                                  {it.quantity} × ₹{it.price}
                                </span>
                              </div>
                            ))}
                          </div>
                        </td>
                        <td className="py-3.5 px-4 text-xs font-medium text-slate-600">
                          ₹{order.subtotal.toFixed(0)}
                        </td>
                        <td className="py-3.5 px-4 text-xs font-medium text-slate-500">
                          ₹{order.tax.toFixed(0)}
                        </td>
                        <td className="py-3.5 px-4 text-sm font-extrabold text-slate-900">
                          ₹{order.total.toLocaleString('en-IN')}
                        </td>
                        <td className="py-3.5 px-4">
                          {order.status !== 'Paid' && order.status !== 'Cancelled' ? (
                            <select
                              value={order.status}
                              onChange={(e) => updateOrderStatus(order.id, e.target.value as OrderStatus)}
                              className={`text-xs font-semibold rounded-lg px-2 py-1 border focus:outline-hidden cursor-pointer ${getStatusBadge(
                                order.status
                              )}`}
                            >
                              <option value="Confirmed">Confirmed</option>
                              <option value="Preparing">Preparing</option>
                              <option value="Served">Served</option>
                              <option value="Billed">Billed</option>
                              <option value="Paid">Paid</option>
                            </select>
                          ) : (
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${getStatusBadge(
                                order.status
                              )}`}
                            >
                              {order.status}
                            </span>
                          )}
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {/* Receipt icon */}
                            <button
                              onClick={() => setReceiptOrder(order)}
                              className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
                              title="View Tax Bill"
                            >
                              <FileText className="w-4 h-4" />
                            </button>

                            {/* Billing Button */}
                            {order.status !== 'Paid' && order.status !== 'Cancelled' && (
                              <button
                                onClick={() => startBillingForOrder(order)}
                                className="px-2.5 py-1 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-2xs transition-colors"
                              >
                                Bill
                              </button>
                            )}

                            {/* Cancel Order */}
                            {order.status !== 'Paid' && order.status !== 'Cancelled' && (
                              <button
                                onClick={() => cancelOrder(order.id)}
                                className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                title="Cancel Order"
                              >
                                <XCircle className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {filteredOrders.length === 0 && (
              <div className="p-12 text-center text-slate-500">
                <ShoppingBag className="w-8 h-8 mx-auto text-slate-300 mb-2" />
                <p className="text-sm font-medium">No orders found matching criteria.</p>
              </div>
            )}
          </div>
        </>
      ) : (
        /* Create New Order Tab */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Menu Selection (2 cols) */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">Select Items from Menu</h3>
              <span className="text-xs text-slate-500">Click item or button to add</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[500px] overflow-y-auto pr-1">
              {menuItems.map((item) => (
                <div
                  key={item.id}
                  onClick={() => item.isAvailable && handleAddDraftItem(item.id)}
                  className={`p-3.5 rounded-xl border border-slate-200 transition-all flex items-center justify-between cursor-pointer hover:border-blue-500 hover:bg-blue-50/30 ${
                    !item.isAvailable ? 'opacity-50 pointer-events-none bg-slate-50' : ''
                  }`}
                >
                  <div className="min-w-0 pr-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-900 truncate">{item.name}</span>
                      <span className="text-[10px] text-blue-600 font-semibold bg-blue-50 px-1.5 rounded">
                        {item.category}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 font-bold mt-0.5">₹{item.price}</p>
                  </div>
                  <button
                    type="button"
                    className="p-1.5 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* New Order Summary & Table Selector (1 col) */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900 pb-3 border-b border-slate-100 mb-4">
                Order Ticket Configuration
              </h3>

              {/* Table Selector */}
              <div className="space-y-4 mb-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                    Assign Table Number
                  </label>
                  <select
                    value={selectedTableNumber}
                    onChange={(e) => setSelectedTableNumber(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-sm font-semibold focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                  >
                    {tables.map((tbl) => (
                      <option key={tbl.id} value={tbl.tableNumber}>
                        Table #{tbl.tableNumber} ({tbl.capacity} Seats) - {tbl.status}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                    Customer Reference (Optional)
                  </label>
                  <input
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="Guest Name / Phone"
                    className="w-full px-3.5 py-2 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                  />
                </div>
              </div>

              {/* Selected Items List */}
              <div className="border-t border-slate-100 pt-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                  Selected Items ({draftItems.length})
                </h4>

                {draftItems.length === 0 ? (
                  <div className="p-6 text-center text-xs text-slate-400 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                    No items selected yet. Choose items from the menu on the left.
                  </div>
                ) : (
                  <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
                    {draftItems.map((item) => (
                      <div
                        key={item.menuItemId}
                        className="flex items-center justify-between p-2 bg-slate-50 rounded-xl text-xs"
                      >
                        <div className="min-w-0 pr-2">
                          <p className="font-semibold text-slate-900 truncate">{item.name}</p>
                          <p className="text-slate-500">₹{item.price} each</p>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            onClick={() => handleUpdateDraftQty(item.menuItemId, -1)}
                            className="w-6 h-6 rounded-md bg-white border border-slate-300 text-slate-700 font-bold flex items-center justify-center hover:bg-slate-100"
                          >
                            -
                          </button>
                          <span className="font-bold w-4 text-center">{item.quantity}</span>
                          <button
                            onClick={() => handleUpdateDraftQty(item.menuItemId, 1)}
                            className="w-6 h-6 rounded-md bg-white border border-slate-300 text-slate-700 font-bold flex items-center justify-center hover:bg-slate-100"
                          >
                            +
                          </button>
                          <button
                            onClick={() => handleRemoveDraftItem(item.menuItemId)}
                            className="p-1 text-slate-400 hover:text-red-600 ml-1"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Totals & Submit */}
            <div className="pt-4 border-t border-slate-100 mt-4 space-y-2">
              <div className="flex justify-between text-xs text-slate-600">
                <span>Subtotal:</span>
                <span>₹{draftSubtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-xs text-slate-600">
                <span>Tax (GST 10%):</span>
                <span>₹{draftTax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm font-bold text-slate-900 pt-1 border-t border-slate-100">
                <span>Grand Total:</span>
                <span className="text-base text-blue-700">₹{draftTotal.toLocaleString('en-IN')}</span>
              </div>

              <div className="pt-2">
                <button
                  onClick={handleCreateOrderSubmit}
                  disabled={draftItems.length === 0}
                  className="w-full py-3 px-4 rounded-xl text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
                >
                  <CheckCircle className="w-4 h-4" />
                  <span>Confirm & Dispatch Order</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tax Receipt Modal */}
      <ReceiptModal
        order={receiptOrder}
        isOpen={!!receiptOrder}
        onClose={() => setReceiptOrder(null)}
      />
    </div>
  );
};
