
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useCareOps } from '../../context/CareOpsContext';
import {
    Calendar as CalendarIcon,
    Clock,
    CheckCircle,
    User,
    Mail,
    Phone,
    MapPin,
    ChevronLeft,
    ChevronRight,
    ArrowRight,
    Star,
    Sparkles
} from 'lucide-react';

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

    // Steps: 1: Service, 2: Date & Time, 3: Details, 4: Confirmed
    const [step, setStep] = useState(1);
    const [selectedService, setSelectedService] = useState(null);
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedTime, setSelectedTime] = useState(null);
    const [customerInfo, setCustomerInfo] = useState({ name: '', email: '', phone: '' });
    const [loading, setLoading] = useState(false);

    // Helper: Scroll to top on step change
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [step]);

    const handleServiceSelect = (service) => {
        setSelectedService(service);
        setStep(2);
    };

    const handleTimeSelect = (time) => {
        setSelectedTime(time);
    };

    const handleContinue = () => {
        if (step === 2 && selectedDate && selectedTime) setStep(3);
        if (step === 3 && customerInfo.name && customerInfo.email) handleSubmitBooking();
    };

    const handleBack = () => {
        if (step > 1) setStep(step - 1);
    };

    const handleSubmitBooking = async () => {
        setLoading(true);
        // Simulate network delay for better UX
        await new Promise(resolve => setTimeout(resolve, 1500));

        // Format Date string YYYY-MM-DD
        const dateStr = selectedDate.toISOString().split('T')[0];

        // 1. Find/Create Contact
        const contact = findOrCreateContact(customerInfo);

        // 2. Create Booking
        const booking = addBooking({
            id: Date.now().toString(),
            contactId: contact.id,
            customerName: customerInfo.name,
            service: selectedService.name,
            serviceId: selectedService.id,
            date: dateStr,
            time: selectedTime,
            duration: selectedService.duration,
            location: selectedService.location || 'In-Person',
            status: 'Confirmed',
            createdAt: new Date().toISOString()
        });

        // 3. Conversation & Messaging Logic
        const conversation = findOrCreateConversation(contact.id, contact.name, {
            contactEmail: contact.email,
            contactPhone: contact.phone,
            automationStatus: 'Active',
            relatedBookingId: booking.id
        });

        // 4. Send Comms & Forms
        sendBookingConfirmation(conversation.id, {
            service: selectedService.name,
            date: dateStr,
            time: selectedTime
        });

        const sentForms = sendFormsForBooking(booking.id, selectedService.id);
        if (sentForms.length > 0) {
            const channel = integrations.email.connected ? 'email' : 'sms';
            addMessageToConversation(conversation.id, {
                sender: 'system',
                content: `We've sent you ${sentForms.length} form(s) to complete before your appointment.`,
                channel,
                type: 'form_reminder',
                deliveryStatus: 'delivered',
                read: true
            });
        }

        // 5. Operations
        scheduleReminders(conversation.id, {
            service: selectedService.name,
            date: dateStr,
            time: selectedTime
        });
        deductResourceUsage(selectedService.id);
        generateAlertsForBooking(booking);

        setLoading(false);
        setStep(4);
    };

    // --- Render Components ---

    if (step === 4) {
        return <BookingSuccess service={selectedService} date={selectedDate} time={selectedTime} />;
    }

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
            {/* Sidebar Summary (Desktop) */}
            <div className="hidden md:flex flex-col w-1/3 max-w-sm bg-white border-r border-slate-200 p-8 sticky top-0 h-screen overflow-y-auto z-10">
                <div className="mb-8">
                    <div className="flex items-center gap-2 mb-2">
                        <div className="p-2 bg-indigo-600 rounded-lg shadow-lg shadow-indigo-200">
                            <Sparkles className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-xl font-bold text-slate-900">CareOps</span>
                    </div>
                    <p className="text-sm text-slate-500">Premium Service Booking</p>
                </div>

                <div className="space-y-6 flex-1">
                    {/* Progress */}
                    <div className="space-y-2">
                        <div className="flex justify-between text-xs font-semibold text-slate-500 uppercase tracking-wide">
                            <span>Step {step} of 3</span>
                            <span>{Math.round((step / 3) * 100)}%</span>
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                            <div
                                className="h-full bg-indigo-600 rounded-full transition-all duration-500 ease-out"
                                style={{ width: `${(step / 3) * 100}%` }}
                            />
                        </div>
                    </div>

                    {/* Booking Recap */}
                    {selectedService && (
                        <div className="animate-fade-in">
                            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4">Your Selection</h3>
                            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 space-y-4">
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-indigo-600 shadow-sm shrink-0">
                                        <Star className="w-6 h-6 fill-current" />
                                    </div>
                                    <div>
                                        <p className="font-bold text-slate-900">{selectedService.name}</p>
                                        <p className="text-sm text-slate-500">{selectedService.duration} mins • {selectedService.location || 'In-Person'}</p>
                                        <p className="text-sm font-semibold text-indigo-600 mt-1">${selectedService.price || '0.00'}</p>
                                    </div>
                                </div>

                                {(selectedDate && selectedTime) && (
                                    <div className="pt-4 border-t border-slate-200 space-y-3">
                                        <div className="flex items-center gap-3 text-sm text-slate-600">
                                            <CalendarIcon className="w-4 h-4 text-slate-400" />
                                            <span>{selectedDate.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}</span>
                                        </div>
                                        <div className="flex items-center gap-3 text-sm text-slate-600">
                                            <Clock className="w-4 h-4 text-slate-400" />
                                            <span>{selectedTime}</span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* Secure Badge */}
                <div className="mt-8 pt-6 border-t border-slate-100 flex items-center gap-2 text-xs text-slate-400">
                    <CheckCircle className="w-3.5 h-3.5" />
                    <span>Secure booking powered by CareOps</span>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-h-screen">
                {/* Mobile Header */}
                <div className="md:hidden p-4 bg-white border-b border-slate-200 sticky top-0 z-20 flex justify-between items-center">
                    <span className="font-bold text-slate-900">CareOps Booking</span>
                    <span className="text-xs font-semibold bg-indigo-50 text-indigo-700 px-2 py-1 rounded-full">Step {step}/3</span>
                </div>

                <div className="flex-1 max-w-3xl mx-auto w-full p-6 md:p-12 lg:p-16">
                    {/* Back Button */}
                    {step > 1 && (
                        <button
                            onClick={handleBack}
                            className="group flex items-center gap-2 text-sm font-medium text-slate-400 hover:text-indigo-600 mb-8 transition-colors"
                        >
                            <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                            Back
                        </button>
                    )}

                    {step === 1 && (
                        <ServiceSelection
                            services={bookingConfig.services}
                            onSelect={handleServiceSelect}
                        />
                    )}

                    {step === 2 && (
                        <DateTimeSelection
                            selectedDate={selectedDate}
                            setSelectedDate={setSelectedDate}
                            selectedTime={selectedTime}
                            onTimeSelect={handleTimeSelect}
                            timeSlots={bookingConfig.availability.timeSlots}
                            onContinue={handleContinue}
                        />
                    )}

                    {step === 3 && (
                        <CustomerDetailsForm
                            info={customerInfo}
                            setInfo={setCustomerInfo}
                            onSubmit={handleContinue}
                            loading={loading}
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

// --- Step Components ---

const ServiceSelection = ({ services, onSelect }) => (
    <div className="animate-slide-in-up">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Select a Service</h1>
        <p className="text-slate-500 mb-8">Choose the service you would like to book today.</p>

        <div className="grid grid-cols-1 gap-4">
            {services.map(service => (
                <button
                    key={service.id}
                    onClick={() => onSelect(service)}
                    className="group bg-white rounded-2xl p-6 border-2 border-slate-100 hover:border-indigo-500 hover:shadow-xl hover:shadow-indigo-100 text-left transition-all duration-300 relative overflow-hidden"
                >
                    <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="bg-indigo-600 rounded-full p-1">
                            <ArrowRight className="w-4 h-4 text-white" />
                        </div>
                    </div>

                    <div className="flex items-start gap-4">
                        <div className="w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                            <Star className="w-8 h-8 fill-current" />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-slate-900 group-hover:text-indigo-700 transition-colors">{service.name}</h3>
                            <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-slate-500 group-hover:text-slate-600">
                                <span className="flex items-center gap-1.5 bg-slate-100 px-2 py-1 rounded-md group-hover:bg-indigo-50/50 group-hover:text-indigo-700">
                                    <Clock className="w-3.5 h-3.5" />
                                    {service.duration} mins
                                </span>
                                <span className="flex items-center gap-1.5">
                                    <MapPin className="w-3.5 h-3.5" />
                                    {service.location || 'In-Person'}
                                </span>
                            </div>
                        </div>
                    </div>
                </button>
            ))}
        </div>
    </div>
);

const DateTimeSelection = ({ selectedDate, setSelectedDate, selectedTime, onTimeSelect, timeSlots, onContinue }) => {
    // Custom Mini Calendar Logic
    const today = new Date();
    const [currentMonth, setCurrentMonth] = useState(new Date(today.getFullYear(), today.getMonth(), 1));

    const getDaysInMonth = (date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        return new Date(year, month + 1, 0).getDate();
    };

    const daysInMonth = getDaysInMonth(currentMonth);
    const firstDayOfMonth = currentMonth.getDay(); // 0 is Sunday

    const handleDateClick = (day) => {
        const newDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
        if (newDate < new Date().setHours(0, 0, 0, 0)) return; // Disable past dates
        setSelectedDate(newDate);
        onTimeSelect(null); // Reset time when date changes
    };

    const nextMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
    const prevMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));

    return (
        <div className="animate-slide-in-up">
            <h1 className="text-3xl font-bold text-slate-900 mb-2">When are you free?</h1>
            <p className="text-slate-500 mb-8">Select a date and time for your appointment.</p>

            <div className="flex flex-col lg:flex-row gap-8">
                {/* Calendar */}
                <div className="flex-1">
                    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="font-bold text-lg text-slate-900">
                                {currentMonth.toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}
                            </h2>
                            <div className="flex gap-2">
                                <button onClick={prevMonth} disabled={currentMonth <= new Date().setsetDate(1)} className="p-2 hover:bg-slate-100 rounded-lg transition-colors disabled:opacity-30">
                                    <ChevronLeft className="w-5 h-5 text-slate-600" />
                                </button>
                                <button onClick={nextMonth} className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
                                    <ChevronRight className="w-5 h-5 text-slate-600" />
                                </button>
                            </div>
                        </div>

                        <div className="grid grid-cols-7 gap-1 text-center mb-2">
                            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
                                <div key={d} className="text-xs font-bold text-slate-400 uppercase py-2">{d}</div>
                            ))}
                        </div>
                        <div className="grid grid-cols-7 gap-1">
                            {Array.from({ length: firstDayOfMonth }).map((_, i) => <div key={`empty-${i}`} />)}
                            {Array.from({ length: daysInMonth }).map((_, i) => {
                                const day = i + 1;
                                const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
                                const isSelected = selectedDate?.toDateString() === date.toDateString();
                                const isPast = date < new Date().setHours(0, 0, 0, 0);
                                const isToday = date.toDateString() === new Date().toDateString();

                                return (
                                    <button
                                        key={day}
                                        disabled={isPast}
                                        onClick={() => handleDateClick(day)}
                                        className={`
                                            h-10 w-10 mx-auto rounded-full text-sm font-medium transition-all
                                            ${isSelected ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200 scale-110' :
                                                isToday ? 'bg-indigo-50 text-indigo-600 font-bold border border-indigo-200' :
                                                    isPast ? 'text-slate-300 cursor-not-allowed' :
                                                        'text-slate-700 hover:bg-slate-100'}
                                        `}
                                    >
                                        {day}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Time Slots */}
                <div className="w-full lg:w-48">
                    <h3 className="font-bold text-slate-900 mb-4">Available Times</h3>
                    {!selectedDate ? (
                        <div className="text-sm text-slate-400 italic text-center py-8 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                            Select a date first
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 lg:grid-cols-1 gap-2 max-h-[360px] overflow-y-auto pr-1">
                            {timeSlots.map(time => (
                                <button
                                    key={time}
                                    onClick={() => onTimeSelect(time)}
                                    className={`
                                        py-2 px-4 rounded-xl text-sm font-medium transition-all border
                                        ${selectedTime === time
                                            ? 'bg-indigo-600 text-white border-indigo-600 shadow-md'
                                            : 'bg-white text-slate-700 border-slate-200 hover:border-indigo-300 hover:text-indigo-600'}
                                    `}
                                >
                                    {time}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <div className="mt-8 pt-6 border-t border-slate-200 flex justify-end">
                <button
                    onClick={onContinue}
                    disabled={!selectedDate || !selectedTime}
                    className="px-8 py-3 bg-indigo-600 text-white font-bold rounded-xl shadow-lg shadow-indigo-200 hover:shadow-xl hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                    Continue
                    <ArrowRight className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
};

const CustomerDetailsForm = ({ info, setInfo, onSubmit, loading }) => (
    <div className="animate-slide-in-up">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Final Details</h1>
        <p className="text-slate-500 mb-8">Enter your details to confirm the appointment.</p>

        <form onSubmit={(e) => { e.preventDefault(); onSubmit(); }} className="space-y-6 max-w-lg">
            <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Full Name</label>
                <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                        type="text"
                        required
                        value={info.name}
                        onChange={(e) => setInfo({ ...info, name: e.target.value })}
                        className="w-full pl-12 pr-4 py-3 bg-white border-2 border-slate-200 rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all outline-none"
                        placeholder="Jane Doe"
                    />
                </div>
            </div>

            <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Email Address</label>
                <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                        type="email"
                        required
                        value={info.email}
                        onChange={(e) => setInfo({ ...info, email: e.target.value })}
                        className="w-full pl-12 pr-4 py-3 bg-white border-2 border-slate-200 rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all outline-none"
                        placeholder="jane@example.com"
                    />
                </div>
            </div>

            <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Phone Number</label>
                <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                        type="tel"
                        value={info.phone}
                        onChange={(e) => setInfo({ ...info, phone: e.target.value })}
                        className="w-full pl-12 pr-4 py-3 bg-white border-2 border-slate-200 rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all outline-none"
                        placeholder="(555) 123-4567"
                    />
                </div>
            </div>

            <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold rounded-xl shadow-lg shadow-indigo-200 hover:shadow-xl hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 mt-8 disabled:opacity-70 disabled:cursor-wait"
            >
                {loading ? (
                    <>Processing...</>
                ) : (
                    <>Confirm Booking <CheckCircle className="w-5 h-5" /></>
                )}
            </button>
        </form>
    </div>
);

const BookingSuccess = ({ service, date, time }) => (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 flex items-center justify-center p-4 animate-fade-in">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-8 text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-emerald-400 to-teal-500" />

            <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
                <CheckCircle className="w-12 h-12 text-emerald-600 animate-bounce" />
            </div>

            <h1 className="text-3xl font-bold text-slate-900 mb-2">Booking Confirmed!</h1>
            <p className="text-slate-500 mb-8">We've sent a confirmation email to you.</p>

            <div className="bg-slate-50 rounded-2xl p-6 mb-8 text-left border border-slate-100">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Appointment Details</h3>
                <div className="space-y-4">
                    <div className="flex items-center gap-3">
                        <Star className="w-5 h-5 text-indigo-500" />
                        <span className="font-semibold text-slate-900">{service.name}</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <CalendarIcon className="w-5 h-5 text-slate-400" />
                        <span className="text-slate-600">
                            {date.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}
                        </span>
                    </div>
                    <div className="flex items-center gap-3">
                        <Clock className="w-5 h-5 text-slate-400" />
                        <span className="text-slate-600">{time} ({service.duration} mins)</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <MapPin className="w-5 h-5 text-slate-400" />
                        <span className="text-slate-600">{service.location || 'In-Person'}</span>
                    </div>
                </div>
            </div>

            <button
                onClick={() => window.location.reload()}
                className="w-full py-3 bg-white border border-slate-200 text-slate-600 font-bold rounded-xl hover:bg-slate-50 transition-colors"
            >
                Book Another Appointment
            </button>
        </div>
    </div>
);

export default PublicBookingPage;
