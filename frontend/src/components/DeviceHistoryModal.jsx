import React, { useState, useEffect } from 'react';
import { X, Smartphone, History, Wrench, Calendar, Plus, Eye, DollarSign } from 'lucide-react';
import { api } from '../services/api';
import { STATUS_CONFIG, formatCurrency, formatDate } from '../utils/statusHelper';

export default function DeviceHistoryModal({
  device,
  onClose,
  onViewRepair,
  onNewRepair,
}) {
  const [repairs, setRepairs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (device?.id) {
      setLoading(true);
      api.getDeviceRepairs(device.id)
        .then((res) => setRepairs(res))
        .catch((err) => console.error(err))
        .finally(() => setLoading(false));
    }
  }, [device]);

  if (!device) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden border border-slate-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-700 flex items-center justify-center">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                {device.brand} {device.model}
              </h2>
              <div className="text-xs text-slate-500 flex items-center gap-2">
                <span>Owner: <strong>{device.customerName}</strong></span>
                {device.serialNumber && <span>• SN: <code className="font-mono">{device.serialNumber}</code></span>}
              </div>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs">
          {/* Device Specs Card */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div>
              <span className="text-slate-400 text-[10px] uppercase font-bold block">Type</span>
              <span className="font-semibold text-slate-800">{device.deviceType}</span>
            </div>
            <div>
              <span className="text-slate-400 text-[10px] uppercase font-bold block">Color</span>
              <span className="font-semibold text-slate-800">{device.color || 'Standard'}</span>
            </div>
            <div>
              <span className="text-slate-400 text-[10px] uppercase font-bold block">Accessories</span>
              <span className="font-semibold text-slate-800 truncate block" title={device.accessories || 'None'}>
                {device.accessories || 'None'}
              </span>
            </div>
            <div>
              <span className="text-slate-400 text-[10px] uppercase font-bold block">Total Jobs</span>
              <span className="font-bold text-indigo-700 font-mono">{repairs.length} Tickets</span>
            </div>
          </div>

          {/* Service History Timeline */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                <History className="w-4 h-4 text-indigo-600" />
                <span>Repair & Service History Timeline</span>
              </h3>
              <button
                onClick={() => onNewRepair(device.id, device.customerId)}
                className="flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-lg border border-indigo-200"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Job</span>
              </button>
            </div>

            {loading ? (
              <div className="p-8 text-center text-slate-400">Loading service history...</div>
            ) : repairs.length > 0 ? (
              <div className="space-y-3">
                {repairs.map((r) => {
                  const statusInfo = STATUS_CONFIG[r.status] || STATUS_CONFIG.RECEIVED;

                  return (
                    <div
                      key={r.id}
                      className="p-4 rounded-xl border border-slate-200 bg-white hover:border-indigo-200 transition space-y-2 shadow-sm"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-slate-800 bg-slate-50 px-2 py-0.5 rounded border border-slate-200">
                            {r.ticketNumber}
                          </span>
                          <span className={`px-2 py-0.5 rounded-full font-semibold text-[11px] border ${statusInfo.color}`}>
                            {statusInfo.label}
                          </span>
                        </div>
                        <span className="text-slate-400 text-[11px]">{formatDate(r.receivedDate)}</span>
                      </div>

                      <div className="text-slate-700 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                        <strong className="text-slate-900 block mb-0.5">Problem:</strong> {r.reportedProblem}
                      </div>

                      {r.technicianNotes && (
                        <div className="text-slate-600 text-[11px]">
                          <strong>Tech Note:</strong> {r.technicianNotes}
                        </div>
                      )}

                      <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                        <span className="text-slate-500">
                          Final Cost: <strong className="text-indigo-700 font-mono">{formatCurrency(r.finalCost || r.estimatedCost)}</strong>
                        </span>
                        <button
                          onClick={() => onViewRepair(r)}
                          className="flex items-center gap-1 text-indigo-600 font-semibold hover:text-indigo-700"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>View Full Ticket</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="p-8 text-center text-slate-400 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                No past repair records found for this device.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
