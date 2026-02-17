
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCareOps } from '../context/CareOpsContext';
import formService from '../services/form.service';
import {
    FileText,
    Plus,
    X,
    Upload,
    Edit2,
    Trash2,
    CheckCircle,
    XCircle,
    Search,
    Filter,
    MoreVertical,
    Layout,
    List,
    FileCheck,
    Calendar,
    Eye,
    Loader
} from 'lucide-react';

const FORM_TYPES = ['Intake', 'Agreement', 'Supporting Document'];

const Forms = () => {
    const { bookingConfig } = useCareOps(); // Removed formTemplates, etc.
    const navigate = useNavigate();

    // Data State
    const [formTemplates, setFormTemplates] = useState([]);
    const [formSubmissions, setFormSubmissions] = useState([]); // Assuming submissions are fetched separately or via service
    const [loading, setLoading] = useState(true);


    // UI State
    const [activeTab, setActiveTab] = useState('templates'); // 'templates' | 'submissions'
    const [showAddModal, setShowAddModal] = useState(false);
    const [editingForm, setEditingForm] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');

    // Form Data State
    const [formData, setFormData] = useState({
        name: '',
        type: 'Intake',
        linkedBookingTypes: [],
        status: 'Active'
    });

    useEffect(() => {
        fetchForms();
        // Ideally fetch submissions too
    }, []);

    const fetchForms = async () => {
        setLoading(true);
        try {
            const data = await formService.getForms();
            setFormTemplates(Array.isArray(data) ? data : []);
            // Mock submissions if not available via API yet
            // setFormSubmissions(await formService.getSubmissions()); 
        } catch (error) {
            console.error("Failed to fetch forms:", error);
        } finally {
            setLoading(false);
        }
    };

    // --- Actions ---

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingForm) {
                const updated = await formService.updateForm(editingForm.id, formData);
                setFormTemplates(prev => prev.map(f => f.id === editingForm.id ? updated : f));
                setEditingForm(null);
            } else {
                const created = await formService.createForm(formData);
                setFormTemplates(prev => [...prev, created]);
            }
            setFormData({ name: '', type: 'Intake', linkedBookingTypes: [], status: 'Active' });
            setShowAddModal(false);
        } catch (error) {
            console.error("Failed to save form:", error);
        }
    };

    const handleEdit = (form) => {
        setEditingForm(form);
        setFormData({
            name: form.name,
            type: form.type,
            linkedBookingTypes: form.linkedBookingTypes || [],
            status: form.status
        });
        setShowAddModal(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this form template?')) {
            try {
                await formService.deleteForm(id);
                setFormTemplates(prev => prev.filter(f => f.id !== id));
            } catch (error) {
                console.error("Failed to delete form:", error);
            }
        }
    };

    const toggleBookingType = (serviceId) => {
        setFormData(prev => ({
            ...prev,
            linkedBookingTypes: prev.linkedBookingTypes.includes(serviceId)
                ? prev.linkedBookingTypes.filter(id => id !== serviceId)
                : [...prev.linkedBookingTypes, serviceId]
        }));
    };

    const closeModal = () => {
        setShowAddModal(false);
        setEditingForm(null);
        setFormData({ name: '', type: 'Intake', linkedBookingTypes: [], status: 'Active' });
    };

    // --- Helpers ---
    const getStatusColor = (status) => {
        return status === 'Active'
            ? 'bg-emerald-50 text-emerald-700 ring-emerald-600/20'
            : 'bg-slate-50 text-slate-600 ring-slate-500/10';
    };

    const filteredTemplates = formTemplates.filter(t =>
        t?.name?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="flex h-[calc(100vh-2rem)] flex-col space-y-4 p-4 max-w-[1600px] mx-auto animate-fade-in">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                        <span className="p-2 bg-indigo-50 rounded-lg text-indigo-600">
                            <FileText className="w-6 h-6" />
                        </span>
                        Forms & Documents
                    </h1>
                    <p className="text-slate-500 text-sm mt-1">Manage intake forms, waivers, and agreements</p>
                </div>

                <div className="flex items-center gap-3">
                    <div className="flex bg-white border border-slate-200 rounded-lg p-1 shadow-sm">
                        <button
                            onClick={() => setActiveTab('templates')}
                            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === 'templates' ? 'bg-indigo-50 text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'}`}
                        >
                            <Layout className="w-4 h-4" />
                            Templates
                        </button>
                        <button
                            onClick={() => setActiveTab('submissions')}
                            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === 'submissions' ? 'bg-indigo-50 text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'}`}
                        >
                            <FileCheck className="w-4 h-4" />
                            Submissions
                        </button>
                    </div>

                    <button
                        onClick={() => setShowAddModal(true)}
                        className="px-4 py-2.5 bg-indigo-600 text-white rounded-xl font-semibold shadow-lg shadow-indigo-200 hover:bg-indigo-700 hover:-translate-y-0.5 transition-all flex items-center gap-2"
                    >
                        <Plus className="w-4 h-4" />
                        <span>New Form</span>
                    </button>
                </div>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <StatCard
                    label="Total Templates"
                    value={formTemplates.length}
                    icon={<FileText className="w-4 h-4" />}
                    color="indigo"
                />
                <StatCard
                    label="Active Forms"
                    value={formTemplates.filter(f => f.status === 'Active').length}
                    icon={<CheckCircle className="w-4 h-4" />}
                    color="green"
                />
                <StatCard
                    label="Total Submissions"
                    value={formSubmissions?.length || 0}
                    icon={<FileCheck className="w-4 h-4" />}
                    color="purple"
                />
                <StatCard
                    label="Pending Review"
                    value={formSubmissions?.filter(s => s.status === 'Pending').length || 0}
                    icon={<Eye className="w-4 h-4" />}
                    color="amber"
                />
            </div>

            {/* Content Area */}
            <div className="flex-1 bg-white rounded-2xl border border-slate-100 shadow-xl shadow-slate-200/50 flex flex-col overflow-hidden">
                {/* Toolbar */}
                <div className="p-4 border-b border-slate-50 flex gap-3">
                    <div className="relative flex-1 max-w-sm">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                            placeholder={activeTab === 'templates' ? "Search templates..." : "Search submissions..."}
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

                {loading ? (
                    <div className="p-12 text-center flex flex-col items-center justify-center h-full">
                        <Loader className="w-8 h-8 text-indigo-600 animate-spin mb-4" />
                        <p className="text-slate-500">Loading forms...</p>
                    </div>
                ) : (
                    <>
                        {/* Templates View */}
                        {activeTab === 'templates' && (
                            <div className="flex-1 overflow-y-auto p-6 bg-slate-50/30">
                                {filteredTemplates.length === 0 ? (
                                    <EmptyState
                                        title="No Form Templates"
                                        description="Create your first form template to start collecting data from clients."
                                        action={() => setShowAddModal(true)}
                                    />
                                ) : (
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                                        {filteredTemplates.map(form => (
                                            <div key={form.id} className="group bg-white rounded-2xl border border-slate-200 hover:border-indigo-200 shadow-sm hover:shadow-lg transition-all p-4 flex flex-col h-full relative overflow-hidden">
                                                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-purple-500 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />

                                                <div className="flex justify-between items-start mb-4">
                                                    <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                                                        <FileText className="w-6 h-6" />
                                                    </div>
                                                    <div className="relative">
                                                        <button className="p-1 hover:bg-slate-100 rounded-lg transition-colors text-slate-400 hover:text-slate-600">
                                                            <MoreVertical className="w-5 h-5" />
                                                        </button>
                                                    </div>
                                                </div>

                                                <h3 className="text-lg font-bold text-slate-900 mb-1 line-clamp-1" title={form.name}>{form.name}</h3>
                                                <p className="text-xs text-slate-500 mb-4 flex items-center gap-2">
                                                    <span className={`inline-block w-2 h-2 rounded-full ${form.status === 'Active' ? 'bg-green-500' : 'bg-slate-400'}`} />
                                                    {form.type}
                                                </p>

                                                <div className="mt-auto space-y-4">
                                                    <div className="space-y-2">
                                                        <div className="flex justify-between text-xs text-slate-500">
                                                            <span>Linked Services</span>
                                                            <span className="font-medium text-slate-700">{form.linkedBookingTypes?.length || 0}</span>
                                                        </div>
                                                        <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                                                            <div
                                                                className="h-full bg-indigo-500 rounded-full"
                                                                style={{ width: `${Math.min(100, ((form.linkedBookingTypes?.length || 0) / 5) * 100)}%` }}
                                                            />
                                                        </div>
                                                    </div>

                                                    <div className="flex gap-2 pt-4 border-t border-slate-50">
                                                        <button
                                                            onClick={() => handleEdit(form)}
                                                            className="flex-1 px-3 py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-1.5"
                                                        >
                                                            <Edit2 className="w-3.5 h-3.5" /> Edit
                                                        </button>
                                                        <button
                                                            onClick={() => handleDelete(form.id)}
                                                            className="px-3 py-2 bg-white border border-slate-200 hover:border-red-200 hover:bg-red-50 text-slate-400 hover:text-red-600 rounded-lg transition-colors"
                                                        >
                                                            <Trash2 className="w-3.5 h-3.5" />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Submissions View */}
                        {activeTab === 'submissions' && (
                            <div className="flex-1 overflow-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead className="bg-slate-50/50 sticky top-0 z-10 backdrop-blur-sm">
                                        <tr>
                                            <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Client</th>
                                            <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Form Name</th>
                                            <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                                            <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Date</th>
                                            <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-50">
                                        {(!formSubmissions || formSubmissions.length === 0) ? (
                                            <tr>
                                                <td colSpan="5">
                                                    <EmptyState
                                                        title="No Submissions Yet"
                                                        description="Forms submitted by clients will appear here."
                                                        compact
                                                    />
                                                </td>
                                            </tr>
                                        ) : (
                                            formSubmissions.map((submission) => (
                                                <tr key={submission.id} className="hover:bg-slate-50 transition-colors group">
                                                    <td className="px-4 py-3">
                                                        <div className="font-semibold text-slate-900">{submission.clientName || 'Unknown Client'}</div>
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        <div className="flex items-center gap-2 text-sm text-slate-600">
                                                            <FileText className="w-4 h-4 text-slate-400" />
                                                            {submission.formName}
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium 
                                                            ${submission.status === 'Completed' ? 'bg-green-50 text-green-700 ring-1 ring-green-600/20' :
                                                                submission.status === 'Signed' ? 'bg-blue-50 text-blue-700 ring-1 ring-blue-600/20' :
                                                                    'bg-amber-50 text-amber-700 ring-1 ring-amber-600/20'}`}>
                                                            {submission.status}
                                                        </span>
                                                    </td>
                                                    <td className="px-4 py-3 text-sm text-slate-500">
                                                        {new Date(submission.submittedAt || Date.now()).toLocaleDateString()}
                                                    </td>
                                                    <td className="px-4 py-3 text-right">
                                                        <button className="text-indigo-600 hover:text-indigo-900 text-sm font-medium">View</button>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* Add/Edit Form Modal */}
            {showAddModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col animate-slide-in-up">
                        {/* Modal Header */}
                        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                            <div>
                                <h2 className="text-xl font-bold text-slate-900">
                                    {editingForm ? 'Edit Form Template' : 'Create New Form'}
                                </h2>
                                <p className="text-sm text-slate-500">Configure form details and automation rules</p>
                            </div>
                            <button
                                onClick={closeModal}
                                className="p-2 hover:bg-slate-200 rounded-lg transition-colors"
                            >
                                <X className="w-5 h-5 text-slate-500" />
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="flex-1 overflow-y-auto p-6">
                            <form id="form-template-form" onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                                                Template Name
                                            </label>
                                            <input
                                                type="text"
                                                required
                                                value={formData.name}
                                                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 transition-all outline-none"
                                                placeholder="e.g. New Client Intake"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                                                Form Type
                                            </label>
                                            <select
                                                value={formData.type}
                                                onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value }))}
                                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 transition-all outline-none"
                                            >
                                                {FORM_TYPES.map(type => (
                                                    <option key={type} value={type}>{type}</option>
                                                ))}
                                            </select>
                                        </div>

                                        <div>
                                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                                                Status
                                            </label>
                                            <div className="flex bg-slate-50 p-1 rounded-xl border border-slate-200">
                                                {['Active', 'Inactive'].map(status => (
                                                    <button
                                                        type="button"
                                                        key={status}
                                                        onClick={() => setFormData(prev => ({ ...prev, status }))}
                                                        className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${formData.status === status
                                                            ? 'bg-white text-slate-900 shadow-sm ring-1 ring-slate-200'
                                                            : 'text-slate-500 hover:text-slate-700'
                                                            }`}
                                                    >
                                                        {status}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Mock Builder Preview */}
                                    <div className="bg-slate-50 rounded-xl border-2 border-dashed border-slate-200 p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:border-indigo-300 hover:bg-indigo-50/30 transition-all group">
                                        <div className="w-12 h-12 bg-white rounded-full shadow-sm flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                                            <Upload className="w-6 h-6 text-indigo-500" />
                                        </div>
                                        <h3 className="font-bold text-slate-700 mb-1">Form Builder</h3>
                                        <p className="text-xs text-slate-500 max-w-[150px]">
                                            Drag & drop fields or upload a PDF to digitize
                                        </p>
                                    </div>
                                </div>

                                <div className="pt-6 border-t border-slate-100">
                                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">
                                        Automation Rules: Auto-Assign to Services
                                    </label>

                                    {bookingConfig.services.length === 0 ? (
                                        <div className="p-4 bg-amber-50 rounded-xl text-amber-800 text-sm border border-amber-100">
                                            No services configured. Go to Bookings to add services first.
                                        </div>
                                    ) : (
                                        <div className="grid grid-cols-2 gap-3">
                                            {bookingConfig.services.map(service => (
                                                <label
                                                    key={service.id}
                                                    className={`
                                                        flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all
                                                        ${formData.linkedBookingTypes.includes(service.id)
                                                            ? 'bg-indigo-50 border-indigo-200 ring-1 ring-indigo-200'
                                                            : 'bg-white border-slate-200 hover:border-indigo-200'}
                                                    `}
                                                >
                                                    <div className={`
                                                        w-5 h-5 rounded-full border flex items-center justify-center transition-colors
                                                        ${formData.linkedBookingTypes.includes(service.id)
                                                            ? 'bg-indigo-500 border-indigo-500'
                                                            : 'bg-white border-slate-300'}
                                                    `}>
                                                        {formData.linkedBookingTypes.includes(service.id) && <CheckCircle className="w-3.5 h-3.5 text-white" />}
                                                    </div>
                                                    <input
                                                        type="checkbox"
                                                        className="hidden"
                                                        checked={formData.linkedBookingTypes.includes(service.id)}
                                                        onChange={() => toggleBookingType(service.id)}
                                                    />
                                                    <span className={`text-sm font-medium ${formData.linkedBookingTypes.includes(service.id) ? 'text-indigo-900' : 'text-slate-700'}`}>
                                                        {service.name}
                                                    </span>
                                                </label>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </form>
                        </div>

                        {/* Modal Footer */}
                        <div className="p-6 border-t border-slate-100 bg-slate-50 flex gap-3">
                            <button
                                onClick={closeModal}
                                className="flex-1 px-6 py-3 bg-white border border-slate-200 text-slate-700 font-bold rounded-xl hover:bg-slate-50 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                form="form-template-form"
                                className="flex-1 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all"
                            >
                                {editingForm ? 'Save Changes' : 'Create Template'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

// --- Sub-Components ---

const StatCard = ({ label, value, icon, color }) => {
    const colorClasses = {
        indigo: 'bg-indigo-50 text-indigo-600',
        green: 'bg-emerald-50 text-emerald-600',
        purple: 'bg-purple-50 text-purple-600',
        amber: 'bg-amber-50 text-amber-600'
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

const EmptyState = ({ title, description, action, compact }) => (
    <div className={`flex flex-col items-center justify-center text-center ${compact ? 'py-12' : 'h-full py-20'}`}>
        <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
            <FileText className="w-8 h-8 text-slate-300" />
        </div>
        <h3 className="text-lg font-bold text-slate-900 mb-2">{title}</h3>
        <p className="text-slate-500 max-w-sm mb-6">{description}</p>
        {action && (
            <button
                onClick={action}
                className="px-6 py-2.5 bg-indigo-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all"
            >
                Get Started
            </button>
        )}
    </div>
);

export default Forms;
