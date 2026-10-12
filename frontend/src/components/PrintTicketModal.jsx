import React from 'react';
import { Printer, X, Wrench, CheckCircle, FileText } from 'lucide-react';
import { formatCurrency, formatDate } from '../utils/statusHelper';

export default function PrintTicketModal({ repair, onClose, type = 'ticket' }) {
  if (!repair) return null;

  const handlePrint = () => {
    window.print();
  };

  const isInvoice = type === 'invoice';
  const partsCost = repair.partsCost || 0;
  const laborCost = repair.laborCost || 0;
  const subtotal = partsCost + laborCost > 0 ? partsCost + laborCost : (repair.finalCost || repair.estimatedCost || 0);
  const tax = Number((subtotal * 0.08).toFixed(2));
  const total = Number((subtotal + tax).toFixed(2));

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden border border-slate-200">
        {/* Modal Controls Bar (Hidden during print) */}
        <div className="no-print bg-slate-100 px-6 py-3 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2 text-slate-800 font-semibold text-sm">
            <FileText className="w-4 h-4 text-indigo-600" />
            <span>{isInvoice ? 'Official Service Invoice' : 'Customer Job Intake Receipt'}</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1.5 rounded-lg text-xs font-semibold shadow transition"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Document</span>
            </button>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Document Sheet */}
        <div id="printable-area" className="p-8 text-slate-800 bg-white">
          {/* Header */}
          <div className="flex justify-between items-start border-b border-slate-200 pb-6 mb-6">
            <div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
                  <Wrench className="w-4 h-4" />
                </div>
                <span className="text-xl font-black tracking-tight text-slate-900">RepairTrack Pro</span>
              </div>
              <p className="text-xs text-slate-500 mt-1">Authorized Electronics Repair & Diagnostics</p>
              <p className="text-xs text-slate-500">100 Tech Blvd, Suite 200 • (555) 019-8800</p>
              <p className="text-xs text-slate-500">support@repairtrack.com • Tax ID: RT-940219</p>
            </div>

            <div className="text-right">
              <div className="inline-block px-3 py-1 bg-slate-100 rounded-md text-xs font-mono font-bold text-slate-800 mb-1">
                {repair.ticketNumber}
              </div>
              <div className="text-xs text-slate-500">Date: {formatDate(repair.receivedDate)}</div>
              <div className="text-xs font-semibold text-indigo-700 mt-1">
                STATUS: {repair.statusDisplayName || repair.status}
              </div>
            </div>
          </div>

          {/* Customer & Device Dual Box */}
          <div className="grid grid-cols-2 gap-6 mb-6 text-xs">
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
              <h3 className="font-bold text-slate-700 uppercase tracking-wider text-[10px] mb-2">Customer Details</h3>
              <p className="font-semibold text-sm text-slate-900">{repair.customerName}</p>
              <p className="text-slate-600 mt-0.5">Phone: {repair.customerPhone}</p>
              {repair.customerEmail && <p className="text-slate-600">Email: {repair.customerEmail}</p>}
              {repair.customerAddress && <p className="text-slate-600">Address: {repair.customerAddress}</p>}
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
              <h3 className="font-bold text-slate-700 uppercase tracking-wider text-[10px] mb-2">Device Specification</h3>
              <p className="font-semibold text-sm text-slate-900">{repair.brand} {repair.model}</p>
              <p className="text-slate-600 mt-0.5">Type: {repair.deviceType} {repair.color ? `(${repair.color})` : ''}</p>
              <p className="text-slate-600">Serial/IMEI: {repair.serialNumber || 'N/A'}</p>
              <p className="text-slate-600">Assigned Tech: {repair.assignedTechnician || 'General Bench'}</p>
            </div>
          </div>

          {/* Reported Issue & Diagnosis */}
          <div className="mb-6 space-y-3 text-xs">
            <div className="border border-slate-200 rounded-xl p-3.5">
              <span className="font-bold text-slate-700 block mb-1">Reported Issue:</span>
              <p className="text-slate-600">{repair.reportedProblem}</p>
            </div>

            {repair.diagnosisDetails && (
              <div className="border border-slate-200 rounded-xl p-3.5 bg-slate-50/50">
                <span className="font-bold text-slate-700 block mb-1">Technician Diagnostic Findings:</span>
                <p className="text-slate-600">{repair.diagnosisDetails}</p>
              </div>
            )}
          </div>

          {/* Cost Items Table */}
          <div className="mb-6 border border-slate-200 rounded-xl overflow-hidden">
            <table className="w-full text-xs">
              <thead className="bg-slate-100 border-b border-slate-200 text-slate-700 font-semibold text-left">
                <tr>
                  <th className="py-2 px-3">Service & Components</th>
                  <th className="py-2 px-3 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr>
                  <td className="py-2 px-3 text-slate-700">Hardware Replacement Parts & Materials</td>
                  <td className="py-2 px-3 text-right font-mono">{formatCurrency(partsCost)}</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 text-slate-700">Labor, Diagnostic & Bench Testing</td>
                  <td className="py-2 px-3 text-right font-mono">{formatCurrency(laborCost)}</td>
                </tr>
                <tr className="bg-slate-50 font-medium">
                  <td className="py-2 px-3 text-slate-800">Subtotal</td>
                  <td className="py-2 px-3 text-right font-mono">{formatCurrency(subtotal)}</td>
                </tr>
                <tr className="bg-slate-50">
                  <td className="py-1.5 px-3 text-slate-600">Estimated Sales Tax (8%)</td>
                  <td className="py-1.5 px-3 text-right font-mono text-slate-600">{formatCurrency(tax)}</td>
                </tr>
                <tr className="bg-indigo-50/50 font-bold text-sm text-slate-900 border-t border-slate-200">
                  <td className="py-2.5 px-3">Final Total</td>
                  <td className="py-2.5 px-3 text-right font-mono text-indigo-700">{formatCurrency(total)}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Terms & Signatures */}
          <div className="border-t border-slate-200 pt-4 text-[10px] text-slate-500">
            <p className="mb-4">
              <strong>Warranty & Terms:</strong> 90-day limited warranty applies to parts repaired or replaced by RepairTrack Pro.
              Liquid damage repair may not guarantee permanent operation. Unclaimed devices after 60 days are subject to disposal.
            </p>

            <div className="grid grid-cols-2 gap-8 pt-4">
              <div className="border-t border-slate-300 pt-2 text-center">
                <span className="font-medium text-slate-700">Customer Authorization Signature</span>
              </div>
              <div className="border-t border-slate-300 pt-2 text-center">
                <span className="font-medium text-slate-700">Technician / Service Advisor</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
