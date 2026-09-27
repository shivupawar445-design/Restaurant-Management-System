import React, { useState } from 'react';
import { useRestaurant } from '../context/RestaurantContext';
import { RestaurantTable, TableStatus } from '../types';
import {
  Grid,
  Plus,
  Users,
  Edit2,
  Trash2,
  UtensilsCrossed,
  Receipt,
  X,
  Check,
  Filter
} from 'lucide-react';

export const TableManagementView: React.FC = () => {
  const {
    tables,
    addTable,
    updateTable,
    deleteTable,
    updateTableStatus,
    setCartTableNumber,
    navigateTo,
    orders,
    startBillingForOrder,
  } = useRestaurant();

  const [filterStatus, setFilterStatus] = useState<string>('All');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingTable, setEditingTable] = useState<RestaurantTable | null>(null);

  // Form states for Add/Edit
  const [tableNumber, setTableNumber] = useState<number>(() => {
    const maxNum = tables.reduce((max, t) => Math.max(max, t.tableNumber), 0);
    return maxNum + 1;
  });
  const [capacity, setCapacity] = useState<number>(4);
  const [status, setStatus] = useState<TableStatus>('Available');

  const filteredTables = tables.filter((table) => {
    if (filterStatus === 'All') return true;
    return table.status === filterStatus;
  });

  const handleOpenAddModal = () => {
    const maxNum = tables.reduce((max, t) => Math.max(max, t.tableNumber), 0);
    setTableNumber(maxNum + 1);
    setCapacity(4);
    setStatus('Available');
    setShowAddModal(true);
  };

  const handleOpenEditModal = (table: RestaurantTable) => {
    setEditingTable(table);
    setTableNumber(table.tableNumber);
    setCapacity(table.capacity);
    setStatus(table.status);
  };

  const handleSaveAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const success = addTable({
      tableNumber: Number(tableNumber),
      capacity: Number(capacity),
      status,
    });
    if (success) {
      setShowAddModal(false);
    }
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTable) return;
    updateTable(editingTable.id, {
      capacity: Number(capacity),
      status,
    });
    setEditingTable(null);
  };

  const handleStartOrderForTable = (tblNumber: number) => {
    setCartTableNumber(tblNumber);
    navigateTo('menu');
  };

  const handleViewBillForTable = (tblNumber: number) => {
    // Find active order for this table
    const activeOrder = orders.find(
      (o) => o.tableNumber === tblNumber && o.status !== 'Paid' && o.status !== 'Cancelled'
    );
    if (activeOrder) {
      startBillingForOrder(activeOrder);
    } else {
      setCartTableNumber(tblNumber);
      navigateTo('orders');
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Table Management
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Organize floor seating, monitor table occupancy, and launch table orders.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleOpenAddModal}
            className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Table</span>
          </button>
        </div>
      </div>

      {/* Filter and Stats Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200">
        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto">
          <Filter className="w-4 h-4 text-slate-400 mr-1 shrink-0" />
          {['All', 'Available', 'Occupied', 'Reserved'].map((st) => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
                filterStatus === st
                  ? 'bg-blue-600 text-white shadow-2xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {st} ({st === 'All' ? tables.length : tables.filter((t) => t.status === st).length})
            </button>
          ))}
        </div>

        <div className="text-xs text-slate-500 font-medium">
          Showing <span className="font-bold text-slate-800">{filteredTables.length}</span> of {tables.length} tables
        </div>
      </div>

      {/* Table Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredTables.map((table) => {
          let statusColor = 'border-emerald-200 bg-emerald-50 text-emerald-700';
          let borderHighlight = 'border-slate-200';

          if (table.status === 'Occupied') {
            statusColor = 'border-amber-300 bg-amber-50 text-amber-700';
            borderHighlight = 'border-amber-200 shadow-xs shadow-amber-500/10';
          } else if (table.status === 'Reserved') {
            statusColor = 'border-blue-200 bg-blue-50 text-blue-700';
            borderHighlight = 'border-blue-200 shadow-xs shadow-blue-500/10';
          }

          // Active order for this table
          const activeOrder = orders.find(
            (o) => o.tableNumber === table.tableNumber && o.status !== 'Paid' && o.status !== 'Cancelled'
          );

          return (
            <div
              key={table.id}
              className={`bg-white rounded-2xl border ${borderHighlight} p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between`}
            >
              <div>
                {/* Header: Table Number & Status Pill */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-800 flex items-center justify-center font-bold text-base">
                      {table.tableNumber}
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">Table #{table.tableNumber}</h4>
                      <div className="flex items-center gap-1 text-xs text-slate-500">
                        <Users className="w-3.5 h-3.5 text-slate-400" />
                        <span>Capacity: {table.capacity} Guests</span>
                      </div>
                    </div>
                  </div>

                  <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full border ${statusColor}`}>
                    {table.status}
                  </span>
                </div>

                {/* Table Info or Active Order Badge */}
                {activeOrder ? (
                  <div className="mt-3 p-2.5 bg-amber-50/70 border border-amber-200/80 rounded-xl text-xs space-y-1">
                    <div className="flex justify-between items-center text-amber-900 font-semibold">
                      <span>Order: {activeOrder.id}</span>
                      <span>₹{activeOrder.total}</span>
                    </div>
                    <p className="text-[11px] text-amber-700 truncate">
                      {activeOrder.items.map((i) => `${i.quantity}x ${i.name}`).join(', ')}
                    </p>
                  </div>
                ) : (
                  <div className="mt-3 p-2.5 bg-slate-50 border border-slate-100 rounded-xl text-xs text-slate-500 flex items-center justify-between">
                    <span>Quick Status Toggle:</span>
                    <select
                      value={table.status}
                      onChange={(e) => updateTableStatus(table.tableNumber, e.target.value as TableStatus)}
                      className="text-xs bg-white border border-slate-200 rounded-md px-1.5 py-0.5 font-medium text-slate-700 focus:outline-hidden"
                    >
                      <option value="Available">Available</option>
                      <option value="Occupied">Occupied</option>
                      <option value="Reserved">Reserved</option>
                    </select>
                  </div>
                )}
              </div>

              {/* Actions Footer */}
              <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleOpenEditModal(table)}
                    className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Edit Table"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => deleteTable(table.id)}
                    className="p-1.5 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete Table"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {activeOrder ? (
                  <button
                    onClick={() => handleViewBillForTable(table.tableNumber)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-2xs transition-colors"
                  >
                    <Receipt className="w-3.5 h-3.5" />
                    <span>View Bill</span>
                  </button>
                ) : (
                  <button
                    onClick={() => handleStartOrderForTable(table.tableNumber)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-2xs transition-colors"
                  >
                    <UtensilsCrossed className="w-3.5 h-3.5" />
                    <span>Take Order</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Table Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-sm w-full p-6 border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h3 className="text-base font-bold text-slate-900">Add New Dining Table</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveAdd} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Table Number
                </label>
                <input
                  type="number"
                  required
                  min={1}
                  value={tableNumber}
                  onChange={(e) => setTableNumber(Number(e.target.value))}
                  className="w-full px-3.5 py-2 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Capacity (Guests)
                </label>
                <input
                  type="number"
                  required
                  min={1}
                  max={20}
                  value={capacity}
                  onChange={(e) => setCapacity(Number(e.target.value))}
                  className="w-full px-3.5 py-2 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Initial Status
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as TableStatus)}
                  className="w-full px-3.5 py-2 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                >
                  <option value="Available">Available</option>
                  <option value="Occupied">Occupied</option>
                  <option value="Reserved">Reserved</option>
                </select>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xs"
                >
                  Save Table
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Table Modal */}
      {editingTable && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-sm w-full p-6 border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h3 className="text-base font-bold text-slate-900">
                Edit Table #{editingTable.tableNumber}
              </h3>
              <button
                onClick={() => setEditingTable(null)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Capacity (Guests)
                </label>
                <input
                  type="number"
                  required
                  min={1}
                  max={20}
                  value={capacity}
                  onChange={(e) => setCapacity(Number(e.target.value))}
                  className="w-full px-3.5 py-2 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Status
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as TableStatus)}
                  className="w-full px-3.5 py-2 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                >
                  <option value="Available">Available</option>
                  <option value="Occupied">Occupied</option>
                  <option value="Reserved">Reserved</option>
                </select>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingTable(null)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xs"
                >
                  Update Table
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
