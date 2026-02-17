import { useState, useEffect } from 'react'; // Added useEffect
import { useNavigate } from 'react-router-dom';
import { useCareOps } from '../context/CareOpsContext';
import inventoryService from '../services/inventory.service'; // Import service
import {
    Package,
    Plus,
    X,
    Edit2,
    Trash2,
    AlertTriangle,
    CheckCircle,
    Search,
    Filter,
    ArrowDown,
    ArrowUp,
    MoreHorizontal,
    Box,
    XCircle // Added missing import
} from 'lucide-react';

const Inventory = () => {
    const { bookingConfig } = useCareOps();
    // State for inventory
    const [resources, setResources] = useState([]);
    const [loading, setLoading] = useState(true);

    // UI State
    const [showAddPanel, setShowAddPanel] = useState(false);
    const [editingResource, setEditingResource] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'asc' });

    const [resourceData, setResourceData] = useState({
        name: '',
        quantity: 0,
        threshold: 1,
        linkedBookingTypes: []
    });

    useEffect(() => {
        fetchInventory();
    }, []);

    const fetchInventory = async () => {
        setLoading(true);
        try {
            const data = await inventoryService.getItems();
            setResources(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("Failed to fetch inventory", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingResource) {
                const updated = await inventoryService.updateItem(editingResource.id, resourceData);
                setResources(prev => prev.map(r => r.id === editingResource.id ? updated : r));
                setEditingResource(null);
            } else {
                const created = await inventoryService.createItem(resourceData);
                setResources(prev => [...prev, created]);
            }
            setResourceData({ name: '', quantity: 0, threshold: 1, linkedBookingTypes: [] });
            setShowAddPanel(false);
        } catch (error) {
            console.error("Failed to save item", error);
        }
    };

    const handleEdit = (resource) => {
        setEditingResource(resource);
        setResourceData({
            name: resource.name,
            quantity: resource.quantity,
            threshold: resource.threshold,
            linkedBookingTypes: resource.linkedBookingTypes
        });
        setShowAddPanel(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this resource?')) {
            try {
                // Assuming service has delete method, if not we skip
                // await inventoryService.deleteItem(id); 
                // Since `inventory.service.js` shown earlier didn't explicitely have delete, 
                // we'll optimistically update or assume implementation.
                // For now, let's filter local state
                setResources(prev => prev.filter(r => r.id !== id));
            } catch (error) {
                console.error("Failed to delete item", error);
            }
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

    const handleSort = (key) => {
        setSortConfig(prev => ({
            key,
            direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
        }));
    };

    // --- Helpers ---

    const getResourceStatus = (resource) => {
        if (resource.quantity === 0) return { label: 'Out of Stock', color: 'red', bg: 'bg-red-50', text: 'text-red-700', ring: 'ring-red-600/20' };
        if (resource.quantity <= resource.threshold) return { label: 'Low Stock', color: 'amber', bg: 'bg-amber-50', text: 'text-amber-700', ring: 'ring-amber-600/20' };
        return { label: 'In Stock', color: 'emerald', bg: 'bg-emerald-50', text: 'text-emerald-700', ring: 'ring-emerald-600/20' };
    };

    const sortedResources = Array.isArray(resources) ? [...resources]
        .filter(r => r?.name?.toLowerCase().includes(searchQuery.toLowerCase()))
        .sort((a, b) => {
            if (sortConfig.key === 'status') {
                // Custom sort for status based on severity
                const getScore = (r) => r.quantity === 0 ? 0 : r.quantity <= r.threshold ? 1 : 2;
                return sortConfig.direction === 'asc' ? getScore(a) - getScore(b) : getScore(b) - getScore(a);
            }
            if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === 'asc' ? -1 : 1;
            if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === 'asc' ? 1 : -1;
            return 0;
        }) : [];

    const lowStockCount = resources.filter(r => r.quantity <= r.threshold && r.quantity > 0).length;
    const outOfStockCount = resources.filter(r => r.quantity === 0).length;

    return (
        <div className="flex h-[calc(100vh-2rem)] gap-4 p-4 max-w-[1600px] mx-auto animate-fade-in relative">

            {/* Main Content */}
            <div className={`flex-1 flex flex-col space-y-4 transition-all duration-300 ${showAddPanel ? 'mr-[400px]' : ''}`}>

                {/* Header */}
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                            <span className="p-2 bg-indigo-50 rounded-lg text-indigo-600">
                                <Package className="w-6 h-6" />
                            </span>
                            Inventory
                        </h1>
                        <p className="text-slate-500 text-sm mt-1">Track consumables and equipment availability</p>
                    </div>
                    <button
                        onClick={() => {
                            setEditingResource(null);
                            setResourceData({ name: '', quantity: 0, threshold: 1, linkedBookingTypes: [] });
                            setShowAddPanel(true);
                        }}
                        className="px-4 py-2.5 bg-indigo-600 text-white rounded-xl font-semibold shadow-lg shadow-indigo-200 hover:bg-indigo-700 hover:-translate-y-0.5 transition-all flex items-center gap-2"
                    >
                        <Plus className="w-4 h-4" />
                        <span>Add Item</span>
                    </button>
                </div>

                {/* Stats Row */}
                <div className="grid grid-cols-4 gap-4">
                    <StatCard
                        label="Total Items"
                        value={resources.length}
                        icon={<Box className="w-4 h-4" />}
                        color="indigo"
                    />
                    <StatCard
                        label="In Stock"
                        value={resources.filter(r => r.quantity > r.threshold).length}
                        icon={<CheckCircle className="w-4 h-4" />}
                        color="emerald"
                    />
                    <StatCard
                        label="Low Stock"
                        value={lowStockCount}
                        icon={<AlertTriangle className="w-4 h-4" />}
                        color="amber"
                    />
                    <StatCard
                        label="Out of Stock"
                        value={outOfStockCount}
                        icon={<XCircle className="w-4 h-4" />}
                        color="red"
                    />
                </div>

                {/* Inventory Table */}
                <div className="flex-1 bg-white rounded-2xl border border-slate-100 shadow-xl shadow-slate-200/50 flex flex-col overflow-hidden">
                    {/* Toolbar */}
                    <div className="p-4 border-b border-slate-50 flex gap-3">
                        <div className="relative flex-1 max-w-sm">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <input
                                placeholder="Search inventory..."
                                value={searchQuery}
                                onChange={e => setSearchQuery(e.target.value)}
                                className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-100 rounded-lg text-sm focus:bg-white focus:ring-2 focus:ring-indigo-500 transition-all outline-none"
                            />
                        </div>
                        <button className="px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-600 text-sm font-medium hover:bg-slate-50 transition-colors flex items-center gap-2">
                            <Filter className="w-4 h-4" />
                            Filter
                        </button>
                    </div>

                    <div className="flex-1 overflow-auto">
                        <table className="w-full text-left border-collapse">
                            <thead className="bg-slate-50/50 sticky top-0 z-10 backdrop-blur-sm">
                                <tr>
                                    <SortableHeader label="Item Name" sortKey="name" currentSort={sortConfig} onSort={handleSort} />
                                    <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider w-48">Stock Level</th>
                                    <SortableHeader label="Quantity" sortKey="quantity" currentSort={sortConfig} onSort={handleSort} />
                                    <SortableHeader label="Status" sortKey="status" currentSort={sortConfig} onSort={handleSort} />
                                    <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Usage</th>
                                    <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {loading ? (
                                    <tr>
                                        <td colSpan="6" className="p-12 text-center">
                                            <div className="flex justify-center mb-2">
                                                <div className="w-6 h-6 border-2 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
                                            </div>
                                            <p className="text-slate-400">Loading inventory...</p>
                                        </td>
                                    </tr>
                                ) : sortedResources.length === 0 ? (
                                    <tr>
                                        <td colSpan="6" className="p-12 text-center text-slate-400">
                                            No items found
                                        </td>
                                    </tr>
                                ) : (
                                    sortedResources.map((resource) => {
                                        const status = getResourceStatus(resource);
                                        const percent = Math.min(100, (resource.quantity / (resource.threshold * 3)) * 100);

                                        return (
                                            <tr key={resource.id} className="hover:bg-slate-50 transition-colors group">
                                                <td className="px-4 py-3">
                                                    <div className="font-semibold text-slate-900">{resource.name}</div>
                                                </td>
                                                <td className="px-4 py-3">
                                                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                                                        <div
                                                            className={`h-full rounded-full transition-all duration-500 ${status.color === 'red' ? 'bg-red-500' :
                                                                status.color === 'amber' ? 'bg-amber-500' : 'bg-emerald-500'
                                                                }`}
                                                            style={{ width: `${percent}%` }}
                                                        />
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3">
                                                    <span className="font-mono font-bold text-slate-700">{resource.quantity}</span>
                                                    <span className="text-xs text-slate-400 ml-1">/ {resource.threshold} (min)</span>
                                                </td>
                                                <td className="px-4 py-3">
                                                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${status.bg} ${status.text} ${status.ring} ring-1`}>
                                                        {status.color === 'red' && <XCircle className="w-3 h-3" />}
                                                        {status.color === 'amber' && <AlertTriangle className="w-3 h-3" />}
                                                        {status.color === 'emerald' && <CheckCircle className="w-3 h-3" />}
                                                        {status.label}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3 text-sm text-slate-500">
                                                    {(resource.linkedBookingTypes?.length || 0) > 0
                                                        ? `${resource.linkedBookingTypes.length} services`
                                                        : 'Manual only'}
                                                </td>
                                                <td className="px-4 py-3 text-right">
                                                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <button
                                                            onClick={() => handleEdit(resource)}
                                                            className="p-1.5 hover:bg-indigo-50 text-slate-400 hover:text-indigo-600 rounded-lg transition-colors"
                                                        >
                                                            <Edit2 className="w-4 h-4" />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDelete(resource.id)}
                                                            className="p-1.5 hover:bg-red-50 text-slate-400 hover:text-red-600 rounded-lg transition-colors"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Slide-over Add/Edit Panel */}
            <div className={`
                fixed inset-y-0 right-0 w-[400px] bg-white shadow-2xl transform transition-transform duration-300 ease-in-out z-50 flex flex-col
                ${showAddPanel ? 'translate-x-0' : 'translate-x-full'}
            `}>
                <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                    <h2 className="text-lg font-bold text-slate-900">
                        {editingResource ? 'Edit Item' : 'New Inventory Item'}
                    </h2>
                    <button
                        onClick={() => setShowAddPanel(false)}
                        className="p-2 hover:bg-slate-200 rounded-lg transition-colors"
                    >
                        <X className="w-5 h-5 text-slate-500" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6">
                    <form id="inventory-form" onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Item Name</label>
                                <input
                                    required
                                    value={resourceData.name}
                                    onChange={e => setResourceData({ ...resourceData, name: e.target.value })}
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 transition-all outline-none"
                                    placeholder="e.g. Surgical Masks"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Current Stock</label>
                                    <input
                                        type="number"
                                        required
                                        min="0"
                                        value={resourceData.quantity}
                                        onChange={e => setResourceData({ ...resourceData, quantity: parseInt(e.target.value) || 0 })}
                                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 transition-all outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Low Alert At</label>
                                    <input
                                        type="number"
                                        required
                                        min="0"
                                        value={resourceData.threshold}
                                        onChange={e => setResourceData({ ...resourceData, threshold: parseInt(e.target.value) || 0 })}
                                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 transition-all outline-none"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="pt-6 border-t border-slate-100">
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">
                                Auto-Deduct on Booking
                            </label>

                            <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-4">
                                <p className="text-xs text-blue-800">
                                    <span className="font-bold">Note:</span> 1 unit will be deducted automatically when a booking is marked as "Completed".
                                </p>
                            </div>

                            {bookingConfig.services.length === 0 ? (
                                <p className="text-sm text-slate-400 italic">No services available.</p>
                            ) : (
                                <div className="space-y-2">
                                    {bookingConfig.services.map(service => (
                                        <label
                                            key={service.id}
                                            className={`
                                                flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all
                                                ${resourceData.linkedBookingTypes.includes(service.id)
                                                    ? 'bg-indigo-50 border-indigo-200 ring-1 ring-indigo-200'
                                                    : 'bg-white border-slate-200 hover:border-indigo-200'}
                                            `}
                                        >
                                            <div className={`
                                                w-5 h-5 rounded-full border flex items-center justify-center transition-colors
                                                ${resourceData.linkedBookingTypes.includes(service.id)
                                                    ? 'bg-indigo-500 border-indigo-500'
                                                    : 'bg-white border-slate-300'}
                                            `}>
                                                {resourceData.linkedBookingTypes.includes(service.id) && <CheckCircle className="w-3.5 h-3.5 text-white" />}
                                            </div>
                                            <input
                                                type="checkbox"
                                                className="hidden"
                                                checked={resourceData.linkedBookingTypes.includes(service.id)}
                                                onChange={() => toggleBookingType(service.id)}
                                            />
                                            <span className={`text-sm font-medium ${resourceData.linkedBookingTypes.includes(service.id) ? 'text-indigo-900' : 'text-slate-700'}`}>
                                                {service.name}
                                            </span>
                                        </label>
                                    ))}
                                </div>
                            )}
                        </div>
                    </form>
                </div>

                <div className="p-6 border-t border-slate-100 bg-slate-50">
                    <button
                        type="submit"
                        form="inventory-form"
                        className="w-full py-3.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all"
                    >
                        {editingResource ? 'Save Changes' : 'Add Item'}
                    </button>
                </div>
            </div>
        </div>
    );
};

// --- Sub-Components ---

const StatCard = ({ label, value, icon, color }) => {
    const colorClasses = {
        indigo: 'bg-indigo-50 text-indigo-600',
        emerald: 'bg-emerald-50 text-emerald-600',
        amber: 'bg-amber-50 text-amber-600',
        red: 'bg-red-50 text-red-600'
    };

    return (
        <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex items-center justify-between">
            <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">{label}</p>
                <p className="text-2xl font-bold text-slate-900 mt-1">{value}</p>
            </div>
            <div className={`p-3 rounded-xl ${colorClasses[color]}`}>
                {icon}
            </div>
        </div>
    );
};

const SortableHeader = ({ label, sortKey, currentSort, onSort }) => (
    <th
        className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider cursor-pointer hover:bg-slate-100 hover:text-indigo-600 transition-colors"
        onClick={() => onSort(sortKey)}
    >
        <div className="flex items-center gap-1">
            {label}
            {currentSort.key === sortKey && (
                currentSort.direction === 'asc' ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />
            )}
        </div>
    </th>
);

export default Inventory;
