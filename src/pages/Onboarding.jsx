import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCareOps } from '../context/CareOpsContext';
import { Sparkles, ArrowRight } from 'lucide-react';

const TIMEZONES = [
    'UTC-12:00 (Baker Island)',
    'UTC-11:00 (American Samoa)',
    'UTC-10:00 (Hawaii)',
    'UTC-09:00 (Alaska)',
    'UTC-08:00 (Pacific Time)',
    'UTC-07:00 (Mountain Time)',
    'UTC-06:00 (Central Time)',
    'UTC-05:00 (Eastern Time)',
    'UTC-04:00 (Atlantic Time)',
    'UTC-03:00 (Argentina)',
    'UTC-02:00 (Mid-Atlantic)',
    'UTC-01:00 (Azores)',
    'UTC+00:00 (London)',
    'UTC+01:00 (Paris)',
    'UTC+02:00 (Cairo)',
    'UTC+03:00 (Moscow)',
    'UTC+04:00 (Dubai)',
    'UTC+05:00 (Pakistan)',
    'UTC+05:30 (India)',
    'UTC+06:00 (Bangladesh)',
    'UTC+07:00 (Bangkok)',
    'UTC+08:00 (Singapore)',
    'UTC+09:00 (Tokyo)',
    'UTC+10:00 (Sydney)',
    'UTC+11:00 (Solomon Islands)',
    'UTC+12:00 (New Zealand)',
];

const Onboarding = () => {
    const {
        setBusiness,
        activateWorkspace
    } = useCareOps();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: '',
        address: '',
        timezone: '',
        email: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleStep1Submit = (e) => {
        e.preventDefault();
        if (!formData.name || !formData.address || !formData.timezone || !formData.email) return;

        setBusiness(formData);
        activateWorkspace();
        navigate('/dashboard');
    };


    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center p-4 relative overflow-hidden">
            {/* Animated Background Elements */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse" style={{ animationDelay: '2s' }}></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse" style={{ animationDelay: '4s' }}></div>
            </div>

            <div className="max-w-2xl w-full glass-effect rounded-2xl shadow-2xl p-8 relative z-10 animate-fade-in">
                {/* Logo and Header */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl mb-4 shadow-lg transform hover:scale-110 transition-transform duration-300">
                        <Sparkles className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
                        Welcome to CareOps
                    </h1>
                    <p className="text-slate-600 font-medium">Let's get your business set up in minutes</p>
                </div>

                {/* Create Workspace Form */}
                <form onSubmit={handleStep1Submit} className="space-y-5">
                    <div className="animate-slide-in" style={{ animationDelay: '0.1s' }}>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">Business Name *</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all bg-white/80"
                            placeholder="e.g., Acme Healthcare"
                        />
                    </div>

                    <div className="animate-slide-in" style={{ animationDelay: '0.15s' }}>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">Business Address *</label>
                        <input
                            type="text"
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all bg-white/80"
                            placeholder="123 Main St, City, State"
                        />
                    </div>

                    <div className="animate-slide-in" style={{ animationDelay: '0.2s' }}>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">Time Zone *</label>
                        <select
                            name="timezone"
                            value={formData.timezone}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all bg-white/80"
                        >
                            <option value="">Select your timezone...</option>
                            {TIMEZONES.map((tz) => (
                                <option key={tz} value={tz}>
                                    {tz}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="animate-slide-in" style={{ animationDelay: '0.25s' }}>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">Contact Email *</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all bg-white/80"
                            placeholder="contact@yourbusiness.com"
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 mt-6 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 animate-slide-in flex items-center justify-center space-x-2"
                        style={{ animationDelay: '0.4s' }}
                    >
                        <span>Get Started</span>
                        <ArrowRight className="w-5 h-5" />
                    </button>
                </form>

                <p className="text-center text-xs text-slate-500 mt-6">
                    By continuing, you agree to our Terms of Service
                </p>
            </div>
        </div>
    );
};

export default Onboarding;
