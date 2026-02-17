
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCareOps } from '../context/CareOpsContext';
import staffService from '../services/staff.service';
import { ArrowLeft, Users, Shield, CheckCircle, XCircle, Mail, Plus, Edit2, Trash2, X, Crown, Loader } from 'lucide-react';

const Staff = () => {
    const navigate = useNavigate();
    const { business } = useCareOps();
    const [staff, setStaff] = useState([]);
    const [loading, setLoading] = useState(true);

    const [showModal, setShowModal] = useState(false);
    const [editingStaff, setEditingStaff] = useState(null);
    const [staffForm, setStaffForm] = useState({
        name: '',
        email: '',
        status: 'Invited',
        permissions: {
            inbox: false,
            bookings: false,
            forms: false,
            inventory: false
        }
    });

    useEffect(() => {
        fetchStaff();
    }, []);

    const fetchStaff = async () => {
        setLoading(true);
        try {
            // Ideally we'd fetch this from service
            // For now, mock it locally if service isn't ready, but let's assume one exists or we mock it here
            const data = await staffService.getStaff();
            setStaff(data);
        } catch (error) {
            console.error("Failed to fetch staff", error);
        } finally {
            setLoading(false);
        }
    };

    const handleOpenModal = (staffMember = null) => {
        if (staffMember) {
            setEditingStaff(staffMember);
            setStaffForm({
                name: staffMember.name,
                email: staffMember.email,
                status: staffMember.status,
                permissions: { ...staffMember.permissions }
            });
        } else {
            setEditingStaff(null);
            setStaffForm({
                name: '',
                email: '',
                status: 'Invited',
                permissions: {
                    inbox: false,
                    bookings: false,
                    forms: false,
                    inventory: false
                }
            });
        }
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setEditingStaff(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingStaff) {
                const updated = await staffService.updateStaff(editingStaff.id, staffForm);
                setStaff(prev => prev.map(s => s.id === editingStaff.id ? updated : s));
            } else {
                const created = await staffService.addStaff(staffForm);
                setStaff(prev => [...prev, created]);
            }
            handleCloseModal();
        } catch (error) {
            console.error("Failed to save staff member", error);
        }
    };

    const handlePermissionToggle = (permission) => {
        setStaffForm(prev => ({
            ...prev,
            permissions: {
                ...prev.permissions,
                [permission]: !prev.permissions[permission]
            }
        }));
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to remove this staff member?')) {
            try {
                await staffService.deleteStaff(id);
                setStaff(prev => prev.filter(s => s.id !== id));
            } catch (error) {
                console.error("Failed to delete staff member", error);
            }
        }
    };

    const getPermissionCount = (permissions) => {
        return Object.values(permissions).filter(Boolean).length;
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50 to-purple-50 animate-fade-in">
            {/* Header */}
            <header className="bg-white shadow-lg border-b border-slate-100 sticky top-0 z-50 backdrop-blur-sm bg-white/95">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-4">
                            <button
                                onClick={() => navigate('/dashboard')}
                                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                            >
                                <ArrowLeft className="w-5 h-5 text-slate-600" />
                            </button>
                            <div className="bg-gradient-to-br from-indigo-600 to-purple-600 p-3 rounded-2xl shadow-lg">
                                <Users className="text-white w-6 h-6" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                                    Staff & Permissions
                                </h1>
                                <p className="text-xs text-slate-500">Manage team access and permissions</p>
                            </div>
                        </div>
                        <button
                            onClick={() => handleOpenModal()}
                            className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold rounded-xl hover:shadow-lg transition-all flex items-center space-x-2"
                        >
                            <Plus className="w-4 h-4" />
                            <span>Add Staff</span>
                        </button>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Owner Card */}
                {business && (
                    <div className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-2xl shadow-lg border-2 border-amber-200 p-6 mb-6">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                                <div className="h-16 w-16 rounded-full bg-gradient-to-br from-amber-500 to-yellow-600 flex items-center justify-center text-white text-2xl font-bold shadow-md">
                                    {business.name?.charAt(0) || 'O'}
                                </div>
                                <div>
                                    <div className="flex items-center space-x-2">
                                        <h3 className="text-xl font-bold text-slate-900">{business.name || 'Business Owner'}</h3>
                                        <Crown className="w-5 h-5 text-amber-600" />
                                    </div>
                                    <span className="inline-block mt-1 px-3 py-1 bg-amber-200 text-amber-800 text-xs font-bold rounded-full uppercase tracking-wider">
                                        Owner
                                    </span>
                                    <div className="mt-2">
                                        <div className="flex items-center space-x-2 text-sm text-slate-600">
                                            <Mail className="w-4 h-4" />
                                            <span>{business.email || 'owner@business.com'}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="hidden md:block flex-1 border-l border-amber-200 pl-8 ml-8">
                                <h4 className="text-sm font-bold text-slate-700 uppercase tracking-wider mb-3 flex items-center space-x-2">
                                    <Shield className="w-4 h-4" />
                                    <span>Full Access</span>
                                </h4>
                                <div className="grid grid-cols-2 gap-3">
                                    <PermissionItem label="Inbox Access" allowed={true} />
                                    <PermissionItem label="Bookings Management" allowed={true} />
                                    <PermissionItem label="Forms Tracking" allowed={true} />
                                    <PermissionItem label="Inventory Visibility" allowed={true} />
                                    <PermissionItem label="System Settings" allowed={true} />
                                    <PermissionItem label="Integrations" allowed={true} />
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Staff List */}
                {loading ? (
                    <div className="p-12 text-center flex flex-col items-center justify-center">
                        <Loader className="w-8 h-8 text-indigo-600 animate-spin mb-4" />
                        <p className="text-slate-500">Loading staff members...</p>
                    </div>
                ) : staff.length === 0 ? (
                    <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-12 text-center">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-slate-100 rounded-full mb-4">
                            <Users className="w-8 h-8 text-slate-400" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 mb-2">No Staff Members Yet</h3>
                        <p className="text-slate-600 mb-6">Add staff members to help manage daily operations</p>
                        <button
                            onClick={() => handleOpenModal()}
                            className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold rounded-xl hover:shadow-lg transition-all"
                        >
                            Add Your First Staff Member
                        </button>
                    </div>
                ) : (
                    <div className="grid gap-6">
                        {staff.map((member) => (
                            <div key={member.id} className="bg-white rounded-2xl shadow-lg border border-slate-100 p-6 hover:shadow-xl transition-shadow duration-300">
                                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                                    <div className="flex items-center space-x-4">
                                        <div className="h-16 w-16 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold shadow-md">
                                            {member.name.charAt(0)}
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-bold text-slate-900">{member.name}</h3>
                                            <span className={`inline-block mt-1 px-3 py-1 text-xs font-bold rounded-full uppercase tracking-wider ${member.status === 'Active'
                                                ? 'bg-green-100 text-green-700'
                                                : 'bg-yellow-100 text-yellow-700'
                                                }`}>
                                                {member.status}
                                            </span>
                                            <div className="mt-2">
                                                <div className="flex items-center space-x-2 text-sm text-slate-600">
                                                    <Mail className="w-4 h-4" />
                                                    <span>{member.email}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex-1 w-full md:w-auto md:border-l md:border-slate-100 md:pl-8">
                                        <h4 className="text-sm font-bold text-slate-700 uppercase tracking-wider mb-3 flex items-center space-x-2">
                                            <Shield className="w-4 h-4" />
                                            <span>Permissions ({getPermissionCount(member.permissions)}/4)</span>
                                        </h4>
                                        <div className="grid grid-cols-2 gap-3">
                                            <PermissionItem label="Inbox Access" allowed={member.permissions.inbox} />
                                            <PermissionItem label="Bookings Management" allowed={member.permissions.bookings} />
                                            <PermissionItem label="Forms Tracking" allowed={member.permissions.forms} />
                                            <PermissionItem label="Inventory Visibility" allowed={member.permissions.inventory} />
                                        </div>
                                    </div>

                                    <div className="flex items-center space-x-2">
                                        <button
                                            onClick={() => handleOpenModal(member)}
                                            className="p-2 hover:bg-indigo-50 rounded-lg transition-colors text-indigo-600"
                                        >
                                            <Edit2 className="w-5 h-5" />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(member.id)}
                                            className="p-2 hover:bg-red-50 rounded-lg transition-colors text-red-600"
                                        >
                                            <Trash2 className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>

            {/* Add/Edit Staff Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-slide-in-up">
                        <div className="sticky top-0 bg-white border-b border-slate-200 p-6 flex items-center justify-between">
                            <h2 className="text-2xl font-bold text-slate-900">
                                {editingStaff ? 'Edit Staff Member' : 'Add Staff Member'}
                            </h2>
                            <button
                                onClick={handleCloseModal}
                                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                            >
                                <X className="w-5 h-5 text-slate-600" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-6">
                            {/* Name */}
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">
                                    Name *
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={staffForm.name}
                                    onChange={(e) => setStaffForm(prev => ({ ...prev, name: e.target.value }))}
                                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                                    placeholder="Enter staff member name"
                                />
                            </div>

                            {/* Email */}
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">
                                    Email *
                                </label>
                                <input
                                    type="email"
                                    required
                                    value={staffForm.email}
                                    onChange={(e) => setStaffForm(prev => ({ ...prev, email: e.target.value }))}
                                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                                    placeholder="staff@example.com"
                                />
                            </div>

                            {/* Status */}
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">
                                    Status
                                </label>
                                <select
                                    value={staffForm.status}
                                    onChange={(e) => setStaffForm(prev => ({ ...prev, status: e.target.value }))}
                                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                                >
                                    <option value="Invited">Invited</option>
                                    <option value="Active">Active</option>
                                </select>
                            </div>

                            {/* Permissions */}
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-3">
                                    Permissions
                                </label>
                                <div className="space-y-3 bg-slate-50 rounded-xl p-4">
                                    <PermissionToggle
                                        label="Inbox Access"
                                        description="View and respond to customer messages"
                                        checked={staffForm.permissions.inbox}
                                        onChange={() => handlePermissionToggle('inbox')}
                                    />
                                    <PermissionToggle
                                        label="Bookings Management"
                                        description="View and manage customer bookings"
                                        checked={staffForm.permissions.bookings}
                                        onChange={() => handlePermissionToggle('bookings')}
                                    />
                                    <PermissionToggle
                                        label="Forms Tracking"
                                        description="View and track form submissions"
                                        checked={staffForm.permissions.forms}
                                        onChange={() => handlePermissionToggle('forms')}
                                    />
                                    <PermissionToggle
                                        label="Inventory Visibility"
                                        description="View inventory and resource levels"
                                        checked={staffForm.permissions.inventory}
                                        onChange={() => handlePermissionToggle('inventory')}
                                    />
                                </div>
                                <p className="text-xs text-slate-500 mt-2">
                                    Note: Staff cannot access System Settings, Integrations, or Workspace Activation
                                </p>
                            </div>

                            {/* Actions */}
                            <div className="flex items-center space-x-3 pt-4 border-t border-slate-200">
                                <button
                                    type="button"
                                    onClick={handleCloseModal}
                                    className="flex-1 px-6 py-3 border-2 border-slate-200 text-slate-700 font-bold rounded-xl hover:bg-slate-50 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold rounded-xl hover:shadow-lg transition-all"
                                >
                                    {editingStaff ? 'Update Staff' : 'Add Staff'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

const PermissionItem = ({ label, allowed }) => (
    <div className={`flex items-center space-x-2 text-sm ${allowed ? 'text-slate-700' : 'text-slate-400'}`}>
        {allowed ? (
            <CheckCircle className="w-4 h-4 text-green-500" />
        ) : (
            <XCircle className="w-4 h-4 text-slate-300" />
        )}
        <span className={!allowed ? 'line-through decoration-slate-300' : ''}>{label}</span>
    </div>
);

const PermissionToggle = ({ label, description, checked, onChange }) => (
    <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-slate-200">
        <div className="flex-1">
            <p className="font-semibold text-slate-900 text-sm">{label}</p>
            <p className="text-xs text-slate-500">{description}</p>
        </div>
        <button
            type="button"
            onClick={onChange}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${checked ? 'bg-indigo-600' : 'bg-slate-300'
                }`}
        >
            <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${checked ? 'translate-x-6' : 'translate-x-1'
                    }`}
            />
        </button>
    </div>
);

export default Staff;
