
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCareOps } from '../context/CareOpsContext';
import contactService from '../services/contact.service';
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
    Search,
    Filter,
    MoreHorizontal,
    ArrowRight,
    MessageSquare,
    Star
} from 'lucide-react';

const LEAD_STATUSES = ['New', 'Contacted', 'Booked', 'Lost'];

const Leads = () => {
    const { business } = useCareOps();
    const navigate = useNavigate();
    const [leads, setLeads] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [selectedLead, setSelectedLead] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        service: '',
        notes: ''
    });

    useEffect(() => {
        fetchLeads();
    }, []);

    const fetchLeads = async () => {
        try {
            setLoading(true);
            const data = await contactService.getContacts();
            setLeads(data);
        } catch (error) {
            console.error('Failed to fetch leads:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateLead = async (e) => {
        e.preventDefault();
        try {
            const newLead = await contactService.createContact({ ...formData, status: 'New' });
            setLeads(prev => [newLead, ...prev]);
            setFormData({ name: '', email: '', phone: '', service: '', notes: '' });
            setShowModal(false);
        } catch (error) {
            console.error('Failed to create lead:', error);
        }
    };

    const handleStatusChange = async (leadId, newStatus) => {
        try {
            const updatedLead = await contactService.updateContact(leadId, { status: newStatus });
            setLeads(prev => prev.map(l => l.id === leadId ? updatedLead : l));
            if (selectedLead?.id === leadId) setSelectedLead(updatedLead);
        } catch (error) {
            console.error('Failed to update status:', error);
        }
    };

    const filteredLeads = leads.filter(l =>
        l.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        l.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const getStatusColor = (status) => {
        switch (status) {
            case 'New': return 'bg-blue-50 text-blue-700 ring-1 ring-blue-700/10';
            case 'Contacted': return 'bg-purple-50 text-purple-700 ring-1 ring-purple-700/10';
            case 'Booked': return 'bg-green-50 text-green-700 ring-1 ring-green-600/20';
            case 'Lost': return 'bg-red-50 text-red-700 ring-1 ring-red-600/10';
            default: return 'bg-slate-50 text-slate-700 ring-1 ring-slate-600/10';
        }
    };

    return (
        <div className="flex h-[calc(100vh-2rem)] gap-4 p-4 max-w-[1600px] mx-auto animate-fade-in relative">

            {/* Main Content Area */}
            <div className={`flex-1 flex flex-col space-y-4 transition-all duration-300 ${selectedLead ? 'w-2/3' : 'w-full'}`}>
                {/* Header */}
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                            <span className="p-2 bg-indigo-50 rounded-lg text-indigo-600">
                                <Users className="w-6 h-6" />
                            </span>
                            Leads
                        </h1>
                        <p className="text-slate-500 text-sm mt-1">Manage pipeline and customer relationships</p>
                    </div>
                    <button
                        onClick={() => setShowModal(true)}
                        className="px-4 py-2.5 bg-indigo-600 text-white rounded-xl font-semibold shadow-lg shadow-indigo-200 hover:bg-indigo-700 hover:-translate-y-0.5 transition-all flex items-center gap-2"
                    >
                        <Plus className="w-4 h-4" />
                        <span>Add Lead</span>
                    </button>
                </div>

                {/* Stats Row */}
                <div className="grid grid-cols-4 gap-4">
                    <StatCard label="Total Leads" value={leads.length} color="indigo" icon={<Users className="w-4 h-4" />} />
                    <StatCard label="New" value={leads.filter(l => l.status === 'New').length} color="blue" icon={<Star className="w-4 h-4" />} />
                    <StatCard label="Pipeline" value={leads.filter(l => l.status === 'Contacted').length} color="purple" icon={<MessageSquare className="w-4 h-4" />} />
                    <StatCard label="Converted" value={leads.filter(l => l.status === 'Booked').length} color="green" icon={<CheckCircle className="w-4 h-4" />} />
                </div>

                {/* Data Grid */}
                <div className="bg-white rounded-2xl border border-slate-100 shadow-xl shadow-slate-200/50 flex flex-col flex-1 overflow-hidden">
                    {/* Toolbar */}
                    <div className="p-4 border-b border-slate-50 flex gap-3">
                        <div className="relative flex-1 max-w-sm">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <input
                                placeholder="Search leads..."
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

                    {/* Table */}
                    <div className="flex-1 overflow-auto">
                        <table className="w-full text-left border-collapse">
                            <thead className="bg-slate-50/50 sticky top-0 z-10 backdrop-blur-sm">
                                <tr>
                                    <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Name</th>
                                    <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Contact</th>
                                    <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                                    <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Service</th>
                                    <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Added</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {loading ? (
                                    <tr>
                                        <td colSpan="5" className="p-12 text-center text-slate-400">Loading...</td>
                                    </tr>
                                ) : filteredLeads.length === 0 ? (
                                    <tr>
                                        <td colSpan="5" className="p-12 text-center text-slate-400">No leads found</td>
                                    </tr>
                                ) : (
                                    filteredLeads.map((lead) => (
                                        <tr
                                            key={lead.id}
                                            onClick={() => setSelectedLead(lead)}
                                            className={`
                                                group cursor-pointer transition-all hover:bg-slate-50
                                                ${selectedLead?.id === lead.id ? 'bg-indigo-50/60' : ''}
                                            `}
                                        >
                                            <td className="px-4 py-3">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 text-indigo-700 flex items-center justify-center font-bold text-xs">
                                                        {lead.name.charAt(0)}
                                                    </div>
                                                    <span className="font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors">
                                                        {lead.name}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="flex flex-col text-sm">
                                                    <span className="text-slate-700 flex items-center gap-1.5">
                                                        <Mail className="w-3 h-3 text-slate-400" />
                                                        {lead.email}
                                                    </span>
                                                    {lead.phone && (
                                                        <span className="text-slate-500 flex items-center gap-1.5 mt-0.5">
                                                            <Phone className="w-3 h-3 text-slate-400" />
                                                            {lead.phone}
                                                        </span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-4 py-3">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(lead.status)}`}>
                                                    {lead.status}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-sm text-slate-600">
                                                {lead.service}
                                            </td>
                                            <td className="px-4 py-3 text-sm text-slate-500 text-right">
                                                {new Date(lead.createdAt).toLocaleDateString()}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Slide-over Details Panel */}
            <div className={`
                fixed inset-y-0 right-0 w-[400px] bg-white shadow-2xl transform transition-transform duration-300 ease-in-out z-50
                ${selectedLead ? 'translate-x-0' : 'translate-x-full'}
            `}>
                {selectedLead && (
                    <div className="h-full flex flex-col">
                        {/* Panel Header */}
                        <div className="p-6 border-b border-slate-100 bg-slate-50/50">
                            <div className="flex justify-between items-start mb-4">
                                <button
                                    onClick={() => setSelectedLead(null)}
                                    className="p-1 hover:bg-slate-200 rounded-full transition-colors"
                                >
                                    <ArrowRight className="w-5 h-5 text-slate-400" />
                                </button>
                                <div className="flex gap-2">
                                    <button className="p-2 bg-white border border-slate-200 rounded-lg text-slate-600 hover:border-indigo-200 hover:text-indigo-600 transition-colors">
                                        <Mail className="w-4 h-4" />
                                    </button>
                                    <button className="p-2 bg-white border border-slate-200 rounded-lg text-slate-600 hover:border-indigo-200 hover:text-indigo-600 transition-colors">
                                        <MessageSquare className="w-4 h-4" />
                                    </button>
                                    <button className="p-2 bg-white border border-slate-200 rounded-lg text-slate-600 hover:border-indigo-200 hover:text-indigo-600 transition-colors">
                                        <MoreHorizontal className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>

                            <div className="text-center mb-2">
                                <div className="w-20 h-20 mx-auto bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mb-3 shadow-lg shadow-indigo-200">
                                    {selectedLead.name.charAt(0)}
                                </div>
                                <h2 className="text-xl font-bold text-slate-900">{selectedLead.name}</h2>
                                <p className="text-sm text-slate-500">{selectedLead.email}</p>
                            </div>

                            <div className="flex justify-center mt-4">
                                <select
                                    value={selectedLead.status}
                                    onChange={(e) => handleStatusChange(selectedLead.id, e.target.value)}
                                    className={`px-3 py-1.5 rounded-full text-sm font-bold border-2 outline-none cursor-pointer ${getStatusColor(selectedLead.status).replace('ring-1', '')}`}
                                >
                                    {LEAD_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                                </select>
                            </div>
                        </div>

                        {/* Panel Body */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-6">
                            <div className="space-y-4">
                                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Contact Info</h3>
                                <div className="space-y-3">
                                    <div className="p-3 bg-slate-50 rounded-xl flex items-center gap-3">
                                        <Phone className="w-4 h-4 text-slate-400" />
                                        <span className="text-sm text-slate-700">{selectedLead.phone || 'No phone number'}</span>
                                    </div>
                                    <div className="p-3 bg-slate-50 rounded-xl flex items-center gap-3">
                                        <Clock className="w-4 h-4 text-slate-400" />
                                        <div className="flex flex-col">
                                            <span className="text-xs text-slate-400">Created</span>
                                            <span className="text-sm text-slate-700">{new Date(selectedLead.createdAt).toLocaleString()}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Notes</h3>
                                <div className="p-4 bg-yellow-50 border border-yellow-100 rounded-xl text-sm text-yellow-900 leading-relaxed">
                                    {selectedLead.notes || 'No notes added.'}
                                </div>
                            </div>

                            <div className="space-y-4">
                                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Activity</h3>
                                <div className="relative pl-4 border-l-2 border-slate-100 space-y-6">
                                    <div className="relative">
                                        <div className="absolute -left-[21px] top-1 w-3 h-3 rounded-full bg-indigo-500 border-2 border-white ring-2 ring-indigo-100"></div>
                                        <p className="text-sm text-slate-900 font-medium">Lead Created</p>
                                        <p className="text-xs text-slate-400">{new Date(selectedLead.createdAt).toLocaleString()}</p>
                                    </div>
                                    {/* Mock activity */}
                                    <div className="relative">
                                        <div className="absolute -left-[21px] top-1 w-3 h-3 rounded-full bg-slate-300 border-2 border-white"></div>
                                        <p className="text-sm text-slate-600">Status updated to {selectedLead.status}</p>
                                        <p className="text-xs text-slate-400">Just now</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Panel Footer */}
                        <div className="p-4 border-t border-slate-100 bg-slate-50">
                            {selectedLead.status !== 'Booked' ? (
                                <button className="w-full py-3 bg-indigo-600 text-white rounded-xl font-bold shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-all">
                                    Convert to Booking
                                </button>
                            ) : (
                                <button disabled className="w-full py-3 bg-slate-200 text-slate-500 rounded-xl font-bold cursor-not-allowed">
                                    Already Booked
                                </button>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* Add Lead Modal Overlay */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4 animate-fade-in">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-slide-in-up">
                        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                            <h2 className="text-lg font-bold text-slate-900">New Lead</h2>
                            <button onClick={() => setShowModal(false)} className="p-2 hover:bg-slate-200 rounded-lg transition-colors">
                                <X className="w-5 h-5 text-slate-500" />
                            </button>
                        </div>
                        <form onSubmit={handleCreateLead} className="p-6 space-y-4">
                            <div className="space-y-4">
                                <input
                                    placeholder="Full Name"
                                    required
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 transition-all outline-none"
                                />
                                <input
                                    type="email"
                                    placeholder="Email Address"
                                    required
                                    value={formData.email}
                                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 transition-all outline-none"
                                />
                                <input
                                    type="tel"
                                    placeholder="Phone Number"
                                    value={formData.phone}
                                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 transition-all outline-none"
                                />
                                <input
                                    placeholder="Service Interest"
                                    value={formData.service}
                                    onChange={e => setFormData({ ...formData, service: e.target.value })}
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 transition-all outline-none"
                                />
                            </div>
                            <button type="submit" className="w-full py-3.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all mt-6">
                                Create Lead
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

const StatCard = ({ label, value, color, icon }) => {
    const colorClasses = {
        indigo: 'bg-indigo-50 text-indigo-600',
        blue: 'bg-blue-50 text-blue-600',
        purple: 'bg-purple-50 text-purple-600',
        green: 'bg-emerald-50 text-emerald-600'
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

export default Leads;
