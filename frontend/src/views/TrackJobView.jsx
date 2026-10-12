import React, { useState } from 'react';
import {
  SearchCheck,
  Search,
  CheckCircle2,
  Clock,
  Wrench,
  Smartphone,
  User,
  AlertCircle,
  FileText,
  Printer,
  PackageCheck,
  ArrowRight,
} from 'lucide-react';
import { api } from '../services/api';
import { STATUS_CONFIG, PRIORITY_CONFIG, formatCurrency, formatDate } from '../utils/statusHelper';

export default function TrackJobView({ onPrintTicket, sampleTickets = [] }) {
  const [ticketInput, setTicketInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [repair, setRepair] = useState(null);
  const [error, setError] = useState('');

  const handleSearch = async (ticket) => {
    const toSearch = (ticket || ticketInput).trim();
    if (!toSearch) {
      setError('Please enter a valid ticket number (e.g. REP-20261001-1001)');
      return;
    }

    setLoading(true);
    setError('');
    setRepair(null);

    try {
      const data = await api.trackRepair(toSearch);
      setRepair(data);
    } catch (err) {
      setError(err.message || `No repair ticket found for "${toSearch}".`);
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    { key: 'RECEIVED', label: 'Device Received', desc: 'Intake and inspection' },
    { key: 'DIAGNOSING', label: 'Diagnosis', desc: 'Hardware & bench testing' },
    { key: 'IN_REPAIR', label: 'In Repair', desc: 'Part replacement & soldering' },
    { key: 'READY_FOR_PICKUP', label: 'Ready for Pickup', desc: 'Quality checked & ready' },
    { key: 'DELIVERED', label: 'Delivered', desc: 'Closed & collected' },
  ];

  const currentStepIndex = repair
    ? steps.findIndex((s) => s.key === repair.status)
    : -1;

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Search Box Header */}
      <div className="bg-gradient-to-br from-indigo-900 via-slate-900 to-indigo-950 rounded-2xl p-8 text-white shadow-xl text-center">
        <div className="inline-flex p-3 rounded-2xl bg-indigo-500/20 text-indigo-300 mb-3 border border-indigo-400/30">
          <SearchCheck className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-black tracking-tight">Public Repair Status Tracker</h2>
        <p className="text-slate-300 text-xs mt-1 max-w-md mx-auto">
          Enter your unique service ticket number to verify current repair stage, diagnostic results, and estimated completion.
        </p>

        {/* Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSearch();
          }}
          className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-2 max-w-lg mx-auto"
        >
          <div className="relative w-full">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="e.g. REP-20261001-1001"
              value={ticketInput}
              onChange={(e) => setTicketInput(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-800/90 border border-slate-700 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 font-mono text-xs uppercase"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full sm:w-auto px-6 py-3 bg-indigo-500 hover:bg-indigo-400 text-white font-bold rounded-xl text-xs transition shadow-lg shadow-indigo-500/30 disabled:opacity-50 shrink-0"
          >
            {loading ? 'Searching...' : 'Track Job'}
          </button>
        </form>

        {/* Quick Sample Tickets */}
        {sampleTickets.length > 0 && (
          <div className="mt-4 flex items-center justify-center gap-2 flex-wrap text-[11px] text-slate-400">
            <span>Try sample tickets:</span>
            {sampleTickets.slice(0, 4).map((ticket) => (
              <button
                key={ticket}
                type="button"
                onClick={() => {
                  setTicketInput(ticket);
                  handleSearch(ticket);
                }}
                className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-indigo-300 font-mono border border-slate-700 transition"
              >
                {ticket}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 rounded-2xl flex items-center gap-3 text-xs">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Result Container */}
      {repair && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden text-xs">
          {/* Status Header */}
          <div className="p-6 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-base font-black text-slate-900 bg-white px-3 py-1 rounded-lg border border-slate-200 shadow-sm">
                  {repair.ticketNumber}
                </span>
                <span className={`px-2.5 py-1 rounded-full font-bold border ${STATUS_CONFIG[repair.status]?.color}`}>
                  {STATUS_CONFIG[repair.status]?.label}
                </span>
              </div>
              <p className="text-slate-500 text-[11px] mt-1">
                Admitted on {formatDate(repair.receivedDate)} • Assigned Tech: <strong>{repair.assignedTechnician || 'General Tech'}</strong>
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => onPrintTicket(repair, 'ticket')}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-slate-700 bg-white hover:bg-slate-50 font-semibold text-xs shadow-sm"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Intake Ticket</span>
              </button>
              <button
                onClick={() => onPrintTicket(repair, 'invoice')}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Service Invoice</span>
              </button>
            </div>
          </div>

          {/* Stepper Progress Bar */}
          <div className="p-6 border-b border-slate-200 bg-white">
            <h3 className="font-bold text-slate-900 uppercase tracking-wide text-[11px] mb-6">
              Live Service Stage Progress
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
              {steps.map((st, idx) => {
                const isPassed = currentStepIndex >= idx;
                const isCurrent = currentStepIndex === idx;

                return (
                  <div
                    key={st.key}
                    className={`p-3 rounded-xl border transition ${
                      isCurrent
                        ? 'bg-indigo-50/80 border-indigo-400 ring-2 ring-indigo-200 shadow-sm'
                        : isPassed
                        ? 'bg-emerald-50/60 border-emerald-300'
                        : 'bg-slate-50 border-slate-200 opacity-60'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[10px] font-bold text-slate-400">0{idx + 1}</span>
                      {isPassed ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      ) : (
                        <Clock className="w-4 h-4 text-slate-300" />
                      )}
                    </div>
                    <div className="font-bold text-slate-800">{st.label}</div>
                    <div className="text-[10px] text-slate-500 mt-0.5">{st.desc}</div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Details & Findings */}
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-slate-400 text-[10px] font-bold uppercase block mb-1">
                  Device Information
                </span>
                <p className="font-bold text-slate-900 text-sm">{repair.brand} {repair.model}</p>
                <p className="text-slate-600 mt-0.5">Type: {repair.deviceType} {repair.color ? `(${repair.color})` : ''}</p>
                <p className="text-slate-600 font-mono">Serial: {repair.serialNumber || 'N/A'}</p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-slate-400 text-[10px] font-bold uppercase block mb-1">
                  Reported Issue
                </span>
                <p className="text-slate-700">{repair.reportedProblem}</p>
              </div>
            </div>

            <div className="space-y-4">
              {repair.diagnosisDetails && (
                <div className="p-4 rounded-xl bg-amber-50/60 border border-amber-200">
                  <span className="text-amber-800 text-[10px] font-bold uppercase block mb-1">
                    Diagnostic Findings
                  </span>
                  <p className="text-slate-800">{repair.diagnosisDetails}</p>
                </div>
              )}

              {repair.technicianNotes && (
                <div className="p-4 rounded-xl bg-indigo-50/60 border border-indigo-200">
                  <span className="text-indigo-800 text-[10px] font-bold uppercase block mb-1">
                    Technician Service Notes
                  </span>
                  <p className="text-slate-800">{repair.technicianNotes}</p>
                </div>
              )}

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex justify-between items-center">
                <div>
                  <span className="text-slate-400 text-[10px] font-bold uppercase block">Service Total</span>
                  <p className="text-xs text-slate-500">Hardware & labor included</p>
                </div>
                <span className="text-xl font-black text-indigo-700 font-mono">
                  {formatCurrency(repair.finalCost || repair.estimatedCost)}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
