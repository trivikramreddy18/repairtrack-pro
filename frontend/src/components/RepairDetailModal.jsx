import React, { useState } from 'react';
import {
  X,
  Wrench,
  Clock,
  User,
  Smartphone,
  DollarSign,
  Printer,
  Edit,
  ArrowRight,
  CheckCircle,
  FileText,
  Calendar,
  Layers,
  History,
} from 'lucide-react';
import { STATUS_CONFIG, PRIORITY_CONFIG, NEXT_STATUS_MAP, formatCurrency, formatDate } from '../utils/statusHelper';

export default function RepairDetailModal({
  repair,
  onClose,
  onEdit,
  onAdvanceStatus,
  onPrintTicket,
  currentUser,
}) {
  const [transitionNotes, setTransitionNotes] = useState('');
  const [showAdvancePrompt, setShowAdvancePrompt] = useState(false);

  if (!repair) return null;

  const statusInfo = STATUS_CONFIG[repair.status] || STATUS_CONFIG.RECEIVED;
  const priorityInfo = PRIORITY_CONFIG[repair.priority] || PRIORITY_CONFIG.MEDIUM;
  const nextTransition = NEXT_STATUS_MAP[repair.status];

  const handleAdvance = () => {
    if (!nextTransition) return;
    onAdvanceStatus(repair.id, nextTransition.next, transitionNotes);
    setShowAdvancePrompt(false);
    setTransitionNotes('');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[92vh] flex flex-col overflow-hidden border border-slate-200">
        {/* Top Modal Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-3">
            <span className="font-mono text-sm font-bold bg-white px-2.5 py-1 rounded-lg border border-slate-200 text-slate-800 shadow-sm">
              {repair.ticketNumber}
            </span>
            <span className={`text-xs px-2.5 py-1 rounded-full font-semibold border ${statusInfo.color}`}>
              {statusInfo.label}
            </span>
            <span className={`text-xs px-2 py-0.5 rounded-md font-medium border ${priorityInfo.color}`}>
              {priorityInfo.label} Priority
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onPrintTicket(repair, 'ticket')}
              title="Print Intake Ticket"
              className="flex items-center gap-1 text-xs text-slate-600 hover:text-slate-900 bg-white border border-slate-200 hover:bg-slate-50 px-2.5 py-1.5 rounded-lg shadow-sm transition"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Ticket</span>
            </button>
            <button
              onClick={() => onPrintTicket(repair, 'invoice')}
              title="Print Invoice"
              className="flex items-center gap-1 text-xs text-indigo-700 bg-indigo-50 border border-indigo-200 hover:bg-indigo-100 px-2.5 py-1.5 rounded-lg font-medium transition"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Invoice</span>
            </button>
            <button
              onClick={() => onEdit(repair)}
              title="Edit Details"
              className="flex items-center gap-1 text-xs text-slate-600 hover:text-slate-900 bg-white border border-slate-200 hover:bg-slate-50 px-2.5 py-1.5 rounded-lg shadow-sm transition"
            >
              <Edit className="w-3.5 h-3.5" />
              <span>Edit</span>
            </button>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Quick Status Workflow Progress Banner */}
          {nextTransition && (
            <div className="bg-gradient-to-r from-indigo-50 to-blue-50 border border-indigo-100 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-sm">
              <div>
                <span className="text-xs font-semibold text-indigo-900 uppercase tracking-wide">Next Stage Action:</span>
                <p className="text-sm font-medium text-indigo-700 mt-0.5">
                  Ready to advance this device to <strong className="text-indigo-900">{STATUS_CONFIG[nextTransition.next]?.label}</strong>?
                </p>
              </div>

              {!showAdvancePrompt ? (
                <button
                  onClick={() => setShowAdvancePrompt(true)}
                  className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-4 py-2 rounded-xl text-xs shadow-md shadow-indigo-600/20 transition shrink-0"
                >
                  <span>{nextTransition.label}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              ) : (
                <div className="flex flex-col gap-2 w-full sm:w-auto">
                  <input
                    type="text"
                    placeholder="Optional transition note..."
                    value={transitionNotes}
                    onChange={(e) => setTransitionNotes(e.target.value)}
                    className="text-xs border border-indigo-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                  <div className="flex gap-2 justify-end">
                    <button
                      onClick={() => setShowAdvancePrompt(false)}
                      className="text-xs text-slate-500 hover:text-slate-700 px-2 py-1"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleAdvance}
                      className="text-xs bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-3 py-1 rounded-lg"
                    >
                      Confirm Transition
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Device & Customer Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Customer Information */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-700 uppercase tracking-wide mb-3">
                <User className="w-4 h-4 text-slate-500" />
                <span>Customer Information</span>
              </div>
              <div className="space-y-1.5 text-xs text-slate-700">
                <div className="font-semibold text-sm text-slate-900">{repair.customerName}</div>
                <div><span className="text-slate-500">Phone:</span> {repair.customerPhone}</div>
                {repair.customerEmail && <div><span className="text-slate-500">Email:</span> {repair.customerEmail}</div>}
                {repair.customerAddress && <div><span className="text-slate-500">Address:</span> {repair.customerAddress}</div>}
              </div>
            </div>

            {/* Device Information */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-700 uppercase tracking-wide mb-3">
                <Smartphone className="w-4 h-4 text-slate-500" />
                <span>Device Information</span>
              </div>
              <div className="space-y-1.5 text-xs text-slate-700">
                <div className="font-semibold text-sm text-slate-900">{repair.brand} {repair.model}</div>
                <div><span className="text-slate-500">Type:</span> {repair.deviceType} {repair.color ? `• ${repair.color}` : ''}</div>
                <div><span className="text-slate-500">Serial/IMEI:</span> <span className="font-mono">{repair.serialNumber || 'N/A'}</span></div>
                <div><span className="text-slate-500">Assigned Tech:</span> <strong className="text-indigo-600">{repair.assignedTechnician || 'Unassigned'}</strong></div>
              </div>
            </div>
          </div>

          {/* Technical Details: Problem, Diagnosis, Notes */}
          <div className="border border-slate-200 rounded-xl p-4 space-y-3.5">
            <div>
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wide block mb-1">
                Reported Problem:
              </span>
              <p className="text-xs text-slate-800 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                {repair.reportedProblem}
              </p>
            </div>

            {repair.diagnosisDetails && (
              <div>
                <span className="text-xs font-bold text-amber-800 uppercase tracking-wide block mb-1">
                  Diagnostic Findings:
                </span>
                <p className="text-xs text-slate-800 bg-amber-50/50 p-2.5 rounded-lg border border-amber-100">
                  {repair.diagnosisDetails}
                </p>
              </div>
            )}

            {repair.technicianNotes && (
              <div>
                <span className="text-xs font-bold text-indigo-800 uppercase tracking-wide block mb-1">
                  Technician Work Notes:
                </span>
                <p className="text-xs text-slate-800 bg-indigo-50/50 p-2.5 rounded-lg border border-indigo-100">
                  {repair.technicianNotes}
                </p>
              </div>
            )}
          </div>

          {/* Costs & Financials */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-700 uppercase tracking-wide mb-3">
              <DollarSign className="w-4 h-4 text-emerald-600" />
              <span>Cost & Estimates</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="bg-white p-3 rounded-lg border border-slate-200">
                <span className="text-slate-500 text-[11px] block">Estimated Cost</span>
                <span className="font-semibold text-slate-800 font-mono text-sm">{formatCurrency(repair.estimatedCost)}</span>
              </div>
              <div className="bg-white p-3 rounded-lg border border-slate-200">
                <span className="text-slate-500 text-[11px] block">Parts / Hardware</span>
                <span className="font-semibold text-slate-800 font-mono text-sm">{formatCurrency(repair.partsCost)}</span>
              </div>
              <div className="bg-white p-3 rounded-lg border border-slate-200">
                <span className="text-slate-500 text-[11px] block">Service Labor</span>
                <span className="font-semibold text-slate-800 font-mono text-sm">{formatCurrency(repair.laborCost)}</span>
              </div>
              <div className="bg-indigo-50 p-3 rounded-lg border border-indigo-200">
                <span className="text-indigo-600 text-[11px] font-medium block">Final Total</span>
                <span className="font-bold text-indigo-700 font-mono text-sm">{formatCurrency(repair.finalCost)}</span>
              </div>
            </div>
          </div>

          {/* Status Timeline History */}
          <div className="border border-slate-200 rounded-xl p-4">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-700 uppercase tracking-wide mb-4">
              <History className="w-4 h-4 text-indigo-600" />
              <span>Service Audit Trail & History</span>
            </div>

            {repair.statusHistory && repair.statusHistory.length > 0 ? (
              <div className="space-y-4 relative before:absolute before:inset-0 before:left-3.5 before:w-0.5 before:bg-slate-200">
                {repair.statusHistory.map((item, idx) => {
                  const cfg = STATUS_CONFIG[item.status] || STATUS_CONFIG.RECEIVED;
                  return (
                    <div key={item.id || idx} className="relative flex items-start gap-4 text-xs">
                      <div className={`w-7 h-7 rounded-full border-2 border-white shadow-sm ${cfg.dot} shrink-0 z-10 flex items-center justify-center text-white text-[10px]`}>
                        ✓
                      </div>
                      <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 flex-1">
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <span className={`font-semibold px-2 py-0.5 rounded text-[11px] border ${cfg.color}`}>
                            {item.statusDisplayName || item.status}
                          </span>
                          <span className="text-slate-400 text-[11px]">{formatDate(item.timestamp)}</span>
                        </div>
                        {item.changedBy && (
                          <div className="text-slate-500 text-[11px] mb-1">Updated by: <strong>{item.changedBy}</strong></div>
                        )}
                        {item.notes && <div className="text-slate-700 mt-1">{item.notes}</div>}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-xs text-slate-500 italic">No transition history recorded.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
