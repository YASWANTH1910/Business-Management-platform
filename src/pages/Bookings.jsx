import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCareOps } from '../context/CareOpsContext';
import bookingService from '../services/booking.service';
import {
    Calendar as CalendarIcon,
    Clock,
    MapPin,
    Globe,
    Plus,
    Link as LinkIcon,
    CheckCircle,
    ChevronLeft,
    ChevronRight,
    List,
    LayoutGrid,
    Settings,
    User,
    MoreHorizontal,
    Filter,
    Loader
} from 'lucide-react';

const DAYS_OF_WEEK = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const TIME_SLOTS = [
    '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
    '12:00 PM', '12:30 PM', '01:00 PM', '01:30 PM', '02:00 PM', '02:30 PM',
    '03:00 PM', '03:30 PM', '04:00 PM', '04:30 PM', '05:00 PM', '05:30 PM'
];

const Bookings = () => {
    const { bookingConfig, updateBookingConfig, business } = useCareOps();
    const navigate = useNavigate();

    // Data State
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    // View State
    const [viewMode, setViewMode] = useState('list'); // 'calendar' | 'list'
    const [showSettings, setShowSettings] = useState(false);

    // Calendar State
    const [currentDate, setCurrentDate] = useState(new Date());

    // Settings State
    const [serviceForm, setServiceForm] = useState({ name: '', duration: 30, location: 'in-person' });
    const [showServiceForm, setShowServiceForm] = useState(false);
    const [selectedDays, setSelectedDays] = useState(bookingConfig.availability?.daysOfWeek || []);
    const [selectedTimes, setSelectedTimes] = useState(bookingConfig.availability?.timeSlots || []);

    useEffect(() => {
        fetchBookings();
    }, []);

    const fetchBookings = async () => {
        try {
            setLoading(true);
            const data = await bookingService.getBookings(); // Fetch latest 100 bookings
            setBookings(data);
        } catch (error) {
            console.error("Failed to fetch bookings:", error);
        } finally {
            setLoading(false);
        }
    };

    // --- Settings Handlers ---
    const handleAddService = (e) => {
        e.preventDefault();
        const newService = { id: Date.now().toString(), ...serviceForm };
        updateBookingConfig({ services: [...bookingConfig.services, newService] });
        setServiceForm({ name: '', duration: 30, location: 'in-person' });
        setShowServiceForm(false);
    };

    const handleSaveAvailability = () => {
        updateBookingConfig({
            availability: { daysOfWeek: selectedDays, timeSlots: selectedTimes }
        });
        setShowSettings(false);
    };

    const toggleDay = (day) => {
        setSelectedDays(prev => prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]);
    };
    const toggleTime = (time) => {
        setSelectedTimes(prev => prev.includes(time) ? prev.filter(t => t !== time) : [...prev, time]);
    };

    const bookingLink = business ? `${window.location.origin}/book/${business.name.toLowerCase().replace(/\s+/g, '-')}` : '';

    // --- Helpers ---
    const getStatusColor = (status) => {
        switch (status) {
            case 'Confirmed': return 'bg-green-100 text-green-700 border-green-200';
            case 'Pending': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
            case 'Completed': return 'bg-blue-100 text-blue-700 border-blue-200';
            case 'Cancelled': return 'bg-red-100 text-red-700 border-red-200';
            default: return 'bg-slate-100 text-slate-700 border-slate-200';
        }
    };

    // --- Calendar Logic ---
    const getDaysInMonth = (date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const firstDayOfMonth = new Date(year, month, 1).getDay(); // 0 (Sun) - 6 (Sat)

        // Adjust to Monday start (0 = Mon, 6 = Sun)
        const startDay = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;

        const days = [];

        // Previous month filler
        for (let i = 0; i < startDay; i++) {
            days.push({ type: 'prev', day: new Date(year, month, 0 - (startDay - 1 - i)).getDate() });
        }

        // Current month days
        for (let i = 1; i <= daysInMonth; i++) {
            days.push({ type: 'current', day: i, date: new Date(year, month, i) });
        }

        // Next month filler
        const remainingCells = 42 - days.length; // 6 rows of 7
        for (let i = 1; i <= remainingCells; i++) {
            days.push({ type: 'next', day: i });
        }

        return days;
    };

    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    const handlePrevMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    };

    const handleNextMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    };

    const calendarDays = getDaysInMonth(currentDate);

    // Get bookings for a specific day
    const getBookingsForDay = (dayDate) => {
        if (!dayDate) return [];
        return bookings.filter(b => {
            const bDate = new Date(b.date);
            return bDate.getDate() === dayDate.getDate() &&
                bDate.getMonth() === dayDate.getMonth() &&
                bDate.getFullYear() === dayDate.getFullYear();
        });
    };

    return (
        <div className="space-y-4 animate-fade-in p-4 max-w-[1600px] mx-auto">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                        <span className="p-2 bg-indigo-50 rounded-lg text-indigo-600">
                            <CalendarIcon className="w-6 h-6" />
                        </span>
                        Bookings
                    </h1>
                    <p className="text-slate-500 text-sm mt-1">Manage appointments and schedules</p>
                </div>

                <div className="flex items-center gap-3">
                    <div className="flex bg-white border border-slate-200 rounded-lg p-1 shadow-sm">
                        <button
                            onClick={() => setViewMode('list')}
                            className={`p-2 rounded-md transition-all ${viewMode === 'list' ? 'bg-indigo-50 text-indigo-600' : 'text-slate-400 hover:text-slate-600'}`}
                        >
                            <List className="w-5 h-5" />
                        </button>
                        <button
                            onClick={() => setViewMode('calendar')}
                            className={`p-2 rounded-md transition-all ${viewMode === 'calendar' ? 'bg-indigo-50 text-indigo-600' : 'text-slate-400 hover:text-slate-600'}`}
                        >
                            <LayoutGrid className="w-5 h-5" />
                        </button>
                    </div>

                    <button
                        onClick={() => setShowSettings(!showSettings)}
                        className={`
                            flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold transition-all border
                            ${showSettings
                                ? 'bg-indigo-600 text-white border-transparent shadow-lg shadow-indigo-200'
                                : 'bg-white text-slate-700 border-slate-200 hover:border-indigo-200 hover:bg-slate-50'
                            }
                        `}
                    >
                        <Settings className="w-4 h-4" />
                        <span>Settings</span>
                    </button>
                </div>
            </div>

            <div className="flex gap-4 items-start">

                {/* Main Content Area */}
                <div className="flex-1 space-y-4">
                    {/* Booking Link Banner */}
                    {bookingConfig.services.length > 0 && (
                        <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-100 rounded-2xl p-4 flex items-center justify-between shadow-sm">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-emerald-100 text-emerald-600 rounded-full">
                                    <CheckCircle className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-emerald-900">Booking Page Active</p>
                                    <p className="text-xs text-emerald-700">Share your link to accept bookings</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <code className="hidden md:block text-xs bg-white/50 px-2 py-1 rounded text-emerald-800 border border-emerald-100/50">
                                    {bookingLink}
                                </code>
                                <button
                                    onClick={() => navigator.clipboard.writeText(bookingLink)}
                                    className="p-2 bg-white text-emerald-600 rounded-lg shadow-sm hover:shadow hover:scale-105 transition-all text-sm font-bold flex items-center gap-1"
                                >
                                    <LinkIcon className="w-3 h-3" />
                                    Copy
                                </button>
                            </div>
                        </div>
                    )}

                    {viewMode === 'list' && (
                        <div className="bg-white rounded-2xl border border-slate-100 shadow-xl shadow-slate-200/50 overflow-hidden">
                            <div className="p-4 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
                                <h3 className="font-bold text-slate-900">Upcoming Appointments</h3>
                                <button className="flex items-center gap-1 text-sm text-slate-500 hover:text-indigo-600 font-medium">
                                    <Filter className="w-4 h-4" />
                                    Filter
                                </button>
                            </div>

                            {loading ? (
                                <div className="p-12 text-center flex flex-col items-center justify-center">
                                    <Loader className="w-8 h-8 text-indigo-600 animate-spin mb-4" />
                                    <p className="text-slate-500">Loading bookings...</p>
                                </div>
                            ) : bookings.length === 0 ? (
                                <div className="p-12 text-center">
                                    <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <CalendarIcon className="w-8 h-8 text-slate-300" />
                                    </div>
                                    <h3 className="text-lg font-bold text-slate-900">No bookings yet</h3>
                                    <p className="text-slate-500">Share your booking link to get started.</p>
                                </div>
                            ) : (
                                <div className="divide-y divide-slate-50">
                                    {bookings.map(booking => (
                                        <div key={booking.id} className="p-4 hover:bg-slate-50 transition-colors group">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-4">
                                                    <div className="flex flex-col items-center justify-center w-14 h-14 bg-indigo-50 rounded-xl text-indigo-600 border border-indigo-100">
                                                        <span className="text-xs font-bold uppercase">{new Date(booking.date).toLocaleDateString('en-US', { month: 'short' })}</span>
                                                        <span className="text-xl font-bold">{new Date(booking.date).getDate()}</span>
                                                    </div>
                                                    <div>
                                                        <h4 className="font-bold text-slate-900">{booking.customerName}</h4>
                                                        <div className="flex items-center gap-3 text-sm text-slate-500 mt-0.5">
                                                            <span className="flex items-center gap-1">
                                                                <Clock className="w-3 h-3" /> {booking.time}
                                                            </span>
                                                            <span className="flex items-center gap-1">
                                                                <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                                                                {booking.service}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-4">
                                                    <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(booking.status || 'Confirmed')}`}>
                                                        {booking.status || 'Confirmed'}
                                                    </span>
                                                    <button className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-white rounded-lg transition-all opacity-0 group-hover:opacity-100">
                                                        <MoreHorizontal className="w-5 h-5" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {viewMode === 'calendar' && (
                        <div className="bg-white rounded-2xl border border-slate-100 shadow-xl shadow-slate-200/50 overflow-hidden">
                            {/* Calendar Header */}
                            <div className="p-4 border-b border-slate-50 flex items-center justify-between">
                                <h3 className="text-lg font-bold text-slate-900">
                                    {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                                </h3>
                                <div className="flex items-center gap-2">
                                    <button onClick={handlePrevMonth} className="p-2 hover:bg-slate-50 rounded-lg text-slate-600">
                                        <ChevronLeft className="w-5 h-5" />
                                    </button>
                                    <button onClick={() => setCurrentDate(new Date())} className="px-3 py-1 text-sm font-bold text-indigo-600 hover:bg-indigo-50 rounded-lg">
                                        Today
                                    </button>
                                    <button onClick={handleNextMonth} className="p-2 hover:bg-slate-50 rounded-lg text-slate-600">
                                        <ChevronRight className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>

                            {/* Calendar Grid */}
                            <div className="grid grid-cols-7 border-b border-slate-100 bg-slate-50/50">
                                {DAYS_OF_WEEK.map(day => (
                                    <div key={day} className="p-3 text-center text-xs font-bold text-slate-500 uppercase tracking-wider">
                                        {day.substring(0, 3)}
                                    </div>
                                ))}
                            </div>
                            <div className="grid grid-cols-7 auto-rows-[120px] divide-x divide-slate-100 border-b border-slate-100">
                                {loading ? (
                                    <div className="col-span-7 p-12 text-center text-slate-400 flex flex-col items-center justify-center h-full">
                                        <Loader className="w-8 h-8 animate-spin mb-4 text-indigo-300" />
                                        Loading calendar...
                                    </div>
                                ) :
                                    calendarDays.map((dayObj, index) => {
                                        const dayBookings = dayObj.type === 'current' ? getBookingsForDay(dayObj.date) : [];

                                        return (
                                            <div
                                                key={index}
                                                className={`p-2 transition-colors relative group
                                                ${dayObj.type !== 'current' ? 'bg-slate-50/30 text-slate-300' : 'bg-white hover:bg-slate-50/50 text-slate-700'}
                                            `}
                                            >
                                                <div className={`text-sm font-medium mb-1 ${dayObj.type === 'current' &&
                                                        dayObj.day === new Date().getDate() &&
                                                        currentDate.getMonth() === new Date().getMonth()
                                                        ? 'bg-indigo-600 text-white w-7 h-7 flex items-center justify-center rounded-full shadow-md shadow-indigo-200'
                                                        : ''
                                                    }`}>
                                                    {dayObj.day}
                                                </div>

                                                {/* Bookings List */}
                                                <div className="space-y-1 overflow-y-auto max-h-[80px] custom-scrollbar">
                                                    {dayBookings.map(booking => (
                                                        <div key={booking.id} className="text-[10px] px-1.5 py-1 bg-indigo-50 text-indigo-700 rounded border border-indigo-100 truncate hover:bg-indigo-100 cursor-pointer transition-colors block">
                                                            <span className="font-bold">{booking.time.split(' ')[0]}</span> {booking.customerName}
                                                        </div>
                                                    ))}
                                                    {dayBookings.length > 3 && (
                                                        <div className="text-[9px] text-slate-400 text-center font-medium">
                                                            +{dayBookings.length - 3} more
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })}
                            </div>
                        </div>
                    )}
                </div>

                {/* Settings Sidebar (Conditional) */}
                {showSettings && (
                    <div className="w-[350px] space-y-6 animate-slide-in-right">

                        {/* Services Config */}
                        <div className="bg-white rounded-2xl border border-slate-100 shadow-lg p-5">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="font-bold text-slate-900">Services</h3>
                                <button
                                    onClick={() => setShowServiceForm(!showServiceForm)}
                                    className="p-1.5 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition-colors"
                                >
                                    <Plus className="w-4 h-4" />
                                </button>
                            </div>

                            {showServiceForm && (
                                <form onSubmit={handleAddService} className="mb-4 bg-slate-50 p-3 rounded-xl border border-slate-100 space-y-3">
                                    <input
                                        placeholder="Service Name"
                                        className="w-full px-3 py-2 rounded-lg text-sm border-slate-200"
                                        value={serviceForm.name}
                                        onChange={e => setServiceForm({ ...serviceForm, name: e.target.value })}
                                        required
                                    />
                                    <div className="flex gap-2">
                                        <select
                                            className="flex-1 px-3 py-2 rounded-lg text-sm border-slate-200"
                                            value={serviceForm.duration}
                                            onChange={e => setServiceForm({ ...serviceForm, duration: Number(e.target.value) })}
                                        >
                                            <option value={15}>15m</option>
                                            <option value={30}>30m</option>
                                            <option value={60}>1h</option>
                                        </select>
                                        <select
                                            className="flex-1 px-3 py-2 rounded-lg text-sm border-slate-200"
                                            value={serviceForm.location}
                                            onChange={e => setServiceForm({ ...serviceForm, location: e.target.value })}
                                        >
                                            <option value="in-person">In-Person</option>
                                            <option value="online">Online</option>
                                        </select>
                                    </div>
                                    <button type="submit" className="w-full py-2 bg-indigo-600 text-white rounded-lg text-xs font-bold">Add</button>
                                </form>
                            )}

                            <div className="space-y-2">
                                {bookingConfig.services.length === 0 && <p className="text-xs text-slate-400 text-center">No services added</p>}
                                {bookingConfig.services.map(s => (
                                    <div key={s.id} className="flex justify-between items-center p-3 bg-slate-50 rounded-xl border border-slate-100">
                                        <div className="min-w-0">
                                            <p className="text-sm font-bold text-slate-900 truncate">{s.name}</p>
                                            <div className="flex items-center gap-2 text-xs text-slate-500">
                                                <span className="flex items-center gap-0.5"><Clock className="w-3 h-3" /> {s.duration}m</span>
                                                <span className="flex items-center gap-0.5"><MapPin className="w-3 h-3" /> {s.location}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Availability Config */}
                        <div className="bg-white rounded-2xl border border-slate-100 shadow-lg p-5">
                            <h3 className="font-bold text-slate-900 mb-4">Availability</h3>

                            <div className="mb-4">
                                <p className="text-xs font-bold text-slate-500 uppercase mb-2">Days</p>
                                <div className="flex flex-wrap gap-1.5">
                                    {DAYS_OF_WEEK.map(day => (
                                        <button
                                            key={day}
                                            onClick={() => toggleDay(day)}
                                            className={`w-8 h-8 rounded-lg text-xs font-bold transition-all ${selectedDays.includes(day)
                                                ? 'bg-indigo-600 text-white'
                                                : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                                                }`}
                                        >
                                            {day[0]}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="mb-4">
                                <p className="text-xs font-bold text-slate-500 uppercase mb-2">Hours</p>
                                <div className="grid grid-cols-3 gap-1.5">
                                    {TIME_SLOTS.slice(0, 9).map(time => (
                                        <button
                                            key={time}
                                            onClick={() => toggleTime(time)}
                                            className={`px-1 py-1.5 rounded-md text-[10px] font-bold transition-all ${selectedTimes.includes(time)
                                                ? 'bg-indigo-100 text-indigo-700 border border-indigo-200'
                                                : 'bg-slate-50 text-slate-500 border border-slate-100 hover:border-slate-300'
                                                }`}
                                        >
                                            {time}
                                        </button>
                                    ))}
                                    {TIME_SLOTS.length > 9 && <div className="text-[10px] text-slate-400 flex items-center justify-center">+ more</div>}
                                </div>
                            </div>

                            <button
                                onClick={handleSaveAvailability}
                                className="w-full py-2 bg-slate-900 text-white rounded-xl text-sm font-bold shadow-lg shadow-slate-200 hover:shadow-xl transition-all"
                            >
                                Save Changes
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Bookings;
