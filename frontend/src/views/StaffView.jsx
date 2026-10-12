import React, { useState } from 'react';
import {
  ShieldCheck,
  UserPlus,
  HardHat,
  Headphones,
  Shield,
  CheckCircle,
  XCircle,
  Trash2,
  Lock,
  Mail,
  Phone,
  User,
} from 'lucide-react';
import { api } from '../services/api';

export default function StaffView({
  users = [],
  onRefreshUsers,
  currentUser,
}) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState('ROLE_TECHNICIAN');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleCreateUser = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      await api.createUser({
        username: username.trim(),
        password: password.trim(),
        fullName: fullName.trim(),
        email: email.trim(),
        phone: phone.trim() || null,
        role,
        active: true,
      });
      setShowAddModal(false);
      setUsername('');
      setPassword('');
      setFullName('');
      setEmail('');
      setPhone('');
      onRefreshUsers();
    } catch (err) {
      setError(err.message || 'Failed to create user account.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleStatus = async (id) => {
    try {
      await api.toggleUserStatus(id);
      onRefreshUsers();
    } catch (err) {
      alert(err.message || 'Failed to toggle user status');
    }
  };

  const handleDeleteUser = async (id) => {
    if (window.confirm('Are you sure you want to delete this staff member?')) {
      try {
        await api.deleteUser(id);
        onRefreshUsers();
      } catch (err) {
        alert(err.message || 'Failed to delete user');
      }
    }
  };

  const roleBadges = {
    ROLE_ADMIN: { label: 'Administrator', icon: Shield, color: 'bg-purple-100 text-purple-700 border-purple-200' },
    ROLE_TECHNICIAN: { label: 'Repair Technician', icon: HardHat, color: 'bg-indigo-100 text-indigo-700 border-indigo-200' },
    ROLE_STAFF: { label: 'Front Desk / Reception', icon: Headphones, color: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-slate-900">Repair Center Personnel</h2>
          <p className="text-xs text-slate-500">Manage technicians, service advisors, and role-based permissions</p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center justify-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs px-4 py-2 rounded-xl shadow-md shadow-indigo-600/20 transition"
        >
          <UserPlus className="w-4 h-4" />
          <span>Add Staff Member</span>
        </button>
      </div>

      {/* Role Permissions Matrix */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm text-xs">
          <div className="flex items-center gap-2 font-bold text-purple-700 mb-2">
            <Shield className="w-4 h-4" />
            <span>Administrator Role</span>
          </div>
          <ul className="space-y-1 text-slate-600 list-disc list-inside">
            <li>Full read/write/delete access</li>
            <li>Manage staff members & permissions</li>
            <li>View financial revenue analytics</li>
            <li>Database and center configuration</li>
          </ul>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm text-xs">
          <div className="flex items-center gap-2 font-bold text-indigo-700 mb-2">
            <HardHat className="w-4 h-4" />
            <span>Technician Role</span>
          </div>
          <ul className="space-y-1 text-slate-600 list-disc list-inside">
            <li>Update diagnostics & findings</li>
            <li>Advance repair workflow status</li>
            <li>Log parts replaced & labor cost</li>
            <li>Add technical service notes</li>
          </ul>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm text-xs">
          <div className="flex items-center gap-2 font-bold text-emerald-700 mb-2">
            <Headphones className="w-4 h-4" />
            <span>Front Desk / Staff</span>
          </div>
          <ul className="space-y-1 text-slate-600 list-disc list-inside">
            <li>Customer intake & check-in</li>
            <li>Register devices & serial numbers</li>
            <li>Print intake tickets & receipts</li>
            <li>Mark completed devices delivered</li>
          </ul>
        </div>
      </div>

      {/* Staff Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden text-xs">
        <table className="w-full text-left">
          <thead className="bg-slate-50 text-slate-500 font-semibold uppercase tracking-wider border-b border-slate-200">
            <tr>
              <th className="py-3 px-4">Staff Member</th>
              <th className="py-3 px-4">Username</th>
              <th className="py-3 px-4">Assigned Role</th>
              <th className="py-3 px-4">Contact</th>
              <th className="py-3 px-4">Account Status</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {users.map((u) => {
              const rBadge = roleBadges[u.role] || roleBadges.ROLE_STAFF;
              const RoleIcon = rBadge.icon;

              return (
                <tr key={u.id} className="hover:bg-slate-50/70 transition">
                  <td className="py-3 px-4">
                    <div className="font-bold text-slate-900">{u.fullName}</div>
                    <div className="text-[11px] text-slate-400">ID #{u.id}</div>
                  </td>
                  <td className="py-3 px-4 font-mono font-semibold text-slate-700">
                    {u.username}
                  </td>
                  <td className="py-3 px-4">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-semibold border ${rBadge.color}`}>
                      <RoleIcon className="w-3.5 h-3.5" />
                      {rBadge.label}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="text-slate-800">{u.email}</div>
                    <div className="text-[11px] text-slate-400 font-mono">{u.phone || '—'}</div>
                  </td>
                  <td className="py-3 px-4">
                    <button
                      onClick={() => handleToggleStatus(u.id)}
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full font-semibold text-[11px] transition ${
                        u.active
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
                          : 'bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100'
                      }`}
                    >
                      {u.active ? <CheckCircle className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                      <span>{u.active ? 'Active' : 'Disabled'}</span>
                    </button>
                  </td>
                  <td className="py-3 px-4 text-right">
                    {currentUser?.username !== u.username && (
                      <button
                        onClick={() => handleDeleteUser(u.id)}
                        title="Delete User"
                        className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg transition"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Add Staff Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-200 text-xs">
            <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
              <h3 className="font-bold text-slate-900 text-sm">Add New Staff Account</h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600">
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateUser} className="p-6 space-y-4">
              {error && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700">
                  {error}
                </div>
              )}

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Jordan Hayes"
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Username</label>
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="jhayes"
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Password</label>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="jordan.h@repairtrack.com"
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Role Permission Level</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl"
                >
                  <option value="ROLE_TECHNICIAN">Repair Technician</option>
                  <option value="ROLE_STAFF">Front Desk / Staff</option>
                  <option value="ROLE_ADMIN">Administrator</option>
                </select>
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 bg-indigo-600 text-white rounded-xl font-semibold"
                >
                  {submitting ? 'Creating...' : 'Create Account'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
