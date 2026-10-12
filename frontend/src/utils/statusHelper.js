export const STATUS_CONFIG = {
  RECEIVED: {
    label: 'Received',
    color: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    dot: 'bg-indigo-500',
    step: 1,
  },
  DIAGNOSING: {
    label: 'Diagnosing',
    color: 'bg-amber-50 text-amber-700 border-amber-200',
    dot: 'bg-amber-500',
    step: 2,
  },
  IN_REPAIR: {
    label: 'In Repair',
    color: 'bg-blue-50 text-blue-700 border-blue-200',
    dot: 'bg-blue-500',
    step: 3,
  },
  READY_FOR_PICKUP: {
    label: 'Ready for Pickup',
    color: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    dot: 'bg-emerald-500',
    step: 4,
  },
  DELIVERED: {
    label: 'Delivered',
    color: 'bg-purple-50 text-purple-700 border-purple-200',
    dot: 'bg-purple-500',
    step: 5,
  },
  CANCELLED: {
    label: 'Cancelled',
    color: 'bg-rose-50 text-rose-700 border-rose-200',
    dot: 'bg-rose-500',
    step: 0,
  },
};

export const PRIORITY_CONFIG = {
  LOW: { label: 'Low', color: 'bg-slate-100 text-slate-700 border-slate-200' },
  MEDIUM: { label: 'Medium', color: 'bg-sky-50 text-sky-700 border-sky-200' },
  HIGH: { label: 'High', color: 'bg-amber-50 text-amber-700 border-amber-200' },
  URGENT: { label: 'Urgent', color: 'bg-rose-50 text-rose-700 border-rose-300 font-bold' },
};

export const NEXT_STATUS_MAP = {
  RECEIVED: { next: 'DIAGNOSING', label: 'Begin Diagnosis' },
  DIAGNOSING: { next: 'IN_REPAIR', label: 'Start Repair' },
  IN_REPAIR: { next: 'READY_FOR_PICKUP', label: 'Mark Ready for Pickup' },
  READY_FOR_PICKUP: { next: 'DELIVERED', label: 'Mark Delivered & Paid' },
  DELIVERED: null,
  CANCELLED: null,
};

export function formatCurrency(amount) {
  if (amount === null || amount === undefined) return '$0.00';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
}

export function formatDate(dateString) {
  if (!dateString) return '—';
  try {
    const d = new Date(dateString);
    return d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch (e) {
    return dateString;
  }
}
