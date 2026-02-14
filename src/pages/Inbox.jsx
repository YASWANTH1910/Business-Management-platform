import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCareOps } from '../context/CareOpsContext';
import {
    ArrowLeft, Inbox as InboxIcon, MessageSquare, Send, Clock, CheckCircle2,
    XCircle, Mail, MessageCircleIcon, AlertCircle, PlayCircle, PauseCircle,
    RefreshCw, Calendar
} from 'lucide-react';

const Inbox = () => {
    const {
        conversations,
        sendMessage,
        updateConversationStatus,
        markConversationAsRead,
        pauseAutomation,
        resumeAutomation,
        integrations
    } = useCareOps();
    const navigate = useNavigate();
    const [selectedConversation, setSelectedConversation] = useState(null);
    const [replyText, setReplyText] = useState('');
    const [selectedChannel, setSelectedChannel] = useState('email');
    const [sending, setSending] = useState(false);

    // Sort conversations by latest activity
    const sortedConversations = [...conversations].sort((a, b) =>
        new Date(b.updatedAt) - new Date(a.updatedAt)
    );

    // Mark conversation as read when selected
    useEffect(() => {
        if (selectedConversation && selectedConversation.unreadCount > 0) {
            markConversationAsRead(selectedConversation.id);
        }
    }, [selectedConversation?.id]);

    const handleSendReply = async (e) => {
        e.preventDefault();
        if (!replyText.trim() || !selectedConversation || sending) return;

        setSending(true);
        try {
            await sendMessage(selectedConversation.id, replyText, selectedChannel, 'Staff');

            // Update conversation status to Open if it was New
            if (selectedConversation.status === 'New') {
                updateConversationStatus(selectedConversation.id, 'Open');
            }

            setReplyText('');
        } catch (error) {
            console.error('Failed to send message:', error);
        } finally {
            setSending(false);
        }
    };

    const handleRetryMessage = async (messageId) => {
        if (!selectedConversation) return;
        // In a real app, this would retry the failed message
        // For now, we'll just show it's being retried
        console.log('Retrying message:', messageId);
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'New': return 'bg-blue-100 text-blue-700 border-blue-200';
            case 'Open': return 'bg-purple-100 text-purple-700 border-purple-200';
            case 'Closed': return 'bg-slate-100 text-slate-700 border-slate-200';
            default: return 'bg-slate-100 text-slate-700 border-slate-200';
        }
    };

    const getAutomationStatusColor = (status) => {
        switch (status) {
            case 'Active': return 'bg-green-100 text-green-700 border-green-200';
            case 'Paused': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
            default: return 'bg-slate-100 text-slate-500 border-slate-200';
        }
    };

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
                                <InboxIcon className="text-white w-6 h-6" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                                    Unified Inbox
                                </h1>
                                <p className="text-xs text-slate-500">Single source of truth for all communication</p>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Conversations List */}
                    <div className="lg:col-span-1 bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden">
                        <div className="p-4 border-b border-slate-100 bg-slate-50">
                            <h2 className="font-bold text-slate-900">Conversations ({sortedConversations.length})</h2>
                        </div>
                        <div className="divide-y divide-slate-100 max-h-[calc(100vh-300px)] overflow-y-auto">
                            {sortedConversations.length === 0 ? (
                                <div className="p-8 text-center">
                                    <InboxIcon className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                                    <p className="text-slate-500 text-sm">No conversations yet</p>
                                </div>
                            ) : (
                                sortedConversations.map((conv) => {
                                    const lastMessage = conv.messages[conv.messages.length - 1];
                                    const lastMessageChannel = lastMessage?.channel || 'email';
                                    return (
                                        <div
                                            key={conv.id}
                                            onClick={() => setSelectedConversation(conv)}
                                            className={`p-4 cursor-pointer transition-colors ${selectedConversation?.id === conv.id
                                                ? 'bg-indigo-50 border-l-4 border-indigo-600'
                                                : 'hover:bg-slate-50'
                                                }`}
                                        >
                                            <div className="flex items-start justify-between mb-2">
                                                <div className="flex items-center space-x-2">
                                                    <h3 className="font-semibold text-slate-900">{conv.contactName}</h3>
                                                    {conv.unreadCount > 0 && (
                                                        <span className="bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                                                            {conv.unreadCount}
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="flex items-center space-x-1">
                                                    {lastMessageChannel === 'email' ? (
                                                        <Mail className="w-4 h-4 text-slate-400" />
                                                    ) : (
                                                        <MessageCircleIcon className="w-4 h-4 text-slate-400" />
                                                    )}
                                                </div>
                                            </div>
                                            <span className={`px-2 py-1 rounded text-xs font-semibold border ${getStatusColor(conv.status)}`}>
                                                {conv.status}
                                            </span>
                                            {lastMessage && (
                                                <p className="text-sm text-slate-600 truncate mb-1 mt-2">
                                                    {lastMessage.content}
                                                </p>
                                            )}
                                            <p className="text-xs text-slate-400">
                                                {new Date(conv.updatedAt).toLocaleString()}
                                            </p>
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </div>

                    {/* Conversation Detail */}
                    <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden flex flex-col">
                        {selectedConversation ? (
                            <>
                                {/* Conversation Header */}
                                <div className="p-4 border-b border-slate-100 bg-slate-50">
                                    <div className="flex items-center justify-between mb-3">
                                        <div>
                                            <h2 className="font-bold text-slate-900">{selectedConversation.contactName}</h2>
                                            <p className="text-xs text-slate-500">
                                                Started {new Date(selectedConversation.createdAt).toLocaleString()}
                                            </p>
                                            {selectedConversation.relatedBookingId && (
                                                <div className="flex items-center space-x-1 mt-1">
                                                    <Calendar className="w-3 h-3 text-indigo-600" />
                                                    <span className="text-xs text-indigo-600">Linked to booking</span>
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            {selectedConversation.automationStatus !== 'None' && (
                                                <div className="flex items-center space-x-2">
                                                    <span className={`px-3 py-1 rounded-lg text-xs font-semibold border ${getAutomationStatusColor(selectedConversation.automationStatus)}`}>
                                                        {selectedConversation.automationStatus === 'Active' ? (
                                                            <span className="flex items-center space-x-1">
                                                                <PlayCircle className="w-3 h-3" />
                                                                <span>Automation Active</span>
                                                            </span>
                                                        ) : (
                                                            <span className="flex items-center space-x-1">
                                                                <PauseCircle className="w-3 h-3" />
                                                                <span>Automation Paused</span>
                                                            </span>
                                                        )}
                                                    </span>
                                                    {selectedConversation.automationStatus === 'Paused' && (
                                                        <button
                                                            onClick={() => resumeAutomation(selectedConversation.id)}
                                                            className="px-3 py-1 bg-green-600 text-white text-xs rounded-lg hover:bg-green-700 transition-colors"
                                                        >
                                                            Resume
                                                        </button>
                                                    )}
                                                </div>
                                            )}
                                            <select
                                                value={selectedConversation.status}
                                                onChange={(e) => updateConversationStatus(selectedConversation.id, e.target.value)}
                                                className={`px-3 py-2 rounded-lg text-sm font-semibold border-2 ${getStatusColor(selectedConversation.status)} cursor-pointer focus:ring-2 focus:ring-indigo-500 outline-none`}
                                            >
                                                <option value="New">New</option>
                                                <option value="Open">Open</option>
                                                <option value="Closed">Closed</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                {/* Messages */}
                                <div className="flex-1 p-4 space-y-4 overflow-y-auto max-h-[calc(100vh-450px)]">
                                    {selectedConversation.messages.map((msg) => (
                                        <MessageBubble
                                            key={msg.id}
                                            message={msg}
                                            onRetry={handleRetryMessage}
                                        />
                                    ))}
                                </div>

                                {/* Reply Form */}
                                <div className="p-4 border-t border-slate-100 bg-slate-50">
                                    {selectedConversation.automationStatus === 'Active' && (
                                        <div className="mb-3 p-2 bg-yellow-50 border border-yellow-200 rounded-lg text-xs text-yellow-800 flex items-center space-x-2">
                                            <AlertCircle className="w-4 h-4" />
                                            <span>Automation will pause when you send a manual reply</span>
                                        </div>
                                    )}
                                    <form onSubmit={handleSendReply} className="space-y-2">
                                        <div className="flex space-x-2">
                                            <select
                                                value={selectedChannel}
                                                onChange={(e) => setSelectedChannel(e.target.value)}
                                                className="px-3 py-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none bg-white"
                                                disabled={!integrations.email.connected && !integrations.sms.connected}
                                            >
                                                {integrations.email.connected && <option value="email">📧 Email</option>}
                                                {integrations.sms.connected && <option value="sms">💬 SMS</option>}
                                            </select>
                                            <input
                                                type="text"
                                                value={replyText}
                                                onChange={(e) => setReplyText(e.target.value)}
                                                placeholder="Type your reply..."
                                                className="flex-1 px-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                                                disabled={sending}
                                            />
                                            <button
                                                type="submit"
                                                disabled={sending || !replyText.trim()}
                                                className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                {sending ? (
                                                    <>
                                                        <RefreshCw className="w-4 h-4 animate-spin" />
                                                        <span>Sending...</span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <Send className="w-4 h-4" />
                                                        <span>Send</span>
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </>
                        ) : (
                            <div className="flex-1 flex items-center justify-center p-8">
                                <div className="text-center">
                                    <MessageSquare className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                                    <p className="text-slate-500">Select a conversation to view messages</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
};

// Message Bubble Component
const MessageBubble = ({ message, onRetry }) => {
    const isCustomer = message.sender === 'customer';
    const isSystem = message.sender === 'system';
    const isTimeline = message.type === 'timeline_event';

    // Timeline events
    if (isTimeline) {
        return (
            <div className="flex justify-center">
                <div className="bg-slate-100 border border-slate-200 rounded-lg px-4 py-2 text-xs text-slate-600 flex items-center space-x-2">
                    <Clock className="w-3 h-3" />
                    <span>{message.content}</span>
                    <span className="text-slate-400">{new Date(message.timestamp).toLocaleTimeString()}</span>
                </div>
            </div>
        );
    }

    // Automated message types
    const getAutomatedMessageStyle = () => {
        switch (message.type) {
            case 'welcome':
                return 'bg-blue-50 border-l-4 border-blue-500 text-blue-900';
            case 'booking_confirmation':
                return 'bg-green-50 border-l-4 border-green-500 text-green-900';
            case 'form_reminder':
                return 'bg-yellow-50 border-l-4 border-yellow-500 text-yellow-900';
            default:
                return '';
        }
    };

    const getMessageTypeLabel = () => {
        switch (message.type) {
            case 'welcome': return '🎉 Welcome Message';
            case 'booking_confirmation': return '✓ Booking Confirmed';
            case 'form_reminder': return '📋 Form Reminder';
            case 'automated': return '🤖 Automated';
            default: return null;
        }
    };

    const automatedStyle = getAutomatedMessageStyle();
    const typeLabel = getMessageTypeLabel();

    return (
        <div className={`flex ${isCustomer ? 'justify-start' : 'justify-end'}`}>
            <div className={`max-w-[70%] ${automatedStyle ? 'w-full' : ''}`}>
                <div
                    className={`rounded-2xl px-4 py-3 ${automatedStyle
                            ? automatedStyle
                            : isCustomer
                                ? 'bg-slate-100 text-slate-900'
                                : isSystem
                                    ? 'bg-blue-50 text-blue-900 border border-blue-200'
                                    : 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white'
                        }`}
                >
                    {typeLabel && (
                        <div className="text-xs font-semibold mb-1 opacity-70">
                            {typeLabel}
                        </div>
                    )}
                    <p className="text-sm">{message.content}</p>
                    <div className="flex items-center justify-between mt-2 text-xs opacity-70 space-x-2">
                        <div className="flex items-center space-x-2">
                            <span>{message.sender}</span>
                            {message.channel && message.channel !== 'system' && (
                                <span className="flex items-center space-x-1">
                                    {message.channel === 'email' ? (
                                        <Mail className="w-3 h-3" />
                                    ) : (
                                        <MessageCircleIcon className="w-3 h-3" />
                                    )}
                                    <span>{message.channel}</span>
                                </span>
                            )}
                        </div>
                        <div className="flex items-center space-x-2">
                            {message.deliveryStatus && (
                                <span className="flex items-center space-x-1">
                                    {message.deliveryStatus === 'delivered' && (
                                        <CheckCircle2 className="w-3 h-3 text-green-500" />
                                    )}
                                    {message.deliveryStatus === 'pending' && (
                                        <Clock className="w-3 h-3 text-yellow-500" />
                                    )}
                                    {message.deliveryStatus === 'failed' && (
                                        <XCircle className="w-3 h-3 text-red-500" />
                                    )}
                                </span>
                            )}
                            <span>{new Date(message.timestamp).toLocaleTimeString()}</span>
                        </div>
                    </div>
                    {message.deliveryStatus === 'failed' && message.failureReason && (
                        <div className="mt-2 p-2 bg-red-100 border border-red-200 rounded text-xs text-red-800">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-1">
                                    <AlertCircle className="w-3 h-3" />
                                    <span>{message.failureReason}</span>
                                </div>
                                <button
                                    onClick={() => onRetry(message.id)}
                                    className="px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition-colors flex items-center space-x-1"
                                >
                                    <RefreshCw className="w-3 h-3" />
                                    <span>Retry</span>
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Inbox;
