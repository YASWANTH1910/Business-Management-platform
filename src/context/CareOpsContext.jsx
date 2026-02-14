import { createContext, useState, useContext, useEffect } from 'react';

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
        email: {
            connected: false,
            status: 'disconnected',
            lastActivity: null,
            lastError: null,
            lastSuccess: null,
            totalSent: 0,
            totalFailed: 0
        },
        sms: {
            connected: false,
            status: 'disconnected',
            lastActivity: null,
            lastError: null,
            lastSuccess: null,
            totalSent: 0,
            totalFailed: 0
        }
    });

    // Operations state
    const [contacts, setContacts] = useState([]);
    const [conversations, setConversations] = useState([]);
    // Booking Configuration state
    const [bookingConfig, setBookingConfig] = useState({
        services: [],
        availability: { days: [], times: [] },
        location: { type: 'in-person', address: '' }
    });

    // Automation Events state
    const [automationEvents, setAutomationEvents] = useState([]);

    // DEVELOPMENT ONLY: Initialize with test data (comment out for production)
    // Uncomment the useEffect below to auto-populate test data
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
                email: {
                    connected: true,
                    status: 'connected',
                    lastActivity: new Date().toISOString(),
                    lastError: null,
                    lastSuccess: new Date().toISOString(),
                    totalSent: 0,
                    totalFailed: 0
                },
                sms: {
                    connected: true,
                    status: 'connected',
                    lastActivity: new Date().toISOString(),
                    lastError: null,
                    lastSuccess: new Date().toISOString(),
                    totalSent: 0,
                    totalFailed: 0
                }
            });

            // Add test conversations for Inbox
            const testConversations = [
                {
                    id: '1',
                    contactId: 'c1',
                    contactName: 'Sarah Johnson',
                    contactEmail: 'sarah@example.com',
                    contactPhone: '+1234567890',
                    status: 'New',
                    unreadCount: 2,
                    automationStatus: 'Active',
                    automationPausedAt: null,
                    automationPausedBy: null,
                    relatedBookingId: 'b1',
                    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
                    updatedAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
                    messages: [
                        {
                            id: 'm1',
                            conversationId: '1',
                            sender: 'system',
                            content: 'Welcome to CareOps! We\'re excited to help you.',
                            channel: 'email',
                            type: 'welcome',
                            deliveryStatus: 'delivered',
                            failureReason: null,
                            timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
                            read: true
                        },
                        {
                            id: 'm2',
                            conversationId: '1',
                            sender: 'customer',
                            content: 'Hi! I\'d like to book an appointment for next week.',
                            channel: 'email',
                            type: 'manual',
                            deliveryStatus: 'delivered',
                            failureReason: null,
                            timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
                            read: false
                        },
                        {
                            id: 'm3',
                            conversationId: '1',
                            sender: 'customer',
                            content: 'Are you available on Tuesday?',
                            channel: 'email',
                            type: 'manual',
                            deliveryStatus: 'delivered',
                            failureReason: null,
                            timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
                            read: false
                        }
                    ]
                },
                {
                    id: '2',
                    contactId: 'c2',
                    contactName: 'Mike Chen',
                    contactEmail: 'mike@example.com',
                    contactPhone: '+1987654321',
                    status: 'Open',
                    unreadCount: 0,
                    automationStatus: 'Paused',
                    automationPausedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
                    automationPausedBy: 'Staff',
                    relatedBookingId: null,
                    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
                    updatedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
                    messages: [
                        {
                            id: 'm4',
                            conversationId: '2',
                            sender: 'customer',
                            content: 'I need to reschedule my appointment',
                            channel: 'sms',
                            type: 'manual',
                            deliveryStatus: 'delivered',
                            failureReason: null,
                            timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
                            read: true
                        },
                        {
                            id: 'm5',
                            conversationId: '2',
                            sender: 'staff',
                            content: 'Of course! What day works best for you?',
                            channel: 'sms',
                            type: 'manual',
                            deliveryStatus: 'delivered',
                            failureReason: null,
                            timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
                            read: true
                        },
                        {
                            id: 'm5-timeline',
                            conversationId: '2',
                            sender: 'system',
                            content: 'Automation paused by Staff (manual intervention)',
                            channel: 'system',
                            type: 'timeline_event',
                            deliveryStatus: 'delivered',
                            failureReason: null,
                            timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
                            read: true
                        },
                        {
                            id: 'm6',
                            conversationId: '2',
                            sender: 'customer',
                            content: 'Friday afternoon would be perfect',
                            channel: 'sms',
                            type: 'manual',
                            deliveryStatus: 'delivered',
                            failureReason: null,
                            timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
                            read: true
                        }
                    ]
                },
                {
                    id: '3',
                    contactId: 'c3',
                    contactName: 'Emma Davis',
                    contactEmail: 'emma@example.com',
                    contactPhone: '+1122334455',
                    status: 'Open',
                    unreadCount: 0,
                    automationStatus: 'None',
                    automationPausedAt: null,
                    automationPausedBy: null,
                    relatedBookingId: 'b2',
                    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
                    updatedAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
                    messages: [
                        {
                            id: 'm7',
                            conversationId: '3',
                            sender: 'system',
                            content: 'Your booking has been confirmed for March 15th at 2:00 PM',
                            channel: 'email',
                            type: 'booking_confirmation',
                            deliveryStatus: 'delivered',
                            failureReason: null,
                            timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
                            read: true
                        },
                        {
                            id: 'm8',
                            conversationId: '3',
                            sender: 'system',
                            content: 'Reminder: Please complete your intake form before your appointment',
                            channel: 'email',
                            type: 'form_reminder',
                            deliveryStatus: 'delivered',
                            failureReason: null,
                            timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
                            read: true
                        },
                        {
                            id: 'm9',
                            conversationId: '3',
                            sender: 'staff',
                            content: 'Looking forward to seeing you! Please arrive 10 minutes early.',
                            channel: 'email',
                            type: 'manual',
                            deliveryStatus: 'failed',
                            failureReason: 'Email delivery failed: Invalid recipient address',
                            timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
                            read: true
                        }
                    ]
                }
            ];

            setConversations(testConversations);
        }
    }, []);


    const addLead = (lead) => setLeads((prev) => [...prev, lead]);
    const updateLead = (id, updates) => setLeads((prev) =>
        prev.map((lead) => (lead.id === id ? { ...lead, ...updates } : lead))
    );
    const addBooking = (booking) => {
        const newBooking = {
            id: Date.now().toString(),
            ...booking,
            status: booking.status || 'Confirmed',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            updatedBy: null
        };
        setBookings(prev => [...prev, newBooking]);
        return newBooking;
    };
    const addForm = (form) => setForms((prev) => [...prev, form]);
    const addMessage = (message) => setMessages((prev) => [...prev, message]);

    // Onboarding methods
    const updateOnboardingStep = (step) => setOnboardingStep(step);

    const activateWorkspace = () => {
        setWorkspaceStatus('active');
    };

    // Integration connection methods
    const connectIntegration = (type) => {
        setIntegrations(prev => ({
            ...prev,
            [type]: {
                ...prev[type],
                connected: true,
                status: 'connected',
                lastActivity: new Date().toISOString(),
                lastSuccess: new Date().toISOString()
            }
        }));
    };

    const disconnectIntegration = (type) => {
        setIntegrations(prev => ({
            ...prev,
            [type]: {
                ...prev[type],
                connected: false,
                status: 'disconnected',
                lastActivity: new Date().toISOString()
            }
        }));
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


    // Operations methods
    const findOrCreateContact = (contactInfo) => {
        // Check for existing contact by email or phone
        const existing = contacts.find(c =>
            (contactInfo.email && c.email === contactInfo.email) ||
            (contactInfo.phone && c.phone === contactInfo.phone)
        );

        if (existing) {
            // Update contact info if new data provided
            const updated = {
                ...existing,
                name: contactInfo.name || existing.name,
                email: contactInfo.email || existing.email,
                phone: contactInfo.phone || existing.phone
            };
            setContacts(prev => prev.map(c => c.id === existing.id ? updated : c));
            return updated;
        }

        // Create new contact
        return addContact(contactInfo);
    };

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
            unreadCount: 0,
            automationStatus: conversation.automationStatus || 'None',
            automationPausedAt: null,
            automationPausedBy: null,
            relatedBookingId: conversation.relatedBookingId || null,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        setConversations(prev => [...prev, newConversation]);

        // Generate alert for new conversation
        addAlert({
            type: 'Conversation',
            severity: 'Info',
            message: `New conversation from ${conversation.contactName}`,
            relatedEntity: { type: 'conversation', id: newConversation.id }
        });

        return newConversation;
    };

    const findOrCreateConversation = (contactId, contactName, options = {}) => {
        // Find existing conversation for this contact
        const existing = conversations.find(c => c.contactId === contactId);

        if (existing) {
            // Update conversation if needed (e.g., link booking)
            if (options.relatedBookingId && !existing.relatedBookingId) {
                setConversations(prev => prev.map(conv =>
                    conv.id === existing.id
                        ? { ...conv, relatedBookingId: options.relatedBookingId }
                        : conv
                ));
            }
            return existing;
        }

        // Create new conversation
        return addConversation({
            contactId,
            contactName,
            contactEmail: options.contactEmail,
            contactPhone: options.contactPhone,
            automationStatus: options.automationStatus || 'Active',
            relatedBookingId: options.relatedBookingId || null
        });
    };

    const sendWelcomeMessage = (conversationId, contactName) => {
        const channel = integrations.email.connected ? 'email' : 'sms';
        const message = {
            id: Date.now().toString(),
            conversationId,
            sender: 'system',
            content: `Hi ${contactName}! Thanks for reaching out. We've received your message and will get back to you soon.`,
            channel,
            type: 'welcome',
            deliveryStatus: 'delivered',
            failureReason: null,
            timestamp: new Date().toISOString(),
            read: true
        };

        // Log automation event
        logAutomationEvent({
            trigger: 'CONTACT_CREATED',
            action: 'SEND_WELCOME_MESSAGE',
            conversationId,
            relatedEntity: { type: 'contact', id: contactName },
            status: 'SUCCESS'
        });

        // Add to conversation
        setConversations(prev => prev.map(conv => {
            if (conv.id === conversationId) {
                return {
                    ...conv,
                    messages: [...conv.messages, message]
                };
            }
            return conv;
        }));

        return message;
    };

    const sendBookingConfirmation = (conversationId, bookingDetails) => {
        const channel = integrations.email.connected ? 'email' : 'sms';
        const message = {
            id: Date.now().toString(),
            conversationId,
            sender: 'system',
            content: `Booking confirmed! ${bookingDetails.service} on ${bookingDetails.date} at ${bookingDetails.time}. We look forward to seeing you!`,
            channel,
            type: 'booking_confirmation',
            deliveryStatus: 'delivered',
            failureReason: null,
            timestamp: new Date().toISOString(),
            read: true
        };

        // Log automation event
        logAutomationEvent({
            trigger: 'BOOKING_CREATED',
            action: 'SEND_BOOKING_CONFIRMATION',
            conversationId,
            relatedEntity: { type: 'booking', id: bookingDetails.id },
            status: 'SUCCESS'
        });

        setConversations(prev => prev.map(conv => {
            if (conv.id === conversationId) {
                return {
                    ...conv,
                    messages: [...conv.messages, message]
                };
            }
            return conv;
        }));

        return message;
    };

    const scheduleReminders = (conversationId, bookingDetails) => {
        const bookingDateTime = new Date(`${bookingDetails.date}T${bookingDetails.time}`);
        const now = new Date();

        // Calculate reminder times
        const reminder24h = new Date(bookingDateTime.getTime() - 24 * 60 * 60 * 1000);
        const reminder1h = new Date(bookingDateTime.getTime() - 1 * 60 * 60 * 1000);

        const channel = integrations.email.connected ? 'email' : 'sms';

        // Log automation event for scheduling
        logAutomationEvent({
            trigger: 'BOOKING_CREATED',
            action: 'SCHEDULE_REMINDERS',
            conversationId,
            relatedEntity: { type: 'booking', id: bookingDetails.id },
            status: 'SUCCESS',
            metadata: { reminders: ['24h', '1h'], bookingDateTime: bookingDateTime.toISOString() }
        });

        // Schedule 24-hour reminder
        if (reminder24h > now) {
            const delay = reminder24h.getTime() - now.getTime();
            setTimeout(() => {
                // Check if automation is still active
                setConversations(current => {
                    const conv = current.find(c => c.id === conversationId);
                    if (conv && conv.automationStatus === 'Active') {
                        const message = {
                            id: Date.now().toString() + '-24h',
                            conversationId,
                            sender: 'system',
                            content: `Reminder: You have an appointment tomorrow at ${bookingDetails.time} for ${bookingDetails.service}.`,
                            channel,
                            type: 'form_reminder',
                            deliveryStatus: 'delivered',
                            failureReason: null,
                            timestamp: new Date().toISOString(),
                            read: true
                        };

                        // Log automation event
                        logAutomationEvent({
                            trigger: 'REMINDER_TIME_REACHED',
                            action: 'SEND_24H_REMINDER',
                            conversationId,
                            relatedEntity: { type: 'booking', id: bookingDetails.id },
                            status: 'SUCCESS'
                        });

                        return current.map(c => {
                            if (c.id === conversationId) {
                                return {
                                    ...c,
                                    messages: [...c.messages, message]
                                };
                            }
                            return c;
                        });
                    } else {
                        // Log automation skipped
                        logAutomationEvent({
                            trigger: 'REMINDER_TIME_REACHED',
                            action: 'SEND_24H_REMINDER',
                            conversationId,
                            relatedEntity: { type: 'booking', id: bookingDetails.id },
                            status: 'SKIPPED',
                            failureReason: 'Automation paused'
                        });
                    }
                    return current;
                });
            }, delay);
        }

        // Schedule 1-hour reminder
        if (reminder1h > now) {
            const delay = reminder1h.getTime() - now.getTime();
            setTimeout(() => {
                setConversations(current => {
                    const conv = current.find(c => c.id === conversationId);
                    if (conv && conv.automationStatus === 'Active') {
                        const message = {
                            id: Date.now().toString() + '-1h',
                            conversationId,
                            sender: 'system',
                            content: `Reminder: Your appointment is in 1 hour at ${bookingDetails.time}. See you soon!`,
                            channel,
                            type: 'form_reminder',
                            deliveryStatus: 'delivered',
                            failureReason: null,
                            timestamp: new Date().toISOString(),
                            read: true
                        };

                        // Log automation event
                        logAutomationEvent({
                            trigger: 'REMINDER_TIME_REACHED',
                            action: 'SEND_1H_REMINDER',
                            conversationId,
                            relatedEntity: { type: 'booking', id: bookingDetails.id },
                            status: 'SUCCESS'
                        });

                        return current.map(c => {
                            if (c.id === conversationId) {
                                return {
                                    ...c,
                                    messages: [...c.messages, message]
                                };
                            }
                            return c;
                        });
                    } else {
                        // Log automation skipped
                        logAutomationEvent({
                            trigger: 'REMINDER_TIME_REACHED',
                            action: 'SEND_1H_REMINDER',
                            conversationId,
                            relatedEntity: { type: 'booking', id: bookingDetails.id },
                            status: 'SKIPPED',
                            failureReason: 'Automation paused'
                        });
                    }
                    return current;
                });
            }, delay);
        }
    };

    const addMessageToConversation = (conversationId, message) => {
        const newMessage = {
            id: Date.now().toString(),
            ...message,
            timestamp: new Date().toISOString()
        };

        let updatedConversation = null;
        setConversations(prev => prev.map(conv => {
            if (conv.id === conversationId) {
                updatedConversation = {
                    ...conv,
                    messages: [...conv.messages, newMessage],
                    updatedAt: new Date().toISOString()
                };
                return updatedConversation;
            }
            return conv;
        }));

        // Generate alert if customer message is unanswered for >2 hours
        if (message.sender === 'customer' && updatedConversation) {
            const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000);
            const messageTime = new Date(newMessage.timestamp);

            // Check if this is an unanswered message (last message from customer)
            const lastStaffMessage = updatedConversation.messages
                .filter(m => m.sender === 'staff')
                .pop();

            if (!lastStaffMessage || new Date(lastStaffMessage.timestamp) < messageTime) {
                // Set timeout to create alert after 2 hours if still unanswered
                setTimeout(() => {
                    setConversations(current => {
                        const conv = current.find(c => c.id === conversationId);
                        if (conv) {
                            const stillUnanswered = conv.messages[conv.messages.length - 1]?.sender === 'customer';
                            if (stillUnanswered) {
                                addAlert({
                                    type: 'Conversation',
                                    severity: 'Warning',
                                    message: `Unanswered message from ${conv.contactName}`,
                                    relatedEntity: { type: 'conversation', id: conversationId }
                                });
                            }
                        }
                        return current;
                    });
                }, 2 * 60 * 60 * 1000); // 2 hours
            }
        }

        return newMessage;
    };

    const updateConversationStatus = (conversationId, status) => {
        setConversations(prev => prev.map(conv =>
            conv.id === conversationId ? { ...conv, status } : conv
        ));
    };

    // Inbox System Methods
    const sendMessage = async (conversationId, messageContent, channel = 'email', staffName = 'Staff') => {
        // Mock delivery logic with 10% failure rate
        const mockDelivery = () => {
            return new Promise((resolve) => {
                setTimeout(() => {
                    const failed = Math.random() < 0.1; // 10% failure rate
                    if (failed) {
                        resolve({
                            status: 'failed',
                            reason: channel === 'email'
                                ? 'Email delivery failed: Invalid recipient address'
                                : 'SMS delivery failed: Phone number unreachable'
                        });
                    } else {
                        resolve({ status: 'delivered' });
                    }
                }, 500); // Simulate network delay
            });
        };

        // Create message object
        const newMessage = {
            id: Date.now().toString(),
            conversationId,
            sender: 'staff',
            content: messageContent,
            channel,
            type: 'manual',
            deliveryStatus: 'pending',
            failureReason: null,
            timestamp: new Date().toISOString(),
            read: true
        };

        // Add message to conversation
        let updatedConversation = null;
        setConversations(prev => prev.map(conv => {
            if (conv.id === conversationId) {
                updatedConversation = {
                    ...conv,
                    messages: [...conv.messages, newMessage],
                    updatedAt: new Date().toISOString()
                };

                // Pause automation if active
                if (conv.automationStatus === 'Active') {
                    updatedConversation.automationStatus = 'Paused';
                    updatedConversation.automationPausedAt = new Date().toISOString();
                    updatedConversation.automationPausedBy = staffName;

                    // Add timeline event
                    const timelineEvent = {
                        id: Date.now().toString() + '-timeline',
                        conversationId,
                        sender: 'system',
                        content: `Automation paused by ${staffName} (manual intervention)`,
                        channel: 'system',
                        type: 'timeline_event',
                        deliveryStatus: 'delivered',
                        failureReason: null,
                        timestamp: new Date().toISOString(),
                        read: true
                    };
                    updatedConversation.messages.push(timelineEvent);
                }

                return updatedConversation;
            }
            return conv;
        }));

        // Attempt delivery
        const deliveryResult = await mockDelivery();

        // Update message delivery status
        setConversations(prev => prev.map(conv => {
            if (conv.id === conversationId) {
                return {
                    ...conv,
                    messages: conv.messages.map(msg =>
                        msg.id === newMessage.id
                            ? {
                                ...msg,
                                deliveryStatus: deliveryResult.status,
                                failureReason: deliveryResult.reason || null
                            }
                            : msg
                    )
                };
            }
            return conv;
        }));

        // Create alert if delivery failed
        if (deliveryResult.status === 'failed' && updatedConversation) {
            addAlert({
                type: 'Conversation',
                severity: 'Critical',
                message: `Message delivery failed: ${updatedConversation.contactName} - ${deliveryResult.reason}`,
                relatedEntity: { type: 'conversation', id: conversationId }
            });
        }

        return { ...newMessage, ...deliveryResult };
    };

    const pauseAutomation = (conversationId, staffName = 'Staff') => {
        setConversations(prev => prev.map(conv => {
            if (conv.id === conversationId && conv.automationStatus === 'Active') {
                // Add timeline event
                const timelineEvent = {
                    id: Date.now().toString() + '-timeline',
                    conversationId,
                    sender: 'system',
                    content: `Automation manually paused by ${staffName}`,
                    channel: 'system',
                    type: 'timeline_event',
                    deliveryStatus: 'delivered',
                    failureReason: null,
                    timestamp: new Date().toISOString(),
                    read: true
                };

                return {
                    ...conv,
                    automationStatus: 'Paused',
                    automationPausedAt: new Date().toISOString(),
                    automationPausedBy: staffName,
                    messages: [...conv.messages, timelineEvent]
                };
            }
            return conv;
        }));
    };

    const resumeAutomation = (conversationId) => {
        setConversations(prev => prev.map(conv => {
            if (conv.id === conversationId && conv.automationStatus === 'Paused') {
                // Add timeline event
                const timelineEvent = {
                    id: Date.now().toString() + '-timeline',
                    conversationId,
                    sender: 'system',
                    content: 'Automation resumed',
                    channel: 'system',
                    type: 'timeline_event',
                    deliveryStatus: 'delivered',
                    failureReason: null,
                    timestamp: new Date().toISOString(),
                    read: true
                };

                return {
                    ...conv,
                    automationStatus: 'Active',
                    automationPausedAt: null,
                    automationPausedBy: null,
                    messages: [...conv.messages, timelineEvent]
                };
            }
            return conv;
        }));
    };

    const markConversationAsRead = (conversationId) => {
        setConversations(prev => prev.map(conv => {
            if (conv.id === conversationId) {
                return {
                    ...conv,
                    unreadCount: 0,
                    messages: conv.messages.map(msg => ({ ...msg, read: true }))
                };
            }
            return conv;
        }));
    };

    const updateMessageDeliveryStatus = (conversationId, messageId, status, reason = null) => {
        setConversations(prev => prev.map(conv => {
            if (conv.id === conversationId) {
                return {
                    ...conv,
                    messages: conv.messages.map(msg =>
                        msg.id === messageId
                            ? { ...msg, deliveryStatus: status, failureReason: reason }
                            : msg
                    )
                };
            }
            return conv;
        }));
    };

    const updateBookingConfig = (config) => {
        setBookingConfig(prev => ({ ...prev, ...config }));
    };

    const updateBookingStatus = (bookingId, newStatus, staffName = 'Staff') => {
        setBookings(prev => prev.map(booking => {
            if (booking.id === bookingId) {
                const updated = {
                    ...booking,
                    status: newStatus,
                    updatedAt: new Date().toISOString(),
                    updatedBy: staffName
                };

                // Find related conversation
                const conversation = conversations.find(c => c.relatedBookingId === bookingId);

                // Handle status-specific logic
                if (newStatus === 'Completed') {
                    // Log completion in conversation
                    if (conversation) {
                        addMessageToConversation(conversation.id, {
                            sender: 'system',
                            content: `Booking marked as completed by ${staffName}`,
                            channel: 'system',
                            type: 'timeline_event',
                            deliveryStatus: 'delivered',
                            read: true
                        });
                    }
                }

                if (newStatus === 'No-show') {
                    // Log no-show in conversation
                    if (conversation) {
                        addMessageToConversation(conversation.id, {
                            sender: 'system',
                            content: `Booking marked as no-show by ${staffName}`,
                            channel: 'system',
                            type: 'timeline_event',
                            deliveryStatus: 'delivered',
                            read: true
                        });
                    }

                    // Generate alert
                    addAlert({
                        type: 'Booking',
                        severity: 'Warning',
                        message: `No-show: ${booking.customerName} - ${booking.service}`,
                        relatedEntity: { type: 'booking', id: bookingId }
                    });
                }

                return updated;
            }
            return booking;
        }));
    };

    const resendForm = (formSubmissionId, conversationId, staffName = 'Staff') => {
        // Update form submission
        setFormSubmissions(prev => prev.map(form => {
            if (form.id === formSubmissionId) {
                return {
                    ...form,
                    resentAt: new Date().toISOString(),
                    resentBy: staffName
                };
            }
            return form;
        }));

        // Log in conversation
        addMessageToConversation(conversationId, {
            sender: 'system',
            content: `Form resent by ${staffName}`,
            channel: 'system',
            type: 'timeline_event',
            deliveryStatus: 'delivered',
            read: true
        });
    };

    const markFormAsCompleted = (formSubmissionId, conversationId, staffName = 'Staff') => {
        // Update form status
        updateFormSubmissionStatus(formSubmissionId, 'Completed');

        // Log in conversation
        addMessageToConversation(conversationId, {
            sender: 'system',
            content: `Form marked as completed by ${staffName} (received offline)`,
            channel: 'system',
            type: 'timeline_event',
            deliveryStatus: 'delivered',
            read: true
        });
    };

    // Automation Event Logger
    const logAutomationEvent = (event) => {
        const automationEvent = {
            id: Date.now().toString() + '-auto',
            trigger: event.trigger,
            action: event.action,
            conversationId: event.conversationId || null,
            relatedEntity: event.relatedEntity || null,
            timestamp: event.timestamp || new Date().toISOString(),
            status: event.status || 'SUCCESS',
            failureReason: event.failureReason || null,
            metadata: event.metadata || {}
        };

        setAutomationEvents(prev => [...prev, automationEvent]);

        // Also log in conversation timeline if conversationId provided
        if (event.conversationId && event.status !== 'SKIPPED') {
            addMessageToConversation(event.conversationId, {
                sender: 'system',
                content: `[Automation] ${event.trigger} → ${event.action}`,
                channel: 'system',
                type: 'automation_event',
                deliveryStatus: 'delivered',
                read: true
            });
        }

        return automationEvent;
    };

    // Integration Services Layer
    const sendEmail = async (payload) => {
        // Simulate email sending (replace with actual API call in production)
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                // Simulate 90% success rate
                if (Math.random() > 0.1) {
                    resolve({
                        messageId: Date.now().toString(),
                        status: 'sent',
                        timestamp: new Date().toISOString()
                    });
                } else {
                    reject(new Error('Email service unavailable'));
                }
            }, 500);
        });
    };

    const sendSMS = async (payload) => {
        // Simulate SMS sending (replace with actual API call in production)
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                // Simulate 90% success rate
                if (Math.random() > 0.1) {
                    resolve({
                        messageId: Date.now().toString(),
                        status: 'sent',
                        timestamp: new Date().toISOString()
                    });
                } else {
                    reject(new Error('SMS service unavailable'));
                }
            }, 500);
        });
    };

    const updateIntegrationStatus = (channel, result, errorMessage = null) => {
        setIntegrations(prev => ({
            ...prev,
            [channel]: {
                ...prev[channel],
                status: result === 'success' ? 'connected' : 'error',
                lastActivity: new Date().toISOString(),
                lastError: errorMessage,
                lastSuccess: result === 'success' ? new Date().toISOString() : prev[channel].lastSuccess,
                totalSent: result === 'success' ? (prev[channel].totalSent || 0) + 1 : prev[channel].totalSent || 0,
                totalFailed: result === 'error' ? (prev[channel].totalFailed || 0) + 1 : prev[channel].totalFailed || 0
            }
        }));
    };

    const sendIntegrationMessage = async (channel, payload) => {
        try {
            let result;

            if (channel === 'email') {
                result = await sendEmail(payload);
            } else if (channel === 'sms') {
                result = await sendSMS(payload);
            } else {
                throw new Error(`Unsupported channel: ${channel}`);
            }

            // Update integration status on success
            updateIntegrationStatus(channel, 'success');

            return { success: true, result };
        } catch (error) {
            // Update integration status on failure
            updateIntegrationStatus(channel, 'error', error.message);

            // Create integration alert
            createIntegrationAlert(channel, error.message);

            return { success: false, error: error.message };
        }
    };

    const createIntegrationAlert = (channel, errorMessage) => {
        const alert = {
            id: Date.now().toString(),
            type: 'integration',
            severity: 'warning',
            title: `${channel.toUpperCase()} Integration Error`,
            message: `Failed to send via ${channel}: ${errorMessage}`,
            resourceId: null,
            resourceName: null,
            currentQuantity: null,
            threshold: null,
            timestamp: new Date().toISOString(),
            dismissed: false,
            dismissedAt: null,
            dismissedBy: null,
            notificationSent: false,
            notificationChannel: null,
            notificationStatus: null
        };

        setAlerts(prev => [...prev, alert]);
    };

    // Inventory Alert Creation
    const createInventoryAlert = (resource, currentQuantity, threshold) => {
        // Check if alert already exists for this resource at this threshold
        const existingAlert = alerts.find(a =>
            a.type === 'inventory' &&
            a.resourceId === resource.id &&
            a.currentQuantity === currentQuantity &&
            !a.dismissed
        );

        if (existingAlert) {
            return; // Prevent duplicate
        }

        const severity = currentQuantity === 0 ? 'critical' : 'warning';

        const alert = {
            id: Date.now().toString(),
            type: 'inventory',
            severity,
            title: `Low Stock: ${resource.name}`,
            message: `${resource.name} is ${currentQuantity === 0 ? 'out of stock' : `running low (${currentQuantity} remaining)`}. Threshold: ${threshold}`,
            resourceId: resource.id,
            resourceName: resource.name,
            currentQuantity,
            threshold,
            timestamp: new Date().toISOString(),
            dismissed: false,
            dismissedAt: null,
            dismissedBy: null,
            notificationSent: false,
            notificationChannel: null,
            notificationStatus: 'pending'
        };

        setAlerts(prev => [...prev, alert]);

        // Send notification
        sendAlertNotification(alert);

        // Log automation event
        logAutomationEvent({
            trigger: 'INVENTORY_THRESHOLD_REACHED',
            action: 'CREATE_INVENTORY_ALERT',
            relatedEntity: { type: 'resource', id: resource.id },
            status: 'SUCCESS',
            metadata: { severity, currentQuantity, threshold }
        });

        return alert;
    };

    const sendAlertNotification = async (alert) => {
        try {
            // Determine channel
            const channel = integrations.email.connected ? 'email' :
                integrations.sms.connected ? 'sms' : 'inbox';

            if (channel === 'email' || channel === 'sms') {
                const result = await sendIntegrationMessage(channel, {
                    to: business?.email || business?.phone,
                    subject: alert.title,
                    body: alert.message
                });

                if (result.success) {
                    updateAlertNotificationStatus(alert.id, 'sent', channel);
                } else {
                    // Fallback to inbox
                    logAlertInInbox(alert);
                    updateAlertNotificationStatus(alert.id, 'failed', 'inbox');
                }
            } else {
                // No integration, log in inbox
                logAlertInInbox(alert);
                updateAlertNotificationStatus(alert.id, 'sent', 'inbox');
            }
        } catch (error) {
            // Fallback to inbox
            logAlertInInbox(alert);
            updateAlertNotificationStatus(alert.id, 'failed', 'inbox');
        }
    };

    const logAlertInInbox = (alert) => {
        // Create system conversation for alerts
        const alertConversation = findOrCreateConversation('system-alerts', 'System Alerts', {
            automationStatus: 'Active'
        });

        addMessageToConversation(alertConversation.id, {
            sender: 'system',
            content: `[ALERT] ${alert.title}: ${alert.message}`,
            channel: 'system',
            type: 'alert',
            deliveryStatus: 'delivered',
            read: false
        });
    };

    const updateAlertNotificationStatus = (alertId, status, channel) => {
        setAlerts(prev => prev.map(alert => {
            if (alert.id === alertId) {
                return {
                    ...alert,
                    notificationSent: status === 'sent',
                    notificationChannel: channel,
                    notificationStatus: status
                };
            }
            return alert;
        }));
    };

    const dismissAlert = (alertId, dismissedBy = 'Admin') => {
        setAlerts(prev => prev.map(alert => {
            if (alert.id === alertId) {
                return {
                    ...alert,
                    dismissed: true,
                    dismissedAt: new Date().toISOString(),
                    dismissedBy
                };
            }
            return alert;
        }));
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
                findOrCreateContact,
                conversations,
                addConversation,
                findOrCreateConversation,
                addMessageToConversation,
                updateConversationStatus,
                // Customer Flow Automation
                sendWelcomeMessage,
                sendBookingConfirmation,
                scheduleReminders,
                // Inbox System Methods
                sendMessage,
                pauseAutomation,
                resumeAutomation,
                markConversationAsRead,
                updateMessageDeliveryStatus,
                bookings,
                addBooking,
                updateBookingStatus,
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
                resendForm,
                markFormAsCompleted,
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
                // Automation
                automationEvents,
                logAutomationEvent,
                // Infrastructure
                dismissAlert,
                createInventoryAlert,
                sendIntegrationMessage,
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
