import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Key, CheckCircle, AlertCircle } from 'lucide-react';

const TokenSetup = () => {
    const [token, setToken] = useState('');
    const [message, setMessage] = useState('');
    const [isSuccess, setIsSuccess] = useState(false);
    const navigate = useNavigate();

    const handleSetToken = () => {
        if (!token.trim()) {
            setMessage('Please enter a token');
            setIsSuccess(false);
            return;
        }

        // Save token to localStorage
        localStorage.setItem('careops_token', token.trim());

        // Set mock user
        localStorage.setItem('careops_user', JSON.stringify({
            id: 2,
            name: 'Test User',
            email: 'test@example.com',
            role: 'admin'
        }));

        setMessage('✅ Token saved successfully! Redirecting to dashboard...');
        setIsSuccess(true);

        // Redirect to dashboard after 2 seconds
        setTimeout(() => {
            navigate('/dashboard');
            window.location.reload(); // Force reload to use new token
        }, 2000);
    };

    const handleClearAuth = () => {
        localStorage.removeItem('careops_token');
        localStorage.removeItem('careops_user');
        setToken('');
        setMessage('Auth data cleared');
        setIsSuccess(false);
    };

    const currentToken = localStorage.getItem('careops_token');

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
            <div className="max-w-2xl w-full bg-white rounded-2xl shadow-xl p-8">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-full mb-4">
                        <Key className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
                        Token Setup
                    </h1>
                    <p className="text-slate-600">
                        Paste your JWT token to authenticate with the backend
                    </p>
                </div>

                {/* Instructions */}
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-6">
                    <h3 className="font-bold text-blue-900 mb-3">How to get your token:</h3>
                    <ol className="text-sm text-blue-800 space-y-2 list-decimal list-inside">
                        <li>Open Swagger UI: <a href="http://localhost:8000/docs" target="_blank" rel="noopener noreferrer" className="underline font-mono">http://localhost:8000/docs</a></li>
                        <li>Find <code className="bg-blue-100 px-2 py-1 rounded">POST /auth/login</code></li>
                        <li>Click "Try it out" and enter your credentials</li>
                        <li>Click "Execute"</li>
                        <li>Copy the <code className="bg-blue-100 px-2 py-1 rounded">access_token</code> value</li>
                        <li>Paste it below</li>
                    </ol>
                </div>

                {/* Current Token Status */}
                {currentToken && (
                    <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6">
                        <div className="flex items-center space-x-2 text-green-800">
                            <CheckCircle className="w-5 h-5" />
                            <span className="font-semibold">Token is currently set</span>
                        </div>
                        <p className="text-sm text-green-700 mt-2">
                            Token preview: {currentToken.substring(0, 30)}...
                        </p>
                    </div>
                )}

                {/* Token Input */}
                <div className="mb-6">
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                        JWT Token
                    </label>
                    <textarea
                        value={token}
                        onChange={(e) => setToken(e.target.value)}
                        placeholder="Paste your token here (starts with eyJ...)"
                        className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none font-mono text-sm"
                        rows={4}
                    />
                </div>

                {/* Message */}
                {message && (
                    <div className={`mb-6 p-4 rounded-xl flex items-center space-x-2 ${isSuccess
                            ? 'bg-green-50 border border-green-200 text-green-800'
                            : 'bg-red-50 border border-red-200 text-red-800'
                        }`}>
                        {isSuccess ? (
                            <CheckCircle className="w-5 h-5" />
                        ) : (
                            <AlertCircle className="w-5 h-5" />
                        )}
                        <span>{message}</span>
                    </div>
                )}

                {/* Buttons */}
                <div className="flex space-x-4">
                    <button
                        onClick={handleSetToken}
                        className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl"
                    >
                        Set Token & Continue
                    </button>
                    <button
                        onClick={handleClearAuth}
                        className="px-6 py-3 border-2 border-slate-300 text-slate-700 font-semibold rounded-xl hover:bg-slate-50 transition-all"
                    >
                        Clear Auth
                    </button>
                </div>

                {/* Skip Option */}
                <div className="mt-6 text-center">
                    <button
                        onClick={() => navigate('/dashboard')}
                        className="text-sm text-slate-500 hover:text-slate-700 underline"
                    >
                        Skip and go to dashboard (will use existing token if any)
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TokenSetup;
