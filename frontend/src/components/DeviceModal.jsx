import React, { useState, useEffect } from 'react';
import { X, Smartphone, AlertCircle, Save } from 'lucide-react';

export default function DeviceModal({
  isOpen,
  onClose,
  device = null,
  customers = [],
  initialCustomerId = null,
  onSave,
}) {
  const isEdit = Boolean(device);

  const [customerId, setCustomerId] = useState('');
  const [deviceType, setDeviceType] = useState('Smartphone');
  const [brand, setBrand] = useState('Apple');
  const [model, setModel] = useState('');
  const [serialNumber, setSerialNumber] = useState('');
  const [color, setColor] = useState('');
  const [conditionNotes, setConditionNotes] = useState('');
  const [accessories, setAccessories] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const deviceTypes = [
    'Smartphone',
    'Laptop',
    'Tablet',
    'Desktop',
    'Smartwatch',
    'Gaming Console',
    'Audio/TV',
    'Other Electronics',
  ];

  const commonBrands = [
    'Apple',
    'Samsung',
    'Dell',
    'Sony',
    'HP',
    'Lenovo',
    'ASUS',
    'Google',
    'Nintendo',
    'Microsoft',
    'Other',
  ];

  useEffect(() => {
    if (device) {
      setCustomerId(device.customerId?.toString() || '');
      setDeviceType(device.deviceType || 'Smartphone');
      setBrand(device.brand || 'Apple');
      setModel(device.model || '');
      setSerialNumber(device.serialNumber || '');
      setColor(device.color || '');
      setConditionNotes(device.conditionNotes || '');
      setAccessories(device.accessories || '');
    } else {
      setCustomerId(initialCustomerId ? initialCustomerId.toString() : '');
      setDeviceType('Smartphone');
      setBrand('Apple');
      setModel('');
      setSerialNumber('');
      setColor('');
      setConditionNotes('');
      setAccessories('');
    }
    setError('');
  }, [device, initialCustomerId, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!customerId) {
      setError('Please select the customer who owns this device.');
      return;
    }
    if (!model.trim()) {
      setError('Device model name is required.');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        customerId: parseInt(customerId, 10),
        deviceType,
        brand,
        model: model.trim(),
        serialNumber: serialNumber.trim() || null,
        color: color.trim() || null,
        conditionNotes: conditionNotes.trim() || null,
        accessories: accessories.trim() || null,
      };
      await onSave(device?.id, payload);
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to save device record.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full flex flex-col overflow-hidden border border-slate-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <Smartphone className="w-5 h-5 text-indigo-600" />
            <h2 className="text-base font-bold text-slate-900">
              {isEdit ? 'Edit Device Information' : 'Register New Customer Device'}
            </h2>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-1 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          {error && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Owner Customer */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Device Owner (Customer) <span className="text-rose-500">*</span>
            </label>
            <select
              value={customerId}
              onChange={(e) => setCustomerId(e.target.value)}
              required
              className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white text-xs"
            >
              <option value="">-- Select Customer --</option>
              {customers.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.phone})
                </option>
              ))}
            </select>
          </div>

          {/* Device Type & Brand */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Device Type</label>
              <select
                value={deviceType}
                onChange={(e) => setDeviceType(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white text-xs"
              >
                {deviceTypes.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Brand</label>
              <select
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white text-xs"
              >
                {commonBrands.map((b) => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Model & Color */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Model Name / Number <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={model}
                onChange={(e) => setModel(e.target.value)}
                placeholder="e.g. iPhone 14 Pro Max / XPS 15"
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white text-xs"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Color / Finish</label>
              <input
                type="text"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                placeholder="e.g. Space Gray, Silver, Midnight"
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white text-xs"
              />
            </div>
          </div>

          {/* Serial Number */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Serial Number or IMEI</label>
            <input
              type="text"
              value={serialNumber}
              onChange={(e) => setSerialNumber(e.target.value)}
              placeholder="e.g. SN-9940210294 or 358921004928172"
              className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white text-xs font-mono"
            />
            <span className="text-[10px] text-slate-400">Used for warranty tracking & duplicate verification</span>
          </div>

          {/* Condition Notes */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Physical Condition on Intake</label>
            <textarea
              rows="2"
              value={conditionNotes}
              onChange={(e) => setConditionNotes(e.target.value)}
              placeholder="e.g. Cracked front glass, scuffed corners, loose volume rocker..."
              className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white text-xs"
            ></textarea>
          </div>

          {/* Accessories Included */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Accessories Retained</label>
            <input
              type="text"
              value={accessories}
              onChange={(e) => setAccessories(e.target.value)}
              placeholder="e.g. OEM Charger, USB Cable, Silicone Protective Case"
              className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white text-xs"
            />
          </div>

          {/* Footer */}
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
              <span>{submitting ? 'Saving...' : isEdit ? 'Update Device' : 'Register Device'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
