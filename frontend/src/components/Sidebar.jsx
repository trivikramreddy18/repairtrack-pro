import React from 'react';
import {
  LayoutDashboard,
  Wrench,
  Users,
  Smartphone,
  SearchCheck,
  ShieldCheck,
  PlusCircle,
  HelpCircle,
  HardHat
} from 'lucide-react';

export default function Sidebar({ currentView, setCurrentView, stats, onNewRepair, currentUser }) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    {
      id: 'repairs',
      label: 'Repair Jobs',
      icon: Wrench,
      badge: stats?.activeRepairs > 0 ? stats.activeRepairs : null,
      badgeColor: 'bg-amber-100 text-amber-700',
    },
    {
      id: 'customers',
      label: 'Customers',
      icon: Users,
      badge: stats?.totalCustomers || null,
      badgeColor: 'bg-slate-100 text-slate-700',
    },
    {
      id: 'devices',
      label: 'Devices',
      icon: Smartphone,
      badge: stats?.totalDevices || null,
      badgeColor: 'bg-slate-100 text-slate-700',
    },
    { id: 'track', label: 'Track Ticket', icon: SearchCheck },
    { id: 'staff', label: 'Staff & Roles', icon: ShieldCheck, adminOnly: true },
  ];

  return (
    <aside className="w-64 bg-slate-900 text-slate-100 flex flex-col shrink-0 min-h-screen border-r border-slate-800">
      {/* Brand Header */}
      <div className="p-5 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-400 flex items-center justify-center shadow-lg shadow-indigo-500/20 text-white font-bold">
            <Wrench className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="font-bold text-base tracking-tight text-white flex items-center gap-1.5">
              RepairTrack <span className="text-xs bg-indigo-500/30 text-indigo-300 font-semibold px-1.5 py-0.5 rounded border border-indigo-400/30">PRO</span>
            </div>
            <div className="text-xs text-slate-400">Electronics Service Hub</div>
          </div>
        </div>
      </div>

      {/* Quick Action Button */}
      <div className="p-4">
        <button
          onClick={onNewRepair}
          className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-medium py-2.5 px-4 rounded-xl shadow-md shadow-indigo-600/20 transition active:scale-[0.98]"
        >
          <PlusCircle className="w-4 h-4" />
          <span>New Repair Ticket</span>
        </button>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-3 space-y-1">
        <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 px-3 py-2">
          Management
        </div>
        {navItems.map((item) => {
          if (item.adminOnly && currentUser?.role !== 'ROLE_ADMIN') {
            return null;
          }
          const Icon = item.icon;
          const isActive = currentView === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setCurrentView(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition ${
                isActive
                  ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-4 h-4 ${isActive ? 'text-indigo-400' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </div>
              {item.badge !== null && item.badge !== undefined && (
                <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${item.badgeColor}`}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* System Status & Center Meta */}
      <div className="p-4 border-t border-slate-800 space-y-3">
        <div className="bg-slate-800/60 rounded-xl p-3 border border-slate-700/60">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              Backend API
            </span>
            <span className="text-emerald-400 font-medium">Online (8080)</span>
          </div>
          <div className="text-[11px] text-slate-400 flex justify-between">
            <span>Ready for Pickup:</span>
            <span className="text-indigo-300 font-semibold">{stats?.readyForPickup || 0} devices</span>
          </div>
        </div>

        {/* User Card */}
        <div className="flex items-center gap-3 px-1 py-1">
          <div className="w-8 h-8 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 flex items-center justify-center font-bold text-xs uppercase">
            {currentUser?.fullName?.charAt(0) || 'U'}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xs font-semibold text-slate-200 truncate">{currentUser?.fullName}</div>
            <div className="text-[11px] text-indigo-400 truncate flex items-center gap-1">
              <HardHat className="w-3 h-3 inline" />
              {currentUser?.role === 'ROLE_ADMIN' ? 'Administrator' : currentUser?.role === 'ROLE_TECHNICIAN' ? 'Technician' : 'Front Desk'}
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
