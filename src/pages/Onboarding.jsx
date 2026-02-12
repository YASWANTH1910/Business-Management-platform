import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCareOps } from '../context/CareOpsContext';
import { Sparkles, ArrowRight, Mail, MessageSquare, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

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
        onboardingStep,
        updateOnboardingStep,
        activateWorkspace,
        integrations,
        connectIntegration,
        disconnectIntegration
    } = useCareOps();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: '',
        address: '',
        timezone: '',
        email: '',
    });

    const [integrationError, setIntegrationError] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleStep1Submit = (e) => {
        e.preventDefault();
        if (!formData.name || !formData.address || !formData.timezone || !formData.email) return;

        setBusiness(formData);
        updateOnboardingStep(2);
    };

    const handleStep2Submit = () => {
        // Validate at least one integration is connected
        if (!integrations.email.connected && !integrations.sms.connected) {
            setIntegrationError('Please connect at least one integration to continue');
            return;
        }

        setIntegrationError('');
        activateWorkspace();
        updateOnboardingStep('complete');
    };

    const handleIntegrationToggle = (type) => {
        if (integrations[type].connected) {
            disconnectIntegration(type);
        } else {
            connectIntegration(type);
        }
        setIntegrationError('');
    };

    if (onboardingStep === 'complete') {
        return <SuccessScreen navigate={navigate} />;
    }

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

                {/* Progress Indicator */}
                <div className="mb-8">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-semibold text-slate-700">Step {onboardingStep} of 2</span>
                        <span className="text-sm font-semibold text-indigo-600">{onboardingStep === 1 ? 'Workspace Setup' : 'Integrations'}</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2">
                        <div
                            className="bg-gradient-to-r from-indigo-600 to-purple-600 h-2 rounded-full transition-all duration-500"
                            style={{ width: `${(onboardingStep / 2) * 100}%` }}
                        ></div>
                    </div>
                </div>

                {/* Step 1: Create Workspace */}
                {onboardingStep === 1 && (
                    <form onSubmit={handleStep1Submit} className="space-y-5">
                        <div className="animate-slide-in">
                            <label className="block text-sm font-semibold text-slate-700 mb-2">Business Name *</label>
                            <input
                                type="text"
                                name="name"
                                required
                                className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all duration-300 bg-white/80 hover:border-indigo-300"
                                placeholder="e.g. Smith Dental Clinic"
                                value={formData.name}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="animate-slide-in" style={{ animationDelay: '0.1s' }}>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">Business Address *</label>
                            <input
                                type="text"
                                name="address"
                                required
                                className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all duration-300 bg-white/80 hover:border-indigo-300"
                                placeholder="123 Main St, City, State 12345"
                                value={formData.address}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="animate-slide-in" style={{ animationDelay: '0.2s' }}>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">Time Zone *</label>
                            <select
                                name="timezone"
                                required
                                className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all duration-300 bg-white/80 hover:border-indigo-300"
                                value={formData.timezone}
                                onChange={handleChange}
                            >
                                <option value="">Select a timezone...</option>
                                {TIMEZONES.map(tz => (
                                    <option key={tz} value={tz}>{tz}</option>
                                ))}
                            </select>
                        </div>

                        <div className="animate-slide-in" style={{ animationDelay: '0.3s' }}>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">Contact Email *</label>
                            <input
                                type="email"
                                name="email"
                                required
                                className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all duration-300 bg-white/80 hover:border-indigo-300"
                                placeholder="contact@business.com"
                                value={formData.email}
                                onChange={handleChange}
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 mt-6 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 animate-slide-in flex items-center justify-center space-x-2"
                            style={{ animationDelay: '0.4s' }}
                        >
                            <span>Continue to Integrations</span>
                            <ArrowRight className="w-5 h-5" />
                        </button>
                    </form>
                )}

                {/* Step 2: Integration Setup */}
                {onboardingStep === 2 && (
                    <div className="space-y-6">
                        <div className="text-center mb-6">
                            <h2 className="text-2xl font-bold text-slate-900 mb-2">Connect Your Integrations</h2>
                            <p className="text-slate-600">Connect at least one integration to activate your workspace</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Email Integration */}
                            <IntegrationCard
                                type="email"
                                title="Email"
                                description="Confirmations & alerts"
                                icon={<Mail className="w-6 h-6" />}
                                connected={integrations.email.connected}
                                onToggle={() => handleIntegrationToggle('email')}
                            />

                            {/* SMS Integration */}
                            <IntegrationCard
                                type="sms"
                                title="SMS"
                                description="Reminders & updates"
                                icon={<MessageSquare className="w-6 h-6" />}
                                connected={integrations.sms.connected}
                                onToggle={() => handleIntegrationToggle('sms')}
                            />
                        </div>

                        {/* Error Message */}
                        {integrationError && (
                            <div className="flex items-center space-x-2 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 animate-fade-in">
                                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                                <span className="text-sm font-semibold">{integrationError}</span>
                            </div>
                        )}

                        {/* Integration Status Log */}
                        <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                            <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider mb-3">Integration Status</h3>
                            <div className="space-y-2">
                                {Object.entries(integrations).map(([type, data]) => (
                                    data.timestamp && (
                                        <div key={type} className="flex items-center justify-between text-sm">
                                            <span className="font-semibold text-slate-700 capitalize">{type}</span>
                                            <div className="flex items-center space-x-2">
                                                <span className={`${data.connected ? 'text-green-600' : 'text-slate-500'}`}>
                                                    {data.status}
                                                </span>
                                                <span className="text-slate-400 text-xs">
                                                    {new Date(data.timestamp).toLocaleTimeString()}
                                                </span>
                                            </div>
                                        </div>
                                    )
                                ))}
                            </div>
                        </div>

                        <button
                            onClick={handleStep2Submit}
                            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center justify-center space-x-2"
                        >
                            <span>Complete Setup</span>
                            <ArrowRight className="w-5 h-5" />
                        </button>
                    </div>
                )}

                <p className="text-center text-xs text-slate-500 mt-6">
                    By continuing, you agree to our Terms of Service
                </p>
            </div>
        </div>
    );
};

const IntegrationCard = ({ type, title, description, icon, connected, onToggle }) => (
    <div className={`p-6 rounded-xl border-2 transition-all duration-300 ${connected
            ? 'bg-green-50 border-green-300'
            : 'bg-white border-slate-200 hover:border-indigo-300'
        }`}>
        <div className="flex items-center justify-between mb-4">
            <div className={`p-3 rounded-lg ${connected ? 'bg-green-100' : 'bg-slate-100'}`}>
                {icon}
            </div>
            {connected ? (
                <CheckCircle className="w-6 h-6 text-green-600" />
            ) : (
                <XCircle className="w-6 h-6 text-slate-300" />
            )}
        </div>
        <h3 className="text-lg font-bold text-slate-900 mb-1">{title}</h3>
        <p className="text-sm text-slate-600 mb-4">{description}</p>
        <button
            onClick={onToggle}
            className={`w-full py-2 px-4 rounded-lg font-semibold transition-all ${connected
                    ? 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                    : 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700'
                }`}
        >
            {connected ? 'Disconnect' : 'Connect'}
        </button>
    </div>
);

const SuccessScreen = ({ navigate }) => (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8 text-center animate-fade-in">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full mb-6 shadow-lg animate-bounce">
                <CheckCircle className="w-12 h-12 text-white" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-4">
                You're All Set! 🎉
            </h1>
            <p className="text-slate-600 mb-8">
                Your workspace is now active and ready to go. Start managing your business operations with CareOps.
            </p>
            <button
                onClick={() => navigate('/dashboard')}
                className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
                Go to Dashboard →
            </button>
        </div>
    </div>
);

export default Onboarding;
