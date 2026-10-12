import React, { useState } from 'react';
import {
  Wrench,
  Search,
  Filter,
  Plus,
  Eye,
  Edit,
  Trash2,
  Printer,
  FileText,
  Kanban,
  Table as TableIcon,
  ArrowRight,
  User,
  Smartphone,
  Calendar,
} from 'lucide-react';
import { STATUS_CONFIG, PRIORITY_CONFIG, NEXT_STATUS_MAP, formatCurrency, formatDate } from '../utils/statusHelper';

export default function RepairsView({
  repairs = [],
  onNewRepair,
  onViewRepair,
  onEditRepair,
  onDeleteRepair,
  onAdvanceStatus,
  onPrintTicket,
  currentUser,
}) {
  const [viewMode, setViewMode] = useState('kanban'); // 'kanban' or 'table'
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [priorityFilter, setPriorityFilter] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  const statuses = [
    { key: 'ALL', label: 'All Repairs' },
    { key: 'RECEIVED', label: 'Received' },
    { key: 'DIAGNOSING', label: 'Diagnosing' },
    { key: 'IN_REPAIR', label: 'In Repair' },
    { key: 'READY_FOR_PICKUP', label: 'Ready for Pickup' },
    { key: 'DELIVERED', label: 'Delivered' },
  ];

  const filteredRepairs = repairs.filter((r) => {
    if (statusFilter !== 'ALL' && r.status !== statusFilter) return false;
    if (priorityFilter !== 'ALL' && r.priority !== priorityFilter) return false;
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      const matchTicket = r.ticketNumber?.toLowerCase().includes(q);
      const matchCustomer = r.customerName?.toLowerCase().includes(q) || r.customerPhone?.includes(q);
      const matchDevice = r.brand?.toLowerCase().includes(q) || r.model?.toLowerCase().includes(q) || r.serialNumber?.toLowerCase().includes(q);
      const matchProblem = r.reportedProblem?.toLowerCase().includes(q);
      const matchTech = r.assignedTechnician?.toLowerCase().includes(q);
      if (!matchTicket && !matchCustomer && !matchDevice && !matchProblem && !matchTech) {
        return false;
      }
    }
    return true;
  });

  const kanbanColumns = [
    { status: 'RECEIVED', title: 'Received', color: 'border-indigo-400 bg-indigo-50/40 text-indigo-800' },
    { status: 'DIAGNOSING', title: 'Diagnosing', color: 'border-amber-400 bg-amber-50/40 text-amber-800' },
    { status: 'IN_REPAIR', title: 'In Repair', color: 'border-blue-400 bg-blue-50/40 text-blue-800' },
    { status: 'READY_FOR_PICKUP', title: 'Ready for Pickup', color: 'border-emerald-400 bg-emerald-50/40 text-emerald-800' },
    { status: 'DELIVERED', title: 'Delivered', color: 'border-purple-400 bg-purple-50/40 text-purple-800' },
  ];

  return (
    <div className="space-y-6">
      {/* Action Bar & Controls */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Search & Filters */}
        <div className="flex items-center gap-3 flex-wrap flex-1">
          <div className="relative min-w-[240px] flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by ticket #, client, model, serial..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white transition"
            />
          </div>

          <div className="flex items-center gap-2 text-xs">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="bg-slate-50 border border-slate-300 rounded-xl px-2.5 py-2 text-xs font-medium focus:ring-2 focus:ring-indigo-500"
            >
              <option value="ALL">All Priorities</option>
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
              <option value="URGENT">Urgent</option>
            </select>
          </div>
        </div>

        {/* View Switcher & New Ticket Button */}
        <div className="flex items-center gap-3">
          <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
            <button
              onClick={() => setViewMode('kanban')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                viewMode === 'kanban' ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Kanban className="w-3.5 h-3.5" />
              <span>Board</span>
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                viewMode === 'table' ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <TableIcon className="w-3.5 h-3.5" />
              <span>Table</span>
            </button>
          </div>

          <button
            onClick={onNewRepair}
            className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs px-4 py-2 rounded-xl shadow-md shadow-indigo-600/20 transition active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>New Ticket</span>
          </button>
        </div>
      </div>

      {/* Status Filter Tabs (for quick drill-down) */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        {statuses.map((s) => {
          const isActive = statusFilter === s.key;
          const count = s.key === 'ALL'
            ? repairs.length
            : repairs.filter((r) => r.status === s.key).length;

          return (
            <button
              key={s.key}
              onClick={() => setStatusFilter(s.key)}
              className={`px-3.5 py-1.5 rounded-xl font-semibold transition shrink-0 flex items-center gap-1.5 ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/20'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              <span>{s.label}</span>
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${isActive ? 'bg-indigo-700 text-white' : 'bg-slate-100 text-slate-600'}`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* KANBAN BOARD VIEW */}
      {viewMode === 'kanban' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-start">
          {kanbanColumns.map((col) => {
            const columnRepairs = filteredRepairs.filter((r) => r.status === col.status);

            return (
              <div key={col.status} className="bg-slate-100/70 rounded-2xl p-3 border border-slate-200/80 flex flex-col min-h-[500px]">
                {/* Column Header */}
                <div className={`p-2.5 rounded-xl border mb-3 flex items-center justify-between font-bold text-xs ${col.color}`}>
                  <span>{col.title}</span>
                  <span className="px-2 py-0.5 rounded-full bg-white/80 text-[10px] shadow-sm font-mono">
                    {columnRepairs.length}
                  </span>
                </div>

                {/* Cards List */}
                <div className="space-y-3 flex-1 overflow-y-auto">
                  {columnRepairs.map((r) => {
                    const priorityInfo = PRIORITY_CONFIG[r.priority] || PRIORITY_CONFIG.MEDIUM;
                    const nextTransition = NEXT_STATUS_MAP[r.status];

                    return (
                      <div
                        key={r.id}
                        className="bg-white rounded-xl p-3.5 border border-slate-200 shadow-sm hover:shadow-md transition text-xs flex flex-col justify-between gap-2.5 group"
                      >
                        <div>
                          <div className="flex items-center justify-between mb-1.5">
                            <span className="font-mono font-bold text-slate-800 text-[11px] bg-slate-50 px-1.5 py-0.5 rounded border border-slate-200">
                              {r.ticketNumber}
                            </span>
                            <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium border ${priorityInfo.color}`}>
                              {priorityInfo.label}
                            </span>
                          </div>

                          <div className="font-bold text-slate-900 truncate">{r.customerName}</div>
                          <div className="text-[11px] text-slate-500 truncate flex items-center gap-1 mt-0.5">
                            <Smartphone className="w-3 h-3 text-slate-400 shrink-0" />
                            <span>{r.brand} {r.model}</span>
                          </div>

                          <p className="text-[11px] text-slate-600 line-clamp-2 mt-2 bg-slate-50/70 p-2 rounded-lg border border-slate-100">
                            {r.reportedProblem}
                          </p>
                        </div>

                        <div className="pt-2 border-t border-slate-100 space-y-2">
                          <div className="flex items-center justify-between text-[11px]">
                            <span className="text-slate-400">Total:</span>
                            <span className="font-mono font-bold text-indigo-700">
                              {formatCurrency(r.finalCost || r.estimatedCost)}
                            </span>
                          </div>

                          {nextTransition && (
                            <button
                              onClick={() => onAdvanceStatus(r.id, nextTransition.next, 'Advanced from Kanban')}
                              className="w-full flex items-center justify-center gap-1 text-[11px] bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-semibold py-1 px-2 rounded-lg border border-indigo-200 transition"
                            >
                              <span>{nextTransition.label}</span>
                              <ArrowRight className="w-3 h-3" />
                            </button>
                          )}

                          <div className="flex items-center justify-between pt-1">
                            <span className="text-[10px] text-slate-400 truncate max-w-[100px]">
                              {r.assignedTechnician || 'Unassigned'}
                            </span>
                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => onViewRepair(r)}
                                title="View Details"
                                className="p-1 text-slate-400 hover:text-slate-800 rounded"
                              >
                                <Eye className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => onEditRepair(r)}
                                title="Edit"
                                className="p-1 text-slate-400 hover:text-slate-800 rounded"
                              >
                                <Edit className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => onPrintTicket(r, 'invoice')}
                                title="Print Invoice"
                                className="p-1 text-slate-400 hover:text-indigo-600 rounded"
                              >
                                <FileText className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}

                  {columnRepairs.length === 0 && (
                    <div className="p-6 text-center text-slate-400 text-xs italic">
                      No jobs in this phase
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* TABLE VIEW */}
      {viewMode === 'table' && (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 text-slate-500 font-semibold uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Ticket #</th>
                  <th className="py-3 px-4">Customer</th>
                  <th className="py-3 px-4">Device</th>
                  <th className="py-3 px-4">Problem</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Priority</th>
                  <th className="py-3 px-4">Technician</th>
                  <th className="py-3 px-4">Cost</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredRepairs.map((r) => {
                  const statusInfo = STATUS_CONFIG[r.status] || STATUS_CONFIG.RECEIVED;
                  const priorityInfo = PRIORITY_CONFIG[r.priority] || PRIORITY_CONFIG.MEDIUM;
                  const nextTransition = NEXT_STATUS_MAP[r.status];

                  return (
                    <tr key={r.id} className="hover:bg-slate-50/70 transition">
                      <td className="py-3 px-4 font-mono font-bold text-slate-900">
                        {r.ticketNumber}
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-semibold text-slate-800">{r.customerName}</div>
                        <div className="text-[11px] text-slate-500">{r.customerPhone}</div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-medium text-slate-800">{r.brand} {r.model}</div>
                        <div className="text-[11px] text-slate-400">{r.deviceType}</div>
                      </td>
                      <td className="py-3 px-4 max-w-xs">
                        <p className="truncate text-slate-600" title={r.reportedProblem}>
                          {r.reportedProblem}
                        </p>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full font-semibold border ${statusInfo.color}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${statusInfo.dot}`}></span>
                          {statusInfo.label}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-0.5 rounded-md font-medium border ${priorityInfo.color}`}>
                          {priorityInfo.label}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-700">
                        {r.assignedTechnician || '—'}
                      </td>
                      <td className="py-3 px-4 font-mono font-semibold text-slate-800">
                        {formatCurrency(r.finalCost || r.estimatedCost)}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {nextTransition && (
                            <button
                              onClick={() => onAdvanceStatus(r.id, nextTransition.next, 'Advanced from Table')}
                              title={`Advance to ${STATUS_CONFIG[nextTransition.next]?.label}`}
                              className="px-2 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-semibold rounded text-[11px] border border-indigo-200 transition"
                            >
                              Advance →
                            </button>
                          )}
                          <button
                            onClick={() => onViewRepair(r)}
                            title="View"
                            className="p-1.5 text-slate-400 hover:text-slate-800 rounded-lg"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => onEditRepair(r)}
                            title="Edit"
                            className="p-1.5 text-slate-400 hover:text-slate-800 rounded-lg"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => onPrintTicket(r, 'invoice')}
                            title="Print Invoice"
                            className="p-1.5 text-slate-400 hover:text-indigo-600 rounded-lg"
                          >
                            <FileText className="w-4 h-4" />
                          </button>
                          {currentUser?.role === 'ROLE_ADMIN' && (
                            <button
                              onClick={() => onDeleteRepair(r.id)}
                              title="Delete Record (Admin)"
                              className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}

                {filteredRepairs.length === 0 && (
                  <tr>
                    <td colSpan="9" className="py-10 text-center text-slate-400">
                      No repair jobs match current filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
