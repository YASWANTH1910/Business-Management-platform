
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCareOps } from '../context/CareOpsContext';
import bookingService from '../services/booking.service';
import contactService from '../services/contact.service';
import formService from '../services/form.service';
import inventoryService from '../services/inventory.service';
import conversationService from '../services/conversation.service';
import {
    Users,
    Calendar,
    MessageSquare,
    FileText,
    Package,
    Sparkles,
    ArrowRight
} from 'lucide-react';
import StatCard from '../components/StatCard';
import ActivityFeed from '../components/ActivityFeed';
import QuickActions from '../components/QuickActions';

const Dashboard = () => {
    const {
        business,
        workspaceStatus,
        canActivateWorkspace,
        loading: globalLoading // Get global loading state
    } = useCareOps();

    const navigate = useNavigate();
    const [loadingMetrics, setLoadingMetrics] = useState(true);
    // ... stats state ...

    useEffect(() => {
        if (!globalLoading && workspaceStatus === 'active') {
            fetchDashboardData();
        } else if (!globalLoading && workspaceStatus !== 'active') {
            setLoadingMetrics(false);
        }
    }, [workspaceStatus, globalLoading]);

    // ... fetchDashboardData ...

    if (globalLoading || (loadingMetrics && workspaceStatus === 'active')) {
        return (
            <div className="flex h-[80vh] items-center justify-center">
                <div className="flex flex-col items-center space-y-4">
                    <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
                    <p className="text-slate-500 font-medium">Loading your dashboard...</p>
                </div>
            </div>
        );
    }

    // If not loading and no business, unauthorized
    if (!business) {
        return (
            <div className="flex h-[80vh] items-center justify-center flex-col gap-4">
                <h2 className="text-xl font-bold text-slate-800">Session Expired</h2>
                <button onClick={() => window.location.reload()} className="px-4 py-2 bg-indigo-600 text-white rounded-lg">
                    Reload Page
                </button>
            </div>
        );
    }

    // --- Render Inactive State ---
    if (workspaceStatus === 'inactive') {
        return (
            <div className="min-h-[80vh] flex items-center justify-center p-4">
                <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center border border-slate-100">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl mb-6 shadow-lg rotate-3 hover:rotate-6 transition-transform">
                        <Sparkles className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-2xl font-bold text-slate-900 mb-2">Welcome to CareOps!</h1>
                    <p className="text-slate-600 mb-8">
                        Your workspace is almost ready. Complete the setup to unlock the full dashboard.
                    </p>

                    <button
                        onClick={() => navigate(canActivateWorkspace() ? '/activate' : '/onboarding')}
                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-xl transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 flex items-center justify-center space-x-2"
                    >
                        <span>{canActivateWorkspace() ? 'Activate Workspace' : 'Continue Setup'}</span>
                        <ArrowRight className="w-5 h-5" />
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-fade-in pb-10">
            {/* Welcome Section */}
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">
                        Dashboard
                    </h1>
                    <p className="text-slate-500 mt-1">
                        Here's what's happening with your business today.
                    </p>
                </div>
                <div className="hidden sm:block text-sm text-slate-500 bg-white px-3 py-1 rounded-full border border-slate-200 shadow-sm">
                    {new Date().toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </div>
            </div>

            {/* Top Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
                <StatCard
                    title="Today's Bookings"
                    value={stats.bookingsToday}
                    icon={Calendar}
                    color="indigo"
                    onClick={() => navigate('/bookings')}
                />
                <StatCard
                    title="Upcoming"
                    value={stats.bookingsUpcoming}
                    icon={Calendar}
                    color="purple"
                    onClick={() => navigate('/bookings')}
                />
                <StatCard
                    title="Pending Forms"
                    value={stats.pendingForms}
                    icon={FileText}
                    color="yellow"
                    onClick={() => navigate('/forms')}
                />
                <StatCard
                    title="Unread Messages"
                    value={stats.unreadMessages}
                    icon={MessageSquare}
                    color="blue"
                    onClick={() => navigate('/inbox')}
                />
                <StatCard
                    title="Inventory Alerts"
                    value={stats.inventoryAlerts}
                    icon={Package}
                    color={stats.inventoryAlerts > 0 ? 'red' : 'green'}
                    onClick={() => navigate('/inventory')}
                />
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Left Column: Activity Feed (2/3 width) */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                        <div className="p-4 border-b border-slate-50 flex justify-between items-center">
                            <h2 className="text-lg font-bold text-slate-900">Activity Feed</h2>
                            <button className="text-sm text-indigo-600 font-medium hover:text-indigo-800">
                                View All
                            </button>
                        </div>
                        <div className="p-2">
                            <ActivityFeed maxItems={8} />
                        </div>
                    </div>
                </div>

                {/* Right Column: Quick Actions & Summary (1/3 width) */}
                <div className="space-y-6">
                    <QuickActions />

                    {/* Mini CRM Summary */}
                    <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm">
                        <h3 className="text-lg font-bold text-slate-900 mb-4">Contact Overview</h3>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center p-3 bg-slate-50 rounded-xl">
                                <div className="flex items-center space-x-3">
                                    <div className="p-2 bg-white rounded-lg shadow-sm text-indigo-600">
                                        <Users className="w-5 h-5" />
                                    </div>
                                    <span className="font-medium text-slate-700">Total Contacts</span>
                                </div>
                                <span className="font-bold text-slate-900">{stats.totalContacts}</span>
                            </div>
                            <button
                                onClick={() => navigate('/leads')}
                                className="w-full py-2 text-sm text-center text-slate-500 hover:text-indigo-600 font-medium border border-dashed border-slate-300 rounded-xl hover:border-indigo-300 hover:bg-indigo-50 transition-all"
                            >
                                View all contacts
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
