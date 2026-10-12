import React, { useState } from 'react';
import {
  Smartphone,
  Search,
  Plus,
  History,
  Edit,
  Trash2,
  Wrench,
  User,
  ExternalLink,
} from 'lucide-react';

export default function DevicesView({
  devices = [],
  onNewDevice,
  onEditDevice,
  onDeleteDevice,
  onViewDeviceHistory,
  onNewRepairForDevice,
  currentUser,
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('ALL');

  const deviceTypes = [
    'ALL',
    'Smartphone',
    'Laptop',
    'Tablet',
    'Gaming Console',
    'Smartwatch',
    'Desktop',
  ];

  const filtered = devices.filter((d) => {
    if (typeFilter !== 'ALL' && d.deviceType !== typeFilter) return false;
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      const matchDevice = d.brand?.toLowerCase().includes(q) || d.model?.toLowerCase().includes(q) || d.serialNumber?.toLowerCase().includes(q);
      const matchOwner = d.customerName?.toLowerCase().includes(q) || d.customerPhone?.includes(q);
      if (!matchDevice && !matchOwner) return false;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Top Header & Search Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by brand, model, serial #, customer name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white transition"
          />
        </div>

        <button
          onClick={() => onNewDevice()}
          className="flex items-center justify-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs px-4 py-2 rounded-xl shadow-md shadow-indigo-600/20 transition active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>Register Device</span>
        </button>
      </div>

      {/* Filter by Type */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        {deviceTypes.map((type) => {
          const isActive = typeFilter === type;
          const count = type === 'ALL'
            ? devices.length
            : devices.filter((d) => d.deviceType === type).length;

          return (
            <button
              key={type}
              onClick={() => setTypeFilter(type)}
              className={`px-3 py-1.5 rounded-xl font-semibold transition shrink-0 flex items-center gap-1.5 ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              <span>{type === 'ALL' ? 'All Types' : type}</span>
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${isActive ? 'bg-indigo-700 text-white' : 'bg-slate-100 text-slate-600'}`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Devices Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 text-slate-500 font-semibold uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Device</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Serial / IMEI</th>
                <th className="py-3 px-4">Owner (Customer)</th>
                <th className="py-3 px-4">Intake Condition</th>
                <th className="py-3 px-4">Repairs</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((d) => (
                <tr key={d.id} className="hover:bg-slate-50/70 transition">
                  <td className="py-3 px-4">
                    <div className="font-bold text-slate-900">{d.brand} {d.model}</div>
                    {d.color && <div className="text-[11px] text-slate-400">Color: {d.color}</div>}
                  </td>
                  <td className="py-3 px-4">
                    <span className="px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 font-medium">
                      {d.deviceType}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-mono text-slate-600">
                    {d.serialNumber || <span className="text-slate-400 italic">None</span>}
                  </td>
                  <td className="py-3 px-4">
                    <div className="font-semibold text-slate-800">{d.customerName}</div>
                    <div className="text-[11px] text-slate-400 font-mono">{d.customerPhone}</div>
                  </td>
                  <td className="py-3 px-4 max-w-xs">
                    <p className="truncate text-slate-600" title={d.conditionNotes || 'No notes'}>
                      {d.conditionNotes || 'Normal wear'}
                    </p>
                    {d.accessories && (
                      <span className="text-[10px] text-slate-400 truncate block">
                        Acc: {d.accessories}
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    <span className="font-mono font-bold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                      {d.repairsCount || 0}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => onViewDeviceHistory(d)}
                        title="View Repair History"
                        className="flex items-center gap-1 text-[11px] font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 px-2 py-1 rounded-lg border border-indigo-200 transition"
                      >
                        <History className="w-3 h-3" />
                        <span>History</span>
                      </button>
                      <button
                        onClick={() => onNewRepairForDevice(d)}
                        title="Create Repair Ticket"
                        className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-slate-100 rounded-lg transition"
                      >
                        <Wrench className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onEditDevice(d)}
                        title="Edit Device"
                        className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      {currentUser?.role === 'ROLE_ADMIN' && (
                        <button
                          onClick={() => onDeleteDevice(d.id)}
                          title="Delete Device (Admin)"
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-slate-100 rounded-lg transition"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}

              {filtered.length === 0 && (
                <tr>
                  <td colSpan="7" className="py-10 text-center text-slate-400">
                    No devices match current filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
