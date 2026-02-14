import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useCareOps } from '../../context/CareOpsContext';
import { Calendar, Clock, CheckCircle, User, Mail, Phone } from 'lucide-react';

const PublicBookingPage = () => {
    const { businessId } = useParams();
    const {
        bookingConfig,
        findOrCreateContact,
        findOrCreateConversation,
        sendBookingConfirmation,
        scheduleReminders,
        addMessageToConversation,
        addBooking,
        integrations,
        sendFormsForBooking,
        deductResourceUsage,
        generateAlertsForBooking
    } = useCareOps();
    const [step, setStep] = useState(1); // 1: Select Service, 2: Select Time, 3: Enter Info, 4: Confirmed
    const [selectedService, setSelectedService] = useState(null);
    const [selectedDate, setSelectedDate] = useState('');
    const [selectedTime, setSelectedTime] = useState('');
    const [customerInfo, setCustomerInfo] = useState({ name: '', email: '', phone: '' });

    const handleServiceSelect = (service) => {
        setSelectedService(service);
        setStep(2);
    };

    const handleTimeSelect = () => {
        if (selectedDate && selectedTime) {
            setStep(3);
        }
    };

    const handleBookingConfirm = (e) => {
        e.preventDefault();

        // Find or create contact (prevents duplicates)
        const contact = findOrCreateContact(customerInfo);

        // Create booking
        const booking = addBooking({
            id: Date.now().toString(),
            contactId: contact.id,
            customerName: customerInfo.name,
            service: selectedService.name,
            serviceId: selectedService.id,
            date: selectedDate,
            time: selectedTime,
            duration: selectedService.duration,
            location: selectedService.location,
            status: 'Confirmed',
            createdAt: new Date().toISOString()
        });

        // Find or create conversation with booking linkage
        const conversation = findOrCreateConversation(contact.id, contact.name, {
            contactEmail: contact.email,
            contactPhone: contact.phone,
            automationStatus: 'Active',
            relatedBookingId: booking.id
        });

        // Send automated booking confirmation
        sendBookingConfirmation(conversation.id, {
            service: selectedService.name,
            date: selectedDate,
            time: selectedTime
        });

        // Automatically send forms linked to this booking type
        const sentForms = sendFormsForBooking(booking.id, selectedService.id);

        if (sentForms.length > 0) {
            // Notify about forms in conversation
            const channel = integrations.email.connected ? 'email' : 'sms';
            addMessageToConversation(conversation.id, {
                sender: 'system',
                content: `We've sent you ${sentForms.length} form(s) to complete before your appointment. Please check your ${channel}.`,
                channel,
                type: 'form_reminder',
                deliveryStatus: 'delivered',
                read: true
            });
        }

        // Schedule automated reminders (24h and 1h before)
        scheduleReminders(conversation.id, {
            service: selectedService.name,
            date: selectedDate,
            time: selectedTime
        });

        // Deduct resources for this booking type
        deductResourceUsage(selectedService.id);

        // Generate alerts for this booking
        generateAlertsForBooking(booking);

        setStep(4);
    };

    if (step === 4) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 flex items-center justify-center p-4">
                <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8 text-center animate-fade-in">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full mb-6 shadow-lg">
                        <CheckCircle className="w-12 h-12 text-white" />
                    </div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-4">
                        Booking Confirmed! 🎉
                    </h1>
                    <div className="bg-slate-50 rounded-xl p-6 text-left mb-6">
                        <h3 className="font-bold text-slate-900 mb-3">Appointment Details</h3>
                        <div className="space-y-2 text-sm">
                            <p><strong>Service:</strong> {selectedService.name}</p>
                            <p><strong>Date:</strong> {selectedDate}</p>
                            <p><strong>Time:</strong> {selectedTime}</p>
                            <p><strong>Duration:</strong> {selectedService.duration} minutes</p>
                            <p><strong>Location:</strong> {selectedService.location}</p>
                        </div>
                    </div>
                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-sm text-blue-900">
                        <p className="font-semibold mb-1">📋 Intake Form Sent</p>
                        <p>Please complete the intake form we sent you before your appointment.</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center p-4">
            <div className="max-w-2xl w-full bg-white rounded-2xl shadow-2xl p-8">
                {/* Progress */}
                <div className="mb-8">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-semibold text-slate-700">Step {step} of 3</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2">
                        <div
                            className="bg-gradient-to-r from-indigo-600 to-purple-600 h-2 rounded-full transition-all duration-500"
                            style={{ width: `${(step / 3) * 100}%` }}
                        ></div>
                    </div>
                </div>

                {/* Step 1: Select Service */}
                {step === 1 && (
                    <div>
                        <h2 className="text-2xl font-bold text-slate-900 mb-6">Select a Service</h2>
                        <div className="space-y-3">
                            {bookingConfig.services.map(service => (
                                <div
                                    key={service.id}
                                    onClick={() => handleServiceSelect(service)}
                                    className="p-4 border-2 border-slate-200 rounded-xl hover:border-indigo-500 hover:bg-indigo-50 cursor-pointer transition-all"
                                >
                                    <h3 className="font-bold text-slate-900">{service.name}</h3>
                                    <div className="flex items-center space-x-4 mt-2 text-sm text-slate-600">
                                        <span className="flex items-center space-x-1">
                                            <Clock className="w-4 h-4" />
                                            <span>{service.duration} min</span>
                                        </span>
                                        <span className="capitalize">{service.location}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Step 2: Select Date & Time */}
                {step === 2 && (
                    <div>
                        <h2 className="text-2xl font-bold text-slate-900 mb-6">Select Date & Time</h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">Date</label>
                                <input
                                    type="date"
                                    value={selectedDate}
                                    onChange={(e) => setSelectedDate(e.target.value)}
                                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">Time</label>
                                <select
                                    value={selectedTime}
                                    onChange={(e) => setSelectedTime(e.target.value)}
                                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                                >
                                    <option value="">Select a time...</option>
                                    {bookingConfig.availability.timeSlots.map(time => (
                                        <option key={time} value={time}>{time}</option>
                                    ))}
                                </select>
                            </div>
                            <button
                                onClick={handleTimeSelect}
                                disabled={!selectedDate || !selectedTime}
                                className="w-full px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold rounded-xl hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Continue
                            </button>
                        </div>
                    </div>
                )}

                {/* Step 3: Enter Info */}
                {step === 3 && (
                    <div>
                        <h2 className="text-2xl font-bold text-slate-900 mb-6">Your Information</h2>
                        <form onSubmit={handleBookingConfirm} className="space-y-4">
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">
                                    <User className="w-4 h-4 inline mr-1" />
                                    Name *
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={customerInfo.name}
                                    onChange={(e) => setCustomerInfo(prev => ({ ...prev, name: e.target.value }))}
                                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">
                                    <Mail className="w-4 h-4 inline mr-1" />
                                    Email *
                                </label>
                                <input
                                    type="email"
                                    required
                                    value={customerInfo.email}
                                    onChange={(e) => setCustomerInfo(prev => ({ ...prev, email: e.target.value }))}
                                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">
                                    <Phone className="w-4 h-4 inline mr-1" />
                                    Phone
                                </label>
                                <input
                                    type="tel"
                                    value={customerInfo.phone}
                                    onChange={(e) => setCustomerInfo(prev => ({ ...prev, phone: e.target.value }))}
                                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                                />
                            </div>
                            <button
                                type="submit"
                                className="w-full px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold rounded-xl hover:shadow-lg transition-all"
                            >
                                Confirm Booking
                            </button>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PublicBookingPage;
