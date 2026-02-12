import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCareOps } from '../context/CareOpsContext';
import { ArrowLeft, Inbox as InboxIcon, MessageSquare, Send, Clock, CheckCircle2, XCircle } from 'lucide-react';

const Inbox = () => {
    const { conversations, addMessageToConversation, updateConversationStatus } = useCareOps();
    const navigate = useNavigate();
    const [selectedConversation, setSelectedConversation] = useState(null);
    const [replyText, setReplyText] = useState('');

    const handleSendReply = (e) => {
        e.preventDefault();
        if (!replyText.trim() || !selectedConversation) return;

        addMessageToConversation(selectedConversation.id, {
            sender: 'staff',
            content: replyText,
            channel: 'dashboard',
            type: 'staff'
        });

        // Update conversation status to Open if it was New
        if (selectedConversation.status === 'New') {
            updateConversationStatus(selectedConversation.id, 'Open');
        }

        setReplyText('');
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'New': return 'bg-blue-100 text-blue-700 border-blue-200';
            case 'Open': return 'bg-purple-100 text-purple-700 border-purple-200';
            case 'Closed': return 'bg-slate-100 text-slate-700 border-slate-200';
            default: return 'bg-slate-100 text-slate-700 border-slate-200';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'New': return <Clock className="w-4 h-4" />;
            case 'Open': return <MessageSquare className="w-4 h-4" />;
            case 'Closed': return <CheckCircle2 className="w-4 h-4" />;
            default: return null;
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
                                    Inbox
                                </h1>
                                <p className="text-xs text-slate-500">Manage customer conversations</p>
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
                            <h2 className="font-bold text-slate-900">Conversations ({conversations.length})</h2>
                        </div>
                        <div className="divide-y divide-slate-100 max-h-[calc(100vh-300px)] overflow-y-auto">
                            {conversations.length === 0 ? (
                                <div className="p-8 text-center">
                                    <InboxIcon className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                                    <p className="text-slate-500 text-sm">No conversations yet</p>
                                </div>
                            ) : (
                                conversations.map((conv) => {
                                    const lastMessage = conv.messages[conv.messages.length - 1];
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
                                                <h3 className="font-semibold text-slate-900">{conv.contactName}</h3>
                                                <span className={`px-2 py-1 rounded text-xs font-semibold border ${getStatusColor(conv.status)}`}>
                                                    {conv.status}
                                                </span>
                                            </div>
                                            {lastMessage && (
                                                <p className="text-sm text-slate-600 truncate mb-1">
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
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h2 className="font-bold text-slate-900">{selectedConversation.contactName}</h2>
                                            <p className="text-xs text-slate-500">
                                                Started {new Date(selectedConversation.createdAt).toLocaleString()}
                                            </p>
                                        </div>
                                        <div className="flex items-center space-x-2">
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
                                        <div
                                            key={msg.id}
                                            className={`flex ${msg.sender === 'customer' ? 'justify-start' : 'justify-end'}`}
                                        >
                                            <div
                                                className={`max-w-[70%] rounded-2xl px-4 py-3 ${msg.sender === 'customer'
                                                        ? 'bg-slate-100 text-slate-900'
                                                        : msg.sender === 'system'
                                                            ? 'bg-blue-50 text-blue-900 border border-blue-200'
                                                            : 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white'
                                                    }`}
                                            >
                                                <p className="text-sm">{msg.content}</p>
                                                <div className="flex items-center justify-between mt-2 text-xs opacity-70">
                                                    <span>{msg.type === 'automated' ? '🤖 Auto' : msg.sender}</span>
                                                    <span>{new Date(msg.timestamp).toLocaleTimeString()}</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Reply Form */}
                                <div className="p-4 border-t border-slate-100 bg-slate-50">
                                    <form onSubmit={handleSendReply} className="flex space-x-2">
                                        <input
                                            type="text"
                                            value={replyText}
                                            onChange={(e) => setReplyText(e.target.value)}
                                            placeholder="Type your reply..."
                                            className="flex-1 px-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                                        />
                                        <button
                                            type="submit"
                                            className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all flex items-center space-x-2"
                                        >
                                            <Send className="w-4 h-4" />
                                            <span>Send</span>
                                        </button>
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

export default Inbox;
