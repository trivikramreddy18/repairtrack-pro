import React from 'react';
import {
  Users,
  Smartphone,
  Wrench,
  PackageCheck,
  CheckCircle2,
  DollarSign,
  TrendingUp,
  AlertTriangle,
  Clock,
  ArrowUpRight,
  ArrowRight,
  Plus,
  Eye,
} from 'lucide-react';
import { STATUS_CONFIG, PRIORITY_CONFIG, NEXT_STATUS_MAP, formatCurrency, formatDate } from '../utils/statusHelper';

export default function DashboardView({
  stats,
  onViewRepair,
  onNewRepair,
  onNewCustomer,
  onNewDevice,
  onNavigateTo,
  onAdvanceStatus,
}) {
  const statusCounts = stats?.statusCounts || {};
  const totalRepairs = stats?.totalRepairs || 1;

  const cards = [
    {
      title: 'Active Repairs',
      value: stats?.activeRepairs || 0,
      subtext: 'Currently on work benches',
      icon: Wrench,
      color: 'bg-amber-500/10 text-amber-600 border-amber-200/60',
      actionView: 'repairs',
    },
    {
      title: 'Ready for Pickup',
      value: stats?.readyForPickup || 0,
      subtext: 'Awaiting customer pickup',
      icon: PackageCheck,
      color: 'bg-emerald-500/10 text-emerald-600 border-emerald-200/60',
      actionView: 'repairs',
    },
    {
      title: 'Delivered & Paid',
      value: stats?.deliveredRepairs || 0,
      subtext: 'Successfully completed',
      icon: CheckCircle2,
      color: 'bg-purple-500/10 text-purple-600 border-purple-200/60',
      actionView: 'repairs',
    },
    {
      title: 'Delivered Revenue',
      value: formatCurrency(stats?.totalDeliveredRevenue || 0),
      subtext: 'Collected service income',
      icon: DollarSign,
      color: 'bg-blue-500/10 text-blue-600 border-blue-200/60',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Top Welcome & Quick Actions Bar */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-semibold mb-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              Live Repair Management Center
            </div>
            <h2 className="text-2xl font-black tracking-tight">Electronics Service Operations</h2>
            <p className="text-slate-300 text-xs mt-1 max-w-xl">
              Track customer devices from intake inspection to component-level repair and final pickup with complete cost auditing.
            </p>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            <button
              onClick={onNewRepair}
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs px-4 py-2.5 rounded-xl shadow-lg shadow-indigo-600/30 transition active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>New Repair</span>
            </button>
            <button
              onClick={onNewCustomer}
              className="flex items-center gap-2 bg-slate-800/80 hover:bg-slate-700/80 text-slate-200 border border-slate-700 font-medium text-xs px-3.5 py-2.5 rounded-xl transition"
            >
              <Users className="w-3.5 h-3.5 text-indigo-400" />
              <span>+ Customer</span>
            </button>
            <button
              onClick={onNewDevice}
              className="flex items-center gap-2 bg-slate-800/80 hover:bg-slate-700/80 text-slate-200 border border-slate-700 font-medium text-xs px-3.5 py-2.5 rounded-xl transition"
            >
              <Smartphone className="w-3.5 h-3.5 text-indigo-400" />
              <span>+ Device</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div
              key={idx}
              className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm hover:shadow-md transition group"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                  {card.title}
                </span>
                <div className={`p-2 rounded-xl border ${card.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-3">
                <span className="text-2xl font-black text-slate-900 tracking-tight">{card.value}</span>
                <p className="text-[11px] text-slate-400 mt-1">{card.subtext}</p>
              </div>
              {card.actionView && (
                <button
                  onClick={() => onNavigateTo(card.actionView)}
                  className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between w-full text-[11px] text-indigo-600 font-semibold group-hover:text-indigo-700"
                >
                  <span>View Details</span>
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* Overview Analytics: Status Pipeline & Secondary KPIs */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Repair Status Distribution */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Service Pipeline Status Breakdown</h3>
              <p className="text-xs text-slate-400">Distribution of devices across repair lifecycle phases</p>
            </div>
            <span className="text-xs font-mono font-semibold bg-slate-100 text-slate-700 px-2.5 py-1 rounded-lg">
              Total: {stats?.totalRepairs || 0} Tickets
            </span>
          </div>

          <div className="space-y-3.5">
            {[
              { key: 'RECEIVED', label: 'Received / Intake Inspection', color: 'bg-indigo-500', barBg: 'bg-indigo-100' },
              { key: 'DIAGNOSING', label: 'Diagnosing & Testing', color: 'bg-amber-500', barBg: 'bg-amber-100' },
              { key: 'IN_REPAIR', label: 'In Repair / Micro-soldering', color: 'bg-blue-500', barBg: 'bg-blue-100' },
              { key: 'READY_FOR_PICKUP', label: 'Ready for Customer Pickup', color: 'bg-emerald-500', barBg: 'bg-emerald-100' },
              { key: 'DELIVERED', label: 'Delivered & Closed', color: 'bg-purple-500', barBg: 'bg-purple-100' },
            ].map((item) => {
              const count = statusCounts[item.key] || 0;
              const percent = totalRepairs > 0 ? Math.round((count / totalRepairs) * 100) : 0;
              return (
                <div key={item.key}>
                  <div className="flex justify-between items-center text-xs mb-1">
                    <span className="font-medium text-slate-700 flex items-center gap-1.5">
                      <span className={`w-2 h-2 rounded-full ${item.color}`}></span>
                      {item.label}
                    </span>
                    <span className="font-semibold text-slate-800 font-mono">
                      {count} <span className="text-slate-400 font-normal">({percent}%)</span>
                    </span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${item.color} rounded-full transition-all duration-500`}
                      style={{ width: `${percent}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Center Registry Summary & Pipeline Value */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-slate-900 text-sm mb-1">Center Registry Metrics</h3>
            <p className="text-xs text-slate-400 mb-4">Total entities currently registered</p>

            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-lg bg-indigo-100 text-indigo-700">
                    <Users className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-slate-800">Total Customers</div>
                    <div className="text-[11px] text-slate-400">Registered client accounts</div>
                  </div>
                </div>
                <span className="text-lg font-black text-slate-900 font-mono">{stats?.totalCustomers || 0}</span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-lg bg-sky-100 text-sky-700">
                    <Smartphone className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-slate-800">Registered Devices</div>
                    <div className="text-[11px] text-slate-400">Smartphones, laptops, consoles</div>
                  </div>
                </div>
                <span className="text-lg font-black text-slate-900 font-mono">{stats?.totalDevices || 0}</span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-indigo-50/70 border border-indigo-100">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-lg bg-indigo-600 text-white">
                    <TrendingUp className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-indigo-900">Active Work Pipeline</div>
                    <div className="text-[11px] text-indigo-700">Estimated value in progress</div>
                  </div>
                </div>
                <span className="text-base font-black text-indigo-900 font-mono">
                  {formatCurrency(stats?.activePipelineValue || 0)}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 text-center">
            <button
              onClick={() => onNavigateTo('repairs')}
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 flex items-center justify-center gap-1 w-full"
            >
              <span>Explore All Repair Jobs</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Recent Repairs Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-slate-900 text-sm">Recent Repair Jobs</h3>
            <p className="text-xs text-slate-400">Latest devices admitted or updated</p>
          </div>
          <button
            onClick={() => onNavigateTo('repairs')}
            className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
          >
            <span>View All ({stats?.totalRepairs || 0})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 text-slate-500 font-semibold uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Ticket #</th>
                <th className="py-3 px-4">Customer & Device</th>
                <th className="py-3 px-4">Reported Problem</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Priority</th>
                <th className="py-3 px-4">Cost</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {stats?.recentRepairs && stats.recentRepairs.length > 0 ? (
                stats.recentRepairs.map((r) => {
                  const statusInfo = STATUS_CONFIG[r.status] || STATUS_CONFIG.RECEIVED;
                  const priorityInfo = PRIORITY_CONFIG[r.priority] || PRIORITY_CONFIG.MEDIUM;
                  const nextTransition = NEXT_STATUS_MAP[r.status];

                  return (
                    <tr key={r.id} className="hover:bg-slate-50/70 transition">
                      <td className="py-3 px-4 font-mono font-bold text-slate-800">
                        {r.ticketNumber}
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-semibold text-slate-900">{r.customerName}</div>
                        <div className="text-slate-500 text-[11px]">
                          {r.brand} {r.model} ({r.deviceType})
                        </div>
                      </td>
                      <td className="py-3 px-4 max-w-xs">
                        <p className="truncate text-slate-700" title={r.reportedProblem}>
                          {r.reportedProblem}
                        </p>
                        <span className="text-[10px] text-slate-400">Tech: {r.assignedTechnician || 'Unassigned'}</span>
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
                      <td className="py-3 px-4 font-mono font-semibold text-slate-800">
                        {formatCurrency(r.finalCost || r.estimatedCost)}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {nextTransition && (
                            <button
                              onClick={() => onAdvanceStatus(r.id, nextTransition.next, 'Quick advanced from dashboard')}
                              title={`Advance to ${STATUS_CONFIG[nextTransition.next]?.label}`}
                              className="px-2 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-semibold rounded text-[11px] border border-indigo-200 transition"
                            >
                              Advance →
                            </button>
                          )}
                          <button
                            onClick={() => onViewRepair(r)}
                            title="View Full Details"
                            className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="7" className="py-8 text-center text-slate-400">
                    No repair tickets found.
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
