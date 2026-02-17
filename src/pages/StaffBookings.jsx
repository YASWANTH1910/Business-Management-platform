
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCareOps } from '../context/CareOpsContext';
import bookingService from '../services/booking.service';
import formService from '../services/form.service';
import conversationService from '../services/conversation.service';
import { ArrowLeft, Calendar, Clock, MapPin, Globe, CheckCircle, AlertCircle, X, RefreshCw, MessageSquare, Loader } from 'lucide-react';

const StaffBookings = () => {
    const navigate = useNavigate();
    // No context needed for data anymore, maybe just business/user info if needed
    const { business } = useCareOps();

    const [bookings, setBookings] = useState([]);
    const [formSubmissions, setFormSubmissions] = useState([]);
    const [conversations, setConversations] = useState([]);
    const [loading, setLoading] = useState(true);

    const [filter, setFilter] = useState('today');
    const [selectedBooking, setSelectedBooking] = useState(null);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [bookingsData, formsData, conversationsData] = await Promise.all([
                bookingService.getBookings(),
                // Mock or implement getSubmissions in formService if not exists
                // For now, assuming endpoints exist or reusing mocks
                formService.getForms(), // This gets templates, not submissions. We might need a separate call for submissions.
                conversationService.getConversations()
            ]);

            setBookings(bookingsData);
            // setFormSubmissions(formsData); // Temporarily commented out until submissions endpoint is verified
            setConversations(conversationsData);
        } catch (error) {
            console.error("Error fetching staff bookings data", error);
        } finally {
            setLoading(false);
        }
    };

    const today = new Date().toISOString().split('T')[0];

    const filteredBookings = bookings.filter(booking => {
        if (filter === 'today') return booking.date === today;
        if (filter === 'upcoming') return new Date(booking.date) >= new Date();
        return true;
    });

    const getBookingForms = (bookingId) => {
        // Mocking: return empty array or implementing specific logic if available
        return formSubmissions.filter(f => f.bookingId === bookingId);
    };

    const getBookingConversation = (bookingId) => {
        return conversations.find(c => c.relatedBookingId === bookingId);
    };

    const handleStatusUpdate = async (bookingId, newStatus) => {
        try {
            await bookingService.updateBookingStatus(bookingId, newStatus);
            setBookings(prev => prev.map(b => b.id === bookingId ? { ...b, status: newStatus } : b));
            if (selectedBooking && selectedBooking.id === bookingId) {
                setSelectedBooking(prev => ({ ...prev, status: newStatus }));
            }
        } catch (error) {
            console.error("Failed to update status", error);
        }
    };

    // Placeholder handlers for forms
    const handleResendForm = async (formId, conversationId) => {
        console.log("Resending form...", formId);
        // await formService.resendForm(formId); 
    };

    const handleMarkFormCompleted = async (formId, conversationId) => {
        console.log("Marking form completed...", formId);
        // await formService.completeForm(formId);
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Confirmed': return 'bg-blue-100 text-blue-700 border-blue-200';
            case 'Completed': return 'bg-green-100 text-green-700 border-green-200';
            case 'No-show': return 'bg-red-100 text-red-700 border-red-200';
            case 'Cancelled': return 'bg-gray-100 text-gray-700 border-gray-200';
            default: return 'bg-slate-100 text-slate-700 border-slate-200';
        }
    };

    const getFormStatusColor = (status) => {
        switch (status) {
            case 'Completed': return 'bg-green-100 text-green-700';
            case 'Sent': return 'bg-blue-100 text-blue-700';
            case 'Pending': return 'bg-yellow-100 text-yellow-700';
            case 'Overdue': return 'bg-red-100 text-red-700';
            default: return 'bg-slate-100 text-slate-700';
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50 to-purple-50 animate-fade-in">
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
                                    Staff Bookings
                                </h1>
                                <p className="text-xs text-slate-500">Manage appointments and forms</p>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Filter Tabs */}
                <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-6 mb-6">
                    <div className="flex space-x-2">
                        <button
                            onClick={() => setFilter('today')}
                            className={`px-6 py-2 rounded-lg font-semibold transition-all ${filter === 'today'
                                ? 'bg-indigo-600 text-white shadow-lg'
                                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                                }`}
                        >
                            Today
                        </button>
                        <button
                            onClick={() => setFilter('upcoming')}
                            className={`px-6 py-2 rounded-lg font-semibold transition-all ${filter === 'upcoming'
                                ? 'bg-indigo-600 text-white shadow-lg'
                                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                                }`}
                        >
                            Upcoming
                        </button>
                        <button
                            onClick={() => setFilter('all')}
                            className={`px-6 py-2 rounded-lg font-semibold transition-all ${filter === 'all'
                                ? 'bg-indigo-600 text-white shadow-lg'
                                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                                }`}
                        >
                            All
                        </button>
                    </div>
                </div>

                {/* Bookings List */}
                {loading ? (
                    <div className="p-12 text-center flex flex-col items-center justify-center">
                        <Loader className="w-8 h-8 text-indigo-600 animate-spin mb-4" />
                        <p className="text-slate-500">Loading bookings...</p>
                    </div>
                ) : (
                    <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-6">
                        <h2 className="text-xl font-bold text-slate-900 mb-6">Appointments</h2>
                        {filteredBookings.length === 0 ? (
                            <p className="text-slate-500 text-center py-8">No bookings found</p>
                        ) : (
                            <div className="space-y-3">
                                {filteredBookings.map(booking => {
                                    const bookingForms = getBookingForms(booking.id);
                                    const completedForms = bookingForms.filter(f => f.status === 'Completed').length;
                                    const totalForms = bookingForms.length;

                                    return (
                                        <div key={booking.id} className="p-4 bg-slate-50 rounded-xl border border-slate-200 hover:shadow-md transition-shadow">
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

                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center space-x-3">
                                                    <span className={`px-3 py-1 rounded-lg text-xs font-semibold border ${getStatusColor(booking.status)}`}>
                                                        {booking.status}
                                                    </span>
                                                    {totalForms > 0 && (
                                                        <span className="text-xs text-slate-600">
                                                            Forms: {completedForms}/{totalForms} ✓
                                                        </span>
                                                    )}
                                                </div>
                                                <button
                                                    onClick={() => setSelectedBooking(booking)}
                                                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-semibold"
                                                >
                                                    View Details
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                )}
            </main>

            {/* Booking Detail Modal */}
            {selectedBooking && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-slide-in-up">
                        {/* Modal Header */}
                        <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
                            <h2 className="text-xl font-bold text-slate-900">Booking Details</h2>
                            <button
                                onClick={() => setSelectedBooking(null)}
                                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                            >
                                <X className="w-5 h-5 text-slate-600" />
                            </button>
                        </div>

                        {/* Modal Content */}
                        <div className="p-6 space-y-6">
                            {/* Booking Info */}
                            <div className="space-y-3">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-xs font-semibold text-slate-500 mb-1">Customer</p>
                                        <p className="text-sm font-semibold text-slate-900">{selectedBooking.customerName}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs font-semibold text-slate-500 mb-1">Service</p>
                                        <p className="text-sm font-semibold text-slate-900">{selectedBooking.service}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs font-semibold text-slate-500 mb-1">Date</p>
                                        <p className="text-sm font-semibold text-slate-900">{selectedBooking.date}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs font-semibold text-slate-500 mb-1">Time</p>
                                        <p className="text-sm font-semibold text-slate-900">{selectedBooking.time}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs font-semibold text-slate-500 mb-1">Duration</p>
                                        <p className="text-sm font-semibold text-slate-900">{selectedBooking.duration} minutes</p>
                                    </div>
                                    <div>
                                        <p className="text-xs font-semibold text-slate-500 mb-1">Location</p>
                                        <p className="text-sm font-semibold text-slate-900 capitalize">{selectedBooking.location}</p>
                                    </div>
                                </div>

                                <div>
                                    <p className="text-xs font-semibold text-slate-500 mb-2">Status</p>
                                    <span className={`inline-block px-4 py-2 rounded-lg text-sm font-semibold border ${getStatusColor(selectedBooking.status)}`}>
                                        {selectedBooking.status}
                                    </span>
                                </div>
                            </div>

                            {/* Forms */}
                            {getBookingForms(selectedBooking.id).length > 0 && (
                                <div>
                                    <h3 className="text-sm font-bold text-slate-900 mb-3">Forms</h3>
                                    <div className="space-y-2">
                                        {getBookingForms(selectedBooking.id).map(form => (
                                            <div key={form.id} className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                                                <div className="flex items-center justify-between mb-2">
                                                    <div>
                                                        <p className="text-sm font-semibold text-slate-900">{form.formName}</p>
                                                        <p className="text-xs text-slate-600">
                                                            Sent: {new Date(form.sentAt).toLocaleDateString()}
                                                        </p>
                                                    </div>
                                                    <span className={`px-3 py-1 rounded text-xs font-semibold ${getFormStatusColor(form.status)}`}>
                                                        {form.status}
                                                    </span>
                                                </div>
                                                {form.status !== 'Completed' && (
                                                    <div className="flex space-x-2 mt-2">
                                                        <button
                                                            onClick={() => handleResendForm(form.id, getBookingConversation(selectedBooking.id)?.id)}
                                                            className="flex-1 px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-xs font-semibold flex items-center justify-center space-x-1"
                                                        >
                                                            <RefreshCw className="w-3 h-3" />
                                                            <span>Resend</span>
                                                        </button>
                                                        <button
                                                            onClick={() => handleMarkFormCompleted(form.id, getBookingConversation(selectedBooking.id)?.id)}
                                                            className="flex-1 px-3 py-1.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-xs font-semibold flex items-center justify-center space-x-1"
                                                        >
                                                            <CheckCircle className="w-3 h-3" />
                                                            <span>Mark Completed</span>
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Conversation Link */}
                            {getBookingConversation(selectedBooking.id) && (
                                <button
                                    onClick={() => {
                                        navigate('/inbox');
                                        setSelectedBooking(null);
                                    }}
                                    className="w-full px-4 py-3 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors font-semibold flex items-center justify-center space-x-2"
                                >
                                    <MessageSquare className="w-4 h-4" />
                                    <span>View Conversation</span>
                                </button>
                            )}

                            {/* Status Actions */}
                            {selectedBooking.status === 'Confirmed' && (
                                <div className="flex space-x-3 pt-4 border-t border-slate-200">
                                    <button
                                        onClick={() => handleStatusUpdate(selectedBooking.id, 'Completed')}
                                        className="flex-1 px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors font-bold flex items-center justify-center space-x-2"
                                    >
                                        <CheckCircle className="w-5 h-5" />
                                        <span>Mark as Completed</span>
                                    </button>
                                    <button
                                        onClick={() => handleStatusUpdate(selectedBooking.id, 'No-show')}
                                        className="flex-1 px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors font-bold flex items-center justify-center space-x-2"
                                    >
                                        <AlertCircle className="w-5 h-5" />
                                        <span>Mark as No-show</span>
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default StaffBookings;
