import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCareOps } from '../context/CareOpsContext';
import { CheckCircle, XCircle, Rocket, AlertCircle, ArrowRight, Sparkles } from 'lucide-react';

const ActivateWorkspace = () => {
    const navigate = useNavigate();
    const { activateWorkspace, getActivationChecklist, workspaceStatus } = useCareOps();
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [isActivating, setIsActivating] = useState(false);

    const checklist = getActivationChecklist();
    const allChecksPass = checklist.hasChannel && checklist.hasBookingType && checklist.hasAvailability;

    const handleActivate = () => {
        setShowConfirmation(true);
    };

    const confirmActivation = () => {
        setIsActivating(true);
        setTimeout(() => {
            const success = activateWorkspace();
            if (success) {
                // Show success state briefly then redirect
                setTimeout(() => {
                    navigate('/dashboard');
                }, 2000);
            }
        }, 1000);
    };

    if (workspaceStatus === 'active') {
        return (
            <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 flex items-center justify-center p-4">
                <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8 text-center">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full mb-6 shadow-lg">
                        <CheckCircle className="w-12 h-12 text-white" />
                    </div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-4">
                        Workspace is Active! 🎉
                    </h1>
                    <p className="text-slate-600 mb-6">
                        Your workspace is already live and operational.
                    </p>
                    <button
                        onClick={() => navigate('/dashboard')}
                        className="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold rounded-xl hover:shadow-lg transition-all"
                    >
                        Go to Dashboard
                    </button>
                </div>
            </div>
        );
    }

    if (isActivating) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center p-4">
                <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8 text-center">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full mb-6 shadow-lg animate-pulse">
                        <Rocket className="w-12 h-12 text-white" />
                    </div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-4">
                        Activating Workspace...
                    </h1>
                    <p className="text-slate-600">
                        Setting up your live workspace
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center p-4">
            <div className="max-w-3xl w-full">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-full mb-6 shadow-lg">
                        <Rocket className="w-10 h-10 text-white" />
                    </div>
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-3">
                        Activate Your Workspace
                    </h1>
                    <p className="text-lg text-slate-600">
                        Complete the checklist below to go live
                    </p>
                </div>

                {/* Checklist Card */}
                <div className="bg-white rounded-2xl shadow-2xl border border-slate-100 p-8 mb-6">
                    <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center space-x-2">
                        <Sparkles className="w-6 h-6 text-indigo-600" />
                        <span>Pre-Activation Checklist</span>
                    </h2>

                    <div className="space-y-4">
                        {/* Communication Channel Check */}
                        <ChecklistItem
                            label="Communication Channel Connected"
                            description="Connect at least one channel (Email or SMS) to communicate with customers"
                            passed={checklist.hasChannel}
                            actionText="Go to Settings → Integrations"
                            onAction={() => navigate('/settings')}
                        />

                        {/* Booking Type Check */}
                        <ChecklistItem
                            label="Booking Type Configured"
                            description="Create at least one service that customers can book"
                            passed={checklist.hasBookingType}
                            actionText="Go to Bookings → Add Service"
                            onAction={() => navigate('/bookings')}
                        />

                        {/* Availability Check */}
                        <ChecklistItem
                            label="Availability Defined"
                            description="Set your business hours and available time slots"
                            passed={checklist.hasAvailability}
                            actionText="Go to Bookings → Set Availability"
                            onAction={() => navigate('/bookings')}
                        />
                    </div>

                    {/* Status Summary */}
                    <div className={`mt-6 p-4 rounded-xl border-2 ${allChecksPass
                            ? 'bg-green-50 border-green-200'
                            : 'bg-yellow-50 border-yellow-200'
                        }`}>
                        <div className="flex items-start space-x-3">
                            {allChecksPass ? (
                                <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
                            ) : (
                                <AlertCircle className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-0.5" />
                            )}
                            <div>
                                <p className={`font-bold ${allChecksPass ? 'text-green-900' : 'text-yellow-900'}`}>
                                    {allChecksPass
                                        ? 'All requirements met! You\'re ready to activate.'
                                        : 'Please complete all requirements before activating'}
                                </p>
                                {!allChecksPass && (
                                    <p className="text-sm text-yellow-700 mt-1">
                                        Click on the action buttons above to complete missing items
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Activation Button */}
                <div className="text-center">
                    <button
                        onClick={handleActivate}
                        disabled={!allChecksPass}
                        className={`px-8 py-4 font-bold rounded-xl text-lg transition-all flex items-center space-x-3 mx-auto ${allChecksPass
                                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:shadow-2xl hover:scale-105'
                                : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                            }`}
                    >
                        <Rocket className="w-6 h-6" />
                        <span>Activate Workspace</span>
                        <ArrowRight className="w-6 h-6" />
                    </button>
                    {!allChecksPass && (
                        <p className="text-sm text-slate-500 mt-3">
                            Complete all checklist items to enable activation
                        </p>
                    )}
                </div>

                {/* Warning */}
                <div className="mt-6 bg-amber-50 border border-amber-200 rounded-xl p-4">
                    <div className="flex items-start space-x-3">
                        <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                        <div className="text-sm text-amber-900">
                            <p className="font-semibold">Important:</p>
                            <p>Once activated, your workspace will be live and public booking links will be accessible. Make sure everything is configured correctly before proceeding.</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Confirmation Modal */}
            {showConfirmation && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8">
                        <div className="text-center mb-6">
                            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full mb-4">
                                <Rocket className="w-8 h-8 text-indigo-600" />
                            </div>
                            <h2 className="text-2xl font-bold text-slate-900 mb-2">
                                Activate Workspace?
                            </h2>
                            <p className="text-slate-600">
                                This will make your workspace live and enable all public-facing features.
                            </p>
                        </div>

                        <div className="bg-slate-50 rounded-xl p-4 mb-6">
                            <p className="text-sm font-semibold text-slate-900 mb-2">What happens next:</p>
                            <ul className="text-sm text-slate-600 space-y-1">
                                <li>✓ Public booking links become active</li>
                                <li>✓ Forms are automatically sent</li>
                                <li>✓ Automations start running</li>
                                <li>✓ Full dashboard functionality enabled</li>
                            </ul>
                        </div>

                        <div className="flex items-center space-x-3">
                            <button
                                onClick={() => setShowConfirmation(false)}
                                className="flex-1 px-6 py-3 border-2 border-slate-200 text-slate-700 font-bold rounded-xl hover:bg-slate-50 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmActivation}
                                className="flex-1 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold rounded-xl hover:shadow-lg transition-all"
                            >
                                Activate Now
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

const ChecklistItem = ({ label, description, passed, actionText, onAction }) => (
    <div className={`p-4 rounded-xl border-2 transition-all ${passed
            ? 'bg-green-50 border-green-200'
            : 'bg-slate-50 border-slate-200'
        }`}>
        <div className="flex items-start justify-between">
            <div className="flex items-start space-x-3 flex-1">
                {passed ? (
                    <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
                ) : (
                    <XCircle className="w-6 h-6 text-slate-400 flex-shrink-0 mt-0.5" />
                )}
                <div className="flex-1">
                    <p className={`font-bold ${passed ? 'text-green-900' : 'text-slate-900'}`}>
                        {label}
                    </p>
                    <p className={`text-sm mt-1 ${passed ? 'text-green-700' : 'text-slate-600'}`}>
                        {description}
                    </p>
                </div>
            </div>
            {!passed && (
                <button
                    onClick={onAction}
                    className="ml-4 px-4 py-2 bg-indigo-600 text-white text-sm font-bold rounded-lg hover:bg-indigo-700 transition-colors flex-shrink-0"
                >
                    {actionText}
                </button>
            )}
        </div>
    </div>
);

export default ActivateWorkspace;
