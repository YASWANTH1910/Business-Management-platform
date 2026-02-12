import { useState } from 'react';
import { useCareOps } from '../../context/CareOpsContext';
import { CheckCircle, Mail, Phone, User, MessageSquare, Sparkles } from 'lucide-react';

const PublicContactForm = () => {
    const { addContact, addConversation, addMessageToConversation, integrations } = useCareOps();
    const [submitted, setSubmitted] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        message: ''
    });
    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const validate = () => {
        const newErrors = {};

        if (!formData.name.trim()) {
            newErrors.name = 'Name is required';
        }

        if (!formData.email.trim() && !formData.phone.trim()) {
            newErrors.contact = 'Please provide either email or phone number';
        }

        if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Please enter a valid email';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!validate()) return;

        // Create contact
        const contact = addContact({
            name: formData.name,
            email: formData.email,
            phone: formData.phone
        });

        // Create conversation
        const conversation = addConversation({
            contactId: contact.id,
            contactName: contact.name
        });

        // Send welcome message
        const welcomeChannel = integrations.email.connected ? 'email' : 'sms';
        const welcomeMessage = {
            sender: 'system',
            content: `Hi ${formData.name}! Thanks for reaching out. We've received your message and will get back to you soon.`,
            channel: welcomeChannel,
            type: 'automated'
        };
        addMessageToConversation(conversation.id, welcomeMessage);

        // Add customer's initial message if provided
        if (formData.message.trim()) {
            addMessageToConversation(conversation.id, {
                sender: 'customer',
                content: formData.message,
                channel: 'form',
                type: 'customer'
            });
        }

        setSubmitted(true);
    };

    if (submitted) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 flex items-center justify-center p-4">
                <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8 text-center animate-fade-in">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full mb-6 shadow-lg">
                        <CheckCircle className="w-12 h-12 text-white" />
                    </div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-4">
                        Message Sent! 🎉
                    </h1>
                    <p className="text-slate-600 mb-6">
                        Thank you for contacting us. We've received your message and will respond shortly.
                    </p>
                    <div className="bg-slate-50 rounded-xl p-4 text-left">
                        <p className="text-sm text-slate-600 mb-2">
                            <strong className="text-slate-900">What's next?</strong>
                        </p>
                        <ul className="text-sm text-slate-600 space-y-1">
                            <li>✓ Your message has been logged</li>
                            <li>✓ Our team has been notified</li>
                            <li>✓ You'll hear from us soon</li>
                        </ul>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center p-4 relative overflow-hidden">
            {/* Animated Background */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse" style={{ animationDelay: '2s' }}></div>
            </div>

            <div className="max-w-md w-full glass-effect rounded-2xl shadow-2xl p-8 relative z-10 animate-fade-in">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl mb-4 shadow-lg">
                        <Sparkles className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
                        Get in Touch
                    </h1>
                    <p className="text-slate-600">We'd love to hear from you</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Name */}
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                            <User className="w-4 h-4 inline mr-1" />
                            Your Name *
                        </label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className={`w-full px-4 py-3 border-2 ${errors.name ? 'border-red-300' : 'border-slate-200'} rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all bg-white/80`}
                            placeholder="John Doe"
                        />
                        {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                    </div>

                    {/* Email */}
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                            <Mail className="w-4 h-4 inline mr-1" />
                            Email
                        </label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className={`w-full px-4 py-3 border-2 ${errors.email ? 'border-red-300' : 'border-slate-200'} rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all bg-white/80`}
                            placeholder="john@example.com"
                        />
                        {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                    </div>

                    {/* Phone */}
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                            <Phone className="w-4 h-4 inline mr-1" />
                            Phone
                        </label>
                        <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all bg-white/80"
                            placeholder="(555) 123-4567"
                        />
                    </div>

                    {errors.contact && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-red-700 text-sm">
                            {errors.contact}
                        </div>
                    )}

                    {/* Message */}
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                            <MessageSquare className="w-4 h-4 inline mr-1" />
                            Message (Optional)
                        </label>
                        <textarea
                            name="message"
                            value={formData.message}
                            onChange={handleChange}
                            rows="4"
                            className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all bg-white/80 resize-none"
                            placeholder="How can we help you?"
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                    >
                        Send Message
                    </button>
                </form>

                <p className="text-center text-xs text-slate-500 mt-6">
                    We'll get back to you as soon as possible
                </p>
            </div>
        </div>
    );
};

export default PublicContactForm;
