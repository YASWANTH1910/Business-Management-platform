import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCareOps } from '../context/CareOpsContext';
import { ArrowLeft, Calendar, Clock, MapPin, Globe, Plus, Link as LinkIcon, CheckCircle } from 'lucide-react';

const DAYS_OF_WEEK = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const TIME_SLOTS = [
    '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
    '12:00 PM', '12:30 PM', '01:00 PM', '01:30 PM', '02:00 PM', '02:30 PM',
    '03:00 PM', '03:30 PM', '04:00 PM', '04:30 PM', '05:00 PM', '05:30 PM'
];

const Bookings = () => {
    const { bookingConfig, updateBookingConfig, bookings, business, formSubmissions } = useCareOps();
    const navigate = useNavigate();
    const [showServiceForm, setShowServiceForm] = useState(false);
    const [serviceForm, setServiceForm] = useState({
        name: '',
        duration: 30,
        location: 'in-person'
    });
    const [selectedDays, setSelectedDays] = useState([]);
    const [selectedTimes, setSelectedTimes] = useState([]);

    const handleAddService = (e) => {
        e.preventDefault();
        const newService = {
            id: Date.now().toString(),
            ...serviceForm
        };
        updateBookingConfig({
            services: [...bookingConfig.services, newService]
        });
        setServiceForm({ name: '', duration: 30, location: 'in-person' });
        setShowServiceForm(false);
    };

    const handleSaveAvailability = () => {
        updateBookingConfig({
            availability: {
                daysOfWeek: selectedDays,
                timeSlots: selectedTimes
            }
        });
    };

    const toggleDay = (day) => {
        setSelectedDays(prev =>
            prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
        );
    };

    const toggleTime = (time) => {
        setSelectedTimes(prev =>
            prev.includes(time) ? prev.filter(t => t !== time) : [...prev, time]
        );
    };

    const bookingLink = business ? `${window.location.origin}/book/${business.name.toLowerCase().replace(/\s+/g, '-')}` : '';

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
                            <div className="bg-gradient-to-br from-indigo-600 to-purple-600 p-3 rounded-2xl shadow-lg">
                                <Calendar className="text-white w-6 h-6" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                                    Bookings
                                </h1>
                                <p className="text-xs text-slate-500">Configure services and availability</p>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
                {/* Booking Link */}
                {bookingConfig.services.length > 0 && (
                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-2xl p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-lg font-bold text-green-900 mb-2 flex items-center space-x-2">
                                    <CheckCircle className="w-5 h-5" />
                                    <span>Your Booking Page is Ready!</span>
                                </h3>
                                <p className="text-sm text-green-700 mb-3">Share this link with customers to accept bookings</p>
                                <div className="flex items-center space-x-2">
                                    <input
                                        type="text"
                                        value={bookingLink}
                                        readOnly
                                        className="flex-1 px-4 py-2 bg-white border border-green-300 rounded-lg text-sm text-slate-700"
                                    />
                                    <button
                                        onClick={() => navigator.clipboard.writeText(bookingLink)}
                                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
                                    >
                                        <LinkIcon className="w-4 h-4" />
                                        <span>Copy</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Services */}
                <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold text-slate-900">Services</h2>
                        <button
                            onClick={() => setShowServiceForm(!showServiceForm)}
                            className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all flex items-center space-x-2"
                        >
                            <Plus className="w-4 h-4" />
                            <span>Add Service</span>
                        </button>
                    </div>

                    {showServiceForm && (
                        <form onSubmit={handleAddService} className="mb-6 p-4 bg-slate-50 rounded-xl space-y-4">
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">Service Name</label>
                                <input
                                    type="text"
                                    required
                                    value={serviceForm.name}
                                    onChange={(e) => setServiceForm(prev => ({ ...prev, name: e.target.value }))}
                                    className="w-full px-4 py-2 border-2 border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                                    placeholder="e.g. Initial Consultation"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-2">Duration (minutes)</label>
                                    <select
                                        value={serviceForm.duration}
                                        onChange={(e) => setServiceForm(prev => ({ ...prev, duration: parseInt(e.target.value) }))}
                                        className="w-full px-4 py-2 border-2 border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                                    >
                                        <option value={15}>15 minutes</option>
                                        <option value={30}>30 minutes</option>
                                        <option value={45}>45 minutes</option>
                                        <option value={60}>60 minutes</option>
                                        <option value={90}>90 minutes</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-2">Location</label>
                                    <select
                                        value={serviceForm.location}
                                        onChange={(e) => setServiceForm(prev => ({ ...prev, location: e.target.value }))}
                                        className="w-full px-4 py-2 border-2 border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                                    >
                                        <option value="in-person">In-Person</option>
                                        <option value="online">Online</option>
                                    </select>
                                </div>
                            </div>
                            <button type="submit" className="w-full px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
                                Save Service
                            </button>
                        </form>
                    )}

                    <div className="space-y-3">
                        {bookingConfig.services.length === 0 ? (
                            <p className="text-slate-500 text-center py-8">No services configured yet</p>
                        ) : (
                            bookingConfig.services.map((service) => (
                                <div key={service.id} className="p-4 bg-slate-50 rounded-xl flex items-center justify-between">
                                    <div>
                                        <h3 className="font-semibold text-slate-900">{service.name}</h3>
                                        <div className="flex items-center space-x-4 mt-1 text-sm text-slate-600">
                                            <span className="flex items-center space-x-1">
                                                <Clock className="w-4 h-4" />
                                                <span>{service.duration} min</span>
                                            </span>
                                            <span className="flex items-center space-x-1">
                                                {service.location === 'online' ? <Globe className="w-4 h-4" /> : <MapPin className="w-4 h-4" />}
                                                <span className="capitalize">{service.location}</span>
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Availability */}
                <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-6">
                    <h2 className="text-xl font-bold text-slate-900 mb-6">Availability</h2>

                    <div className="mb-6">
                        <h3 className="text-sm font-semibold text-slate-700 mb-3">Days of Week</h3>
                        <div className="flex flex-wrap gap-2">
                            {DAYS_OF_WEEK.map(day => (
                                <button
                                    key={day}
                                    onClick={() => toggleDay(day)}
                                    className={`px-4 py-2 rounded-lg font-semibold transition-all ${selectedDays.includes(day)
                                        ? 'bg-indigo-600 text-white'
                                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                                        }`}
                                >
                                    {day.slice(0, 3)}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="mb-6">
                        <h3 className="text-sm font-semibold text-slate-700 mb-3">Time Slots</h3>
                        <div className="grid grid-cols-4 gap-2">
                            {TIME_SLOTS.map(time => (
                                <button
                                    key={time}
                                    onClick={() => toggleTime(time)}
                                    className={`px-3 py-2 rounded-lg text-sm font-semibold transition-all ${selectedTimes.includes(time)
                                        ? 'bg-indigo-600 text-white'
                                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                                        }`}
                                >
                                    {time}
                                </button>
                            ))}
                        </div>
                    </div>

                    <button
                        onClick={handleSaveAvailability}
                        className="w-full px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold rounded-xl hover:shadow-lg transition-all"
                    >
                        Save Availability
                    </button>
                </div>


                {/* Bookings List */}
                <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-6">
                    <h2 className="text-xl font-bold text-slate-900 mb-6">Recent Bookings</h2>
                    {bookings.length === 0 ? (
                        <p className="text-slate-500 text-center py-8">No bookings yet</p>
                    ) : (
                        <div className="space-y-3">
                            {bookings.map(booking => {
                                // Get forms for this booking
                                const bookingForms = formSubmissions.filter(f => f.bookingId === booking.id);

                                return (
                                    <div key={booking.id} className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                                        <div className="flex items-center justify-between mb-3">
                                            <div>
                                                <h3 className="font-semibold text-slate-900">{booking.customerName}</h3>
                                                <p className="text-sm text-slate-600">{booking.service}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-sm font-semibold text-slate-900">{booking.date}</p>
                                                <p className="text-sm text-slate-600">{booking.time}</p>
                                            </div>
                                        </div>

                                        {/* Form Status */}
                                        {bookingForms.length > 0 && (
                                            <div className="mt-3 pt-3 border-t border-slate-200">
                                                <p className="text-xs font-semibold text-slate-700 mb-2">Forms:</p>
                                                <div className="flex flex-wrap gap-2">
                                                    {bookingForms.map(form => (
                                                        <span
                                                            key={form.id}
                                                            className={`px-2 py-1 rounded text-xs font-semibold ${form.status === 'Completed' ? 'bg-green-100 text-green-700' :
                                                                form.status === 'Sent' ? 'bg-blue-100 text-blue-700' :
                                                                    'bg-yellow-100 text-yellow-700'
                                                                }`}
                                                        >
                                                            {form.formName} - {form.status}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default Bookings;
