import React, { useState, useEffect, useCallback } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Toast from './components/Toast';
import PrintTicketModal from './components/PrintTicketModal';
import RepairModal from './components/RepairModal';
import CustomerModal from './components/CustomerModal';
import DeviceModal from './components/DeviceModal';
import RepairDetailModal from './components/RepairDetailModal';
import CustomerDetailsModal from './components/CustomerDetailsModal';
import DeviceHistoryModal from './components/DeviceHistoryModal';

import DashboardView from './views/DashboardView';
import RepairsView from './views/RepairsView';
import CustomersView from './views/CustomersView';
import DevicesView from './views/DevicesView';
import TrackJobView from './views/TrackJobView';
import StaffView from './views/StaffView';

import { api } from './services/api';

export default function App() {
  const [currentView, setCurrentView] = useState('dashboard');
  const [stats, setStats] = useState(null);
  const [repairs, setRepairs] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [devices, setDevices] = useState([]);
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);

  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [toast, setToast] = useState(null);

  // Modals state
  const [repairModal, setRepairModal] = useState({ isOpen: false, repair: null });
  const [customerModal, setCustomerModal] = useState({ isOpen: false, customer: null });
  const [deviceModal, setDeviceModal] = useState({ isOpen: false, device: null, initialCustomerId: null });
  const [detailModalRepair, setDetailModalRepair] = useState(null);
  const [customerDetailModalData, setCustomerDetailModalData] = useState(null);
  const [deviceHistoryModalData, setDeviceHistoryModalData] = useState(null);
  const [printModal, setPrintModal] = useState({ isOpen: false, repair: null, type: 'ticket' });

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 4500);
  };

  // Fetch all core system data
  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [statsData, repairsData, customersData, devicesData, usersData] = await Promise.all([
        api.getDashboardStats().catch(() => null),
        api.getRepairs().catch(() => []),
        api.getCustomers().catch(() => []),
        api.getDevices().catch(() => []),
        api.getUsers().catch(() => []),
      ]);

      if (statsData) setStats(statsData);
      setRepairs(repairsData);
      setCustomers(customersData);
      setDevices(devicesData);
      setUsers(usersData);

      // Default active user to admin if not set
      if (!currentUser && usersData.length > 0) {
        const defaultAdmin = usersData.find((u) => u.role === 'ROLE_ADMIN') || usersData[0];
        setCurrentUser(defaultAdmin);
      }
    } catch (err) {
      console.error('Failed to load initial data:', err);
      showToast('Could not load some application data from backend.', 'error');
    } finally {
      setLoading(false);
    }
  }, [currentUser]);

  useEffect(() => {
    loadData();
  }, []);

  const handleSwitchUser = (username) => {
    const selected = users.find((u) => u.username === username);
    if (selected) {
      setCurrentUser(selected);
      showToast(`Switched active profile to ${selected.fullName} (${selected.role.replace('ROLE_', '')})`, 'info');
    }
  };

  // --- REPAIR ACTIONS ---
  const handleSaveRepair = async (id, payload) => {
    if (id) {
      await api.updateRepair(id, payload);
      showToast('Repair ticket successfully updated.');
    } else {
      await api.createRepair(payload);
      showToast('New repair ticket generated successfully.');
    }
    await loadData();
    // Update active modal if open
    if (detailModalRepair && detailModalRepair.id === id) {
      const refreshed = await api.getRepair(id);
      setDetailModalRepair(refreshed);
    }
  };

  const handleAdvanceStatus = async (repairId, nextStatus, notes = '') => {
    try {
      const updated = await api.updateRepairStatus(repairId, {
        status: nextStatus,
        changedBy: currentUser?.fullName || 'Technician',
        notes: notes || `Advanced status to ${nextStatus}`,
      });
      showToast(`Status updated to ${updated.statusDisplayName || nextStatus}`);
      await loadData();
      if (detailModalRepair && detailModalRepair.id === repairId) {
        setDetailModalRepair(updated);
      }
    } catch (err) {
      showToast(err.message || 'Failed to advance status.', 'error');
    }
  };

  const handleDeleteRepair = async (id) => {
    if (window.confirm('Are you sure you want to delete this repair record?')) {
      try {
        await api.deleteRepair(id);
        showToast('Repair record deleted.');
        if (detailModalRepair?.id === id) setDetailModalRepair(null);
        await loadData();
      } catch (err) {
        showToast(err.message || 'Failed to delete repair record.', 'error');
      }
    }
  };

  // --- CUSTOMER ACTIONS ---
  const handleSaveCustomer = async (id, payload) => {
    if (id) {
      await api.updateCustomer(id, payload);
      showToast('Customer information updated.');
    } else {
      await api.createCustomer(payload);
      showToast('Customer registered successfully.');
    }
    await loadData();
  };

  const handleDeleteCustomer = async (id) => {
    if (window.confirm('Delete this customer? All their associated devices and repair jobs will also be removed.')) {
      try {
        await api.deleteCustomer(id);
        showToast('Customer record deleted.');
        await loadData();
      } catch (err) {
        showToast(err.message || 'Failed to delete customer.', 'error');
      }
    }
  };

  // --- DEVICE ACTIONS ---
  const handleSaveDevice = async (id, payload) => {
    if (id) {
      await api.updateDevice(id, payload);
      showToast('Device details updated.');
    } else {
      await api.createDevice(payload);
      showToast('Device registered to customer successfully.');
    }
    await loadData();
  };

  const handleDeleteDevice = async (id) => {
    if (window.confirm('Delete this device? Linked repair histories will also be removed.')) {
      try {
        await api.deleteDevice(id);
        showToast('Device record removed.');
        await loadData();
      } catch (err) {
        showToast(err.message || 'Failed to delete device.', 'error');
      }
    }
  };

  // Print trigger
  const handlePrint = (repair, type = 'ticket') => {
    setPrintModal({ isOpen: true, repair, type });
  };

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans text-slate-900">
      {/* Left Sidebar */}
      <Sidebar
        currentView={currentView}
        setCurrentView={setCurrentView}
        stats={stats}
        currentUser={currentUser}
        onNewRepair={() => setRepairModal({ isOpen: true, repair: null })}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <Header
          currentView={currentView}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onRefresh={loadData}
          loading={loading}
          currentUser={currentUser}
          onSwitchUser={handleSwitchUser}
          allUsers={users}
        />

        <main className="flex-1 p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {currentView === 'dashboard' && (
            <DashboardView
              stats={stats}
              onViewRepair={(r) => setDetailModalRepair(r)}
              onNewRepair={() => setRepairModal({ isOpen: true, repair: null })}
              onNewCustomer={() => setCustomerModal({ isOpen: true, customer: null })}
              onNewDevice={() => setDeviceModal({ isOpen: true, device: null, initialCustomerId: null })}
              onNavigateTo={(view) => setCurrentView(view)}
              onAdvanceStatus={handleAdvanceStatus}
            />
          )}

          {currentView === 'repairs' && (
            <RepairsView
              repairs={repairs}
              onNewRepair={() => setRepairModal({ isOpen: true, repair: null })}
              onViewRepair={(r) => setDetailModalRepair(r)}
              onEditRepair={(r) => setRepairModal({ isOpen: true, repair: r })}
              onDeleteRepair={handleDeleteRepair}
              onAdvanceStatus={handleAdvanceStatus}
              onPrintTicket={handlePrint}
              currentUser={currentUser}
            />
          )}

          {currentView === 'customers' && (
            <CustomersView
              customers={customers}
              onNewCustomer={() => setCustomerModal({ isOpen: true, customer: null })}
              onEditCustomer={(c) => setCustomerModal({ isOpen: true, customer: c })}
              onDeleteCustomer={handleDeleteCustomer}
              onViewCustomerDetails={(c) => setCustomerDetailModalData(c)}
              onRegisterDeviceForCustomer={(cId) => setDeviceModal({ isOpen: true, device: null, initialCustomerId: cId })}
              currentUser={currentUser}
            />
          )}

          {currentView === 'devices' && (
            <DevicesView
              devices={devices}
              onNewDevice={() => setDeviceModal({ isOpen: true, device: null, initialCustomerId: null })}
              onEditDevice={(d) => setDeviceModal({ isOpen: true, device: d, initialCustomerId: null })}
              onDeleteDevice={handleDeleteDevice}
              onViewDeviceHistory={(d) => setDeviceHistoryModalData(d)}
              onNewRepairForDevice={(d) => {
                setRepairModal({ isOpen: true, repair: null });
              }}
              currentUser={currentUser}
            />
          )}

          {currentView === 'track' && (
            <TrackJobView
              onPrintTicket={handlePrint}
              sampleTickets={repairs.map((r) => r.ticketNumber)}
            />
          )}

          {currentView === 'staff' && (
            <StaffView
              users={users}
              onRefreshUsers={loadData}
              currentUser={currentUser}
            />
          )}
        </main>
      </div>

      {/* Floating Toast Notification */}
      <Toast toast={toast} onClose={() => setToast(null)} />

      {/* MODALS */}
      {/* Repair Create / Edit Modal */}
      <RepairModal
        isOpen={repairModal.isOpen}
        repair={repairModal.repair}
        customers={customers}
        currentUser={currentUser}
        onClose={() => setRepairModal({ isOpen: false, repair: null })}
        onSave={handleSaveRepair}
      />

      {/* Customer Create / Edit Modal */}
      <CustomerModal
        isOpen={customerModal.isOpen}
        customer={customerModal.customer}
        onClose={() => setCustomerModal({ isOpen: false, customer: null })}
        onSave={handleSaveCustomer}
      />

      {/* Device Create / Edit Modal */}
      <DeviceModal
        isOpen={deviceModal.isOpen}
        device={deviceModal.device}
        customers={customers}
        initialCustomerId={deviceModal.initialCustomerId}
        onClose={() => setDeviceModal({ isOpen: false, device: null, initialCustomerId: null })}
        onSave={handleSaveDevice}
      />

      {/* Repair Detail Modal */}
      <RepairDetailModal
        repair={detailModalRepair}
        onClose={() => setDetailModalRepair(null)}
        onEdit={(r) => {
          setDetailModalRepair(null);
          setRepairModal({ isOpen: true, repair: r });
        }}
        onAdvanceStatus={handleAdvanceStatus}
        onPrintTicket={handlePrint}
        currentUser={currentUser}
      />

      {/* Customer Details Drawer / Modal */}
      <CustomerDetailsModal
        customer={customerDetailModalData}
        onClose={() => setCustomerDetailModalData(null)}
        onNewDevice={(customerId) => {
          setCustomerDetailModalData(null);
          setDeviceModal({ isOpen: true, device: null, initialCustomerId: customerId });
        }}
        onNewRepair={(deviceId, customerId) => {
          setCustomerDetailModalData(null);
          setRepairModal({ isOpen: true, repair: null });
        }}
        onViewRepair={(r) => {
          setCustomerDetailModalData(null);
          setDetailModalRepair(r);
        }}
      />

      {/* Device History Modal */}
      <DeviceHistoryModal
        device={deviceHistoryModalData}
        onClose={() => setDeviceHistoryModalData(null)}
        onViewRepair={(r) => {
          setDeviceHistoryModalData(null);
          setDetailModalRepair(r);
        }}
        onNewRepair={(deviceId, customerId) => {
          setDeviceHistoryModalData(null);
          setRepairModal({ isOpen: true, repair: null });
        }}
      />

      {/* Printable Ticket / Invoice Modal */}
      {printModal.isOpen && (
        <PrintTicketModal
          repair={printModal.repair}
          type={printModal.type}
          onClose={() => setPrintModal({ isOpen: false, repair: null, type: 'ticket' })}
        />
      )}
    </div>
  );
}
