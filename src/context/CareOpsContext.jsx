import { createContext, useState, useContext } from 'react';

const CareOpsContext = createContext(undefined);

export const CareOpsProvider = ({ children }) => {
    const [business, setBusiness] = useState(null);
    const [leads, setLeads] = useState([]);
    const [bookings, setBookings] = useState([]);
    const [forms, setForms] = useState([]);
    const [messages, setMessages] = useState([]);

    // Forms Management state
    const [formTemplates, setFormTemplates] = useState([]);
    const [formSubmissions, setFormSubmissions] = useState([]); // Track forms per booking

    // Inventory/Resources state
    const [resources, setResources] = useState([]);

    // Alerts state
    const [alerts, setAlerts] = useState([]);

    // Staff state
    const [staff, setStaff] = useState([]);

    // Onboarding state
    const [onboardingStep, setOnboardingStep] = useState(1);
    const [workspaceStatus, setWorkspaceStatus] = useState('inactive');
    const [integrations, setIntegrations] = useState({
        email: { connected: false, status: '', timestamp: '' },
        sms: { connected: false, status: '', timestamp: '' }
    });

    // Operations state
    const [contacts, setContacts] = useState([]);
    const [conversations, setConversations] = useState([]);
    const [bookingConfig, setBookingConfig] = useState({
        services: [],
        availability: {
            daysOfWeek: [],
            timeSlots: []
        }
    });

    // DEVELOPMENT ONLY: Initialize with test data (comment out for production)
    // Uncomment the useEffect below to auto-populate test data
    /*
    useEffect(() => {
        if (!business) {
            setBusiness({
                name: 'Test Business',
                address: '123 Main St',
                timezone: 'America/New_York',
                email: 'test@business.com'
            });
            setWorkspaceStatus('active');
            setIntegrations({
                email: { connected: true, status: 'Connected', timestamp: new Date().toISOString() },
                sms: { connected: false, status: '', timestamp: '' }
            });
        }
    }, []);
    */


    const addLead = (lead) => setLeads((prev) => [...prev, lead]);
    const updateLead = (id, updates) => setLeads((prev) =>
        prev.map((lead) => (lead.id === id ? { ...lead, ...updates } : lead))
    );
    const addBooking = (booking) => setBookings((prev) => [...prev, booking]);
    const addForm = (form) => setForms((prev) => [...prev, form]);
    const addMessage = (message) => setMessages((prev) => [...prev, message]);

    // Onboarding methods
    const updateOnboardingStep = (step) => setOnboardingStep(step);

    const activateWorkspace = () => {
        // Only activate if all requirements are met
        if (canActivateWorkspace()) {
            setWorkspaceStatus('active');
            return true;
        }
        return false;
    };

    const canActivateWorkspace = () => {
        // Check if at least one communication channel is connected
        const hasChannel = integrations.email.connected || integrations.sms.connected;

        // Check if at least one booking type exists
        const hasBookingType = bookingConfig.services.length > 0;

        // Check if availability has been defined
        const hasAvailability = bookingConfig.availability.daysOfWeek.length > 0 &&
            bookingConfig.availability.timeSlots.length > 0;

        return hasChannel && hasBookingType && hasAvailability;
    };

    const getActivationChecklist = () => {
        return {
            hasChannel: integrations.email.connected || integrations.sms.connected,
            hasBookingType: bookingConfig.services.length > 0,
            hasAvailability: bookingConfig.availability.daysOfWeek.length > 0 &&
                bookingConfig.availability.timeSlots.length > 0
        };
    };

    const connectIntegration = (type) => {
        setIntegrations(prev => ({
            ...prev,
            [type]: {
                connected: true,
                status: 'Connected',
                timestamp: new Date().toISOString()
            }
        }));
    };

    const disconnectIntegration = (type) => {
        setIntegrations(prev => ({
            ...prev,
            [type]: {
                connected: false,
                status: 'Disconnected',
                timestamp: new Date().toISOString()
            }
        }));
    };

    // Operations methods
    const addContact = (contact) => {
        const newContact = {
            id: Date.now().toString(),
            ...contact,
            createdAt: new Date().toISOString()
        };
        setContacts(prev => [...prev, newContact]);
        return newContact;
    };

    const addConversation = (conversation) => {
        const newConversation = {
            id: Date.now().toString(),
            ...conversation,
            messages: conversation.messages || [],
            status: 'New',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        setConversations(prev => [...prev, newConversation]);
        return newConversation;
    };

    const addMessageToConversation = (conversationId, message) => {
        const newMessage = {
            id: Date.now().toString(),
            ...message,
            timestamp: new Date().toISOString()
        };
        setConversations(prev => prev.map(conv =>
            conv.id === conversationId
                ? {
                    ...conv,
                    messages: [...conv.messages, newMessage],
                    updatedAt: new Date().toISOString()
                }
                : conv
        ));
        return newMessage;
    };

    const updateConversationStatus = (conversationId, status) => {
        setConversations(prev => prev.map(conv =>
            conv.id === conversationId ? { ...conv, status } : conv
        ));
    };

    const updateBookingConfig = (config) => {
        setBookingConfig(prev => ({ ...prev, ...config }));
    };

    const updateFormStatus = (formId, status) => {
        setForms(prev => prev.map(form =>
            form.id === formId ? { ...form, status } : form
        ));
    };

    // Forms Management methods
    const addFormTemplate = (template) => {
        const newTemplate = {
            id: Date.now().toString(),
            ...template,
            createdAt: new Date().toISOString()
        };
        setFormTemplates(prev => [...prev, newTemplate]);
        return newTemplate;
    };

    const updateFormTemplate = (id, updates) => {
        setFormTemplates(prev => prev.map(template =>
            template.id === id ? { ...template, ...updates } : template
        ));
    };

    const deleteFormTemplate = (id) => {
        setFormTemplates(prev => prev.filter(template => template.id !== id));
    };

    const sendFormsForBooking = (bookingId, bookingType) => {
        // Find all active forms linked to this booking type
        const linkedForms = formTemplates.filter(
            template => template.status === 'Active' &&
                template.linkedBookingTypes.includes(bookingType)
        );

        // Create form submissions for each linked form
        const newSubmissions = linkedForms.map(form => ({
            id: Date.now().toString() + Math.random(),
            bookingId,
            formTemplateId: form.id,
            formName: form.name,
            formType: form.type,
            status: 'Sent',
            sentAt: new Date().toISOString(),
            completedAt: null
        }));

        setFormSubmissions(prev => [...prev, ...newSubmissions]);
        return newSubmissions;
    };

    const updateFormSubmissionStatus = (submissionId, status) => {
        setFormSubmissions(prev => prev.map(submission =>
            submission.id === submissionId
                ? {
                    ...submission,
                    status,
                    completedAt: status === 'Completed' ? new Date().toISOString() : submission.completedAt
                }
                : submission
        ));
    };

    // Inventory/Resources methods
    const addResource = (resource) => {
        const newResource = {
            id: Date.now().toString(),
            ...resource,
            createdAt: new Date().toISOString()
        };
        setResources(prev => [...prev, newResource]);

        // Check if low stock and create alert
        if (newResource.quantity <= newResource.threshold) {
            addAlert({
                type: 'Inventory',
                severity: newResource.quantity === 0 ? 'Critical' : 'Warning',
                message: `${newResource.name} is ${newResource.quantity === 0 ? 'out of stock' : 'low on stock'}`,
                relatedEntity: { type: 'resource', id: newResource.id }
            });
        }

        return newResource;
    };

    const updateResource = (id, updates) => {
        setResources(prev => prev.map(resource => {
            if (resource.id === id) {
                const updated = { ...resource, ...updates };

                // Check for low stock alert
                if (updated.quantity <= updated.threshold && resource.quantity > resource.threshold) {
                    addAlert({
                        type: 'Inventory',
                        severity: updated.quantity === 0 ? 'Critical' : 'Warning',
                        message: `${updated.name} is ${updated.quantity === 0 ? 'out of stock' : 'low on stock'}`,
                        relatedEntity: { type: 'resource', id: updated.id }
                    });
                }

                return updated;
            }
            return resource;
        }));
    };

    const deleteResource = (id) => {
        setResources(prev => prev.filter(resource => resource.id !== id));
    };

    const deductResourceUsage = (bookingType) => {
        // Find resources linked to this booking type and deduct 1 from each
        setResources(prev => prev.map(resource => {
            if (resource.linkedBookingTypes.includes(bookingType)) {
                const newQuantity = Math.max(0, resource.quantity - 1);

                // Check for low stock alert
                if (newQuantity <= resource.threshold && resource.quantity > resource.threshold) {
                    addAlert({
                        type: 'Inventory',
                        severity: newQuantity === 0 ? 'Critical' : 'Warning',
                        message: `${resource.name} is ${newQuantity === 0 ? 'out of stock' : 'low on stock'}`,
                        relatedEntity: { type: 'resource', id: resource.id }
                    });
                }

                return { ...resource, quantity: newQuantity };
            }
            return resource;
        }));
    };

    // Alerts methods
    const addAlert = (alert) => {
        const newAlert = {
            id: Date.now().toString() + Math.random(),
            ...alert,
            timestamp: new Date().toISOString(),
            read: false
        };
        setAlerts(prev => [...prev, newAlert]);
        return newAlert;
    };

    const markAlertAsRead = (id) => {
        setAlerts(prev => prev.map(alert =>
            alert.id === id ? { ...alert, read: true } : alert
        ));
    };

    const clearAlert = (id) => {
        setAlerts(prev => prev.filter(alert => alert.id !== id));
    };

    const generateAlertsForBooking = (booking) => {
        const now = new Date();
        const bookingDate = new Date(booking.date + ' ' + booking.time);
        const hoursUntilBooking = (bookingDate - now) / (1000 * 60 * 60);

        // Alert if booking is within 24 hours
        if (hoursUntilBooking > 0 && hoursUntilBooking <= 24) {
            addAlert({
                type: 'Booking',
                severity: 'Info',
                message: `Upcoming booking: ${booking.customerName} - ${booking.service}`,
                relatedEntity: { type: 'booking', id: booking.id }
            });
        }

        // Alert if booking is upcoming but forms not completed
        if (hoursUntilBooking > 0 && hoursUntilBooking <= 48) {
            const bookingForms = formSubmissions.filter(sub => sub.bookingId === booking.id);
            const pendingForms = bookingForms.filter(sub => sub.status === 'Pending' || sub.status === 'Sent');

            if (pendingForms.length > 0) {
                addAlert({
                    type: 'Forms',
                    severity: 'Warning',
                    message: `${pendingForms.length} form(s) pending for ${booking.customerName}`,
                    relatedEntity: { type: 'booking', id: booking.id }
                });
            }
        }

        // Alert if booking is past and forms still pending
        if (hoursUntilBooking < 0) {
            const bookingForms = formSubmissions.filter(sub => sub.bookingId === booking.id);
            const pendingForms = bookingForms.filter(sub => sub.status === 'Pending' || sub.status === 'Sent');

            if (pendingForms.length > 0) {
                addAlert({
                    type: 'Forms',
                    severity: 'Critical',
                    message: `Overdue: ${pendingForms.length} form(s) still pending for ${booking.customerName}`,
                    relatedEntity: { type: 'booking', id: booking.id }
                });
            }
        }
    };

    // Staff methods
    const addStaff = (staffMember) => {
        const newStaff = {
            id: Date.now().toString(),
            ...staffMember,
            permissions: staffMember.permissions || {
                inbox: false,
                bookings: false,
                forms: false,
                inventory: false
            },
            status: staffMember.status || 'Invited',
            createdAt: new Date().toISOString()
        };
        setStaff(prev => [...prev, newStaff]);
        return newStaff;
    };

    const updateStaff = (id, updates) => {
        setStaff(prev => prev.map(member =>
            member.id === id ? { ...member, ...updates } : member
        ));
    };

    const deleteStaff = (id) => {
        setStaff(prev => prev.filter(member => member.id !== id));
    };

    const updateStaffPermissions = (id, permissions) => {
        setStaff(prev => prev.map(member =>
            member.id === id ? { ...member, permissions: { ...member.permissions, ...permissions } } : member
        ));
    };

    return (
        <CareOpsContext.Provider
            value={{
                business,
                setBusiness,
                leads,
                addLead,
                updateLead,
                bookings,
                addBooking,
                forms,
                addForm,
                updateFormStatus,
                messages,
                addMessage,
                // Onboarding state and methods
                onboardingStep,
                updateOnboardingStep,
                workspaceStatus,
                activateWorkspace,
                integrations,
                connectIntegration,
                disconnectIntegration,
                // Operations state and methods
                contacts,
                addContact,
                conversations,
                addConversation,
                addMessageToConversation,
                updateConversationStatus,
                bookingConfig,
                updateBookingConfig,
                // Forms Management
                formTemplates,
                addFormTemplate,
                updateFormTemplate,
                deleteFormTemplate,
                formSubmissions,
                sendFormsForBooking,
                updateFormSubmissionStatus,
                // Inventory/Resources
                resources,
                addResource,
                updateResource,
                deleteResource,
                deductResourceUsage,
                // Alerts
                alerts,
                addAlert,
                markAlertAsRead,
                clearAlert,
                generateAlertsForBooking,
                // Staff
                staff,
                addStaff,
                updateStaff,
                deleteStaff,
                updateStaffPermissions,
                // Workspace Activation
                canActivateWorkspace,
                getActivationChecklist,
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
