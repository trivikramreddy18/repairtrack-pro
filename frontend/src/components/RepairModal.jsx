import React, { useState, useEffect } from 'react';
import { X, Wrench, AlertCircle, Save, Plus } from 'lucide-react';
import { api } from '../services/api';

export default function RepairModal({
  isOpen,
  onClose,
  repair = null,
  onSave,
  customers = [],
  currentUser,
}) {
  const isEdit = Boolean(repair);

  const [selectedCustomerId, setSelectedCustomerId] = useState('');
  const [customerDevices, setCustomerDevices] = useState([]);
  const [deviceId, setDeviceId] = useState('');
  const [reportedProblem, setReportedProblem] = useState('');
  const [diagnosisDetails, setDiagnosisDetails] = useState('');
  const [technicianNotes, setTechnicianNotes] = useState('');
  const [priority, setPriority] = useState('MEDIUM');
  const [status, setStatus] = useState('RECEIVED');
  const [estimatedCost, setEstimatedCost] = useState('0');
  const [partsCost, setPartsCost] = useState('0');
  const [laborCost, setLaborCost] = useState('0');
  const [finalCost, setFinalCost] = useState('0');
  const [assignedTechnician, setAssignedTechnician] = useState('');
  const [estimatedCompletionDate, setEstimatedCompletionDate] = useState('');

  const [loadingDevices, setLoadingDevices] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (repair) {
      setSelectedCustomerId(repair.customerId || '');
      setDeviceId(repair.deviceId || '');
      setReportedProblem(repair.reportedProblem || '');
      setDiagnosisDetails(repair.diagnosisDetails || '');
      setTechnicianNotes(repair.technicianNotes || '');
      setPriority(repair.priority || 'MEDIUM');
      setStatus(repair.status || 'RECEIVED');
      setEstimatedCost(repair.estimatedCost?.toString() || '0');
      setPartsCost(repair.partsCost?.toString() || '0');
      setLaborCost(repair.laborCost?.toString() || '0');
      setFinalCost(repair.finalCost?.toString() || '0');
      setAssignedTechnician(repair.assignedTechnician || '');
      setEstimatedCompletionDate(repair.estimatedCompletionDate ? repair.estimatedCompletionDate.slice(0, 16) : '');
    } else {
      setSelectedCustomerId('');
      setDeviceId('');
      setReportedProblem('');
      setDiagnosisDetails('');
      setTechnicianNotes('');
      setPriority('MEDIUM');
      setStatus('RECEIVED');
      setEstimatedCost('0');
      setPartsCost('0');
      setLaborCost('0');
      setFinalCost('0');
      setAssignedTechnician(currentUser?.fullName || 'Alex Rivera');
      setEstimatedCompletionDate('');
    }
    setError('');
  }, [repair, isOpen, currentUser]);

  // When customer changes in create mode, load their devices
  useEffect(() => {
    if (selectedCustomerId && !isEdit) {
      setLoadingDevices(true);
      api.getDevices(selectedCustomerId)
        .then((devices) => {
          setCustomerDevices(devices);
          if (devices.length > 0) {
            setDeviceId(devices[0].id.toString());
          } else {
            setDeviceId('');
          }
        })
        .catch((err) => console.error(err))
        .finally(() => setLoadingDevices(false));
    } else {
      setCustomerDevices([]);
    }
  }, [selectedCustomerId, isEdit]);

  // Recalculate final cost when parts or labor cost changes
  const handlePartsChange = (val) => {
    setPartsCost(val);
    const p = parseFloat(val) || 0;
    const l = parseFloat(laborCost) || 0;
    setFinalCost((p + l).toFixed(2));
  };

  const handleLaborChange = (val) => {
    setLaborCost(val);
    const p = parseFloat(partsCost) || 0;
    const l = parseFloat(val) || 0;
    setFinalCost((p + l).toFixed(2));
  };

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!isEdit && !deviceId) {
      setError('Please select a customer device to create a repair job ticket.');
      return;
    }

    if (!reportedProblem.trim()) {
      setError('Please enter the reported problem or fault description.');
      return;
    }

    setSubmitting(true);
    try {
      if (isEdit) {
        const payload = {
          reportedProblem,
          diagnosisDetails,
          technicianNotes,
          status,
          priority,
          estimatedCost: parseFloat(estimatedCost) || 0,
          partsCost: parseFloat(partsCost) || 0,
          laborCost: parseFloat(laborCost) || 0,
          finalCost: parseFloat(finalCost) || 0,
          assignedTechnician,
          estimatedCompletionDate: estimatedCompletionDate ? estimatedCompletionDate + ':00' : null,
        };
        await onSave(repair.id, payload);
      } else {
        const payload = {
          deviceId: parseInt(deviceId, 10),
          reportedProblem,
          priority,
          estimatedCost: parseFloat(estimatedCost) || 0,
          assignedTechnician,
          estimatedCompletionDate: estimatedCompletionDate ? estimatedCompletionDate + ':00' : null,
        };
        await onSave(null, payload);
      }
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to save repair record.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden border border-slate-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <Wrench className="w-5 h-5 text-indigo-600" />
            <h2 className="text-base font-bold text-slate-900">
              {isEdit ? `Edit Job Ticket (${repair.ticketNumber})` : 'New Repair Job Ticket'}
            </h2>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-1 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5 text-xs">
          {error && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {!isEdit && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Step 1: Customer */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  1. Select Customer <span className="text-rose-500">*</span>
                </label>
                <select
                  value={selectedCustomerId}
                  onChange={(e) => setSelectedCustomerId(e.target.value)}
                  required
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white text-xs"
                >
                  <option value="">-- Choose Customer --</option>
                  {customers.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.phone})
                    </option>
                  ))}
                </select>
              </div>

              {/* Step 2: Device */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  2. Select Customer Device <span className="text-rose-500">*</span>
                </label>
                <select
                  value={deviceId}
                  onChange={(e) => setDeviceId(e.target.value)}
                  disabled={!selectedCustomerId || loadingDevices || customerDevices.length === 0}
                  required
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white text-xs disabled:opacity-60"
                >
                  <option value="">
                    {loadingDevices
                      ? 'Loading devices...'
                      : customerDevices.length === 0
                      ? 'No devices registered for customer'
                      : '-- Choose Device --'}
                  </option>
                  {customerDevices.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.brand} {d.model} ({d.deviceType} {d.serialNumber ? `• ${d.serialNumber}` : ''})
                    </option>
                  ))}
                </select>
                {selectedCustomerId && customerDevices.length === 0 && !loadingDevices && (
                  <p className="text-[11px] text-amber-600 mt-1">
                    Customer has no registered devices yet. Please add a device in Devices tab first.
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Reported Problem */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Reported Problem / Customer Complaint <span className="text-rose-500">*</span>
            </label>
            <textarea
              rows="3"
              value={reportedProblem}
              onChange={(e) => setReportedProblem(e.target.value)}
              placeholder="e.g. Broken touch screen, device restarts after 5 minutes, water splash..."
              required
              className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white text-xs"
            ></textarea>
          </div>

          {/* Priority & Assigned Tech */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Priority Level</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white text-xs"
              >
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
                <option value="URGENT">Urgent</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Assigned Technician</label>
              <input
                type="text"
                value={assignedTechnician}
                onChange={(e) => setAssignedTechnician(e.target.value)}
                placeholder="e.g. Alex Rivera"
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white text-xs"
              />
            </div>
          </div>

          {/* If Editing: Diagnosis, Status, Notes */}
          {isEdit && (
            <>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Current Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white text-xs"
                >
                  <option value="RECEIVED">Received</option>
                  <option value="DIAGNOSING">Diagnosing</option>
                  <option value="IN_REPAIR">In Repair</option>
                  <option value="READY_FOR_PICKUP">Ready for Pickup</option>
                  <option value="DELIVERED">Delivered</option>
                  <option value="CANCELLED">Cancelled</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Diagnostic Findings</label>
                <textarea
                  rows="2"
                  value={diagnosisDetails}
                  onChange={(e) => setDiagnosisDetails(e.target.value)}
                  placeholder="e.g. Cracked digitizer cable, battery swelled to 8mm, shorts detected on 5V rail"
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white text-xs"
                ></textarea>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Technician Notes</label>
                <textarea
                  rows="2"
                  value={technicianNotes}
                  onChange={(e) => setTechnicianNotes(e.target.value)}
                  placeholder="e.g. Replaced display and pre-flashed firmware. Burn-in tested for 1 hour."
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white text-xs"
                ></textarea>
              </div>
            </>
          )}

          {/* Cost Estimates & Pricing */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
            <span className="font-semibold text-slate-800 block mb-3">Cost Breakdown ($)</span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>
                <label className="block text-slate-600 mb-1">Estimated Cost</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={estimatedCost}
                  onChange={(e) => setEstimatedCost(e.target.value)}
                  className="w-full p-2 bg-white border border-slate-300 rounded-lg text-xs font-mono"
                />
              </div>

              {isEdit && (
                <>
                  <div>
                    <label className="block text-slate-600 mb-1">Parts Cost</label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={partsCost}
                      onChange={(e) => handlePartsChange(e.target.value)}
                      className="w-full p-2 bg-white border border-slate-300 rounded-lg text-xs font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 mb-1">Labor Cost</label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={laborCost}
                      onChange={(e) => handleLaborChange(e.target.value)}
                      className="w-full p-2 bg-white border border-slate-300 rounded-lg text-xs font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-indigo-700 font-semibold mb-1">Final Cost</label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={finalCost}
                      onChange={(e) => setFinalCost(e.target.value)}
                      className="w-full p-2 bg-indigo-50 border border-indigo-200 rounded-lg text-xs font-mono font-bold text-indigo-800"
                    />
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Buttons */}
          <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-md shadow-indigo-600/20 disabled:opacity-60"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{submitting ? 'Saving...' : isEdit ? 'Update Ticket' : 'Create Job Ticket'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
