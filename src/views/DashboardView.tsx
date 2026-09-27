import React, { useState } from 'react';
import { useRestaurant } from '../context/RestaurantContext';
import { Order } from '../types';
import {
  Grid,
  ShoppingBag,
  IndianRupee,
  UtensilsCrossed,
  Receipt,
  BarChart3,
  ArrowUpRight,
  Clock,
  CheckCircle,
  Eye,
  FileText
} from 'lucide-react';
import { ReceiptModal } from '../components/ReceiptModal';

export const DashboardView: React.FC = () => {
  const {
    metrics,
    orders,
    tables,
    navigateTo,
    startBillingForOrder,
    setCartTableNumber
  } = useRestaurant();

  const [receiptOrder, setReceiptOrder] = useState<Order | null>(null);

  // Recent 6 orders
  const recentOrders = [...orders]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 7);

  // Status badge styling helper
  const getStatusBadge = (status: Order['status']) => {
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
    <div className="space-y-8 pb-12">
      {/* Welcome Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Restaurant Operations Dashboard
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Real-time management for tables, live orders, billing, and sales analytics.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <span className="w-2 h-2 rounded-full bg-emerald-500 mr-2 animate-ping" />
            Kitchen & POS Online
          </span>
        </div>
      </div>

      {/* Primary KPI Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {/* Card 1: Total Tables */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Total Tables
            </span>
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Grid className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl sm:text-4xl font-extrabold text-slate-900">
              {metrics.totalTables}
            </span>
            <span className="text-xs font-semibold text-slate-500">units</span>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-emerald-600 font-medium">
              {metrics.availableTablesCount} Available
            </span>
            <span className="text-amber-600 font-medium">
              {metrics.occupiedTablesCount} Occupied
            </span>
            <span className="text-blue-600 font-medium">
              {metrics.reservedTablesCount} Reserved
            </span>
          </div>
        </div>

        {/* Card 2: Today's Orders */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Today&apos;s Orders
            </span>
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <ShoppingBag className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl sm:text-4xl font-extrabold text-slate-900">
              {metrics.todayOrdersCount}
            </span>
            <span className="text-xs font-semibold text-slate-500">tickets processed</span>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span className="flex items-center gap-1 text-emerald-600 font-medium">
              <CheckCircle className="w-3.5 h-3.5" />
              {orders.filter((o) => o.status === 'Paid').length} Completed
            </span>
            <span className="text-amber-600 font-medium">
              {orders.filter((o) => ['Pending', 'Confirmed', 'Preparing', 'Served', 'Billed'].includes(o.status)).length} Active In-Dining
            </span>
          </div>
        </div>

        {/* Card 3: Today's Revenue */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Today&apos;s Revenue
            </span>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <IndianRupee className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl sm:text-4xl font-extrabold text-slate-900">
              ₹{metrics.todayRevenue.toLocaleString('en-IN')}
            </span>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span className="text-emerald-600 font-medium flex items-center gap-1">
              <ArrowUpRight className="w-3.5 h-3.5" />
              Target Met (₹18,500)
            </span>
            <span>Avg ticket: ₹{Math.round(metrics.todayRevenue / (orders.filter(o => o.status === 'Paid').length || 1))}</span>
          </div>
        </div>
      </div>

      {/* Quick Action Buttons */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-600 mb-4">
          Quick Action Shortcuts
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
          <button
            onClick={() => navigateTo('tables')}
            className="flex flex-col items-center justify-center p-4 rounded-xl border border-slate-200 hover:border-blue-500 hover:bg-blue-50/50 text-slate-700 hover:text-blue-700 transition-all group"
          >
            <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
              <Grid className="w-5 h-5" />
            </div>
            <span className="text-xs sm:text-sm font-semibold">Manage Tables</span>
          </button>

          <button
            onClick={() => navigateTo('menu')}
            className="flex flex-col items-center justify-center p-4 rounded-xl border border-slate-200 hover:border-blue-500 hover:bg-blue-50/50 text-slate-700 hover:text-blue-700 transition-all group"
          >
            <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
              <UtensilsCrossed className="w-5 h-5" />
            </div>
            <span className="text-xs sm:text-sm font-semibold">Manage Menu</span>
          </button>

          <button
            onClick={() => navigateTo('orders')}
            className="flex flex-col items-center justify-center p-4 rounded-xl border border-slate-200 hover:border-blue-500 hover:bg-blue-50/50 text-slate-700 hover:text-blue-700 transition-all group"
          >
            <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <span className="text-xs sm:text-sm font-semibold">Manage Orders</span>
          </button>

          <button
            onClick={() => navigateTo('billing')}
            className="flex flex-col items-center justify-center p-4 rounded-xl border border-slate-200 hover:border-blue-500 hover:bg-blue-50/50 text-slate-700 hover:text-blue-700 transition-all group"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
              <Receipt className="w-5 h-5" />
            </div>
            <span className="text-xs sm:text-sm font-semibold">View Billing</span>
          </button>

          <button
            onClick={() => navigateTo('reports')}
            className="flex flex-col items-center justify-center p-4 rounded-xl border border-slate-200 hover:border-blue-500 hover:bg-blue-50/50 text-slate-700 hover:text-blue-700 transition-all group col-span-2 sm:col-span-1"
          >
            <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
              <BarChart3 className="w-5 h-5" />
            </div>
            <span className="text-xs sm:text-sm font-semibold">View Reports</span>
          </button>
        </div>
      </div>

      {/* Grid: Recent Orders Table & Quick Table Status */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Orders Table (2 Cols on lg) */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-5 sm:px-6 border-b border-slate-200 flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900">Recent Orders</h3>
              <p className="text-xs text-slate-500">Live order activity and dining checks</p>
            </div>
            <button
              onClick={() => navigateTo('orders')}
              className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1 transition-colors"
            >
              View All Orders
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  <th className="py-3 px-4">Order ID</th>
                  <th className="py-3 px-4">Table</th>
                  <th className="py-3 px-4">Items</th>
                  <th className="py-3 px-4">Total</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {recentOrders.map((ord) => {
                  const itemCount = ord.items.reduce((s, it) => s + it.quantity, 0);
                  const itemsSummary = ord.items.map((it) => `${it.quantity}x ${it.name}`).join(', ');

                  return (
                    <tr key={ord.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3 px-4 font-mono font-bold text-slate-800 text-xs">
                        {ord.id}
                      </td>
                      <td className="py-3 px-4">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-semibold bg-slate-100 text-slate-700">
                          Table {ord.tableNumber}
                        </span>
                      </td>
                      <td className="py-3 px-4 max-w-[200px]">
                        <p className="text-xs text-slate-800 truncate font-medium" title={itemsSummary}>
                          {itemsSummary}
                        </p>
                        <span className="text-[11px] text-slate-500">{itemCount} items</span>
                      </td>
                      <td className="py-3 px-4 font-bold text-slate-900">
                        ₹{ord.total.toLocaleString('en-IN')}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${getStatusBadge(
                            ord.status
                          )}`}
                        >
                          {ord.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setReceiptOrder(ord)}
                            className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
                            title="View Receipt"
                          >
                            <FileText className="w-4 h-4" />
                          </button>
                          {ord.status !== 'Paid' && ord.status !== 'Cancelled' ? (
                            <button
                              onClick={() => startBillingForOrder(ord)}
                              className="px-2.5 py-1 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-2xs transition-colors"
                            >
                              Bill
                            </button>
                          ) : (
                            <span className="text-xs text-emerald-600 font-medium px-2 py-0.5">
                              Done
                            </span>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Tables Grid Overview Widget */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 sm:p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900">Table Floor Plan</h3>
                <p className="text-xs text-slate-500">20 dining tables status preview</p>
              </div>
              <button
                onClick={() => navigateTo('tables')}
                className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
              >
                Manage
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Visual compact map of all 20 tables */}
            <div className="grid grid-cols-4 sm:grid-cols-5 gap-2.5 my-2">
              {tables.map((tbl) => {
                let badgeStyle = 'bg-emerald-50 text-emerald-700 border-emerald-200';
                if (tbl.status === 'Occupied') {
                  badgeStyle = 'bg-amber-500 text-white border-amber-600 shadow-xs shadow-amber-500/20';
                } else if (tbl.status === 'Reserved') {
                  badgeStyle = 'bg-blue-100 text-blue-800 border-blue-300';
                }

                return (
                  <button
                    key={tbl.id}
                    onClick={() => {
                      setCartTableNumber(tbl.tableNumber);
                      navigateTo('tables');
                    }}
                    className={`p-2 rounded-xl border text-center transition-all hover:scale-105 ${badgeStyle}`}
                    title={`Table ${tbl.tableNumber} (${tbl.capacity} seats) - ${tbl.status}`}
                  >
                    <span className="block text-xs font-extrabold">T-{tbl.tableNumber}</span>
                    <span className="block text-[10px] opacity-80">{tbl.capacity}P</span>
                  </button>
                );
              })}
            </div>

            <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <span>Available</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                <span>Occupied</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                <span>Reserved</span>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100">
            <button
              onClick={() => {
                setCartTableNumber(1);
                navigateTo('menu');
              }}
              className="w-full py-2.5 px-4 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-all shadow-xs flex items-center justify-center gap-1.5"
            >
              <UtensilsCrossed className="w-4 h-4" />
              <span>Start New Order for a Table</span>
            </button>
          </div>
        </div>
      </div>

      {/* Receipt Modal */}
      <ReceiptModal
        order={receiptOrder}
        isOpen={!!receiptOrder}
        onClose={() => setReceiptOrder(null)}
      />
    </div>
  );
};
