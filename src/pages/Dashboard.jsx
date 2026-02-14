import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCareOps } from '../context/CareOpsContext';
import { Users, Calendar, ClipboardList, MessageSquare, TrendingUp, Sparkles, Inbox, FileText, Package, Bell, Rocket, ArrowRight, CheckCircle2, AlertCircle, Clock } from 'lucide-react';
import AlertsPanel from '../components/AlertsPanel';

const Dashboard = () => {
    const { business, leads, bookings, forms, workspaceStatus, alerts, formSubmissions, resources, canActivateWorkspace, conversations } = useCareOps();
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

    // Helper functions for metrics
    const getTodaysBookings = () => {
        const today = new Date().toISOString().split('T')[0];
        return bookings.filter(b => b.date === today);
    };

    const getUpcomingBookings = () => {
        const today = new Date();
        const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
        return bookings.filter(b => {
            const bookingDate = new Date(b.date);
            return bookingDate >= today && bookingDate <= nextWeek;
        });
    };

    const getCompletedBookings = () => {
        return bookings.filter(b => b.status === 'Completed').length;
    };

    const getNoShowBookings = () => {
        return bookings.filter(b => b.status === 'No-show').length;
    };

    const getNewInquiries = () => {
        return leads.filter(l => l.status === 'New').length;
    };

    const getOngoingConversations = () => {
        return conversations.filter(c => c.status === 'New' || c.status === 'Open').length;
    };

    const getUnansweredMessages = () => {
        return conversations.filter(c => {
            if (c.messages.length === 0) return false;
            const lastMessage = c.messages[c.messages.length - 1];
            return lastMessage.sender === 'customer';
        }).length;
    };

    const getPendingForms = () => {
        return formSubmissions.filter(f => f.status === 'Sent' || f.status === 'Pending').length;
    };

    const getOverdueForms = () => {
        const now = new Date();
        const fortyEightHoursAgo = new Date(now.getTime() - 48 * 60 * 60 * 1000);
        return formSubmissions.filter(f => {
            if (f.status !== 'Sent' && f.status !== 'Pending') return false;
            const sentDate = new Date(f.sentAt);
            return sentDate < fortyEightHoursAgo;
        }).length;
    };

    const getCompletedForms = () => {
        return formSubmissions.filter(f => f.status === 'Completed').length;
    };

    const getLowStockItems = () => {
        return resources.filter(r => r.quantity <= r.threshold && r.quantity > 0).length;
    };

    const getCriticalInventory = () => {
        return resources.filter(r => r.quantity === 0).length;
    };

    const todaysBookings = getTodaysBookings();
    const upcomingBookings = getUpcomingBookings();

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
                                <p className="text-xs text-slate-500">Business Dashboard</p>
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

                {/* SECTION 1: Booking Overview */}
                <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-8 mb-8 animate-fade-in">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center space-x-4">
                            <div className="h-14 w-14 bg-gradient-to-br from-pink-100 to-pink-200 rounded-2xl flex items-center justify-center">
                                <Calendar className="h-7 w-7 text-pink-600" />
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold text-slate-900">Booking Overview</h3>
                                <p className="text-slate-600">Today's appointments and upcoming schedule</p>
                            </div>
                        </div>
                        <button
                            onClick={() => navigate('/bookings')}
                            className="px-4 py-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors flex items-center space-x-2"
                        >
                            <span>View All</span>
                            <ArrowRight className="w-4 h-4" />
                        </button>
                    </div>

                    {bookings.length === 0 ? (
                        <div className="text-center py-8 bg-green-50 rounded-xl border-2 border-green-200">
                            <CheckCircle2 className="w-12 h-12 text-green-600 mx-auto mb-3" />
                            <p className="text-green-900 font-semibold mb-1">No upcoming bookings</p>
                            <p className="text-sm text-green-700">Your schedule is clear</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <MetricCard
                                label="Today's Bookings"
                                value={todaysBookings.length}
                                icon={<Calendar className="w-5 h-5" />}
                                color="blue"
                            />
                            <MetricCard
                                label="Upcoming (7 days)"
                                value={upcomingBookings.length}
                                icon={<Clock className="w-5 h-5" />}
                                color="purple"
                            />
                            <MetricCard
                                label="Completed"
                                value={getCompletedBookings()}
                                icon={<CheckCircle2 className="w-5 h-5" />}
                                color="green"
                            />
                            <MetricCard
                                label="No-shows"
                                value={getNoShowBookings()}
                                icon={<AlertCircle className="w-5 h-5" />}
                                color="red"
                            />
                        </div>
                    )}
                </div>

                {/* SECTION 2: Leads & Conversations */}
                <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-8 mb-8 animate-fade-in">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center space-x-4">
                            <div className="h-14 w-14 bg-gradient-to-br from-indigo-100 to-indigo-200 rounded-2xl flex items-center justify-center">
                                <MessageSquare className="h-7 w-7 text-indigo-600" />
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold text-slate-900">Leads & Conversations</h3>
                                <p className="text-slate-600">Customer inquiries and ongoing discussions</p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-2">
                            <button
                                onClick={() => navigate('/leads')}
                                className="px-4 py-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors flex items-center space-x-2"
                            >
                                <span>Leads</span>
                                <ArrowRight className="w-4 h-4" />
                            </button>
                            <button
                                onClick={() => navigate('/inbox')}
                                className="px-4 py-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors flex items-center space-x-2"
                            >
                                <span>Inbox</span>
                                <ArrowRight className="w-4 h-4" />
                            </button>
                        </div>
                    </div>

                    {leads.length === 0 && conversations.length === 0 ? (
                        <div className="text-center py-8 bg-green-50 rounded-xl border-2 border-green-200">
                            <CheckCircle2 className="w-12 h-12 text-green-600 mx-auto mb-3" />
                            <p className="text-green-900 font-semibold mb-1">All messages responded</p>
                            <p className="text-sm text-green-700">No pending inquiries</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <MetricCard
                                label="New Inquiries"
                                value={getNewInquiries()}
                                icon={<Users className="w-5 h-5" />}
                                color="blue"
                            />
                            <MetricCard
                                label="Ongoing Conversations"
                                value={getOngoingConversations()}
                                icon={<MessageSquare className="w-5 h-5" />}
                                color="purple"
                            />
                            <MetricCard
                                label="Unanswered Messages"
                                value={getUnansweredMessages()}
                                icon={<Inbox className="w-5 h-5" />}
                                color={getUnansweredMessages() > 0 ? "red" : "green"}
                            />
                        </div>
                    )}
                </div>

                {/* SECTION 3: Forms Status */}
                <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-8 mb-8 animate-fade-in">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center space-x-4">
                            <div className="h-14 w-14 bg-gradient-to-br from-teal-100 to-teal-200 rounded-2xl flex items-center justify-center">
                                <FileText className="h-7 w-7 text-teal-600" />
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold text-slate-900">Forms Status</h3>
                                <p className="text-slate-600">Customer form submissions and completion</p>
                            </div>
                        </div>
                        <button
                            onClick={() => navigate('/forms')}
                            className="px-4 py-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors flex items-center space-x-2"
                        >
                            <span>View All</span>
                            <ArrowRight className="w-4 h-4" />
                        </button>
                    </div>

                    {formSubmissions.length === 0 ? (
                        <div className="text-center py-8 bg-green-50 rounded-xl border-2 border-green-200">
                            <CheckCircle2 className="w-12 h-12 text-green-600 mx-auto mb-3" />
                            <p className="text-green-900 font-semibold mb-1">No pending forms</p>
                            <p className="text-sm text-green-700">All forms are up to date</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <MetricCard
                                label="Pending Forms"
                                value={getPendingForms()}
                                icon={<Clock className="w-5 h-5" />}
                                color="yellow"
                            />
                            <MetricCard
                                label="Overdue Forms"
                                value={getOverdueForms()}
                                icon={<AlertCircle className="w-5 h-5" />}
                                color={getOverdueForms() > 0 ? "red" : "green"}
                            />
                            <MetricCard
                                label="Completed Forms"
                                value={getCompletedForms()}
                                icon={<CheckCircle2 className="w-5 h-5" />}
                                color="green"
                            />
                        </div>
                    )}
                </div>

                {/* SECTION 4: Inventory Alerts */}
                <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-8 mb-8 animate-fade-in">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center space-x-4">
                            <div className="h-14 w-14 bg-gradient-to-br from-amber-100 to-amber-200 rounded-2xl flex items-center justify-center">
                                <Package className="h-7 w-7 text-amber-600" />
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold text-slate-900">Inventory Alerts</h3>
                                <p className="text-slate-600">Stock levels and resource availability</p>
                            </div>
                        </div>
                        <button
                            onClick={() => navigate('/inventory')}
                            className="px-4 py-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors flex items-center space-x-2"
                        >
                            <span>View All</span>
                            <ArrowRight className="w-4 h-4" />
                        </button>
                    </div>

                    {resources.length === 0 || (getLowStockItems() === 0 && getCriticalInventory() === 0) ? (
                        <div className="text-center py-8 bg-green-50 rounded-xl border-2 border-green-200">
                            <CheckCircle2 className="w-12 h-12 text-green-600 mx-auto mb-3" />
                            <p className="text-green-900 font-semibold mb-1">Inventory levels healthy</p>
                            <p className="text-sm text-green-700">All items are well stocked</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <MetricCard
                                label="Low Stock Items"
                                value={getLowStockItems()}
                                icon={<Package className="w-5 h-5" />}
                                color="yellow"
                            />
                            <MetricCard
                                label="Critical (Out of Stock)"
                                value={getCriticalInventory()}
                                icon={<AlertCircle className="w-5 h-5" />}
                                color={getCriticalInventory() > 0 ? "red" : "green"}
                            />
                        </div>
                    )}
                </div>

                {/* SECTION 5: Key Alerts */}
                <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-8 animate-fade-in">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center space-x-4">
                            <div className="h-14 w-14 bg-gradient-to-br from-red-100 to-orange-100 rounded-2xl flex items-center justify-center">
                                <Bell className="h-7 w-7 text-red-600" />
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold text-slate-900">Key Alerts</h3>
                                <p className="text-slate-600">
                                    {alerts.filter(a => !a.read).length > 0
                                        ? `${alerts.filter(a => !a.read).length} items need your attention`
                                        : 'All systems running smoothly'}
                                </p>
                            </div>
                        </div>
                    </div>
                    <AlertsPanel maxAlerts={null} showGrouping={true} />
                </div>
            </main>
        </div>
    );
};

// Metric Card Component
const MetricCard = ({ label, value, icon, color }) => {
    const colorClasses = {
        blue: {
            bg: 'bg-blue-50',
            text: 'text-blue-700',
            icon: 'text-blue-600'
        },
        purple: {
            bg: 'bg-purple-50',
            text: 'text-purple-700',
            icon: 'text-purple-600'
        },
        green: {
            bg: 'bg-green-50',
            text: 'text-green-700',
            icon: 'text-green-600'
        },
        red: {
            bg: 'bg-red-50',
            text: 'text-red-700',
            icon: 'text-red-600'
        },
        yellow: {
            bg: 'bg-yellow-50',
            text: 'text-yellow-700',
            icon: 'text-yellow-600'
        }
    };

    const colors = colorClasses[color] || colorClasses.blue;

    return (
        <div className={`${colors.bg} rounded-xl p-6 border-2 border-${color}-200`}>
            <div className="flex items-center justify-between mb-3">
                <div className={`p-2 bg-white rounded-lg ${colors.icon}`}>
                    {icon}
                </div>
            </div>
            <p className={`text-3xl font-bold ${colors.text} mb-1`}>{value}</p>
            <p className="text-sm font-semibold text-slate-600">{label}</p>
        </div>
    );
};

export default Dashboard;
