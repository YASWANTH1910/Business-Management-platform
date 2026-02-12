import { useNavigate } from 'react-router-dom';
import { useCareOps } from '../context/CareOpsContext';
import { FileText, Calendar, Package, AlertCircle, X, Clock } from 'lucide-react';

const AlertsPanel = ({ maxAlerts = null, showFilters = false }) => {
    const { alerts, markAlertAsRead, clearAlert } = useCareOps();
    const navigate = useNavigate();

    const getAlertIcon = (type) => {
        switch (type) {
            case 'Forms': return FileText;
            case 'Booking': return Calendar;
            case 'Inventory': return Package;
            case 'Integration': return AlertCircle;
            default: return AlertCircle;
        }
    };

    const getAlertColor = (severity) => {
        switch (severity) {
            case 'Critical': return {
                bg: 'bg-red-50',
                border: 'border-red-200',
                icon: 'text-red-600',
                badge: 'bg-red-100 text-red-700'
            };
            case 'Warning': return {
                bg: 'bg-yellow-50',
                border: 'border-yellow-200',
                icon: 'text-yellow-600',
                badge: 'bg-yellow-100 text-yellow-700'
            };
            case 'Info': return {
                bg: 'bg-blue-50',
                border: 'border-blue-200',
                icon: 'text-blue-600',
                badge: 'bg-blue-100 text-blue-700'
            };
            default: return {
                bg: 'bg-slate-50',
                border: 'border-slate-200',
                icon: 'text-slate-600',
                badge: 'bg-slate-100 text-slate-700'
            };
        }
    };

    const handleAlertClick = (alert) => {
        markAlertAsRead(alert.id);

        // Navigate to related entity
        if (alert.relatedEntity) {
            switch (alert.relatedEntity.type) {
                case 'booking':
                    navigate('/bookings');
                    break;
                case 'resource':
                    navigate('/inventory');
                    break;
                case 'form':
                    navigate('/forms');
                    break;
                default:
                    break;
            }
        }
    };

    const handleDismiss = (e, alertId) => {
        e.stopPropagation();
        clearAlert(alertId);
    };

    const getRelativeTime = (timestamp) => {
        const now = new Date();
        const alertTime = new Date(timestamp);
        const diffMs = now - alertTime;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return `${diffMins}m ago`;
        if (diffHours < 24) return `${diffHours}h ago`;
        return `${diffDays}d ago`;
    };

    // Sort alerts by severity and timestamp
    const sortedAlerts = [...alerts].sort((a, b) => {
        const severityOrder = { Critical: 0, Warning: 1, Info: 2 };
        if (severityOrder[a.severity] !== severityOrder[b.severity]) {
            return severityOrder[a.severity] - severityOrder[b.severity];
        }
        return new Date(b.timestamp) - new Date(a.timestamp);
    });

    const displayAlerts = maxAlerts ? sortedAlerts.slice(0, maxAlerts) : sortedAlerts;

    if (alerts.length === 0) {
        return (
            <div className="text-center py-8">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 rounded-full mb-3">
                    <AlertCircle className="w-6 h-6 text-green-600" />
                </div>
                <p className="text-slate-600 font-medium">All clear! No alerts at the moment.</p>
                <p className="text-sm text-slate-400 mt-1">We'll notify you when something needs attention</p>
            </div>
        );
    }

    return (
        <div className="space-y-3">
            {displayAlerts.map((alert) => {
                const Icon = getAlertIcon(alert.type);
                const colors = getAlertColor(alert.severity);

                return (
                    <div
                        key={alert.id}
                        onClick={() => handleAlertClick(alert)}
                        className={`${colors.bg} ${colors.border} border-2 rounded-xl p-4 cursor-pointer hover:shadow-md transition-all ${alert.read ? 'opacity-60' : ''
                            }`}
                    >
                        <div className="flex items-start space-x-3">
                            <div className={`p-2 bg-white rounded-lg ${colors.icon}`}>
                                <Icon className="w-5 h-5" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center space-x-2 mb-1">
                                    <span className={`px-2 py-1 rounded text-xs font-bold ${colors.badge}`}>
                                        {alert.severity}
                                    </span>
                                    <span className="px-2 py-1 bg-white rounded text-xs font-semibold text-slate-600">
                                        {alert.type}
                                    </span>
                                </div>
                                <p className="text-sm font-semibold text-slate-900 mb-1">
                                    {alert.message}
                                </p>
                                <div className="flex items-center space-x-1 text-xs text-slate-500">
                                    <Clock className="w-3 h-3" />
                                    <span>{getRelativeTime(alert.timestamp)}</span>
                                </div>
                            </div>
                            <button
                                onClick={(e) => handleDismiss(e, alert.id)}
                                className="p-1 hover:bg-white rounded-lg transition-colors"
                            >
                                <X className="w-4 h-4 text-slate-400 hover:text-slate-600" />
                            </button>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default AlertsPanel;
