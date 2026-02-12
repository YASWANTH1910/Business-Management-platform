import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCareOps } from '../context/CareOpsContext';
import { Users, Calendar, ClipboardList, MessageSquare, TrendingUp, Sparkles, Inbox, FileText, Package, Bell, Rocket, ArrowRight } from 'lucide-react';
import AlertsPanel from '../components/AlertsPanel';

const Dashboard = () => {
    const { business, leads, bookings, forms, workspaceStatus, alerts, formSubmissions, resources, canActivateWorkspace } = useCareOps();
    const navigate = useNavigate();

    useEffect(() => {
        if (!business) {
            navigate('/');
        }
    }, [business, navigate]);

    if (!business) return null;

    // Show limited view if workspace is not active
    if (workspaceStatus === 'inactive') {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
                <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-amber-500 to-orange-600 rounded-full mb-6 shadow-lg">
                        <Sparkles className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-2xl font-bold text-slate-900 mb-4">Complete Onboarding First</h1>
                    <p className="text-slate-600 mb-6">
                        Your workspace is not fully set up yet. Please complete the onboarding process to unlock full dashboard access.
                    </p>
                    <button
                        onClick={() => navigate('/onboarding')}
                        className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                    >
                        Continue Onboarding →
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50 to-purple-50">
            {/* Header with Gradient */}
            <header className="bg-white shadow-lg border-b border-slate-100 sticky top-0 z-50 backdrop-blur-sm bg-white/95">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-4">
                            <div className="bg-gradient-to-br from-indigo-600 to-purple-600 p-3 rounded-2xl shadow-lg transform hover:scale-110 transition-transform duration-300">
                                <Sparkles className="text-white font-bold text-xl w-6 h-6" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                                    CareOps
                                </h1>
                                <p className="text-xs text-slate-500">Business Management</p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-4">
                            <div className="relative">
                                <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors relative">
                                    <Bell className="w-5 h-5 text-slate-600" />
                                    {alerts.filter(a => !a.read).length > 0 && (
                                        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                                            {alerts.filter(a => !a.read).length}
                                        </span>
                                    )}
                                </button>
                            </div>
                            <div className="text-right hidden sm:block">
                                <p className="text-xs text-slate-500">Welcome back,</p>
                                <span className="font-bold text-slate-900">{business.name}</span>
                            </div>
                            <div className="h-12 w-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg border-4 border-white shadow-lg transform hover:scale-110 transition-transform duration-300 cursor-pointer">
                                {business.name.charAt(0)}
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Welcome Banner */}
                <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-2xl p-8 mb-8 text-white shadow-xl animate-fade-in">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-3xl font-bold mb-2">Welcome back, {business.name}! 👋</h2>
                            <p className="text-indigo-100 text-lg">Here's what's happening with your business today</p>
                        </div>
                        <TrendingUp className="w-16 h-16 opacity-50 hidden md:block" />
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="mb-8">
                    <h3 className="text-xl font-bold text-slate-900 mb-4">Quick Actions</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <ActionCard
                            title="Manage Leads"
                            description="View and manage customer leads"
                            icon={<Users className="h-6 w-6" />}
                            onClick={() => navigate('/leads')}
                            color="indigo"
                        />
                        <ActionCard
                            title="Inbox"
                            description="View customer conversations"
                            icon={<Inbox className="h-6 w-6" />}
                            onClick={() => navigate('/inbox')}
                            color="purple"
                        />
                        <ActionCard
                            title="Bookings"
                            description="Manage appointments"
                            icon={<Calendar className="h-6 w-6" />}
                            onClick={() => navigate('/bookings')}
                            color="pink"
                        />
                        <ActionCard
                            title="Manage Staff"
                            description="View and manage team members"
                            icon={<Users className="h-6 w-6" />}
                            onClick={() => navigate('/staff')}
                            color="emerald"
                        />
                        <ActionCard
                            title="Forms"
                            description="Manage customer forms"
                            icon={<FileText className="h-6 w-6" />}
                            onClick={() => navigate('/forms')}
                            color="teal"
                        />
                        <ActionCard
                            title="Inventory"
                            description="Track resources and stock"
                            icon={<Package className="h-6 w-6" />}
                            onClick={() => navigate('/inventory')}
                            color="amber"
                        />
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <StatCard
                        title="Total Leads"
                        value={leads.length}
                        icon={<Users className="h-7 w-7" />}
                        trend={`${leads.filter(l => l.status === 'New').length} new inquiries`}
                        color="indigo"
                        delay="0s"
                    />
                    <StatCard
                        title="New Leads"
                        value={leads.filter(l => l.status === 'New').length}
                        icon={<Users className="h-7 w-7" />}
                        trend="Awaiting contact"
                        color="emerald"
                        delay="0.1s"
                    />
                    <StatCard
                        title="Booked Leads"
                        value={leads.filter(l => l.status === 'Booked').length}
                        icon={<Calendar className="h-7 w-7" />}
                        trend="Successfully converted"
                        color="amber"
                        delay="0.2s"
                    />
                </div>

                {/* Activation Prompt */}
                {workspaceStatus === 'inactive' && (
                    <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl shadow-xl border-2 border-indigo-200 p-8 mb-8 animate-fade-in">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                                <div className="h-14 w-14 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center">
                                    <Rocket className="h-7 w-7 text-white" />
                                </div>
                                <div>
                                    <h3 className="text-2xl font-bold text-slate-900">Ready to Go Live?</h3>
                                    <p className="text-slate-600">
                                        {canActivateWorkspace()
                                            ? 'All requirements met! Activate your workspace to start accepting bookings.'
                                            : 'Complete the setup checklist to activate your workspace'}
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={() => navigate('/activate')}
                                className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold rounded-xl hover:shadow-lg transition-all flex items-center space-x-2"
                            >
                                <span>Activate Workspace</span>
                                <ArrowRight className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                )}

                {/* Alerts Section */}
                {alerts.length > 0 && (
                    <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-8 mb-8 animate-fade-in">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center space-x-4">
                                <div className="h-14 w-14 bg-gradient-to-br from-red-100 to-orange-100 rounded-2xl flex items-center justify-center">
                                    <Bell className="h-7 w-7 text-red-600" />
                                </div>
                                <div>
                                    <h3 className="text-2xl font-bold text-slate-900">Attention Required</h3>
                                    <p className="text-slate-600">{alerts.filter(a => !a.read).length} items need your attention</p>
                                </div>
                            </div>
                        </div>
                        <AlertsPanel maxAlerts={3} />
                        {alerts.length > 3 && (
                            <div className="mt-4 text-center">
                                <p className="text-sm text-slate-500">
                                    Showing top 3 alerts • {alerts.length - 3} more alerts available
                                </p>
                            </div>
                        )}
                    </div>
                )}

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <StatCard
                        title="Total Leads"
                        value={leads.length}
                        icon={<Users className="h-7 w-7" />}
                        trend={`${leads.filter(l => l.status === 'New').length} new inquiries`}
                        color="indigo"
                        delay="0s"
                    />
                    <StatCard
                        title="Pending Forms"
                        value={formSubmissions.filter(f => f.status === 'Sent' || f.status === 'Pending').length}
                        icon={<FileText className="h-7 w-7" />}
                        trend="Awaiting completion"
                        color="amber"
                        delay="0.1s"
                    />
                    <StatCard
                        title="Low Stock Items"
                        value={resources.filter(r => r.quantity <= r.threshold && r.quantity > 0).length}
                        icon={<Package className="h-7 w-7" />}
                        trend="Need restocking"
                        color="emerald"
                        delay="0.2s" />
                </div>

                {/* Main Content Area - Leads Management */}
                <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-8 animate-fade-in">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center space-x-4">
                            <div className="h-14 w-14 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-2xl flex items-center justify-center">
                                <Users className="h-7 w-7 text-indigo-600" />
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold text-slate-900">Leads Management</h3>
                                <p className="text-slate-600">Track and manage customer inquiries</p>
                            </div>
                        </div>
                        <button
                            onClick={() => navigate('/leads')}
                            className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300"
                        >
                            View All Leads →
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                        {/* Team Access Card */}
                        <div
                            onClick={() => navigate('/staff')}
                            className="bg-slate-50 rounded-xl p-6 border border-slate-100 cursor-pointer hover:bg-slate-100 hover:shadow-md transition-all group"
                        >
                            <div className="flex items-center justify-between mb-4">
                                <div className="p-3 bg-white rounded-lg shadow-sm group-hover:scale-110 transition-transform">
                                    <Users className="w-6 h-6 text-indigo-600" />
                                </div>
                                <span className="bg-indigo-100 text-indigo-700 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                                    Team
                                </span>
                            </div>
                            <h3 className="text-lg font-bold text-slate-900 mb-1">Staff Access</h3>
                            <p className="text-slate-600 text-sm">Manage team roles and permissions</p>
                        </div>

                        {/* Settings Card */}
                        <div
                            onClick={() => navigate('/settings')}
                            className="bg-slate-50 rounded-xl p-6 border border-slate-100 cursor-pointer hover:bg-slate-100 hover:shadow-md transition-all group"
                        >
                            <div className="flex items-center justify-between mb-4">
                                <div className="p-3 bg-white rounded-lg shadow-sm group-hover:scale-110 transition-transform">
                                    <Sparkles className="w-6 h-6 text-slate-600" />
                                </div>
                                <span className="bg-amber-100 text-amber-700 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider border border-amber-200">
                                    Owner Only
                                </span>
                            </div>
                            <h3 className="text-lg font-bold text-slate-900 mb-1">System Settings</h3>
                            <p className="text-slate-600 text-sm">Configure business preferences</p>
                        </div>
                    </div>

                    {/* Quick Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                        <QuickStat label="Total" value={leads.length} color="slate" />
                        <QuickStat label="New" value={leads.filter(l => l.status === 'New').length} color="blue" />
                        <QuickStat label="Contacted" value={leads.filter(l => l.status === 'Contacted').length} color="purple" />
                        <QuickStat label="Booked" value={leads.filter(l => l.status === 'Booked').length} color="green" />
                    </div>

                    {/* Recent Leads Preview */}
                    {leads.length > 0 ? (
                        <div className="border-t border-slate-100 pt-6">
                            <h4 className="text-sm font-bold text-slate-700 uppercase tracking-wider mb-4">Recent Leads</h4>
                            <div className="space-y-3">
                                {leads.slice(-3).reverse().map((lead) => (
                                    <div key={lead.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors">
                                        <div className="flex items-center space-x-3">
                                            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold">
                                                {lead.name.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="font-semibold text-slate-900">{lead.name}</p>
                                                <p className="text-sm text-slate-600">{lead.service}</p>
                                            </div>
                                        </div>
                                        <span className={`px-3 py-1 rounded-lg text-xs font-semibold ${lead.status === 'New' ? 'bg-blue-100 text-blue-700' :
                                            lead.status === 'Contacted' ? 'bg-purple-100 text-purple-700' :
                                                lead.status === 'Booked' ? 'bg-green-100 text-green-700' :
                                                    'bg-red-100 text-red-700'
                                            }`}>
                                            {lead.status}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="text-center py-8 border-t border-slate-100">
                            <p className="text-slate-600 mb-4">No leads yet. Start tracking customer inquiries!</p>
                            <button
                                onClick={() => navigate('/leads')}
                                className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300"
                            >
                                <Users className="w-5 h-5" />
                                <span>Go to Leads</span>
                            </button>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

const QuickStat = ({ label, value, color }) => {
    const colorClasses = {
        slate: 'text-slate-700 bg-slate-100',
        blue: 'text-blue-700 bg-blue-100',
        purple: 'text-purple-700 bg-purple-100',
        green: 'text-green-700 bg-green-100'
    };

    return (
        <div className={`${colorClasses[color]} rounded-xl p-4 text-center`}>
            <p className="text-2xl font-bold">{value}</p>
            <p className="text-xs font-semibold uppercase tracking-wider mt-1">{label}</p>
        </div>
    );
};

// Action Card Component
const ActionCard = ({ title, description, icon, onClick, color }) => {
    const colorClasses = {
        indigo: 'from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700',
        purple: 'from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700',
        pink: 'from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700',
        emerald: 'from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700',
        teal: 'from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700',
        amber: 'from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700',
    };

    return (
        <div
            onClick={onClick}
            className={`bg-gradient-to-br ${colorClasses[color]} rounded-xl p-6 text-white cursor-pointer hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300`}
        >
            <div className="flex items-center justify-between mb-3">
                <div className="p-3 bg-white/20 rounded-lg backdrop-blur-sm">
                    {icon}
                </div>
            </div>
            <h3 className="text-lg font-bold mb-1">{title}</h3>
            <p className="text-sm opacity-90">{description}</p>
        </div>
    );
};

const StatCard = ({ title, value, icon, trend, color, delay }) => {
    const colorClasses = {
        indigo: {
            bg: 'from-indigo-500 to-indigo-600',
            text: 'text-indigo-600',
            iconBg: 'bg-indigo-50',
            border: 'border-indigo-100'
        },
        emerald: {
            bg: 'from-emerald-500 to-emerald-600',
            text: 'text-emerald-600',
            iconBg: 'bg-emerald-50',
            border: 'border-emerald-100'
        },
        amber: {
            bg: 'from-amber-500 to-amber-600',
            text: 'text-amber-600',
            iconBg: 'bg-amber-50',
            border: 'border-amber-100'
        }
    };

    const colors = colorClasses[color];

    return (
        <div
            className={`bg-white rounded-2xl p-6 shadow-lg border-2 ${colors.border} card-hover animate-slide-in relative overflow-hidden`}
            style={{ animationDelay: delay }}
        >
            {/* Gradient Accent */}
            <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${colors.bg} opacity-5 rounded-full -mr-16 -mt-16`}></div>

            <div className="flex items-center justify-between mb-4 relative z-10">
                <h3 className="text-slate-600 font-bold text-sm uppercase tracking-wider">{title}</h3>
                <div className={`p-3 ${colors.iconBg} rounded-xl ${colors.text}`}>
                    {icon}
                </div>
            </div>
            <div className="flex items-end space-x-2 relative z-10">
                <span className={`text-4xl font-bold bg-gradient-to-r ${colors.bg} bg-clip-text text-transparent`}>
                    {value}
                </span>
            </div>
            <p className="text-xs text-slate-500 mt-3 font-medium relative z-10">{trend}</p>
        </div>
    );
};

export default Dashboard;
