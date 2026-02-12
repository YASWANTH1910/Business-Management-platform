import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCareOps } from '../context/CareOpsContext';
import { ArrowLeft, Package, Plus, X, Edit2, Trash2, AlertTriangle, CheckCircle } from 'lucide-react';

const Inventory = () => {
    const { resources, addResource, updateResource, deleteResource, bookingConfig } = useCareOps();
    const navigate = useNavigate();
    const [showAddModal, setShowAddModal] = useState(false);
    const [editingResource, setEditingResource] = useState(null);
    const [resourceData, setResourceData] = useState({
        name: '',
        quantity: 0,
        threshold: 1,
        linkedBookingTypes: []
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        if (editingResource) {
            updateResource(editingResource.id, resourceData);
            setEditingResource(null);
        } else {
            addResource(resourceData);
        }
        setResourceData({ name: '', quantity: 0, threshold: 1, linkedBookingTypes: [] });
        setShowAddModal(false);
    };

    const handleEdit = (resource) => {
        setEditingResource(resource);
        setResourceData({
            name: resource.name,
            quantity: resource.quantity,
            threshold: resource.threshold,
            linkedBookingTypes: resource.linkedBookingTypes
        });
        setShowAddModal(true);
    };

    const handleDelete = (id) => {
        if (confirm('Are you sure you want to delete this resource?')) {
            deleteResource(id);
        }
    };

    const toggleBookingType = (serviceId) => {
        setResourceData(prev => ({
            ...prev,
            linkedBookingTypes: prev.linkedBookingTypes.includes(serviceId)
                ? prev.linkedBookingTypes.filter(id => id !== serviceId)
                : [...prev.linkedBookingTypes, serviceId]
        }));
    };

    const closeModal = () => {
        setShowAddModal(false);
        setEditingResource(null);
        setResourceData({ name: '', quantity: 0, threshold: 1, linkedBookingTypes: [] });
    };

    const getResourceStatus = (resource) => {
        if (resource.quantity === 0) return { label: 'Out of Stock', color: 'red', severity: 'critical' };
        if (resource.quantity <= resource.threshold) return { label: 'Low Stock', color: 'yellow', severity: 'warning' };
        return { label: 'In Stock', color: 'green', severity: 'healthy' };
    };

    const lowStockCount = resources.filter(r => r.quantity <= r.threshold && r.quantity > 0).length;
    const outOfStockCount = resources.filter(r => r.quantity === 0).length;

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50 to-purple-50">
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
                                <Package className="text-white w-6 h-6" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                                    Inventory & Resources
                                </h1>
                                <p className="text-xs text-slate-500">Track and manage business resources</p>
                            </div>
                        </div>
                        <button
                            onClick={() => setShowAddModal(true)}
                            className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all flex items-center space-x-2"
                        >
                            <Plus className="w-4 h-4" />
                            <span>Add Resource</span>
                        </button>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <StatCard
                        title="Total Resources"
                        value={resources.length}
                        color="indigo"
                    />
                    <StatCard
                        title="In Stock"
                        value={resources.filter(r => r.quantity > r.threshold).length}
                        color="green"
                    />
                    <StatCard
                        title="Low Stock"
                        value={lowStockCount}
                        color="yellow"
                    />
                    <StatCard
                        title="Out of Stock"
                        value={outOfStockCount}
                        color="red"
                    />
                </div>

                {/* Resources Grid */}
                <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-6">
                    <h2 className="text-xl font-bold text-slate-900 mb-6">Resources</h2>

                    {resources.length === 0 ? (
                        <div className="text-center py-16">
                            <div className="inline-flex items-center justify-center w-16 h-16 bg-slate-100 rounded-full mb-4">
                                <Package className="w-8 h-8 text-slate-400" />
                            </div>
                            <p className="text-slate-600 mb-4">No resources configured yet</p>
                            <button
                                onClick={() => setShowAddModal(true)}
                                className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300"
                            >
                                <Plus className="w-5 h-5" />
                                <span>Add Your First Resource</span>
                            </button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {resources.map((resource) => {
                                const status = getResourceStatus(resource);
                                const percentFull = Math.min(100, (resource.quantity / (resource.threshold * 3)) * 100);

                                return (
                                    <div key={resource.id} className="p-5 bg-slate-50 rounded-xl border-2 border-slate-200 hover:shadow-lg transition-all">
                                        <div className="flex items-start justify-between mb-3">
                                            <div className="flex-1">
                                                <h3 className="text-lg font-semibold text-slate-900 mb-1">{resource.name}</h3>
                                                <div className="flex items-center space-x-2">
                                                    <span className={`px-2 py-1 rounded-lg text-xs font-bold flex items-center space-x-1 ${status.color === 'green' ? 'bg-green-100 text-green-700' :
                                                            status.color === 'yellow' ? 'bg-yellow-100 text-yellow-700' :
                                                                'bg-red-100 text-red-700'
                                                        }`}>
                                                        {status.color === 'green' ? <CheckCircle className="w-3 h-3" /> :
                                                            <AlertTriangle className="w-3 h-3" />}
                                                        <span>{status.label}</span>
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="flex items-center space-x-1">
                                                <button
                                                    onClick={() => handleEdit(resource)}
                                                    className="p-2 hover:bg-indigo-100 rounded-lg transition-colors group"
                                                >
                                                    <Edit2 className="w-4 h-4 text-slate-600 group-hover:text-indigo-600" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(resource.id)}
                                                    className="p-2 hover:bg-red-100 rounded-lg transition-colors group"
                                                >
                                                    <Trash2 className="w-4 h-4 text-slate-600 group-hover:text-red-600" />
                                                </button>
                                            </div>
                                        </div>

                                        {/* Quantity Display */}
                                        <div className="mb-3">
                                            <div className="flex items-center justify-between text-sm mb-1">
                                                <span className="text-slate-600 font-medium">Quantity</span>
                                                <span className="font-bold text-slate-900">{resource.quantity}</span>
                                            </div>
                                            <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                                                <div
                                                    className={`h-full transition-all duration-300 ${status.color === 'green' ? 'bg-green-500' :
                                                            status.color === 'yellow' ? 'bg-yellow-500' :
                                                                'bg-red-500'
                                                        }`}
                                                    style={{ width: `${percentFull}%` }}
                                                />
                                            </div>
                                            <p className="text-xs text-slate-500 mt-1">
                                                Low stock threshold: {resource.threshold}
                                            </p>
                                        </div>

                                        {/* Linked Booking Types */}
                                        <div className="text-sm">
                                            <p className="text-slate-600 font-medium mb-1">Linked to:</p>
                                            {resource.linkedBookingTypes.length === 0 ? (
                                                <p className="text-slate-400 text-xs">No booking types</p>
                                            ) : (
                                                <div className="flex flex-wrap gap-1">
                                                    {resource.linkedBookingTypes.map(typeId => {
                                                        const service = bookingConfig.services.find(s => s.id === typeId);
                                                        return service ? (
                                                            <span key={typeId} className="px-2 py-1 bg-indigo-100 text-indigo-700 rounded text-xs font-medium">
                                                                {service.name}
                                                            </span>
                                                        ) : null;
                                                    })}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </main>

            {/* Add/Edit Resource Modal */}
            {showAddModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
                            <h2 className="text-xl font-bold text-slate-900">
                                {editingResource ? 'Edit Resource' : 'Add New Resource'}
                            </h2>
                            <button
                                onClick={closeModal}
                                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                            >
                                <X className="w-5 h-5 text-slate-600" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-6">
                            {/* Resource Name */}
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">
                                    Resource Name *
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={resourceData.name}
                                    onChange={(e) => setResourceData(prev => ({ ...prev, name: e.target.value }))}
                                    className="w-full px-4 py-2 border-2 border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                                    placeholder="e.g. Treatment Room, Equipment Kit"
                                />
                            </div>

                            {/* Quantity and Threshold */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                                        Initial Quantity *
                                    </label>
                                    <input
                                        type="number"
                                        required
                                        min="0"
                                        value={resourceData.quantity}
                                        onChange={(e) => setResourceData(prev => ({ ...prev, quantity: parseInt(e.target.value) || 0 }))}
                                        className="w-full px-4 py-2 border-2 border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                                        placeholder="0"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                                        Low Stock Threshold *
                                    </label>
                                    <input
                                        type="number"
                                        required
                                        min="0"
                                        value={resourceData.threshold}
                                        onChange={(e) => setResourceData(prev => ({ ...prev, threshold: parseInt(e.target.value) || 1 }))}
                                        className="w-full px-4 py-2 border-2 border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                                        placeholder="1"
                                    />
                                </div>
                            </div>

                            {/* Usage Rule Info */}
                            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                                <p className="text-sm text-blue-800">
                                    <span className="font-semibold">Usage Rule:</span> 1 unit will be deducted per booking for linked booking types.
                                </p>
                            </div>

                            {/* Linked Booking Types */}
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">
                                    Link to Booking Types
                                </label>
                                {bookingConfig.services.length === 0 ? (
                                    <p className="text-sm text-slate-500 italic">No services configured yet. Add services in Bookings first.</p>
                                ) : (
                                    <div className="space-y-2">
                                        {bookingConfig.services.map(service => (
                                            <label key={service.id} className="flex items-center space-x-3 p-3 bg-slate-50 rounded-lg hover:bg-slate-100 cursor-pointer transition-colors">
                                                <input
                                                    type="checkbox"
                                                    checked={resourceData.linkedBookingTypes.includes(service.id)}
                                                    onChange={() => toggleBookingType(service.id)}
                                                    className="w-4 h-4 text-indigo-600 rounded focus:ring-2 focus:ring-indigo-500"
                                                />
                                                <span className="text-sm font-medium text-slate-700">{service.name}</span>
                                            </label>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Submit Button */}
                            <div className="flex space-x-3 pt-4">
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    className="flex-1 px-6 py-3 bg-slate-200 text-slate-700 font-semibold rounded-xl hover:bg-slate-300 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all"
                                >
                                    {editingResource ? 'Update Resource' : 'Add Resource'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

const StatCard = ({ title, value, color }) => {
    const colorClasses = {
        indigo: 'from-indigo-500 to-indigo-600 text-indigo-600',
        green: 'from-green-500 to-green-600 text-green-600',
        yellow: 'from-yellow-500 to-yellow-600 text-yellow-600',
        red: 'from-red-500 to-red-600 text-red-600'
    };

    return (
        <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-slate-100">
            <h3 className="text-slate-600 font-bold text-sm uppercase tracking-wider mb-2">{title}</h3>
            <p className={`text-4xl font-bold bg-gradient-to-r ${colorClasses[color]} bg-clip-text text-transparent`}>
                {value}
            </p>
        </div>
    );
};

export default Inventory;
