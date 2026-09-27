import React, { useState } from 'react';
import { useRestaurant } from '../context/RestaurantContext';
import {
  BarChart3,
  Download,
  IndianRupee,
  ShoppingBag,
  Grid,
  TrendingUp,
  Filter,
  CheckCircle,
  FileSpreadsheet,
  Calendar,
  UtensilsCrossed,
  ArrowUpRight
} from 'lucide-react';

export const ReportsView: React.FC = () => {
  const {
    metrics,
    orders,
    tables,
    menuItems,
    addToast
  } = useRestaurant();

  const [activeReportTab, setActiveReportTab] = useState<'sales' | 'orders' | 'tables'>('sales');
  const [orderSearch, setOrderSearch] = useState('');

  // Category breakdown calculation
  const categorySalesMap: Record<string, { count: number; revenue: number }> = {};

  orders
    .filter((o) => o.status === 'Paid')
    .forEach((ord) => {
      ord.items.forEach((item) => {
        const menuItem = menuItems.find((m) => m.id === item.menuItemId);
        const cat = menuItem?.category || 'Fast Food';
        if (!categorySalesMap[cat]) {
          categorySalesMap[cat] = { count: 0, revenue: 0 };
        }
        categorySalesMap[cat].count += item.quantity;
        categorySalesMap[cat].revenue += item.price * item.quantity;
      });
    });

  const categorySalesList = Object.entries(categorySalesMap).map(([category, data]) => ({
    category,
    ...data,
  })).sort((a, b) => b.revenue - a.revenue);

  const totalCatRevenue = categorySalesList.reduce((s, c) => s + c.revenue, 0) || 1;

  // Filtered orders for Order Report
  const filteredReportOrders = orders.filter((o) => {
    return (
      o.id.toLowerCase().includes(orderSearch.toLowerCase()) ||
      `table ${o.tableNumber}`.toLowerCase().includes(orderSearch.toLowerCase()) ||
      o.status.toLowerCase().includes(orderSearch.toLowerCase())
    );
  });

  // Export CSV Report Handler
  const handleExportReport = () => {
    // Generate CSV data from all orders
    const headers = ['Order ID', 'Table Number', 'Status', 'Items Count', 'Subtotal (INR)', 'Tax (INR)', 'Total (INR)', 'Payment Method', 'Timestamp'];
    const rows = orders.map((o) => [
      o.id,
      o.tableNumber,
      o.status,
      o.items.reduce((s, it) => s + it.quantity, 0),
      o.subtotal,
      o.tax,
      o.total,
      o.paymentMethod || 'Pending',
      o.createdAt,
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.map((c) => `"${c}"`).join(','))].join('\n');

    // Trigger browser download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `restaurant_report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    addToast('Restaurant report exported successfully as CSV!', 'success', 'Export Downloaded');
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-600">
            <BarChart3 className="w-4 h-4" />
            <span>Business Intelligence</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight mt-1">
            Analytics & Reports
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Operational auditing, revenue breakdowns, table turnover, and CSV data extraction.
          </p>
        </div>

        {/* Export Report button requested in Module 11 */}
        <button
          onClick={handleExportReport}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors"
        >
          <Download className="w-4 h-4" />
          <span>Export Report (CSV)</span>
        </button>
      </div>

      {/* Primary 3 KPI Metric Cards requested in Module 11 */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {/* Total Orders */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Total Orders
            </span>
            <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-slate-900">{metrics.todayOrdersCount}</div>
          <p className="text-xs text-slate-500 mt-1">
            {orders.filter((o) => o.status === 'Paid').length} Completed | {orders.filter((o) => o.status !== 'Paid' && o.status !== 'Cancelled').length} Active
          </p>
        </div>

        {/* Total Sales */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Total Sales
            </span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <IndianRupee className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-slate-900">
            ₹{metrics.todayRevenue.toLocaleString('en-IN')}
          </div>
          <p className="text-xs text-emerald-600 font-medium mt-1">
            Target benchmark: ₹18,500 reached
          </p>
        </div>

        {/* Available Tables */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Available Tables
            </span>
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Grid className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-slate-900">
            {metrics.availableTablesCount} / {metrics.totalTables}
          </div>
          <p className="text-xs text-slate-500 mt-1">
            {metrics.occupiedTablesCount} Occupied ({Math.round((metrics.occupiedTablesCount / metrics.totalTables) * 100)}% occupancy)
          </p>
        </div>
      </div>

      {/* Report Section Tabs: Sales Report, Order Report, Table Report */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="flex border-b border-slate-200 px-6 pt-4 gap-6 bg-slate-50/50">
          <button
            onClick={() => setActiveReportTab('sales')}
            className={`pb-3 text-xs font-bold uppercase tracking-wider transition-all border-b-2 ${
              activeReportTab === 'sales'
                ? 'border-blue-600 text-blue-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Sales Report
          </button>
          <button
            onClick={() => setActiveReportTab('orders')}
            className={`pb-3 text-xs font-bold uppercase tracking-wider transition-all border-b-2 ${
              activeReportTab === 'orders'
                ? 'border-blue-600 text-blue-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Order Report
          </button>
          <button
            onClick={() => setActiveReportTab('tables')}
            className={`pb-3 text-xs font-bold uppercase tracking-wider transition-all border-b-2 ${
              activeReportTab === 'tables'
                ? 'border-blue-600 text-blue-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Table Report
          </button>
        </div>

        <div className="p-6">
          {/* TAB 1: SALES REPORT */}
          {activeReportTab === 'sales' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-bold text-slate-900 mb-1">
                  Category Revenue Performance
                </h3>
                <p className="text-xs text-slate-500 mb-4">
                  Breakdown of customer orders across Fast Food, Main Course, Starters, Beverages and Desserts.
                </p>

                <div className="space-y-4">
                  {categorySalesList.map((cat) => {
                    const percentage = Math.round((cat.revenue / totalCatRevenue) * 100);

                    return (
                      <div key={cat.category} className="space-y-1.5">
                        <div className="flex justify-between text-xs font-semibold">
                          <span className="text-slate-800">{cat.category}</span>
                          <span className="font-mono text-slate-900">
                            ₹{cat.revenue.toLocaleString('en-IN')} ({percentage}%)
                          </span>
                        </div>
                        <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-blue-600 rounded-full transition-all duration-500"
                            style={{ width: `${Math.max(5, percentage)}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Payment Methods Distribution */}
              <div className="pt-6 border-t border-slate-100">
                <h3 className="text-sm font-bold text-slate-900 mb-3">
                  Settlement Method Distribution
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {['UPI', 'Card', 'Cash'].map((method) => {
                    const methodOrders = orders.filter((o) => o.paymentMethod === method);
                    const methodRev = methodOrders.reduce((s, o) => s + o.total, 0);

                    return (
                      <div key={method} className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                        <span className="text-xs font-semibold text-slate-500">{method} Settlements</span>
                        <div className="text-xl font-bold text-slate-900 mt-1 font-mono">
                          ₹{methodRev.toLocaleString('en-IN')}
                        </div>
                        <span className="text-xs text-slate-500">{methodOrders.length} transactions</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: ORDER REPORT */}
          {activeReportTab === 'orders' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                <input
                  type="text"
                  placeholder="Filter order logs..."
                  value={orderSearch}
                  onChange={(e) => setOrderSearch(e.target.value)}
                  className="w-full sm:w-72 px-3 py-2 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                />
                <span className="text-xs text-slate-500 font-medium">
                  Showing {filteredReportOrders.length} records
                </span>
              </div>

              <div className="overflow-x-auto border border-slate-200 rounded-xl">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-slate-200 font-semibold text-slate-600 uppercase">
                    <tr>
                      <th className="py-2.5 px-3">Order ID</th>
                      <th className="py-2.5 px-3">Table</th>
                      <th className="py-2.5 px-3">Status</th>
                      <th className="py-2.5 px-3">Items Count</th>
                      <th className="py-2.5 px-3">Subtotal</th>
                      <th className="py-2.5 px-3">Tax (10%)</th>
                      <th className="py-2.5 px-3">Total Amount</th>
                      <th className="py-2.5 px-3">Payment</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredReportOrders.map((ord) => (
                      <tr key={ord.id} className="hover:bg-slate-50/50">
                        <td className="py-2.5 px-3 font-mono font-bold text-slate-800">{ord.id}</td>
                        <td className="py-2.5 px-3">Table #{ord.tableNumber}</td>
                        <td className="py-2.5 px-3 font-semibold">{ord.status}</td>
                        <td className="py-2.5 px-3">{ord.items.reduce((s, it) => s + it.quantity, 0)}</td>
                        <td className="py-2.5 px-3 font-mono">₹{ord.subtotal}</td>
                        <td className="py-2.5 px-3 font-mono">₹{ord.tax}</td>
                        <td className="py-2.5 px-3 font-mono font-bold text-slate-900">₹{ord.total}</td>
                        <td className="py-2.5 px-3">{ord.paymentMethod || '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: TABLE REPORT */}
          {activeReportTab === 'tables' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-900">
                  <span className="text-xs font-semibold uppercase tracking-wider">Available For Seating</span>
                  <div className="text-2xl font-bold mt-1">{metrics.availableTablesCount} Tables</div>
                </div>
                <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-amber-900">
                  <span className="text-xs font-semibold uppercase tracking-wider">Currently Occupied</span>
                  <div className="text-2xl font-bold mt-1">{metrics.occupiedTablesCount} Tables</div>
                </div>
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl text-blue-900">
                  <span className="text-xs font-semibold uppercase tracking-wider">Advance Reserved</span>
                  <div className="text-2xl font-bold mt-1">{metrics.reservedTablesCount} Tables</div>
                </div>
              </div>

              <div className="overflow-x-auto border border-slate-200 rounded-xl mt-4">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-slate-200 font-semibold text-slate-600 uppercase">
                    <tr>
                      <th className="py-2.5 px-3">Table #</th>
                      <th className="py-2.5 px-3">Capacity</th>
                      <th className="py-2.5 px-3">Current Status</th>
                      <th className="py-2.5 px-3">Linked Order</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {tables.map((t) => (
                      <tr key={t.id} className="hover:bg-slate-50/50">
                        <td className="py-2.5 px-3 font-bold text-slate-900">Table #{t.tableNumber}</td>
                        <td className="py-2.5 px-3">{t.capacity} Guests</td>
                        <td className="py-2.5 px-3">
                          <span
                            className={`px-2 py-0.5 rounded-full font-semibold ${
                              t.status === 'Available'
                                ? 'bg-emerald-100 text-emerald-800'
                                : t.status === 'Occupied'
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-blue-100 text-blue-800'
                            }`}
                          >
                            {t.status}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 font-mono">{t.currentOrderId || 'None'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
