import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Settings as SettingsIcon, Shield, Globe, Bell, Lock, Key } from 'lucide-react';

const Settings = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50 to-purple-50">
            {/* Header */}
            <header className="bg-white shadow-lg border-b border-slate-100 sticky top-0 z-50 backdrop-blur-sm bg-white/95">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-4">
                            <button
                                onClick={() => navigate('/dashboard')}
                                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                            >
                                <ArrowLeft className="w-5 h-5 text-slate-600" />
                            </button>
                            <div className="bg-gradient-to-br from-slate-700 to-slate-900 p-3 rounded-2xl shadow-lg">
                                <SettingsIcon className="text-white w-6 h-6" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold bg-gradient-to-r from-slate-700 to-slate-900 bg-clip-text text-transparent">
                                    System Settings
                                </h1>
                                <p className="text-xs text-slate-500">Configure your workspace</p>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">

                {/* General Settings - Owner Only */}
                <SettingsSection
                    title="General Settings"
                    icon={<Globe className="w-5 h-5" />}
                    ownerOnly={true}
                >
                    <div className="space-y-4">
                        <div className="flex flex-col">
                            <label className="text-sm font-bold text-slate-700 mb-1">Business Name</label>
                            <input type="text" defaultValue="My Business" disabled className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-500 cursor-not-allowed" />
                        </div>
                        <div className="flex flex-col">
                            <label className="text-sm font-bold text-slate-700 mb-1">Timezone</label>
                            <select disabled className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-500 cursor-not-allowed">
                                <option>UTC-5 (Eastern Time)</option>
                            </select>
                        </div>
                    </div>
                </SettingsSection>

                {/* Notifications - Open to Staff */}
                <SettingsSection
                    title="Notifications"
                    icon={<Bell className="w-5 h-5" />}
                    ownerOnly={false}
                >
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <span className="text-slate-700 font-medium">Email Notifications</span>
                            <div className="w-11 h-6 bg-indigo-600 rounded-full relative cursor-pointer">
                                <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div>
                            </div>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-slate-700 font-medium">Browser Alerts</span>
                            <div className="w-11 h-6 bg-indigo-600 rounded-full relative cursor-pointer">
                                <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div>
                            </div>
                        </div>
                    </div>
                </SettingsSection>

                {/* Integrations - Owner Only */}
                <SettingsSection
                    title="Integrations & API"
                    icon={<Key className="w-5 h-5" />}
                    ownerOnly={true}
                >
                    <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 text-center">
                        <p className="text-slate-500 text-sm mb-3">Manage API keys and third-party connections.</p>
                        <button disabled className="px-4 py-2 bg-slate-200 text-slate-400 font-bold rounded-lg cursor-not-allowed flex items-center justify-center mx-auto space-x-2">
                            <Lock className="w-4 h-4" />
                            <span>Manage Integrations</span>
                        </button>
                    </div>
                </SettingsSection>

            </main>
        </div>
    );
};

const SettingsSection = ({ title, icon, children, ownerOnly }) => (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-lg ${ownerOnly ? 'bg-amber-100 text-amber-600' : 'bg-indigo-100 text-indigo-600'}`}>
                    {icon}
                </div>
                <h2 className="text-lg font-bold text-slate-800">{title}</h2>
            </div>
            {ownerOnly && (
                <div className="flex items-center space-x-1 px-3 py-1 bg-amber-100 text-amber-700 text-xs font-bold rounded-full uppercase tracking-wider border border-amber-200">
                    <Shield className="w-3 h-3" />
                    <span>Owner Only</span>
                </div>
            )}
        </div>
        <div className="p-6">
            {children}
        </div>
    </div>
);

export default Settings;
