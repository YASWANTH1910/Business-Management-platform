
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCareOps } from '../context/CareOpsContext';
import {
    Inbox as InboxIcon,
    Search,
    Filter,
    MoreVertical,
    Phone,
    Video,
    Info,
    Paperclip,
    Smile,
    Send,
    Check,
    CheckCheck,
    Clock,
    AlertCircle,
    Mail,
    MessageSquare,
    Zap,
    PauseCircle,
    PlayCircle,
    User
} from 'lucide-react';
import conversationService from '../services/conversation.service';

const Inbox = () => {
    const { business, integrations } = useCareOps();
    const navigate = useNavigate();

    const [conversations, setConversations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedId, setSelectedId] = useState(null);
    const [filterStatus, setFilterStatus] = useState('All'); // All, New, Open, Closed
    const [searchQuery, setSearchQuery] = useState('');
    const [replyText, setReplyText] = useState('');
    const [selectedChannel, setSelectedChannel] = useState('email');
    const [sending, setSending] = useState(false);

    // Initial load
    useEffect(() => {
        fetchConversations();
        // Set up polling interval for new messages
        const interval = setInterval(fetchConversations, 10000);
        return () => clearInterval(interval);
    }, []);

    const fetchConversations = async () => {
        try {
            const data = await conversationService.getConversations();
            setConversations(data);
            setLoading(false);
        } catch (error) {
            console.error("Failed to fetch conversations:", error);
            setLoading(false);
        }
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!replyText.trim() || !selectedId || sending) return;

        setSending(true);
        try {
            await conversationService.sendMessage(selectedId, replyText, selectedChannel);

            // Optimistic update or refresh
            const updatedConversations = conversations.map(c => {
                if (c.id === selectedId) {
                    return {
                        ...c,
                        messages: [
                            ...c.messages,
                            {
                                id: Date.now().toString(), // temporary ID
                                content: replyText,
                                sender: 'staff',
                                timestamp: new Date().toISOString(),
                                channel: selectedChannel
                            }
                        ],
                        status: c.status === 'New' ? 'Open' : c.status
                    };
                }
                return c;
            });
            setConversations(updatedConversations);
            setReplyText('');

            // Refresh in background to get real message object
            fetchConversations();

        } catch (error) {
            console.error('Failed to send:', error);
        } finally {
            setSending(false);
        }
    };

    // Mark as read when selected
    useEffect(() => {
        if (selectedId) {
            const conversation = conversations.find(c => c.id === selectedId);
            if (conversation && conversation.unreadCount > 0) {
                // Call API to mark as read
                conversationService.markAsRead(selectedId).catch(console.error);

                // Local update
                setConversations(prev => prev.map(c =>
                    c.id === selectedId ? { ...c, unreadCount: 0 } : c
                ));
            }
        }
    }, [selectedId, conversations]); // Added conversations dependency for real-time updates



    // Auto-scroll to bottom of chat
    const messagesEndRef = useRef(null);
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const selectedConversation = conversations.find(c => c.id === selectedId);

    useEffect(() => {
        if (selectedConversation) {
            scrollToBottom();
            if (selectedConversation.unreadCount > 0) {
                // markConversationAsRead(selectedConversation.id); // Handled in effect above
            }
        }
    }, [selectedConversation, conversations]); // Added conversations to dep array to scroll on new msg

    // Filter conversations
    const filteredConversations = conversations
        .filter(c => {
            const matchesSearch = c.contactName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                c.lastMessage?.content?.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesStatus = filterStatus === 'All' || c.status === filterStatus;
            return matchesSearch && matchesStatus;
        })
        .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));



    const getStatusColor = (status) => {
        switch (status) {
            case 'New': return 'bg-blue-100 text-blue-700';
            case 'Open': return 'bg-purple-100 text-purple-700';
            case 'Closed': return 'bg-slate-100 text-slate-500';
            default: return 'bg-slate-50 text-slate-500';
        }
    };

    return (
        <div className="h-[calc(100vh-3.5rem)] flex gap-4 max-w-[1600px] mx-auto p-4">
            {/* Left Sidebar: Conversation List */}
            <div className="w-1/3 min-w-[350px] bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 flex flex-col overflow-hidden">
                {/* Header */}
                <div className="p-4 border-b border-slate-50 space-y-4">
                    <div className="flex justify-between items-center">
                        <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                            <span className="p-2 bg-indigo-50 rounded-lg text-indigo-600">
                                <InboxIcon className="w-5 h-5" />
                            </span>
                            Inbox
                        </h1>
                        <div className="flex bg-slate-100 p-1 rounded-lg">
                            {['All', 'New', 'Open', 'Closed'].map(status => (
                                <button
                                    key={status}
                                    onClick={() => setFilterStatus(status)}
                                    className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${filterStatus === status
                                        ? 'bg-white text-slate-900 shadow-sm'
                                        : 'text-slate-500 hover:text-slate-700'
                                        }`}
                                >
                                    {status}
                                </button>
                            ))}
                        </div>
                    </div>
                    {/* Search */}
                    <div className="relative group">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                        <input
                            type="text"
                            placeholder="Search messages..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-100 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 transition-all outline-none text-sm"
                        />
                    </div>
                </div>

                {/* List */}
                <div className="flex-1 overflow-y-auto">
                    {filteredConversations.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-slate-400 p-8 text-center">
                            <InboxIcon className="w-12 h-12 mb-3 opacity-20" />
                            <p className="font-medium">No conversations found</p>
                        </div>
                    ) : (
                        filteredConversations.map(conv => {
                            const lastMsg = conv.messages[conv.messages.length - 1];
                            const isSelected = selectedId === conv.id;

                            return (
                                <div
                                    key={conv.id}
                                    onClick={() => setSelectedId(conv.id)}
                                    className={`p-3 border-b border-slate-50 cursor-pointer transition-all hover:bg-slate-50
                                        ${isSelected ? 'bg-indigo-50/50 border-l-4 border-l-indigo-500' : 'border-l-4 border-l-transparent'}
                                    `}
                                >
                                    <div className="flex justify-between items-start mb-1">
                                        <div className="flex items-center gap-2">
                                            <span className="font-bold text-slate-900">{conv.contactName}</span>
                                            {conv.unreadCount > 0 && (
                                                <span className="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                                                    {conv.unreadCount}
                                                </span>
                                            )}
                                        </div>
                                        <span className="text-xs text-slate-400 font-medium whitespace-nowrap ml-2">
                                            {new Date(conv.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-end">
                                        <p className={`text-sm line-clamp-1 ${conv.unreadCount > 0 ? 'text-slate-700 font-medium' : 'text-slate-500'}`}>
                                            {lastMsg?.sender === 'staff' && 'You: '}
                                            {lastMsg?.content || 'No messages yet'}
                                        </p>
                                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide ml-2 ${getStatusColor(conv.status)}`}>
                                            {conv.status}
                                        </span>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            </div>

            {/* Right Panel: Chat Area */}
            <div className="flex-1 bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 flex flex-col overflow-hidden relative">
                {selectedConversation ? (
                    <>
                        {/* Chat Header */}
                        <div className="p-4 border-b border-slate-50 flex justify-between items-center bg-white/80 backdrop-blur-sm z-10">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center text-indigo-600 font-bold text-lg">
                                    {selectedConversation.contactName.charAt(0)}
                                </div>
                                <div>
                                    <h2 className="font-bold text-slate-900">{selectedConversation.contactName}</h2>
                                    <div className="flex items-center gap-2 text-xs text-slate-500">
                                        <span className="flex items-center gap-1">
                                            <Mail className="w-3 h-3" /> {selectedConversation.contactEmail}
                                        </span>
                                        {selectedConversation.contactPhone && (
                                            <>
                                                <span>•</span>
                                                <span className="flex items-center gap-1">
                                                    <Phone className="w-3 h-3" /> {selectedConversation.contactPhone}
                                                </span>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                {selectedConversation.automationStatus === 'Active' ? (
                                    <div className="flex items-center gap-1.5 px-3 py-1.5 bg-green-50 text-green-700 rounded-full text-xs font-semibold">
                                        <Zap className="w-3 h-3 fill-green-700" />
                                        <span>Automation On</span>
                                    </div>
                                ) : (
                                    <button
                                        onClick={() => conversationService.resumeAutomation(selectedConversation.id).then(fetchConversations)}
                                        className="flex items-center gap-1.5 px-3 py-1.5 bg-yellow-50 hover:bg-yellow-100 text-yellow-700 rounded-full text-xs font-semibold transition-colors"
                                    >
                                        <PauseCircle className="w-3 h-3" />
                                        <span>Automation Paused</span>
                                    </button>
                                )}

                                <div className="h-8 w-[1px] bg-slate-200 mx-1" />

                                <button className="p-2 hover:bg-slate-50 rounded-lg text-slate-500 hover:text-indigo-600 transition-colors">
                                    <Phone className="w-5 h-5" />
                                </button>
                                <button className="p-2 hover:bg-slate-50 rounded-lg text-slate-500 hover:text-indigo-600 transition-colors">
                                    <MoreVertical className="w-5 h-5" />
                                </button>
                            </div>
                        </div>

                        {/* Messages Area */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#f8fafc]">
                            {/* Date seperator example */}
                            <div className="flex justify-center">
                                <span className="bg-slate-200/60 text-slate-500 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                                    Today
                                </span>
                            </div>

                            {selectedConversation.messages.map((msg, index) => {
                                const isMe = msg.sender === 'staff';
                                const isSystem = msg.sender === 'system' || msg.sender === 'automation';

                                if (isSystem) {
                                    return (
                                        <div key={msg.id} className="flex justify-center my-4">
                                            <div className="max-w-[80%] bg-white border border-slate-200 rounded-xl px-4 py-2 shadow-sm flex items-start gap-3">
                                                <div className="p-1.5 bg-blue-50 text-blue-600 rounded-lg mt-0.5">
                                                    <Info className="w-4 h-4" />
                                                </div>
                                                <div>
                                                    <p className="text-sm text-slate-600">{msg.content}</p>
                                                    <span className="text-[10px] text-slate-400 mt-1 block">
                                                        {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • System
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                }

                                return (
                                    <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                                        <div className={`max-w-[70%] ${isMe ? 'order-1' : 'order-2'}`}>
                                            <div className={`
                                                p-3 rounded-2xl shadow-sm text-sm relative group
                                                ${isMe
                                                    ? 'bg-gradient-to-br from-indigo-600 to-indigo-700 text-white rounded-br-none'
                                                    : 'bg-white border border-slate-100 text-slate-800 rounded-bl-none'
                                                }
                                            `}>
                                                <p className="leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                                                <div className={`
                                                    text-[10px] items-center gap-1 mt-1 flex
                                                    ${isMe ? 'text-indigo-200 justify-end' : 'text-slate-400 justify-start'}
                                                `}>
                                                    {msg.channel === 'email' ? <Mail className="w-3 h-3" /> : <MessageSquare className="w-3 h-3" />}
                                                    <span>{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                                    {isMe && <CheckCheck className="w-3 h-3 opacity-70" />}
                                                </div>
                                            </div>
                                        </div>
                                        {/* Avatar placement */}
                                        <div className={`flex flex-col justify-end mx-2 ${isMe ? 'order-2' : 'order-1'}`}>
                                            {isMe ? (
                                                <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center">
                                                    <User className="w-4 h-4 text-indigo-600" />
                                                </div>
                                            ) : (
                                                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center">
                                                    <span className="text-xs font-bold text-slate-600">{selectedConversation.contactName.charAt(0)}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input Area */}
                        <div className="p-4 bg-white border-t border-slate-100">
                            {selectedConversation.automationStatus === 'Active' && (
                                <div className="mb-3 flex items-center justify-between p-2 bg-amber-50 text-amber-700 rounded-lg text-xs border border-amber-100">
                                    <span className="flex items-center gap-2">
                                        <AlertCircle className="w-4 h-4" />
                                        <b>Heads up:</b> Sending a manual reply will pause automation for this contact.
                                    </span>
                                </div>
                            )}

                            <form onSubmit={handleSendMessage} className="flex gap-2 items-end">
                                <div className="flex-1 bg-slate-50 border border-slate-200 focus-within:ring-2 focus-within:ring-indigo-100 focus-within:border-indigo-500 rounded-2xl p-2 transition-all">
                                    <textarea
                                        value={replyText}
                                        onChange={(e) => setReplyText(e.target.value)}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter' && !e.shiftKey) {
                                                e.preventDefault();
                                                handleSendMessage(e);
                                            }
                                        }}
                                        placeholder="Type your message..."
                                        className="w-full bg-transparent border-none focus:ring-0 text-sm max-h-32 resize-none p-2 placeholder:text-slate-400"
                                        rows={1}
                                    />
                                    <div className="flex justify-between items-center px-1 mt-1">
                                        <div className="flex gap-1 text-slate-400">
                                            <button type="button" className="p-1.5 hover:bg-slate-200 rounded-lg transition-colors">
                                                <Paperclip className="w-4 h-4" />
                                            </button>
                                            <button type="button" className="p-1.5 hover:bg-slate-200 rounded-lg transition-colors">
                                                <Smile className="w-4 h-4" />
                                            </button>
                                        </div>
                                        <select
                                            value={selectedChannel}
                                            onChange={(e) => setSelectedChannel(e.target.value)}
                                            className="text-xs bg-white border border-slate-200 rounded-lg px-2 py-1 outline-none focus:border-indigo-500 text-slate-600 font-medium"
                                        >
                                            <option value="email">Email</option>
                                            <option value="sms">SMS</option>
                                        </select>
                                    </div>
                                </div>
                                <button
                                    type="submit"
                                    disabled={!replyText.trim() || sending}
                                    className={`
                                        p-4 rounded-2xl flex items-center justify-center transition-all shadow-lg hover:shadow-indigo-200
                                        ${!replyText.trim() || sending ? 'bg-slate-200 text-slate-400 cursor-not-allowed' : 'bg-indigo-600 text-white hover:bg-indigo-700 hover:-translate-y-0.5'}
                                    `}
                                >
                                    <Send className="w-5 h-5" />
                                </button>
                            </form>
                        </div>
                    </>
                ) : (
                    /* Empty State */
                    <div className="h-full flex flex-col items-center justify-center text-center p-8 bg-slate-50/50">
                        <div className="w-24 h-24 bg-white rounded-full shadow-lg flex items-center justify-center mb-6">
                            <MessageSquare className="w-10 h-10 text-indigo-500" />
                        </div>
                        <h3 className="text-2xl font-bold text-slate-900 mb-2">Select a Conversation</h3>
                        <p className="text-slate-500 max-w-sm">
                            Click on a contact from the list on the left to view their message history and send replies.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Inbox;
