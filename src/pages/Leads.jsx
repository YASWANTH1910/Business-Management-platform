import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCareOps } from '../context/CareOpsContext';
import {
    Users,
    Plus,
    X,
    Mail,
    Phone,
    Calendar,
    CheckCircle,
    XCircle,
    Clock,
    ArrowLeft,
    Sparkles
} from 'lucide-react';

const LEAD_STATUSES = ['New', 'Contacted', 'Booked', 'Lost'];

const Leads = () => {
    const { business, leads, addLead, updateLead } = useCareOps();
    const navigate = useNavigate();
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        service: '',
        notes: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const newLead = {
            id: Date.now().toString(),
            ...formData,
            status: 'New',
            createdAt: new Date().toISOString()
        };
        addLead(newLead);
        setFormData({ name: '', email: '', phone: '', service: '', notes: '' });
        setShowModal(false);
    };

    const handleStatusChange = (leadId, newStatus) => {
        updateLead(leadId, { status: newStatus });
    };

    const handleConvertToBooking = (leadId) => {
        updateLead(leadId, { status: 'Booked' });
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'New': return <Clock className="w-4 h-4" />;
            case 'Contacted': return <Mail className="w-4 h-4" />;
            case 'Booked': return <CheckCircle className="w-4 h-4" />;
            case 'Lost': return <XCircle className="w-4 h-4" />;
            default: return null;
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'New': return 'bg-blue-100 text-blue-700 border-blue-200';
            case 'Contacted': return 'bg-purple-100 text-purple-700 border-purple-200';
            case 'Booked': return 'bg-green-100 text-green-700 border-green-200';
            case 'Lost': return 'bg-red-100 text-red-700 border-red-200';
            default: return 'bg-gray-100 text-gray-700 border-gray-200';
        }
    };

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
                                <Users className="text-white w-6 h-6" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                                    Leads Management
                                </h1>
                                <p className="text-xs text-slate-500">Track and manage customer inquiries</p>
                            </div>
                        </div>
                        <button
                            onClick={() => setShowModal(true)}
                            className="flex items-center space-x-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-5 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300"
                        >
                            <Plus className="w-5 h-5" />
                            <span>Add Lead</span>
                        </button>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Stats Summary */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                    <StatBox
                        label="Total Leads"
                        value={leads.length}
                        color="indigo"
                    />
                    <StatBox
                        label="New"
                        value={leads.filter(l => l.status === 'New').length}
                        color="blue"
                    />
                    <StatBox
                        label="Contacted"
                        value={leads.filter(l => l.status === 'Contacted').length}
                        color="purple"
                    />
                    <StatBox
                        label="Booked"
                        value={leads.filter(l => l.status === 'Booked').length}
                        color="green"
                    />
                </div>

                {/* Leads Table */}
                <div className="bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden">
                    {leads.length === 0 ? (
                        <div className="p-12 text-center">
                            <div className="h-20 w-20 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Users className="h-10 w-10 text-indigo-600" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-2">No leads yet</h3>
                            <p className="text-slate-600 mb-6">Start by adding your first customer inquiry</p>
                            <button
                                onClick={() => setShowModal(true)}
                                className="inline-flex items-center space-x-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300"
                            >
                                <Plus className="w-5 h-5" />
                                <span>Add First Lead</span>
                            </button>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gradient-to-r from-slate-50 to-slate-100 border-b-2 border-slate-200">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">Customer</th>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">Contact</th>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">Service</th>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">Status</th>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">Created</th>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {leads.map((lead, index) => (
                                        <tr
                                            key={lead.id}
                                            className="hover:bg-slate-50 transition-colors animate-fade-in"
                                            style={{ animationDelay: `${index * 0.05}s` }}
                                        >
                                            <td className="px-6 py-4">
                                                <div className="flex items-center space-x-3">
                                                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold">
                                                        {lead.name.charAt(0)}
                                                    </div>
                                                    <div className="font-semibold text-slate-900">{lead.name}</div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="space-y-1">
                                                    <div className="flex items-center space-x-2 text-sm text-slate-600">
                                                        <Mail className="w-4 h-4" />
                                                        <span>{lead.email}</span>
                                                    </div>
                                                    {lead.phone && (
                                                        <div className="flex items-center space-x-2 text-sm text-slate-600">
                                                            <Phone className="w-4 h-4" />
                                                            <span>{lead.phone}</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="text-sm text-slate-700">{lead.service}</span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <select
                                                    value={lead.status}
                                                    onChange={(e) => handleStatusChange(lead.id, e.target.value)}
                                                    className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-semibold border-2 ${getStatusColor(lead.status)} cursor-pointer focus:ring-2 focus:ring-indigo-500 outline-none transition-all`}
                                                >
                                                    {LEAD_STATUSES.map(status => (
                                                        <option key={status} value={status}>{status}</option>
                                                    ))}
                                                </select>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center space-x-2 text-sm text-slate-600">
                                                    <Calendar className="w-4 h-4" />
                                                    <span>{new Date(lead.createdAt).toLocaleDateString()}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                {lead.status !== 'Booked' && (
                                                    <button
                                                        onClick={() => handleConvertToBooking(lead.id)}
                                                        className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white text-sm font-semibold rounded-lg hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300"
                                                    >
                                                        Convert to Booking
                                                    </button>
                                                )}
                                                {lead.status === 'Booked' && (
                                                    <span className="flex items-center space-x-2 text-green-600 font-semibold text-sm">
                                                        <CheckCircle className="w-4 h-4" />
                                                        <span>Booked</span>
                                                    </span>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </main>

            {/* Add Lead Modal */}
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[100] p-4 animate-fade-in">
                <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto relative animate-slide-in flex flex-col">

                    {/* Modal Header */}
                    <div className="sticky top-0 bg-white z-10 px-8 pt-8 pb-4 border-b border-slate-100 flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <button
                                type="button"
                                onClick={() => setShowModal(false)}
                                className="p-2 hover:bg-slate-100 rounded-lg transition-colors mr-1"
                            >
                                <ArrowLeft className="w-5 h-5 text-slate-600" />
                            </button>
                            <div className="bg-gradient-to-br from-indigo-600 to-purple-600 p-2 rounded-lg">
                                <Plus className="w-5 h-5 text-white" />
                            </div>
                            <h2 className="text-xl font-bold text-slate-900">Add New Lead</h2>
                        </div>
                        <button
                            onClick={() => setShowModal(false)}
                            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                        >
                            <X className="w-5 h-5 text-slate-500" />
                        </button>
                    </div>

                    {/* Modal Body */}
                    <div className="p-8 pt-4">
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">
                                    Customer Name *
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    required
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                                    placeholder="John Doe"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">
                                    Email *
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    required
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                                    placeholder="john@example.com"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">
                                    Phone
                                </label>
                                <input
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                                    placeholder="(555) 123-4567"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">
                                    Service Requested *
                                </label>
                                <input
                                    type="text"
                                    name="service"
                                    required
                                    value={formData.service}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                                    placeholder="e.g. Dental Cleaning"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">
                                    Notes
                                </label>
                                <textarea
                                    name="notes"
                                    value={formData.notes}
                                    onChange={handleChange}
                                    rows="3"
                                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all resize-none"
                                    placeholder="Additional information..."
                                />
                            </div>

                            <div className="flex space-x-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="flex-1 px-6 py-3 border-2 border-slate-300 text-slate-700 font-semibold rounded-xl hover:bg-slate-50 transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300"
                                >
                                    Add Lead
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

const StatBox = ({ label, value, color }) => {
    const colorClasses = {
        indigo: 'from-indigo-500 to-indigo-600',
        blue: 'from-blue-500 to-blue-600',
        purple: 'from-purple-500 to-purple-600',
        green: 'from-green-500 to-emerald-600'
    };

    return (
        <div className="bg-white rounded-xl p-5 shadow-lg border-2 border-slate-100 animate-fade-in">
            <p className="text-sm font-semibold text-slate-600 mb-2">{label}</p>
            <p className={`text-3xl font-bold bg-gradient-to-r ${colorClasses[color]} bg-clip-text text-transparent`}>
                {value}
            </p>
        </div>
    );
};

export default Leads;
