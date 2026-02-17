const StatusBadge = ({ status, type = 'default' }) => {
    const getStatusConfig = () => {
        // Booking statuses
        if (type === 'booking') {
            switch (status) {
                case 'Confirmed':
                    return { color: 'bg-green-100 text-green-700 border-green-200', icon: '✅' };
                case 'Pending':
                    return { color: 'bg-yellow-100 text-yellow-700 border-yellow-200', icon: '⏳' };
                case 'Cancelled':
                    return { color: 'bg-red-100 text-red-700 border-red-200', icon: '❌' };
                case 'Completed':
                    return { color: 'bg-blue-100 text-blue-700 border-blue-200', icon: '✓' };
                case 'No-show':
                    return { color: 'bg-slate-100 text-slate-700 border-slate-200', icon: '⊘' };
                default:
                    return { color: 'bg-slate-100 text-slate-700 border-slate-200', icon: '' };
            }
        }

        // Conversation statuses
        if (type === 'conversation') {
            switch (status) {
                case 'New':
                    return { color: 'bg-blue-100 text-blue-700 border-blue-200', icon: '🆕' };
                case 'Open':
                    return { color: 'bg-purple-100 text-purple-700 border-purple-200', icon: '💬' };
                case 'Closed':
                    return { color: 'bg-slate-100 text-slate-700 border-slate-200', icon: '✓' };
                default:
                    return { color: 'bg-slate-100 text-slate-700 border-slate-200', icon: '' };
            }
        }

        // Form statuses
        if (type === 'form') {
            switch (status) {
                case 'Pending':
                    return { color: 'bg-yellow-100 text-yellow-700 border-yellow-200', icon: '⏳' };
                case 'Sent':
                    return { color: 'bg-blue-100 text-blue-700 border-blue-200', icon: '📤' };
                case 'Completed':
                    return { color: 'bg-green-100 text-green-700 border-green-200', icon: '✅' };
                case 'Overdue':
                    return { color: 'bg-red-100 text-red-700 border-red-200', icon: '🔴' };
                default:
                    return { color: 'bg-slate-100 text-slate-700 border-slate-200', icon: '' };
            }
        }

        // Lead statuses
        if (type === 'lead') {
            switch (status) {
                case 'New':
                    return { color: 'bg-blue-100 text-blue-700 border-blue-200', icon: '🆕' };
                case 'Contacted':
                    return { color: 'bg-purple-100 text-purple-700 border-purple-200', icon: '📞' };
                case 'Qualified':
                    return { color: 'bg-green-100 text-green-700 border-green-200', icon: '✓' };
                case 'Converted':
                    return { color: 'bg-emerald-100 text-emerald-700 border-emerald-200', icon: '🎉' };
                case 'Lost':
                    return { color: 'bg-red-100 text-red-700 border-red-200', icon: '❌' };
                default:
                    return { color: 'bg-slate-100 text-slate-700 border-slate-200', icon: '' };
            }
        }

        // Default
        return { color: 'bg-slate-100 text-slate-700 border-slate-200', icon: '' };
    };

    const config = getStatusConfig();

    return (
        <span className={`inline-flex items-center space-x-1 px-3 py-1 rounded-lg text-xs font-bold border-2 ${config.color}`}>
            {config.icon && <span>{config.icon}</span>}
            <span>{status}</span>
        </span>
    );
};

export default StatusBadge;
