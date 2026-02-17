import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

const StatCard = ({ title, value, icon: Icon, color = 'indigo', trend, onClick }) => {

    const colors = {
        indigo: { bg: 'bg-indigo-50', text: 'text-indigo-600', border: 'border-indigo-100', iconBg: 'bg-indigo-100' },
        purple: { bg: 'bg-purple-50', text: 'text-purple-600', border: 'border-purple-100', iconBg: 'bg-purple-100' },
        green: { bg: 'bg-green-50', text: 'text-green-600', border: 'border-green-100', iconBg: 'bg-green-100' },
        red: { bg: 'bg-red-50', text: 'text-red-600', border: 'border-red-100', iconBg: 'bg-red-100' },
        yellow: { bg: 'bg-yellow-50', text: 'text-yellow-600', border: 'border-yellow-100', iconBg: 'bg-yellow-100' },
        blue: { bg: 'bg-blue-50', text: 'text-blue-600', border: 'border-blue-100', iconBg: 'bg-blue-100' },
        teal: { bg: 'bg-teal-50', text: 'text-teal-600', border: 'border-teal-100', iconBg: 'bg-teal-100' },
    };

    const theme = colors[color] || colors.indigo;

    return (
        <div
            onClick={onClick}
            className={`
                bg-white p-4 rounded-xl border border-slate-100 shadow-sm
                hover:shadow-lg hover:border-indigo-100 transition-all duration-300
                group cursor-pointer relative overflow-hidden
            `}
        >
            <div className="flex justify-between items-start mb-3">
                <div className={`
                    p-2 rounded-lg ${theme.bg} ${theme.text}
                    group-hover:scale-110 transition-transform duration-300
                `}>
                    <Icon className="w-5 h-5" />
                </div>
                {/* Trend omitted for brevity in density update if not critical, but keeping structure implies just changing padding/icons */}
                {trend && (
                    <div className={`
                        flex items-center space-x-1 text-xs font-semibold px-2 py-0.5 rounded-full
                        ${trend.positive ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}
                    `}>
                        {trend.positive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                        <span>{trend.value}</span>
                    </div>
                )}
            </div>

            <div>
                <h3 className="text-2xl font-bold text-slate-900 mb-0.5 tracking-tight">
                    {value}
                </h3>
                <p className="text-xs font-medium text-slate-500">
                    {title}
                </p>
            </div>

            {/* Decorative Background Element */}
            <div className={`
                absolute -right-4 -bottom-4 w-24 h-24 rounded-full opacity-5
                ${theme.bg.replace('bg-', 'bg-gradient-to-br from-').replace('50', '400')}
                to-white pointer-events-none group-hover:scale-150 transition-transform duration-500
            `} />
        </div>
    );
};

export default StatCard;
