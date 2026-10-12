import React, { useState } from 'react';
import {
  Users,
  Search,
  Plus,
  Phone,
  Mail,
  MapPin,
  Smartphone,
  Wrench,
  Edit,
  Trash2,
  ChevronRight,
  Eye,
  PlusCircle,
} from 'lucide-react';
import { formatDate } from '../utils/statusHelper';

export default function CustomersView({
  customers = [],
  onNewCustomer,
  onEditCustomer,
  onDeleteCustomer,
  onViewCustomerDetails,
  onRegisterDeviceForCustomer,
  currentUser,
}) {
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = customers.filter((c) => {
    if (!searchTerm.trim()) return true;
    const q = searchTerm.toLowerCase();
    return (
      c.name?.toLowerCase().includes(q) ||
      c.phone?.includes(q) ||
      c.email?.toLowerCase().includes(q) ||
      c.city?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      {/* Top Header & Search Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search customers by name, phone, email, or city..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white transition"
          />
        </div>

        <button
          onClick={onNewCustomer}
          className="flex items-center justify-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs px-4 py-2 rounded-xl shadow-md shadow-indigo-600/20 transition active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>New Customer</span>
        </button>
      </div>

      {/* Customer Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((c) => (
          <div
            key={c.id}
            className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm hover:shadow-md transition flex flex-col justify-between"
          >
            <div>
              {/* Card Header */}
              <div className="flex items-start justify-between gap-2 mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-sm">
                    {c.name?.charAt(0) || 'C'}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm">{c.name}</h3>
                    <span className="text-[10px] text-slate-400">Client ID #{c.id}</span>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => onEditCustomer(c)}
                    title="Edit Customer"
                    className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg transition"
                  >
                    <Edit className="w-3.5 h-3.5" />
                  </button>
                  {currentUser?.role === 'ROLE_ADMIN' && (
                    <button
                      onClick={() => onDeleteCustomer(c.id)}
                      title="Delete Customer"
                      className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg transition"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              {/* Contact Information */}
              <div className="space-y-1.5 text-xs text-slate-600 mb-4">
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="font-mono">{c.phone}</span>
                </div>
                {c.email && (
                  <div className="flex items-center gap-2 truncate">
                    <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{c.email}</span>
                  </div>
                )}
                {(c.address || c.city) && (
                  <div className="flex items-center gap-2 truncate">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{[c.address, c.city].filter(Boolean).join(', ')}</span>
                  </div>
                )}
              </div>

              {c.notes && (
                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 text-[11px] text-slate-600 mb-4 italic line-clamp-2">
                  "{c.notes}"
                </div>
              )}
            </div>

            {/* Badges & Actions */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-semibold text-[11px]">
                  <Smartphone className="w-3 h-3 text-slate-500" />
                  {c.deviceCount || 0} Devices
                </span>
                {c.activeRepairsCount > 0 && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-50 text-amber-700 border border-amber-200 font-semibold text-[11px]">
                    <Wrench className="w-3 h-3 text-amber-600" />
                    {c.activeRepairsCount} In Repair
                  </span>
                )}
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => onRegisterDeviceForCustomer(c.id)}
                  title="Add Device for Customer"
                  className="p-1.5 text-indigo-600 hover:bg-indigo-50 rounded-lg transition"
                >
                  <PlusCircle className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onViewCustomerDetails(c)}
                  className="flex items-center gap-1 text-[11px] font-semibold text-indigo-600 hover:text-indigo-700 px-2 py-1 rounded-lg hover:bg-indigo-50 transition"
                >
                  <span>Profile</span>
                  <ChevronRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="col-span-full py-12 text-center text-slate-400 bg-white rounded-2xl border border-slate-200/80">
            No customer records found matching your search.
          </div>
        )}
      </div>
    </div>
  );
}
