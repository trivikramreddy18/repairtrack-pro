import React, { useState, useEffect } from 'react';
import {
  X,
  User,
  Phone,
  Mail,
  MapPin,
  Smartphone,
  Wrench,
  Plus,
  ArrowRight,
  Eye,
} from 'lucide-react';
import { api } from '../services/api';
import { STATUS_CONFIG, formatCurrency, formatDate } from '../utils/statusHelper';

export default function CustomerDetailsModal({
  customer,
  onClose,
  onNewDevice,
  onNewRepair,
  onViewRepair,
}) {
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (customer?.id) {
      setLoading(true);
      api.getDevices(customer.id)
        .then((res) => setDevices(res))
        .catch((err) => console.error(err))
        .finally(() => setLoading(false));
    }
  }, [customer]);

  if (!customer) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden border border-slate-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold text-base">
              {customer.name?.charAt(0) || 'C'}
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">{customer.name}</h2>
              <div className="text-xs text-slate-500">Customer Profile & Device Portfolio</div>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs">
          {/* Contact Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
            <div>
              <span className="text-slate-400 text-[10px] font-bold uppercase tracking-wider block mb-1">
                Contact Numbers
              </span>
              <p className="font-semibold text-slate-800 font-mono text-sm">{customer.phone}</p>
              {customer.email && <p className="text-slate-600 mt-1">{customer.email}</p>}
            </div>
            <div>
              <span className="text-slate-400 text-[10px] font-bold uppercase tracking-wider block mb-1">
                Billing / Street Address
              </span>
              <p className="text-slate-700">{[customer.address, customer.city].filter(Boolean).join(', ') || 'No address provided'}</p>
            </div>
            {customer.notes && (
              <div className="col-span-full border-t border-slate-200/60 pt-2 text-slate-600 italic">
                "{customer.notes}"
              </div>
            )}
          </div>

          {/* Registered Devices List */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                <Smartphone className="w-4 h-4 text-indigo-600" />
                <span>Registered Devices ({devices.length})</span>
              </h3>
              <button
                onClick={() => onNewDevice(customer.id)}
                className="flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-lg border border-indigo-200"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Register Device</span>
              </button>
            </div>

            {loading ? (
              <div className="p-6 text-center text-slate-400">Loading devices...</div>
            ) : devices.length > 0 ? (
              <div className="space-y-3">
                {devices.map((d) => (
                  <div
                    key={d.id}
                    className="p-3.5 rounded-xl border border-slate-200 bg-white hover:border-indigo-200 transition space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <div className="font-bold text-slate-900">
                        {d.brand} {d.model} <span className="text-slate-400 font-normal">({d.deviceType})</span>
                      </div>
                      <span className="font-mono text-[11px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
                        {d.serialNumber || 'No Serial #'}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-slate-500 text-[11px]">
                      <span>Repairs Logged: <strong>{d.repairsCount || 0}</strong></span>
                      <button
                        onClick={() => onNewRepair(d.id, customer.id)}
                        className="flex items-center gap-1 text-indigo-600 font-semibold hover:text-indigo-700"
                      >
                        <Wrench className="w-3 h-3" />
                        <span>Create Repair Ticket</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-6 text-center text-slate-400 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                No devices currently registered for this customer.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
