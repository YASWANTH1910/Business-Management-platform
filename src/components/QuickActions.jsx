import { useNavigate } from 'react-router-dom';
import {
    Plus,
    CalendarPlus,
    MessageSquarePlus,
    UserPlus
} from 'lucide-react';

const QuickActions = () => {
    const navigate = useNavigate();

    const actions = [
        {
            label: 'New Booking',
            description: 'Schedule manually',
            icon: CalendarPlus,
            color: 'bg-indigo-600',
            onClick: () => navigate('/bookings')
        },
        {
            label: 'Send Message',
            description: 'Email or SMS',
            icon: MessageSquarePlus,
            color: 'bg-purple-600',
            onClick: () => navigate('/inbox')
        },
        {
            label: 'Add Contact',
            description: 'Create profile',
            icon: UserPlus,
            color: 'bg-teal-600',
            onClick: () => navigate('/leads')
        }
    ];

    return (
        <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm h-full">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Quick Actions</h3>
            <div className="space-y-3">
                {actions.map((action, index) => (
                    <button
                        key={index}
                        onClick={action.onClick}
                        className="w-full flex items-center p-3 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-200 transition-all group text-left"
                    >
                        <div className={`
                            p-3 rounded-lg text-white shadow-md
                            ${action.color} group-hover:scale-110 transition-transform duration-300
                        `}>
                            <action.icon className="w-5 h-5" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                                {action.label}
                            </p>
                            <p className="text-xs text-slate-500">
                                {action.description}
                            </p>
                        </div>
                    </button>
                ))}
            </div>
        </div>
    );
};

export default QuickActions;
