import { createContext, useState, useContext, useEffect } from 'react';
import alertService from '../services/alert.service';
import authService from '../services/auth.service';

const CareOpsContext = createContext(undefined);

export const CareOpsProvider = ({ children }) => {
    // Global Business/User State
    const [business, setBusiness] = useState(null);
    const [loading, setLoading] = useState(true);

    // Auth & Workspace State
    const [onboardingStep, setOnboardingStep] = useState(1);
    const [workspaceStatus, setWorkspaceStatus] = useState('inactive');

    // Integration Status
    const [integrations, setIntegrations] = useState({
        email: { connected: false, status: 'disconnected' },
        sms: { connected: false, status: 'disconnected' }
    });

    // Global Config
    const [bookingConfig, setBookingConfig] = useState({
        services: [],
        availability: { days: [], times: [] },
        location: { type: 'in-person', address: '' }
    });

    // Alerts State
    const [alerts, setAlerts] = useState([]);

    // Initialize
    useEffect(() => {
        const init = async () => {
            const user = authService.getCurrentUser();
            if (user) {
                setBusiness({
                    name: user.name || 'My Business',
                    email: user.email,
                    role: user.role,
                    id: user.id
                });
                setWorkspaceStatus('active');

                // Set integrations as connected if token exists (mock logic for now)
                setIntegrations(prev => ({
                    email: { ...prev.email, connected: true, status: 'connected' },
                    sms: { ...prev.sms, connected: true, status: 'connected' }
                }));

                // Fetch initial alerts
                fetchAlerts();
            } else {
                // Check if we have workspace setup in local storage even if not fully logged in (for demo)
                const storedUserStr = localStorage.getItem('careops_user');
                if (storedUserStr) {
                    try {
                        const storedUser = JSON.parse(storedUserStr);
                        setBusiness({
                            name: storedUser.name || 'My Business',
                            email: storedUser.email,
                            role: storedUser.role,
                            id: storedUser.id
                        });
                        setWorkspaceStatus('active');
                        fetchAlerts();
                    } catch (e) {
                        console.error("Error parsing stored user", e);
                    }
                }
            }
            setLoading(false);
        };
        init();
    }, []);

    // Alert Methods
    const fetchAlerts = async () => {
        try {
            const data = await alertService.getAlerts();
            setAlerts(data);
        } catch (error) {
            console.error("Failed to fetch alerts:", error);
        }
    };

    const markAlertAsRead = async (id) => {
        try {
            // Optimistic update
            setAlerts(prev => prev.map(a => a.id === id ? { ...a, read: true } : a));
            if (id) await alertService.markAsRead(id);
        } catch (error) {
            console.error("Failed to mark alert as read:", error);
        }
    };

    // Workspace Methods
    const updateOnboardingStep = (step) => setOnboardingStep(step);

    const activateWorkspace = () => setWorkspaceStatus('active');

    const connectIntegration = (type) => {
        setIntegrations(prev => ({
            ...prev,
            [type]: { ...prev[type], connected: true, status: 'connected' }
        }));
    };

    const disconnectIntegration = (type) => {
        setIntegrations(prev => ({
            ...prev,
            [type]: { ...prev[type], connected: false, status: 'disconnected' }
        }));
    };

    const canActivateWorkspace = () => {
        return (integrations.email.connected || integrations.sms.connected) &&
            bookingConfig.services.length > 0 &&
            bookingConfig.availability.daysOfWeek.length > 0;
    };

    const getActivationChecklist = () => ({
        hasChannel: integrations.email.connected || integrations.sms.connected,
        hasBookingType: bookingConfig.services.length > 0,
        hasAvailability: bookingConfig.availability.daysOfWeek.length > 0
    });

    return (
        <CareOpsContext.Provider
            value={{
                business,
                setBusiness,
                // Auth & Workspace
                onboardingStep,
                updateOnboardingStep,
                workspaceStatus,
                activateWorkspace,
                // Integrations
                integrations,
                connectIntegration,
                disconnectIntegration,
                canActivateWorkspace,
                getActivationChecklist,
                // Config
                bookingConfig,
                setBookingConfig, // exposed for Settings page
                // Alerts
                alerts,
                fetchAlerts,
                markAlertAsRead,
                // Global Loading
                loading
            }}
        >
            {children}
        </CareOpsContext.Provider>
    );
};

export const useCareOps = () => {
    const context = useContext(CareOpsContext);
    if (context === undefined) {
        throw new Error('useCareOps must be used within a CareOpsProvider');
    }
    return context;
};
