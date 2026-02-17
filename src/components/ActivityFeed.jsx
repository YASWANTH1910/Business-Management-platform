import { useNavigate } from 'react-router-dom';
import { useCareOps } from '../context/CareOpsContext';
import {
    Clock,
    CheckCircle2,
    AlertCircle,
    MessageSquare,
    FileText,
    Package,
    Calendar,
    ChevronRight
} from 'lucide-react';

const ActivityFeed = ({ maxItems = 10 }) => {
    const { alerts, markAlertAsRead } = useCareOps();
    const navigate = useNavigate();

    // Mapping icons to activity types
    const getIcon = (type) => {
        switch (type) {
            case 'Booking': return Calendar;
            case 'Conversation': return MessageSquare;
            case 'Forms': return FileText;
            case 'Inventory': return Package;
            case 'System': return AlertCircle;
            default: return Clock;
        }
    };

    // Mapping colors to severity
    const getStyles = (severity) => {
        switch (severity) {
            case 'Critical': return 'bg-red-100 text-red-600 border-red-200';
            case 'Warning': return 'bg-amber-100 text-amber-600 border-amber-200';
            case 'Success': return 'bg-green-100 text-green-600 border-green-200';
            default: return 'bg-slate-100 text-slate-600 border-slate-200';
        }
    };

    const handleItemClick = (alert) => {
        markAlertAsRead(alert.id);
        if (alert.relatedEntity) {
            switch (alert.relatedEntity.type) {
                case 'booking': navigate('/bookings'); break;
                case 'conversation': navigate('/inbox'); break;
                case 'form': navigate('/forms'); break;
                case 'resource': navigate('/inventory'); break;
                default: break;
            }
        }
    };

    const formatTime = (isoString) => {
        const date = new Date(isoString);
        const now = new Date();
        const diffInMinutes = Math.floor((now - date) / 60000);

        if (diffInMinutes < 1) return 'Just now';
        if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
        if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
        return `${Math.floor(diffInMinutes / 1440)}d ago`;
    };

    // Sorting alerts by timestamp (newest first)
    const sortedActivities = [...alerts].sort((a, b) =>
        new Date(b.timestamp) - new Date(a.timestamp)
    );

    const displayActivities = maxItems ? sortedActivities.slice(0, maxItems) : sortedActivities;

    if (displayActivities.length === 0) {
        return (
            <div className="text-center py-12 px-4 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                <div className="bg-white p-3 rounded-full shadow-sm inline-block mb-3">
                    <CheckCircle2 className="w-6 h-6 text-green-500" />
                </div>
                <p className="text-slate-900 font-medium">All caught up!</p>
                <p className="text-slate-500 text-sm">No new activities to report.</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {displayActivities.map((activity, index) => {
                const Icon = getIcon(activity.type);
                const styles = getStyles(activity.severity);

                return (
                    <div
                        key={activity.id}
                        onClick={() => handleItemClick(activity)}
                        className={`
                            group flex items-start space-x-3 p-3 rounded-xl border border-transparent
                            hover:bg-slate-50 hover:border-slate-100 transition-all cursor-pointer
                            ${!activity.read ? 'bg-indigo-50/30' : ''}
                        `}
                    >
                        {/* Icon Timeline Connector */}
                        <div className="relative">
                            <div className={`p-2 rounded-lg border ${styles} relative z-10`}>
                                <Icon className="w-4 h-4" />
                            </div>
                            {index !== displayActivities.length - 1 && (
                                <div className="absolute top-8 left-1/2 -translate-x-1/2 w-0.5 h-10 bg-slate-100 -z-0" />
                            )}
                        </div>

                        <div className="flex-1 min-w-0 pt-0.5">
                            <div className="flex justify-between items-center mb-1">
                                <span className={`
                                    text-xs font-bold px-2 py-0.5 rounded-full
                                    ${activity.severity === 'Critical' ? 'bg-red-50 text-red-700' : 'bg-slate-100 text-slate-600'}
                                `}>
                                    {activity.type}
                                </span>
                                <span className="text-xs text-slate-400 font-mono">
                                    {formatTime(activity.timestamp)}
                                </span>
                            </div>
                            <p className={`text-sm text-slate-900 ${!activity.read ? 'font-semibold' : 'font-medium'}`}>
                                {activity.message}
                            </p>
                        </div>

                        <div className="opacity-0 group-hover:opacity-100 transition-opacity self-center">
                            <ChevronRight className="w-4 h-4 text-slate-400" />
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default ActivityFeed;
