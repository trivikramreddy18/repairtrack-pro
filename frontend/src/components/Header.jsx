import React from 'react';
import { RefreshCw, Search, UserCheck, Shield, Wrench, Headphones, HelpCircle } from 'lucide-react';

export default function Header({
  currentView,
  searchQuery,
  setSearchQuery,
  onRefresh,
  loading,
  currentUser,
  onSwitchUser,
  allUsers,
}) {
  const titles = {
    dashboard: { title: 'Service Operations Dashboard', subtitle: 'Overview of repair throughput, active jobs, and turnaround metrics' },
    repairs: { title: 'Repair Job Management', subtitle: 'Track and update lifecycle status, diagnostics, and parts costs' },
    customers: { title: 'Customer Records Directory', subtitle: 'Centralized registry of clients with linked devices and repair histories' },
    devices: { title: 'Device Registry & History', subtitle: 'Catalog of electronics received for diagnosis and servicing' },
    track: { title: 'Ticket Tracking Portal', subtitle: 'Lookup repair status and diagnostic timeline by ticket number' },
    staff: { title: 'Staff & Role Permissions', subtitle: 'Manage repair technicians, service advisors, and system administrators' },
  };

  const currentInfo = titles[currentView] || { title: 'RepairTrack Pro', subtitle: 'Electronics Repair Center' };

  return (
    <header className="bg-white border-b border-slate-200 px-8 py-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4 sticky top-0 z-30 shadow-sm">
      <div>
        <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
          {currentInfo.title}
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">{currentInfo.subtitle}</p>
      </div>

      <div className="flex items-center gap-3 flex-wrap">
        {/* Global Search Input (for repairs/customers/devices) */}
        {['repairs', 'customers', 'devices'].includes(currentView) && (
          <div className="relative min-w-[240px]">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder={`Search ${currentView}...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition"
            />
          </div>
        )}

        {/* Refresh button */}
        <button
          onClick={onRefresh}
          disabled={loading}
          title="Refresh Data"
          className="p-2 text-slate-600 hover:text-indigo-600 hover:bg-slate-100 rounded-lg border border-slate-200 transition"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-indigo-600' : ''}`} />
        </button>

        {/* Role Switcher (Pre-seeded role toggling for testing) */}
        <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-2.5 py-1.5 rounded-xl text-xs">
          <span className="text-slate-400 font-medium flex items-center gap-1">
            <UserCheck className="w-3.5 h-3.5 text-slate-500" />
            Acting Role:
          </span>
          <select
            value={currentUser?.username || ''}
            onChange={(e) => onSwitchUser(e.target.value)}
            className="bg-transparent font-semibold text-slate-800 focus:outline-none cursor-pointer"
          >
            {allUsers.map((u) => (
              <option key={u.id} value={u.username}>
                {u.fullName} ({u.role.replace('ROLE_', '')})
              </option>
            ))}
          </select>
        </div>
      </div>
    </header>
  );
}
